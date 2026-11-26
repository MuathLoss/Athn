import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowUpLeft, Check, ClipboardList, ShieldCheck } from 'lucide-react';
import { Link, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import type { HumanReviewDecision, ReviewDecisionInput, ReviewDecisionPreview, ReviewFilters, Verification } from './domain';
import { Evidence, Facts } from './evidence';
import { ServiceError } from './services/contracts';
import {
  Action, authorizations, Back, Data, date, Decision, Empty, ErrorState, EvidenceImage, FilterBar, Id, reasons,
  reviewCasePath, reviewStatuses, RowLink, Search, services, Title,
} from './ui';

const choiceDetails: Record<HumanReviewDecision, string> = {
  confirm_allow: 'سجّل اختيار السماح في ملف الحالة.',
  confirm_hold: 'سجّل اختيار تعليق النشر للمراجعة.',
  needs_more_information: 'أبقِ الحالة قيد المراجعة إلى أن تتوفر معلومات إضافية.',
};
const humanLabels: Record<HumanReviewDecision, string> = {
  confirm_allow: 'تأكيد السماح',
  confirm_hold: 'تأكيد تعليق النشر للمراجعة',
  needs_more_information: 'طلب معلومات إضافية',
};

function ReviewEvidencePreview({ verification }: { verification: Verification }) {
  if (!verification.uploaded_image_url) return null;
  return <div className="review-evidence-preview">
    <figure><EvidenceImage src={verification.uploaded_image_url} label="صورة السوق" /><figcaption>الصورة المقدّمة</figcaption></figure>
    {verification.matched_image_url && <figure><EvidenceImage src={verification.matched_image_url} label="صورة المقارنة" /><figcaption>صورة المقارنة</figcaption></figure>}
  </div>;
}

function useCase() {
  const { caseId = '' } = useParams();
  const query = useQuery({ queryKey: ['case', caseId], queryFn: () => services.review.getCase(caseId) });
  return { caseId, query, path: reviewCasePath(caseId) };
}

export function Queue() {
  const [params, set] = useSearchParams();
  const term = params.get('q') ?? '';
  const status = params.get('status');
  const reason = params.get('reason');
  const filters: ReviewFilters = {
    query: term, status: status === 'pending' || status === 'in_review' || status === 'resolved' ? status : undefined,
    reason: reason && Object.hasOwn(reasons, reason) ? reason as ReviewFilters['reason'] : undefined,
  };
  const query = useQuery({ queryKey: ['review-queue', filters], queryFn: () => services.review.getQueue(filters) });
  function update(key: string, value: string) {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    set(next, { replace: true });
  }
  return <>
    <Title title="طابور المراجعة" context="مساحة المراجع" subtitle="افتح الحالة لمعرفة سبب إحالتها وما تحتاج إلى مراجعته." />
    <div className="review-ledger"><FilterBar><Search value={term} onChange={value => update('q', value)} label="البحث في الحالات" />
      <label className="field">حالة المراجعة<select value={filters.status ?? ''} onChange={event => update('status', event.target.value)}>
        <option value="">الكل</option>{(['pending', 'in_review', 'resolved'] as const).map(key => <option key={key} value={key}>{reviewStatuses[key]}</option>)}
      </select></label>
      <label className="field">سبب المراجعة<select value={filters.reason ?? ''} onChange={event => update('reason', event.target.value)}>
        <option value="">الكل</option>{Object.entries(reasons).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
      </select></label>
    </FilterBar>
    <Data query={query}>{records => records.length ? <ul className="ledger queue">{records.map(item => <li key={item.id}>
      <RowLink id={item.id} to={reviewCasePath(item.id)}>
        {item.verification.uploaded_image_url ? <EvidenceImage src={item.verification.uploaded_image_url} label="الصورة المقدّمة للمراجعة" className="thumbnail" />
          : <span className="row-icon"><ClipboardList size={24} aria-hidden="true" /></span>}
        <span className="row-main"><strong>{reasons[item.reason]}</strong><small><Id>{item.id}</Id> · <Id>{item.verification_id}</Id> · {item.verification.marketplace.name}</small>
          {item.verification.registration_id && <small>التسجيل · <Id>{item.verification.registration_id}</Id></small>}</span>
        <span className="queue-status"><strong>{reviewStatuses[item.status]}</strong><small>{date(item.created_at)}</small><small>فتح الحالة</small></span>
        <ArrowUpLeft size={17} aria-hidden="true" />
      </RowLink>
    </li>)}</ul> : <Empty>{term || filters.status || filters.reason ? 'لا توجد حالات تطابق عوامل التصفية.' : 'لا توجد حالات في طابور المراجعة.'}</Empty>}</Data>
    </div>
  </>;
}

export function ReviewCaseScreen() {
  const { caseId, query, path } = useCase();
  const location = useLocation();
  return <>
    <Back to="/review">طابور المراجعة</Back>
    <Data query={query}>{item => <>
      <Title context={<Id>{caseId}</Id>} title="مساحة الأدلة" subtitle={reasons[item.reason]} action={item.status !== 'resolved' && Boolean(item.available_decisions?.length) && <Action to={path + '/decision'}>إعداد قرار المراجعة</Action>} />
      {location.state?.recorded && <div className="success-strip"><p role="status"><Check size={23} aria-hidden="true" /> تم تسجيل قرار المراجعة في سجل التدقيق.</p><Action to="/review" secondary>العودة إلى طابور المراجعة</Action></div>}
      <Evidence item={item.verification_detail}>
        {item.authorization_records.length > 0 && <section><h2>سجلات الإذن المتاحة</h2><ul className="plain-list">{item.authorization_records.map(record => <li key={record.id}><Id>{record.seller_id}</Id> · {authorizations[record.status]}</li>)}</ul></section>}
        <section className="human-result"><h2>قرار المراجع</h2><p>{item.humanDecision ? humanLabels[item.humanDecision] : 'لم يُسجّل قرار بشري لهذه الحالة بعد.'}</p>
          {item.humanNote && <p className="human-note">{item.humanNote}</p>}
          {item.auditId && <small>التدقيق · <Id>{item.auditId}</Id></small>}</section>
      </Evidence>
    </>}</Data>
  </>;
}

type Prepared = { caseId: string; input: ReviewDecisionInput; preview: ReviewDecisionPreview; revision: number };

export function ReviewDecisionScreen() {
  const { query, caseId, path } = useCase();
  const navigate = useNavigate();
  const location = useLocation();
  const restored = location.state?.draft as ReviewDecisionInput | undefined;
  const [decision, setDecision] = useState<HumanReviewDecision | ''>(restored?.decision ?? '');
  const [note, setNote] = useState(restored?.note ?? '');
  const prepare = useMutation({
    mutationFn: async ({ input, revision }: { input: ReviewDecisionInput; revision: number }) => ({
      caseId, input, revision, preview: await services.review.prepareDecision(caseId, input),
    }),
    onSuccess: (prepared: Prepared) => {
      const go = () => navigate(path + '/confirm', { state: prepared, flushSync: true });
      if (!document.startViewTransition || matchMedia('(prefers-reduced-motion: reduce)').matches) return go();
      const transition = document.startViewTransition(go);
      // A window resize can skip the visual snapshot while navigation still completes.
      void transition.ready.catch(() => undefined);
      return transition.updateCallbackDone;
    },
  });
  return <>
    <Back to={path}>العودة إلى الأدلة</Back>
    <Title context={<Id>{caseId}</Id>} title="إعداد قرار المراجعة" subtitle="اختر قرارًا بعد مراجعة الأدلة. يمكنك معاينة أثره وتعديله قبل التأكيد." />
    <Data query={query}>{item => item.status === 'resolved' ? <Empty>تمت مراجعة هذه الحالة.</Empty>
      : !item.available_decisions?.length ? <Empty>لا توجد خيارات قرار متاحة لهذه الحالة.</Empty> : <div className="decision-layout">
      <form className="decision-form" onSubmit={event => {
        event.preventDefault();
        if (decision && item.available_decisions?.includes(decision)) prepare.mutate({ input: { decision, note: note.trim() || undefined }, revision: item.revision });
      }}>
        <fieldset disabled={prepare.isPending}><legend>اختر قرار المراجعة</legend>
          {item.available_decisions.filter(key => Object.hasOwn(humanLabels, key)).map(key => <label key={key} className="choice">
            <input type="radio" required name="decision" value={key} aria-label={humanLabels[key]} checked={decision === key} onChange={() => setDecision(key)} />
            <span><strong className={decision === key ? 'decision-transition' : undefined}>{humanLabels[key]}</strong><small>{choiceDetails[key]}</small></span>
          </label>)}
        </fieldset>
        <label className="field">ملاحظة للمراجعة (اختيارية)<textarea value={note} onChange={event => setNote(event.target.value)} rows={3} /></label>
        {prepare.isError && <ErrorState error={prepare.error} />}
        <button className="button" disabled={prepare.isPending} type="submit">{prepare.isPending ? 'جارٍ إعداد المعاينة' : 'معاينة القرار'}</button>
      </form>
      <aside className="evidence-rail decision-context"><h2>سياق الحالة</h2>
        <ReviewEvidencePreview verification={item.verification} />
        <Facts rows={[[ 'سبب المراجعة', reasons[item.reason]], ['توصية النظام', <Decision value={item.verification.decision} />], ['حالة المراجعة', reviewStatuses[item.status]]]} />
      </aside>
    </div>}</Data>
  </>;
}

export function Confirm() {
  const { query, caseId, path } = useCase();
  const location = useLocation();
  const navigate = useNavigate();
  const client = useQueryClient();
  const prepared = location.state as Prepared | null;
  const submission = useMutation({
    mutationFn: (draft: Prepared) => services.review.submitDecision(caseId, draft.input, draft.revision),
    onError: async error => {
      if (error instanceof ServiceError && error.kind === 'conflict') {
        await client.invalidateQueries({ queryKey: ['case', caseId] });
      }
    },
    onSuccess: async () => {
      await Promise.all([
        client.invalidateQueries({ queryKey: ['case', caseId] }),
        client.invalidateQueries({ queryKey: ['review-queue'] }),
        client.invalidateQueries({ queryKey: ['verification'] }),
      ]);
      navigate(path, { replace: true, state: { recorded: true } });
    },
  });
  const conflict = submission.error instanceof ServiceError && submission.error.kind === 'conflict';
  return <>
    <Back to={path}>العودة إلى الأدلة</Back>
    <Title context={<Id>{caseId}</Id>} title="تأكيد قرار المراجعة" subtitle="راجع أثر القرار. يمكنك الرجوع وتعديله قبل تسجيله." />
    <Data query={query}>{item => {
      if (!prepared || prepared.caseId !== caseId) return <div className="state"><p>ابدأ بإعداد القرار للحصول على معاينة الأثر.</p><Action to={path + '/decision'}>إعداد القرار</Action></div>;
      const stale = conflict || item.revision !== prepared.revision || item.status === 'resolved' || !item.available_decisions?.includes(prepared.input.decision);
      return <div className="decision-layout">
      <div className="confirmation">
        <div className="confirm-title"><ShieldCheck size={30} aria-hidden="true" /><h2 className="decision-transition">{humanLabels[prepared.input.decision]}</h2></div>
        <Facts rows={[
          ['أثر القرار', prepared.preview.effect_summary],
          ...(prepared.preview.marketplace_effect ? [['الأثر على السوق', prepared.preview.marketplace_effect] as [string, string]] : []),
          ...(prepared.preview.notification_effect ? [['الأثر على الإشعار', prepared.preview.notification_effect] as [string, string]] : []),
          ...(prepared.input.note ? [['ملاحظة المراجع', prepared.input.note] as [string, string]] : []),
        ]} />
        <p>عند التأكيد، يُسجَّل قرارك في سجل التدقيق.</p>
        {stale ? <><ErrorState error={new ServiceError('conflict')} /><Action to={path} secondary>عرض أحدث بيانات الحالة</Action></> : <>
          {submission.isError && <ErrorState error={submission.error} />}
          <div className="actions"><button className="button" type="button" disabled={submission.isPending} onClick={() => submission.mutate(prepared)}>{submission.isPending ? 'جارٍ التأكيد' : 'تأكيد القرار'}</button>
            <Link className="button secondary" to={path + '/decision'} state={{ draft: prepared.input }}>رجوع للتعديل</Link></div>
        </>}
      </div>
      <aside className="evidence-rail decision-context"><h2>الحالة قيد النظر</h2>
        <ReviewEvidencePreview verification={item.verification} />
        <Facts rows={[[ 'سبب المراجعة', reasons[item.reason]], ['نتيجة النظام', <Decision value={item.verification.decision} />], ['حالة المراجعة', reviewStatuses[item.status]]]} />
      </aside>
      </div>;
    }}</Data>
  </>;
}
