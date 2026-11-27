import ManagePermissions from './ManagePermissions';
import RegisterWork from './RegisterWork';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowUpLeft, Bell, BellRing, BookOpenText, CalendarDays, CircleAlert, CircleCheck, CircleHelp, Clock3, Layers3, ScanLine, KeyRound, CircleDot, Store } from 'lucide-react';
import { Link, useLocation, useParams, useSearchParams } from 'react-router-dom';
import type { NotificationType, ProtectedWork, Verification, VerificationDecision, WorkFilters } from './domain';
import { Evidence, Facts, verificationReason } from './evidence';
import { DetailLink, sharedMediaName, WorkspaceBanner } from './visuals';
import {
  Action, authorizations, Back, Data, date, Decision, decisions, Empty, ErrorState,
  EvidenceImage, FilterBar, Id, portalVerification, reviewStatuses, RowLink, Search, services, Title, useSession,
} from './ui';

const workPath = (id: string) => '/portal/works/' + id;
const notificationTypes: Record<NotificationType, string> = {
  unauthorized_usage: 'محاولة استخدام', review_started: 'بدء المراجعة',
  review_resolved: 'اكتمال المراجعة', integration_failure: 'تعذّر التكامل',
};

function PriorityVerification({ verification, work, description }: { verification: Verification; work?: ProtectedWork; description?: string }) {
  const reason = description ?? verificationReason(verification);
  return <article className="priority-story">
    <figure className="priority-images">
      <EvidenceImage src={verification.uploaded_image_url} label="صورة الاستخدام المقدّمة من السوق" transitionName={sharedMediaName('verification', verification.id)} />
      {verification.matched_image_url && <div className="priority-reference">
        <EvidenceImage src={verification.matched_image_url} label="الصورة المستخدمة للمقارنة" /><span>صورة المقارنة</span>
      </div>}
      <figcaption>الصورة المقدّمة · {verification.marketplace.name}</figcaption>
    </figure>
    <div className="priority-content">
      <h2>{verification.review_status === 'resolved' ? 'محاولة استخدام تمت مراجعتها' : 'محاولة استخدام تحتاج مراجعة'}</h2>
      {reason && <p>{reason}</p>}
      <div className="attention-trace">
        {work ? <Link to={workPath(work.id)}>{work.title}</Link> : verification.registration_id && <Id>{verification.registration_id}</Id>}
        <Decision value={verification.decision} />
      </div>
      <ol className="priority-path priority-evidence-path" aria-label="مسار التحقق">
        {([[Layers3, 'الصورة'], [ScanLine, 'المطابقة'], [BookOpenText, 'السجل'], [KeyRound, 'الإذن'], [CircleDot, 'النتيجة']] as const).map(([Icon, label]) =>
          <li key={label}><span><Icon size={16} aria-hidden="true" /></span><small>{label}</small></li>)}
      </ol>
      <DetailLink className="button" id={'priority-' + verification.id} to={portalVerification(verification.id)}
        queryKey={['verification', verification.id]} queryFn={() => services.verification.getVerification(verification.id)}>
        فتح تفاصيل التحقق <ArrowUpLeft size={17} aria-hidden="true" />
      </DetailLink>
    </div>
  </article>;
}

function ActivityRows({ records }: { records: Verification[] }) {
  if (!records.length) return <Empty>لا يوجد نشاط استخدام في هذه القائمة.</Empty>;
  return <ul className="ledger activity-list">{records.map(item => <li key={item.id}>
    <RowLink id={item.id} to={portalVerification(item.id)}>
      {item.uploaded_image_url ? <EvidenceImage src={item.uploaded_image_url} label="الصورة المقدّمة" className="thumbnail" />
        : <span className="row-icon"><Clock3 size={21} aria-hidden="true" /></span>}
      <span className="row-main"><strong>طلب تحقق <Id>{item.id}</Id></strong><small>{item.marketplace.name} · {date(item.created_at)}</small>
        <small>{item.seller.display_name ?? <Id>{item.seller.id}</Id>}{item.registration_id && <> · <Id>{item.registration_id}</Id></>}</small>
        {item.review_status && <small>{reviewStatuses[item.review_status]}{item.notification_status === 'sent' && ' · تم إرسال تنبيه'}</small>}</span>
      <Decision value={item.decision} /><ArrowUpLeft size={17} aria-hidden="true" />
    </RowLink>
  </li>)}</ul>;
}

function WorkRows({ records, catalog = false }: { records: ProtectedWork[]; catalog?: boolean }) {
  if (!records.length) return <Empty>لا توجد مصنفات مطابقة في هذه القائمة.</Empty>;
  if (catalog) return <ul className="catalog-rows">{records.map(work => <li key={work.id}>
    <DetailLink id={work.id} to={workPath(work.id)} className="catalog-row" queryKey={['work', work.id]} queryFn={() => services.rights.getWork(work.id)}>
      <EvidenceImage src={work.image_url} label={work.title} className="catalog-thumbnail" transitionName={sharedMediaName('work', work.id)} />
      <div className="catalog-description"><h2>{work.title}</h2>
        <div className="entry-meta">
          <span><Layers3 size={16} aria-hidden="true" /><Id>{work.registration_id}</Id></span>
          <span><BookOpenText size={16} aria-hidden="true" />{work.registry_source}</span>
          {work.registered_at && <span><CalendarDays size={16} aria-hidden="true" /><time dateTime={work.registered_at}>{date(work.registered_at)}</time></span>}
        </div>
        {work.last_activity_at && <p className="catalog-activity"><Clock3 size={15} aria-hidden="true" />آخر محاولة استخدام · <time dateTime={work.last_activity_at}>{date(work.last_activity_at)}</time></p>}
      </div>
      <span className="catalog-status" data-active={work.registration_status === 'active'}>{work.registration_status === 'active'
        ? <><CircleCheck size={18} aria-hidden="true" />تسجيل نشط</> : <><CircleHelp size={18} aria-hidden="true" />حالة التسجيل غير متاحة</>}</span>
      <span className="catalog-cta">عرض التفاصيل <ArrowUpLeft size={17} aria-hidden="true" /></span>
    </DetailLink>
  </li>)}</ul>;
  return <ul className="ledger">{records.map(work => <li key={work.id}>
    <RowLink id={work.id} to={workPath(work.id)}>
      <EvidenceImage src={work.image_url} label={work.title} className="thumbnail" />
      <span className="row-main"><strong>{work.title}</strong><small><Id>{work.registration_id}</Id> · {work.registry_source}</small>
        {work.last_activity_at && <small>آخر محاولة استخدام · {date(work.last_activity_at)}</small>}</span>
      <span className="record-status">{work.registration_status === 'active' ? 'تسجيل نشط' : 'حالة التسجيل غير متاحة'}</span><ArrowUpLeft size={17} aria-hidden="true" />
    </RowLink>
  </li>)}</ul>;
}

export function Overview() {
  const session = useSession();
  const query = useQuery({ queryKey: ['overview'], queryFn: services.rights.getOverview });
  return <>
    <Title context="بوابة صاحب الحق" title="النظرة العامة" subtitle={session.data?.name} action={<Action to="/portal/works" secondary>عرض المصنفات</Action>} />
    <Data query={query}>{overview => <>
      <div className="overview-top">
        <section className="attention">
          <span className="attention-label"><Bell size={19} aria-hidden="true" /> ما يحتاج انتباهك</span>
          {overview.priority_items.length ? overview.priority_items.map(item => {
            const verification = item.type === 'verification' ? overview.recent_verifications.find(entry => entry.id === item.id) : undefined;
            const work = overview.recent_works.find(entry => entry.registration_id === verification?.registration_id);
            if (verification) return <PriorityVerification key={item.id} verification={verification} work={work} description={item.description} />;
            return <div key={item.id}>
            <h2>{item.title}</h2>
            {item.description && <p>{item.description}</p>}
            <Action to={item.type === 'verification' ? portalVerification(item.id) : item.type === 'work' ? workPath(item.id) : '/portal/notifications'}>فتح التفاصيل</Action>
          </div>;
          }) : <h2>لا يوجد طلب يحتاج متابعة الآن</h2>}
        </section>
        <aside className="registry-summary">
          <BookOpenText size={23} aria-hidden="true" />
          <h2>سجل الحقوق</h2>
          <p>{({ connected: 'السجل متاح', unavailable: 'السجل غير متاح حاليًا', syncing: 'تجري المزامنة' })[overview.registry_status]}</p>
          <Link to="/portal/notifications">{overview.unread_notification_count.toLocaleString('ar-SA')} تنبيهات غير مقروءة</Link>
        </aside>
      </div>
      <div className="overview-lists">
        <section><div className="section-heading"><h2>المصنفات الأخيرة</h2><Layers3 size={22} aria-hidden="true" /></div><WorkRows records={overview.recent_works} /></section>
        <section><div className="section-heading"><h2>نشاط الاستخدام الأخير</h2><Clock3 size={22} aria-hidden="true" /></div><ActivityRows records={overview.recent_verifications} /></section>
      </div>
    </>}</Data>
  </>;
}

function useFilterParams() {
  const [params, set] = useSearchParams();
  return { params, update(key: string, value: string) {
    const next = new URLSearchParams(params);
if (key !== 'page') next.delete('page');
    if (value) next.set(key, value);
    else next.delete(key);
    set(next, { replace: true });
  } };
}

export function Works() {
  const { params, update } = useFilterParams();
  const term = params.get('q') ?? '';
  const status = params.get('status');
  const filters: WorkFilters = { query: term, status: status === 'active' || status === 'unknown' ? status : undefined };
  const query = useQuery({ queryKey: ['works', filters], queryFn: () => services.rights.getProtectedWorks(filters) });
  const overview = useQuery({ queryKey: ['overview'], queryFn: services.rights.getOverview });
  return <>
    <WorkspaceBanner context="بوابة صاحب الحق" title="المصنفات" description="الصور والمحتوى المرتبط بسجل حقوقك." icon={Layers3} />
<RegisterWork />
    <div className="registry-ledger catalog-ledger">
      {overview.data && <div className="catalog-summary"><Layers3 size={20} aria-hidden="true" />إجمالي المصنفات <strong>{overview.data.protected_work_count.toLocaleString('ar-SA')}</strong></div>}
      <FilterBar><Search value={term} onChange={value => update('q', value)} label="البحث في المصنفات" placeholder="اسم المصنف أو معرف التسجيل" />
      <label className="field">حالة التسجيل<select value={filters.status ?? ''} onChange={event => update('status', event.target.value)}><option value="">الكل</option><option value="active">نشط</option><option value="unknown">غير متاح</option></select></label>
      {params.size > 0 && <Link className="button secondary clear-filters" to="/portal/works">مسح المرشحات</Link>}
    </FilterBar>
    <Data query={query}>{records => {
  const pageSize = 25;
  const totalPages = Math.max(
    1, Math.ceil(records.length / pageSize)
  );

  const page = Math.max(
    1,
    Math.min(
      totalPages,
      parseInt(params.get('page') ?? '1', 10) || 1
    )
  );

  const visible = records.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  return <>
    <p className="result-count" role="status">
      نتائج القائمة
      <strong>
        {records.length.toLocaleString('ar-SA')}
      </strong>
    </p>

    <WorkRows records={visible} catalog />

    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '16px',
      padding: '20px'
    }}>
      <button
        className="button secondary"
        disabled={page === 1}
        onClick={() => update('page', String(page - 1))}
      >
        السابق
      </button>

      <span>
        صفحة {page} من {totalPages}
      </span>

      <button
        className="button secondary"
        disabled={page === totalPages}
        onClick={() => update('page', String(page + 1))}
      >
        التالي
      </button>
    </div>
  </>;
}}</Data>
    </div>
  </>;
}

export function WorkDetail() {
  const { workId = '' } = useParams();
  const query = useQuery({ queryKey: ['work', workId], queryFn: () => services.rights.getWork(workId) });
  return <>
    <Back to="/portal/works">المصنفات</Back>
    <Data query={query}>{work => <>
      <Title context={<Id>{work.registration_id}</Id>} title={work.title} action={<Action to={'/portal/activity?work=' + encodeURIComponent(work.id)} secondary>عرض نشاط الاستخدام</Action>} />
      <div className="work-detail record-sheet">
        <figure><EvidenceImage src={work.image_url} label={work.title} transitionName={sharedMediaName('work', work.id)} /><figcaption>الصورة المرتبطة بالتسجيل · {work.registry_source}</figcaption></figure>
        <section className="evidence-rail"><div className="section-heading"><h2>بيانات التسجيل</h2><BookOpenText size={20} aria-hidden="true" /></div>
          <Facts rows={[
            ['المصدر', work.registry_source], ['صاحب الحق', work.owner_name], ['رقم التسجيل', <Id>{work.registration_id}</Id>],
            ['الحالة', work.registration_status === 'active' ? 'نشط' : 'غير متاحة'], ['تاريخ التسجيل', date(work.registered_at)],
          ]} />
        </section>
      </div>
<ManagePermissions
  workId={work.id}
  authorizations={work.authorizations}
/>
      <section className="detail-section"><h2>سجلات الإذن</h2>
        {work.authorizations.length ? <ul className="ledger">{work.authorizations.map(record => <li key={record.id} className="ledger-row">
          <span className="row-main"><strong>{record.seller_name ?? <Id>{record.seller_id}</Id>}</strong><small>{record.marketplace ?? 'السوق غير متاح'} · <Id>{record.seller_id}</Id></small></span>
          <span>{authorizations[record.status]}</span>
        </li>)}</ul> : <Empty>لا توجد سجلات إذن متاحة لهذا المصنف.</Empty>}
      </section>
      <section className="detail-section"><h2>نشاط استخدام المصنف</h2><ActivityRows records={work.recent_verifications} /></section>
    </>}</Data>
  </>;
}

export function Activity() {
  const { params, update } = useFilterParams();
  const term = params.get('q') ?? '';
  const decision = params.get('decision');
  const review = params.get('review');
  const filters = {
    query: term,
    decision: decision && Object.hasOwn(decisions, decision) ? decision as VerificationDecision : undefined,
    review_status: review === 'pending' || review === 'in_review' || review === 'resolved' ? review : undefined,
    work_id: params.get('work') ?? undefined,
  } as const;
  const query = useQuery({ queryKey: ['activity', filters], queryFn: () => services.rights.getUsageActivity(filters) });
  return <>
    <Title context="بوابة صاحب الحق" title="نشاط الاستخدام" subtitle="تابع أين حاول البائعون استخدام صورك وما نتيجة التحقق قبل النشر." />
    <FilterBar><Search value={term} onChange={value => update('q', value)} label="البحث في الطلبات" />
      <label className="field">نتيجة النظام<select value={filters.decision ?? ''} onChange={event => update('decision', event.target.value)}><option value="">الكل</option>{Object.entries(decisions).map(([key, label]) => <option value={key} key={key}>{label}</option>)}</select></label>
      <label className="field">حالة المراجعة<select value={filters.review_status ?? ''} onChange={event => update('review', event.target.value)}><option value="">الكل</option><option value="pending">بانتظار المراجعة</option><option value="in_review">قيد المراجعة</option><option value="resolved">تمت المراجعة</option></select></label>
      {params.size > 0 && <Link className="button secondary clear-filters" to="/portal/activity">مسح المرشحات</Link>}
    </FilterBar>
    <Data query={query}>{records => <ActivityRows records={records} />}</Data>
  </>;
}

export function VerificationScreen() {
  const { verificationId = '' } = useParams();
  const query = useQuery({ queryKey: ['verification', verificationId], queryFn: () => services.verification.getVerification(verificationId) });
  const fromOverview = useLocation().state?.rowOrigin?.path === '/portal';
  return <>
    <Back to={fromOverview ? '/portal' : '/portal/activity'}>{fromOverview ? 'النظرة العامة' : 'نشاط الاستخدام'}</Back>
    <Data query={query}>{item => <><Title context={<Id>{verificationId}</Id>} title="تفاصيل التحقق" subtitle={item.marketplace.name + ' · ' + (item.seller.display_name ?? item.seller.id) + ' · ' + date(item.created_at)} /><Evidence item={item}>
      {item.related_work && <Action to={workPath(item.related_work.id)} secondary>فتح المصنف</Action>}
    </Evidence></>}</Data>
  </>;
}

export function Notifications() {
  const client = useQueryClient();
  const { params, update } = useFilterParams();
  const reading = params.get('reading') === 'unread' ? 'unread' : params.get('reading') === 'read' ? 'read' : '';
  const period = params.get('period') === '7' ? '7' : params.get('period') === '30' ? '30' : '';
  const query = useQuery({ queryKey: ['notifications'], queryFn: services.notification.getNotifications });
  const overview = useQuery({ queryKey: ['overview'], queryFn: services.rights.getOverview });
  const read = useMutation({
    mutationFn: services.notification.markAsRead,
    onSuccess: () => Promise.all([client.invalidateQueries({ queryKey: ['notifications'] }), client.invalidateQueries({ queryKey: ['overview'] })]),
  });
  return <>
    <WorkspaceBanner context="بوابة صاحب الحق" title="التنبيهات" description="تابع التنبيهات المرتبطة بصورك والمصنفات التي تحتاج انتباهك." icon={BellRing} />
    {read.isError && <ErrorState error={read.error} />}
    <Data query={query}>{records => {
      const now = Date.now();
      const earliest = period ? now - Number(period) * 86_400_000 : 0;
      const filtered = records.filter(item => (!reading || item.read === (reading === 'read')) && (!period
        || (Date.parse(item.created_at) >= earliest && Date.parse(item.created_at) <= now)))
        .sort((first, second) => Date.parse(second.created_at) - Date.parse(first.created_at));
      return <section className="notification-inbox" aria-label="صندوق التنبيهات">
        <header className="inbox-toolbar">
          <p className="result-count" role="status">التنبيهات المعروضة <strong>{filtered.length.toLocaleString('ar-SA')}</strong></p>
          <FilterBar>
            <label className="field">حالة القراءة<select value={reading} onChange={event => update('reading', event.target.value)}>
              <option value="">الكل</option><option value="unread">غير مقروء</option><option value="read">مقروء</option>
            </select></label>
            <label className="field">الفترة الزمنية<select value={period} onChange={event => update('period', event.target.value)}>
              <option value="">كل الفترات</option><option value="7">آخر 7 أيام</option><option value="30">آخر 30 يومًا</option>
            </select></label>
            {(reading || period) && <Link className="back-link clear-filters" to="/portal/notifications">مسح المرشحات</Link>}
          </FilterBar>
        </header>
        {filtered.length ? <ul className="inbox-rows">{filtered.map(item => {
          const verification = overview.data?.recent_verifications.find(record => record.id === item.verification_id);
          const work = overview.data?.recent_works.find(record => record.id === item.work_id);
          const Icon = item.type === 'review_resolved' ? CircleCheck : item.type === 'integration_failure' ? CircleAlert : Bell;
          const preview = item.preview_image_url ?? verification?.uploaded_image_url;
          return <li key={item.id} className="inbox-entry" data-unread={!item.read}>
            {preview ? <EvidenceImage src={preview} label="الصورة المرتبطة بالتنبيه" className="inbox-thumbnail" /> : <div className="inbox-icon"><Icon aria-hidden="true" /></div>}
            <div className="inbox-entry-content">
              <p className="inbox-event"><Icon size={16} aria-hidden="true" />{notificationTypes[item.type]} <span>{item.read ? 'مقروء' : 'غير مقروء'}</span></p>
              <h2>{item.title}</h2><p>{item.message}</p>
              <div className="entry-meta">
                <span><Clock3 size={15} aria-hidden="true" /><time dateTime={item.created_at}>{date(item.created_at)}</time></span>
                {verification && <span><Store size={15} aria-hidden="true" />{verification.marketplace.name}</span>}
                {(work || item.work_id) && <span><Layers3 size={15} aria-hidden="true" /><Id>{work?.registration_id ?? item.work_id}</Id></span>}
                {item.verification_id && <span>طلب التحقق <Id>{item.verification_id}</Id></span>}
              </div>
            </div>
            <div className="inbox-actions">
              {item.verification_id && <Action to={portalVerification(item.verification_id)} secondary={item.read}>عرض تفاصيل التحقق</Action>}
              {item.work_id && <Link className="back-link" to={workPath(item.work_id)}>فتح المصنف</Link>}
              {!item.read && <button className="text-button" disabled={read.isPending} onClick={() => read.mutate(item.id)}>تحديد كمقروء</button>}
            </div>
          </li>;
        })}</ul> : <Empty>{records.length ? 'لا توجد تنبيهات تطابق المرشحات.' : 'لا توجد تنبيهات حاليًا.'}</Empty>}
      </section>;
    }}</Data>
  </>;
}
