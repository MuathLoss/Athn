import { Camera, ImagePlus, PackageOpen, UserRound, ScanLine, List, Layers3, LoaderCircle, LogOut, Upload, Trash2, BookOpenText, ArrowLeft, Check, Fingerprint, ImageIcon } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import type { VerificationDecision } from './domain';
import { ServiceError } from './services/contracts';
import { createMarketplaceHttpService, createMarketplaceMockService, type MarketplaceSellerContext, type MarketplaceService, type MarketplaceVerification } from './services/marketplace';
import { currentScenario } from './services/mock';
import { getLocalUser } from './services/local-auth';
import { developmentFixtures } from './services/runtime';
import { outcomes } from './services/scenarios';
import { authorizations, Decision, ErrorState, Id, Pending, useSession, useSignOut } from './ui';
import { WorkspaceBanner } from './visuals';

const messages: Record<VerificationDecision, string> = {
  allow: 'اكتمل التحقق ويمكن للسوق متابعة النشر.',
  review: 'تحتاج الصورة إلى مراجعة.',
  hold_for_review: 'النشر معلّق لحين مراجعة الحالة.',
};
const accepted = ['image/jpeg', 'image/png', 'image/webp'];
const endpoint = import.meta.env.VITE_MARKETPLACE_ANALYZE_URL;
const contextEndpoint = import.meta.env.VITE_MARKETPLACE_SESSION_URL;
const sellerLogin = import.meta.env.VITE_MARKETPLACE_LOGIN_URL;
const nextPublish = import.meta.env.VITE_MARKETPLACE_PUBLISH_URL;

const service = endpoint
  ? createMarketplaceHttpService(new URL(endpoint, location.origin), contextEndpoint ? new URL(contextEndpoint, location.origin) : undefined)
  : import.meta.env.DEV ? createMarketplaceMockService(async () => {
    if (getLocalUser()?.role !== 'seller') throw new ServiceError('expired');
    const scenario = currentScenario();
    if (scenario === 'backend_error') throw new ServiceError('unavailable');
    const { decision, match_found, authorization_status } = outcomes[scenario];
    return { decision, match_found, authorization_status };
  }) : null;

export function Marketplace() {
  const session = useSession();
  const logout = useSignOut();
  const localSellerRequired = developmentFixtures || (import.meta.env.DEV && !endpoint);
  const seller = useQuery({
    queryKey: ['marketplace-seller', session.data?.id],
    enabled: Boolean(service) && (!localSellerRequired || session.data?.role === 'seller'),
    queryFn: ({ signal }) => service?.getSellerContext(signal) ?? Promise.resolve(null),
  });
  return <>
    <header className="market-header"><div><PackageOpen size={22} aria-hidden="true" /> <span>مساحة البائع</span><small>إدارة المنتجات</small>
      {session.data?.role === 'seller' && <span className="market-account"><UserRound size={17} aria-hidden="true" />{session.data.name}</span>}
      {session.data && (localSellerRequired || session.data.role === 'seller') && <button className="icon-button market-logout" aria-label="تسجيل الخروج" disabled={logout.isPending} onClick={() => logout.mutate()}><LogOut size={19} aria-hidden="true" /></button>}
    </div></header>
    <main className="workspace market">
      <WorkspaceBanner context="المنتجات · قبل النشر" title="إضافة صورة المنتج" description="تخضع صورة المنتج للتحقق قبل متابعة نشره." icon={ImagePlus} />
      {logout.isError && <ErrorState error={logout.error} />}
      {localSellerRequired && session.isPending ? <Pending />
        : localSellerRequired && session.isError ? <ErrorState error={session.error} retry={() => void session.refetch()} />
        : localSellerRequired && !session.data ? <section className="state"><UserRound aria-hidden="true" /><p>سجّل الدخول إلى حساب البائع للمتابعة.</p><Link className="button" to="/login">تسجيل الدخول</Link></section>
        : localSellerRequired && session.data?.role !== 'seller' ? <ErrorState error={new ServiceError('denied')} />
        : !service ? <p role="status">تعذّر بدء التحقق. أعد فتح المنتج من حسابك في السوق.</p>
        : seller.isPending ? <Pending />
        : seller.isError ? <ErrorState error={seller.error} retry={() => void seller.refetch()} />
        : seller.data ? <MarketplaceProduct service={service} seller={seller.data} />
        : <section className="state"><UserRound aria-hidden="true" /><p>سجّل الدخول إلى حسابك في السوق للمتابعة.</p>
          {sellerLogin && <a className="button" href={sellerLogin}>تسجيل الدخول إلى السوق</a>}</section>}
    </main>
  </>;
}

function MarketplaceProduct({ service, seller }: { service: MarketplaceService; seller: MarketplaceSellerContext }) {
  const [image, setImage] = useState<File>();
  const [preview, setPreview] = useState<{ file: File; url: string }>();
  const [validatedImage, setValidatedImage] = useState<File>();
  const [title, setTitle] = useState(seller.productTitle ?? '');
  const [status, setStatus] = useState<'idle' | 'checking' | 'complete' | 'failed'>('idle');
  const [result, setResult] = useState<MarketplaceVerification>();
  const [fileError, setFileError] = useState('');
  const [error, setError] = useState<unknown>(null);
  const [dragging, setDragging] = useState(false);
  const request = useRef<AbortController | null>(null);
  const verificationPanel = useRef<HTMLDivElement>(null);
  const lastValidImage = useRef<File>(undefined);

  useEffect(() => {
    if (!image) return;
    const url = URL.createObjectURL(image);
    setPreview({ file: image, url });
    return () => URL.revokeObjectURL(url);
  }, [image]);
  useEffect(() => () => request.current?.abort(), []);
  useEffect(() => {
    if (status === 'complete' && document.activeElement === document.body) {
      verificationPanel.current?.focus({ preventScroll: true });
      verificationPanel.current?.scrollIntoView({ block: 'nearest' });
    }
  }, [status]);

  function select(file?: File) {
    if (request.current) return;
    if (file && (!accepted.includes(file.type) || file.size === 0)) {
      setFileError('تعذّر استخدام هذا الملف. اختر صورة JPG أو PNG أو WebP.');
      return;
    }
    setStatus('idle');
    setResult(undefined);
    setValidatedImage(undefined);
    setFileError('');
    setError(null);
    if (!file) lastValidImage.current = undefined;
    setImage(file);
  }

  async function verify() {
    if (!image || validatedImage !== image || !title.trim() || status === 'complete' || request.current) return;
    const controller = new AbortController();
    request.current = controller;
    setStatus('checking');
    setError(null);
    try {
      const result = await service.verifyBeforePublish(image, controller.signal);
      if (controller.signal.aborted) return;
      setResult(result);
      setStatus('complete');
    } catch (error) {
      if (controller.signal.aborted) return;
      setError(error);
      setStatus('failed');
    } finally {
      if (request.current === controller) request.current = null;
    }
  }

  const checking = status === 'checking';
  const phase = status === 'complete' ? 2 : status === 'idle' ? 0 : 1;
  const decision = result?.decision ?? null;
  const reason = (decision === 'review' || decision === 'hold_for_review') && result?.match_found === true && result.authorization_status === 'not_recorded'
    ? 'وجد النظام تشابهًا بصريًا مع صورة مرتبطة بسجل الحقوق، ولم يعثر على إذن مسجّل للبائع.'
    : (decision === 'review' || decision === 'hold_for_review') && result?.authorization_status === 'unknown' ? 'لم تكفِ البيانات المتاحة لتأكيد الإذن.' : undefined;
  const hasPreview = Boolean(image && preview?.file === image);
  return <div className="market-layout">
      <header className="market-workflow">
        <div className="market-verification-head">
          <div className="market-provider-mark"><img src="/media/mark.svg" alt="" /></div>
          <h2 id="market-verification-title">التحقق من حقوق الصورة بواسطة إذن</h2>
        </div>
        <ol className="market-trace" aria-label="مراحل التحقق">
          {[
            { label: 'صورة المنتج', icon: ImageIcon },
            { label: 'التحقق', icon: ScanLine },
            { label: 'النتيجة', icon: List },
          ].map(({ label, icon: Icon }, index) => <li key={label} aria-current={index === phase ? 'step' : undefined} data-complete={index < phase}>
            <span className="market-step-node">{index < phase ? <Check size={17} aria-hidden="true" /> : <Icon size={17} aria-hidden="true" />}</span>
            <span>{label}{index < phase && <span className="market-step-status">، مكتملة</span>}</span>
          </li>)}
        </ol>
      </header>
      <form className="market-form" id="market-product" onSubmit={event => { event.preventDefault(); void verify(); }}>
        <h2 className="market-form-heading"><PackageOpen size={21} aria-hidden="true" />{seller.productTitle ? 'تعديل المنتج' : 'إعداد المنتج'}</h2>
        <fieldset disabled={checking}>
          <label className="field">اسم المنتج<input value={title} placeholder="أدخل اسم المنتج" onChange={event => { setTitle(event.target.value); setStatus('idle'); setError(null); }} required /></label>
          <div className="seller-drop" data-preview={hasPreview} data-dragging={dragging} onDragOver={event => { event.preventDefault(); setDragging(!checking); }} onDragLeave={() => setDragging(false)}
            onDrop={event => { event.preventDefault(); setDragging(false); select(event.dataTransfer.files[0]); }}>
            {image && preview?.file === image ? <figure className="market-image"><div className="market-image-stage"><img src={preview.url} alt="معاينة صورة المنتج" onLoad={() => {
              lastValidImage.current = image;
              setValidatedImage(image);
            }} onError={() => {
              setImage(lastValidImage.current);
              setFileError('تعذّر قراءة الصورة. اختر ملف صورة صالحًا.');
            }} /></div><figcaption><span><ImageIcon size={16} aria-hidden="true" />الصورة المرفوعة</span><bdi>{image.name}</bdi></figcaption></figure>
              : <><div className="seller-drop-icon"><ImagePlus size={34} aria-hidden="true" /></div><strong>اسحب صورة المنتج إلى هنا</strong><p>أو اختر صورة من جهازك.</p></>}
            <div className="market-actions">
              <label className="button secondary file-action"><Upload size={17} aria-hidden="true" />{image ? 'استبدال الصورة' : 'اختر صورة'}<input type="file" aria-label="اختيار ملف الصورة" accept={accepted.join(',')} onChange={event => { select(event.target.files?.[0]); event.target.value = ''; }} /></label>
              <label className="button secondary file-action"><Camera size={18} aria-hidden="true" /> التقاط صورة<input type="file" aria-label="التقاط صورة بالكاميرا" accept="image/*" capture="environment" onChange={event => { select(event.target.files?.[0]); event.target.value = ''; }} /></label>
              {image && <button type="button" className="button secondary" onClick={() => select()}><Trash2 size={17} aria-hidden="true" />إزالة الصورة</button>}
            </div>
            {!image && <small>الصيغ المدعومة <bdi dir="ltr">JPG, PNG, WebP</bdi></small>}
          </div>
        </fieldset>
        {fileError && <p className="market-file-error" role="alert">{fileError}</p>}
      </form>
      <aside className="market-verification" aria-labelledby="market-verification-title">
        <div className="market-verification-content" ref={verificationPanel} tabIndex={-1}>
          {status === 'idle' && <>
            <div className="market-state-heading"><ScanLine size={21} aria-hidden="true" /><h3>قبل إرسال الصورة</h3></div>
            <p>تقارن «إذن» صورة المنتج بالصور المرتبطة بسجل الحقوق. تظهر النتيجة هنا قبل متابعة النشر.</p>
          </>}
          {checking && <div className="market-checking" role="status">
            <div className="market-state-heading"><LoaderCircle size={21} aria-hidden="true" /><h3>جارٍ التحقق من الصورة</h3></div>
            <p>النشر متوقف حتى تصل نتيجة التحقق.</p>
          </div>}
          {error instanceof ServiceError && error.kind === 'expired'
            ? <div className="state" role="alert">انتهت جلسة السوق. {sellerLogin && <a className="button secondary" href={sellerLogin}>سجّل الدخول إلى السوق</a>}</div>
            : error != null && <ErrorState error={error} />}
          {status === 'complete' && result && <section className="market-result" data-decision={decision ?? 'unknown'} aria-labelledby="market-result-title">
            <div className="market-state-heading"><List size={21} aria-hidden="true" /><h3 id="market-result-title">نتيجة التحقق</h3></div>
            <div className="market-result-summary" role="status">
              <h4><Decision value={decision} /></h4>
              <p>{decision ? messages[decision] : 'لم تكتمل عملية التحقق. يبقى النشر متوقفًا.'}</p>
              {reason && <p className="market-result-reason">{reason}</p>}
            </div>
            {(result.registration_id || result.match_found != null || result.authorization_status) && <dl className="market-result-meta">
              {result.registration_id && <div><dt><BookOpenText size={16} aria-hidden="true" />معرّف التسجيل</dt><dd><Id>{result.registration_id}</Id></dd></div>}
              {result.match_found != null && <div><dt><Layers3 size={16} aria-hidden="true" />المقارنة البصرية</dt><dd>{result.match_found ? 'وُجد تطابق بصري' : 'لم يُؤكّد تطابق بصري'}</dd></div>}
              {result.authorization_status && <div><dt><Fingerprint size={16} aria-hidden="true" />حالة الإذن</dt><dd>{authorizations[result.authorization_status]}</dd></div>}
            </dl>}
          </section>}
        </div>
        <div className="market-next">
          {status !== 'complete' ? <>
            {status === 'idle' && <p>{hasPreview ? 'راجع الصورة واسم المنتج قبل إرسالها.' : 'أضف اسم المنتج وصورته للمتابعة.'}</p>}
            <button form="market-product" type="submit" className="button" disabled={!image || validatedImage !== image || !title.trim() || checking}>
              {checking ? 'جارٍ رفع الصورة والتحقق منها' : status === 'failed' ? 'إعادة التحقق' : 'التحقق ومتابعة النشر'}<ArrowLeft size={17} aria-hidden="true" />
            </button>
          </> : decision === 'allow' && nextPublish
            ? <a className="button" href={nextPublish}>متابعة النشر في السوق<ArrowLeft size={17} aria-hidden="true" /></a>
            : (decision === 'review' || decision === 'hold_for_review') && <p className="market-next-note"><span>الخطوة التالية</span>انتظر نتيجة المراجعة قبل متابعة النشر.</p>}
        </div>
      </aside>
    </div>;
}
