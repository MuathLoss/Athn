import { BookOpenText, Fingerprint, ScanLine, TriangleAlert } from 'lucide-react';
import { useRef, type ReactNode } from 'react';
import type { Verification, VerificationDetail } from './domain';
import { authorizations, date, Decision, EvidenceImage, Id, reviewStatuses, Trace } from './ui';
import { sharedMediaName } from './visuals';

export function verificationReason(item: Verification) {
  if (item.system_reason) return item.system_reason;
  if (item.evidence_availability === 'registry_unavailable') return 'توقف التحقق عند سجل الحقوق لأن بياناته غير متاحة.';
  if (item.match_found && item.authorization_status === 'not_recorded') return 'وجد النظام تشابهًا بصريًا مع صورة مرتبطة بسجل الحقوق، ولم يعثر على إذن مسجّل للبائع.';
  if (!item.match_found && item.matched_image_url && item.decision === 'review') return 'وجد النظام صورة مرشحة، وتحتاج المقارنة إلى مراجعة.';
  if (item.authorization_status === 'unknown') return 'لم تكفِ البيانات المتاحة لتأكيد الإذن.';
}

export function Facts({ rows }: { rows: [string, ReactNode][] }) {
  return <dl className="facts">{rows.map(([label, content]) => <div key={label}><dt>{label}</dt><dd>{content}</dd></div>)}</dl>;
}

export function Evidence({ item, children }: { item: VerificationDetail; children?: ReactNode }) {
  const registryUnavailable = item.evidence_availability === 'registry_unavailable';
  const score = item.similarity_score;
  const inspector = useRef<HTMLDialogElement>(null);
  const reference = item.match_found ? 'الصورة المرجعية' : 'الصورة المرشحة للمقارنة';
  const reason = verificationReason(item);
  return <div className="evidence-workspace">
    {item.evidence_availability !== 'full' && <div className="evidence-notice" role="status">
      <TriangleAlert size={21} aria-hidden="true" />
      {registryUnavailable ? 'سجل الحقوق غير متاح. توقف التحقق عند السجل ولا توجد نتيجة تشغيلية مكتملة.' : 'بعض المعلومات غير متاحة. يمكنك مراجعة الأدلة المتوفرة أدناه.'}
    </div>}
    <div className="evidence-grid">
      <section className="comparison" aria-labelledby="comparison-title">
        <div className="section-heading"><h2 id="comparison-title">مقارنة الصور</h2><ScanLine size={21} aria-hidden="true" /></div>
        <div className="image-pair">
          <figure><EvidenceImage src={item.uploaded_image_url} label="الصورة المقدّمة من السوق" transitionName={sharedMediaName('verification', item.id)} /><figcaption><strong>الصورة المقدّمة</strong><span>المصدر · {item.marketplace.name}</span></figcaption></figure>
          <figure><EvidenceImage src={item.matched_image_url} label="الصورة المرجعية للمطابقة البصرية" /><figcaption><strong>{reference}</strong><span>{item.matched_image_url ? 'المصدر · ' + (item.registration_id ? 'سجل الحقوق' : 'خدمة المطابقة البصرية') : 'لم تُرجع الخدمة صورة مرجعية'}</span></figcaption></figure>
        </div>
        <div className="score-strip">
          <div><strong>درجة التشابه بين الصورتين</strong><p>{item.match_found ? 'وجدت الخدمة تطابقًا بصريًا.' : score != null ? 'إشارة بصرية غير حاسمة.' : 'لم تجد الخدمة تطابقًا بصريًا.'}</p></div>
          <bdi dir="ltr">{score == null ? '—' : score.toFixed(3)}</bdi>
        </div>
        <p className="evidence-note">الدرجة تصف التشابه البصري فقط. يُعرض التسجيل والإذن من مصادرهما.</p>
        <button className="button secondary inspect-link" onClick={() => inspector.current?.showModal()}>تكبير الصور</button>
        <dialog ref={inspector} className="image-inspector" aria-label="معاينة الصور بحجم أكبر">
          <form method="dialog"><button className="button secondary">إغلاق المعاينة</button></form>
          <div className="image-pair">
            <figure><EvidenceImage src={item.uploaded_image_url} label="الصورة المقدّمة من السوق" /><figcaption>الصورة المقدّمة</figcaption></figure>
            <figure><EvidenceImage src={item.matched_image_url} label="الصورة المرجعية للمطابقة البصرية" /><figcaption>{reference}</figcaption></figure>
          </div>
        </dialog>
      </section>
      <aside className="evidence-rail" aria-label="خلاصة الحالة والسجل والإذن">
        <section className="evidence-outcome" aria-label="الخلاصة التشغيلية">
          <h2>خلاصة الحالة</h2>
          <div className="evidence-system-result"><span>نتيجة النظام</span><Decision value={item.decision} /></div>
          {item.review_status && <p className="evidence-review-status">حالة المراجعة · {reviewStatuses[item.review_status]}</p>}
          {reason && !registryUnavailable && <p>{reason}</p>}
        </section>
        <section><div className="section-heading"><h2>سجل الحقوق</h2><BookOpenText size={19} aria-hidden="true" /></div>
          {registryUnavailable ? <p>تعذّر الوصول إلى السجل.</p> : <Facts rows={[
            ['معرّف التسجيل', item.registration_id ? <Id>{item.registration_id}</Id> : 'غير متاح'],
            ['صاحب الحق المسجّل', item.registered_owner ?? 'غير متاح'],
            ['مصدر بيانات التسجيل', item.related_work?.registry_source ?? 'غير متاح'],
          ]} />}
        </section>
        <section><div className="section-heading"><h2>إذن استخدام الصورة</h2><Fingerprint size={19} aria-hidden="true" /></div>
          <p>{registryUnavailable ? 'لم تكتمل خطوة التحقق من الإذن.' : authorizations[item.authorization_status]}</p>
          <small>البائع · {item.seller.display_name ?? <Id>{item.seller.id}</Id>}</small>
          {item.evidence_availability === 'partial' && <small className="evidence-review-status">بعض بيانات التحقق غير متاحة.</small>}
        </section>
        {children}
      </aside>
    </div>
    <section className="trace-panel evidence-timeline" aria-labelledby="trace-title">
      <h2 id="trace-title">مراحل التحقق من الصورة</h2><Trace steps={item.trace} />
    </section>
    <details className="inspector"><summary>تفاصيل الطلب والمصادر</summary>
      <Facts rows={[
        ['معرّف التحقق', <Id>{item.id}</Id>], ['وقت الاستلام', date(item.created_at)], ['السوق', item.marketplace.name],
        ['معرّف البائع من السوق', <Id>{item.seller.id}</Id>],
        ['حالة الإشعار', item.notification_status ? ({ sent: 'تم الإرسال', failed: 'تعذّر الإرسال', pending: 'بانتظار الإرسال', not_required: 'غير مطلوب' } as const)[item.notification_status] : 'غير متاحة'],
      ]} />
    </details>
  </div>;
}
