import { useState } from 'react';
import { KeyRound, Layers3, ScanLine, BookOpenText, GitCommitHorizontal, ShieldCheck, UserRoundCheck, Eye, EyeOff, Mail, LockKeyhole } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Navigate } from 'react-router-dom';
import { Action, authKey, Back, ErrorState, Pending, services, Title, useSession, workspaceByRole } from './ui';
import { LayerMotif } from './visuals';

const stages = [
  { label: 'استلام الصورة', detail: 'يرسل السوق صورة المنتج للتحقق قبل النشر.', icon: Layers3 },
  { label: 'المطابقة البصرية', detail: 'يبحث النظام عن صورة مشابهة للمقارنة.', icon: ScanLine },
  { label: 'سجل الحقوق', detail: 'يراجع النظام بيانات التسجيل للصورة المرجعية عند توافرها.', icon: BookOpenText },
  { label: 'الإذن', detail: 'يبحث النظام عن إذن مسجّل للبائع باستخدام الصورة.', icon: KeyRound },
  { label: 'النتيجة', detail: 'يتلقى السوق النتيجة ويعرف هل يمكن متابعة النشر أم يلزم الانتظار.', icon: GitCommitHorizontal },
];

function VerificationJourney() {
  const [step, setStep] = useState(0);
  const current = stages[step];
  const Icon = current.icon;
  return <section className="process journey" aria-labelledby="process-title">
    <div className="process-heading"><h2 id="process-title">كيف يتم التحقق؟</h2></div>
    <ol className="journey-controls">{stages.map(({ label, icon: StageIcon }, index) => <li key={label}>
      <button type="button" aria-pressed={index === step} aria-controls="journey-evidence" onClick={() => setStep(index)}>
        <span className="journey-node"><StageIcon size={20} aria-hidden="true" /></span><strong>{label}</strong>
      </button>
    </li>)}</ol>
    <div className="journey-evidence" id="journey-evidence" data-step={step}>
      <div className="journey-images">
        <img className="journey-submitted" src="/media/submission.jpg" alt="صورة المنتج المقدّمة من السوق" loading="lazy" />
        {step > 0 && <img className="journey-reference" src="/media/ceramic.jpg" alt="صورة مرجعية للمقارنة" loading="lazy" />}
        <div className="journey-connector"><Icon size={21} aria-hidden="true" /></div>
      </div>
      <div aria-live="polite"><h3>{current.label}</h3><p>{current.detail}</p></div>
    </div>
  </section>;
}

export function Entry() {
  return <>
    <section className="hero">
      <div className="hero-copy">
        <p className="eyebrow"><span /> التحقق من حقوق الصور</p>
        <h1>تحقّق من الصورة<br /><em>قبل نشرها.</em></h1>
        <p className="hero-description">يراجع «إذن» تشابه الصورة مع الأعمال المسجّلة، ويبيّن ما إذا كان للبائع إذن مسجّل باستخدامها.</p>
        <Action to="/login">تسجيل الدخول</Action>
      </div>
      <figure className="hero-figure" aria-label="تمثيل بصري لانتقال الصورة إلى السجل ثم القرار">
        <div className="figure-head"><span>مسار التحقق</span><ScanLine size={21} aria-hidden="true" /></div>
        <div className="art-field" aria-hidden="true">
          <div className="art-layer art-back" /><div className="art-layer art-middle" />
          <div className="art-layer art-photo"><img src="/media/ceramic.jpg" alt="" /></div>
          <div className="art-signal"><i /></div>
        </div>
        <figcaption><span>الصورة</span><i /><span>المطابقة</span><i /><span>السجل</span><i /><span>الإذن</span><i /><span>النتيجة</span></figcaption>
      </figure>
    </section>
    <VerificationJourney />
    <dl className="participant-strip">
      <div><dt>السوق</dt><dd>يرسل الصورة للتحقق قبل نشرها.</dd></div>
      <div><dt>صاحب الحق</dt><dd>يتابع أعماله ومحاولات استخدامها.</dd></div>
      <div><dt>المراجع</dt><dd>يفحص الحالات التي تحتاج قرارًا بشريًا.</dd></div>
    </dl>
  </>;
}

export function Login() {
  const session = useSession();
  const client = useQueryClient();
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ identifier?: string; password?: string }>({});
  const login = useMutation({
    mutationFn: services.auth.signIn,
    gcTime: 0,
    onSuccess: user => {
      client.removeQueries({ predicate: query => query.queryKey[0] !== authKey[0] });
      client.setQueryData(authKey, user);
    },
  });
  if (session.data) return <Navigate to={workspaceByRole[session.data.role]} replace />;
  return <section className="identity-gateway">
    <div className="identity-stage">
      <div className="login-content">
      <Back to="/">الصفحة الرئيسية</Back>
      <Title context="بوابة الهوية" title="تسجيل الدخول" subtitle="أدخل بريدك الإلكتروني وكلمة المرور للوصول إلى مساحة عملك." />
      {session.isPending ? <Pending />
        : session.isError ? <ErrorState error={session.error} retry={() => void session.refetch()} />
        : <form className="identity-form" noValidate aria-busy={login.isPending} onSubmit={event => {
          event.preventDefault();
          if (login.isPending) return;
          const form = event.currentTarget;
          const fields = new FormData(form);
          const identifier = String(fields.get('identifier') ?? '').trim();
          const password = String(fields.get('password') ?? '');
          const validation = {
            identifier: !identifier ? 'أدخل بريدك الإلكتروني.' : !form.querySelector<HTMLInputElement>('#login-identifier')?.validity.valid ? 'أدخل بريدًا إلكترونيًا صالحًا.' : undefined,
            password: !password ? 'أدخل كلمة المرور.' : undefined,
          };
          setErrors(validation);
          if (validation.identifier || validation.password) {
            form.querySelector<HTMLElement>(validation.identifier ? '#login-identifier' : '#login-password')?.focus();
            return;
          }
          login.mutate({ identifier, password });
        }}>
          <fieldset disabled={login.isPending}>
            <label className="field" htmlFor="login-identifier">البريد الإلكتروني</label>
            <div className="identity-field">
              <Mail size={18} aria-hidden="true" />
              <input id="login-identifier" name="identifier" type="email" autoComplete="username" dir="ltr" required aria-invalid={Boolean(errors.identifier)}
                aria-describedby={errors.identifier ? 'login-identifier-error' : undefined} onChange={() => {
                  if (errors.identifier) setErrors(previous => ({ ...previous, identifier: undefined }));
                  if (login.isError) login.reset();
                }} />
            </div>
            {errors.identifier && <p id="login-identifier-error" className="identity-field-error" role="alert">{errors.identifier}</p>}
            <label className="field" htmlFor="login-password">كلمة المرور</label>
            <div className="identity-field identity-password">
              <LockKeyhole size={18} aria-hidden="true" />
              <input id="login-password" name="password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" dir="ltr" required aria-invalid={Boolean(errors.password)}
                aria-describedby={errors.password ? 'login-password-error' : undefined} onChange={() => {
                  if (errors.password) setErrors(previous => ({ ...previous, password: undefined }));
                  if (login.isError) login.reset();
                }} />
              <button type="button" className="identity-password-toggle" aria-label={showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
                aria-controls="login-password" onClick={() => setShowPassword(visible => !visible)}>
                {showPassword ? <EyeOff size={19} aria-hidden="true" /> : <Eye size={19} aria-hidden="true" />}
              </button>
            </div>
            {errors.password && <p id="login-password-error" className="identity-field-error" role="alert">{errors.password}</p>}
            <button type="submit" className="button"><KeyRound size={18} aria-hidden="true" />{login.isPending ? 'جارٍ تسجيل الدخول' : 'تسجيل الدخول'}</button>
          </fieldset>
          {login.isPending && <span role="status">جارٍ التحقق من بيانات الحساب.</span>}
          {login.isError && <ErrorState error={login.error} />}
        </form>}
      <p className="identity-session-note"><ShieldCheck size={18} aria-hidden="true" />صلاحيات الوصول مرتبطة بحسابك.</p>
      </div>
      <div className="identity-visual">
        <LayerMotif icon={ScanLine} image />
        <div className="identity-visual-copy"><h2>تحقّق من حقوق الصور قبل النشر</h2><p>من الصورة المقدّمة إلى مراجعة سجل الحقوق والإذن باستخدامها.</p></div>
      </div>
    </div>
    <ol className="identity-sequence" aria-label="خطوات الوصول إلى مساحة العمل">
      <li><UserRoundCheck aria-hidden="true" /><div><strong>التحقق من الهوية</strong><span>دخول موثّق</span></div></li>
      <li><ShieldCheck aria-hidden="true" /><div><strong>تحديد الصلاحيات</strong><span>حسب دور الحساب</span></div></li>
      <li><Layers3 aria-hidden="true" /><div><strong>فتح مساحة العمل</strong><span>إجراءات المراجعة قبل النشر</span></div></li>
    </ol>
  </section>;
}
