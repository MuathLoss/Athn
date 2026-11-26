import { useEffect, useRef, type ReactNode } from 'react';
import { useMutation, useQuery, useQueryClient, type UseQueryResult } from '@tanstack/react-query';
import { Link, NavLink, Outlet, useLocation, useNavigate, useNavigationType } from 'react-router-dom';
import { AlertCircle, ArrowLeft, ArrowUpLeft, Check, Circle, Clock3, Focus, ImageOff, LoaderCircle, LogOut } from 'lucide-react';
import type { AuthorizationStatus, UserRole, VerificationDecision, VerificationTraceStep } from './domain';
import { ServiceError } from './services/contracts';
import { services } from './services/runtime';

export { services };
export const authKey = ['session'] as const;
export const workspaceByRole: Record<UserRole, string> = {
  seller: '/marketplace/pre-publish', rights_holder: '/portal', reviewer: '/review',
};
export const portalVerification = (id: string) => '/portal/verifications/' + id;
export const reviewCasePath = (id: string) => '/review/cases/' + id;

export const decisions: Record<VerificationDecision, string> = {
  allow: 'سماح', review: 'تحتاج مراجعة', hold_for_review: 'تعليق النشر للمراجعة',
};
export const authorizations: Record<AuthorizationStatus, string> = {
  authorized: 'إذن مسجّل', not_recorded: 'لم نعثر على إذن مسجّل', unknown: 'تعذّر تأكيد الإذن', not_applicable: 'غير منطبق',
};
export const reviewStatuses = {
  pending: 'بانتظار المراجعة', in_review: 'قيد المراجعة', resolved: 'تمت المراجعة', not_required: 'لا تتطلب مراجعة',
};
export const reasons = {
  borderline_match: 'تطابق بصري غير حاسم', unknown_authorization: 'الإذن يحتاج مراجعة',
  missing_registry_data: 'بيانات السجل غير متاحة', conflicting_registry_data: 'تعارض في أدلة السجل', other: 'تحتاج مراجعة',
};
export const sources = {
  marketplace: 'السوق', ai: 'المطابقة البصرية', registry: 'السجل', authorization: 'الإذن', reviewer: 'المراجع', system: 'النظام',
};
export function date(value?: string | null) {
  return value ? new Intl.DateTimeFormat('ar-SA', { dateStyle: 'medium', timeStyle: 'short', calendar: 'gregory', timeZone: 'Asia/Riyadh' }).format(new Date(value)) : 'غير متاح';
}
export function Id({ children }: { children: ReactNode }) {
  return <bdi className="id" dir="ltr">{children}</bdi>;
}
export function Logo() {
  return <Link className="brand" to="/" aria-label="إذن، الصفحة الرئيسية"><img src="/media/mark.svg" alt="" /><span>إذن</span></Link>;
}
export function useSignOut() {
  const navigate = useNavigate();
  const client = useQueryClient();
  return useMutation({
    mutationFn: services.auth.signOut,
    onSuccess: () => {
      client.setQueryData(authKey, null);
      client.removeQueries({ predicate: query => query.queryKey[0] !== authKey[0] });
      navigate('/login', { replace: true });
    },
  });
}

export function SiteHeader({ area }: { area?: 'portal' | 'review' }) {
  const logout = useSignOut();
  return <header className="site-header">
    <div className="header-inner">
      <Logo />
      {area === 'portal' && <nav aria-label="بوابة صاحب الحق" className="main-nav">
        <NavLink to="/portal" end>النظرة العامة</NavLink><NavLink to="/portal/works">المصنفات</NavLink>
        <NavLink to="/portal/activity">نشاط الاستخدام</NavLink><NavLink to="/portal/notifications">التنبيهات</NavLink>
      </nav>}
      {area === 'review' && <nav className="main-nav" aria-label="مساحة المراجعة"><NavLink to="/review">طابور المراجعة</NavLink></nav>}
      <div className="header-actions">
        {area ? <button className="icon-button" disabled={logout.isPending} aria-label="تسجيل الخروج" title="تسجيل الخروج" onClick={() => logout.mutate()}><LogOut size={19} /></button>
          : <Link className="header-identity" to="/login">بوابة الهوية</Link>}
      </div>
    </div>
    {logout.isError && <ErrorState error={logout.error} />}
  </header>;
}
export function Shell({ area }: { area?: 'portal' | 'review' }) {
  const { pathname, state } = useLocation();
  const navigation = useNavigationType();
  const focusId = typeof state?.returnFocus === 'string' ? state.returnFocus : undefined;
  const main = useRef<HTMLElement>(null);
  const previousPath = useRef(pathname);
  useEffect(() => {
    const node = main.current;
    if (!node) return;
    if (navigation !== 'POP' || previousPath.current !== pathname) {
      node.focus({ preventScroll: true });
      window.scrollTo(0, 0);
    }
    previousPath.current = pathname;
    if (!focusId) return;
    function restore() {
      const link = document.getElementById(focusId!);
      if (!link) return;
      link.focus();
      observer.disconnect();
    }
    const observer = new MutationObserver(restore);
    observer.observe(node, { childList: true, subtree: true });
    restore();
    return () => observer.disconnect();
  }, [focusId, navigation, pathname]);
  return <>
    <a className="skip" href="#main">انتقل إلى المحتوى</a>
    <SiteHeader area={area} />
    <main id="main" ref={main} tabIndex={-1} className={area ? 'workspace' : 'public-main'}><Outlet /></main>
  </>;
}
export function useSession() {
  return useQuery({ queryKey: authKey, queryFn: services.auth.getCurrentUser, staleTime: Infinity });
}
export function Title({ context, title, subtitle, action }: { context?: ReactNode; title: string; subtitle?: ReactNode; action?: ReactNode }) {
  return <header className="page-heading">
    <div>{context && <div className="context">{context}</div>}<h1>{title}</h1>{subtitle && <p>{subtitle}</p>}</div>
    {action}
  </header>;
}
export function Back({ to, children }: { to: string; children: ReactNode }) {
  const { state } = useLocation();
  const origin = state?.rowOrigin as { path: string; search: string; id: string } | undefined;
  const returning = origin?.path === to;
  return <Link className="back-link" to={returning ? to + origin.search : to} state={returning ? { returnFocus: origin.id } : undefined}>{children}<ArrowLeft size={16} aria-hidden="true" /></Link>;
}
export function RowLink({ id, to, children }: { id: string; to: string; children: ReactNode }) {
  const { pathname, search } = useLocation();
  return <Link id={id} className="ledger-row" to={to} state={{ rowOrigin: { path: pathname, search, id } }}>{children}</Link>;
}
export function Action({ to, children, secondary = false }: { to: string; children: ReactNode; secondary?: boolean }) {
  return <Link className={secondary ? 'button secondary' : 'button'} to={to}>{children}<ArrowUpLeft size={17} aria-hidden="true" /></Link>;
}
export function Decision({ value }: { value: VerificationDecision | null }) {
  const Icon = value === 'allow' ? Check : value === 'hold_for_review' ? AlertCircle : value ? Clock3 : Circle;
  return <span className={'decision ' + (value ?? 'unknown')}><Icon size={17} aria-hidden="true" />{value ? decisions[value] : 'النتيجة غير متاحة'}</span>;
}
const errors = {
  invalid_credentials: 'البريد الإلكتروني أو كلمة المرور غير صحيحة. تحقق من بياناتك وحاول مرة أخرى.',
  denied: 'ليس لديك صلاحية لعرض هذه الصفحة.',
  expired: 'انتهت الجلسة. سجّل الدخول للمتابعة.',
  missing: 'لم نعثر على السجل المطلوب.',
  unavailable: 'تعذّر تحميل البيانات. أعد المحاولة.',
  registry_unavailable: 'تعذّر جلب بيانات المصنف من سجل الحقوق.',
  conflict: 'تغيّرت الحالة منذ إعداد القرار. افتح أحدث تفاصيلها ثم أعد إعداد القرار.',
  invalid: 'اختر قرارًا صالحًا للمتابعة.',
};
export function ErrorState({ error, retry }: { error: unknown; retry?: () => void }) {
  const kind = error instanceof ServiceError ? error.kind : 'unavailable';
  return <div className="state error" role="alert"><AlertCircle size={23} aria-hidden="true" /><strong>{errors[kind]}</strong>
    {kind === 'expired' && <Action to="/login">تسجيل الدخول</Action>}
    {(kind === 'unavailable' || kind === 'registry_unavailable') && retry && <button className="button secondary" onClick={retry}>إعادة المحاولة</button>}
  </div>;
}
export function Empty({ children }: { children: ReactNode }) {
  return <div className="state"><Focus size={24} aria-hidden="true" /><p>{children}</p></div>;
}
export function Pending() {
  return <div className="state loading" role="status"><LoaderCircle size={22} aria-hidden="true" /> جارٍ تحميل البيانات</div>;
}
export function Data<T>({ query, children }: { query: UseQueryResult<T>; children: (data: T) => ReactNode }) {
  if (query.isPending) return <Pending />;
  if (query.isError) return <ErrorState error={query.error} retry={() => void query.refetch()} />;
  return children(query.data);
}
const traceStates = { complete: 'مكتمل', active: 'جارٍ', pending: 'لم يكتمل', failed: 'تعذّر' };
export function Trace({ steps }: { steps: VerificationTraceStep[] }) {
  return <ol className="trace">{steps.map(step => <li key={step.id} data-state={step.status} aria-current={step.status === 'active' ? 'step' : undefined}>
    <span className="trace-node" aria-hidden="true">{step.status === 'complete' ? <Check size={13} /> : step.status === 'failed' ? <AlertCircle size={15} /> : <Circle size={8} />}</span>
    <strong>{step.label}</strong><small>{sources[step.source]} · {traceStates[step.status]}</small>
  </li>)}</ol>;
}
export function EvidenceImage({ src, label, className, transitionName }: { src?: string | null; label: string; className?: string; transitionName?: string }) {
  return <div className={'evidence-image ' + (className ?? '')} style={transitionName ? { viewTransitionName: transitionName } : undefined}>
    {src ? <img src={src} alt={label} onError={event => { event.currentTarget.hidden = true; }} /> : null}
    <div className="image-fallback"><ImageOff aria-hidden="true" size={24} /> الصورة غير متاحة</div>
  </div>;
}
export function FilterBar({ children }: { children: ReactNode }) {
  return <div className="filter-bar">{children}</div>;
}
export function Search({ value, onChange, label = 'بحث', placeholder = 'اكتب للبحث' }: { value: string; onChange: (value: string) => void; label?: string; placeholder?: string }) {
  return <label className="field"><span>{label}</span><input type="search" value={value} onChange={event => onChange(event.target.value)} placeholder={placeholder} /></label>;
}
