import type {
  AuthorizationRecord, MockScenarioId, Notification, ProtectedWork, ReviewCaseDetail,
  ReviewDecisionInput, ReviewDecisionPreview, UserRole, VerificationDetail,
  VerificationTraceStep,
} from '../domain';
import { ServiceError, type Services } from './contracts';
import { defaultScenario, outcomes, scenarios } from './scenarios';
import { getLocalUser, localAuth } from './local-auth';

const scenarioKey = 'idhn.demo.scenario';
export const demoImage = '/media/ceramic.jpg';
const work: ProtectedWork = {
  id: 'work_001', registration_id: 'REG-001', title: 'مزهرية خزفية زرقاء',
  image_url: demoImage, owner_name: 'نورة السالم', registry_source: 'سجل الحقوق',
  registration_status: 'active', registered_at: '2026-11-01T10:00:00+03:00',
};
const permission: AuthorizationRecord = {
  id: 'auth_001', seller_id: 'seller_a', seller_name: 'البائع أ', marketplace: 'سوق المتاجر',
  status: 'authorized', valid_from: '2026-11-01T10:00:00+03:00',
};

export function currentScenario(): MockScenarioId {
  const saved = sessionStorage.getItem(scenarioKey);
  return saved && Object.hasOwn(scenarios, saved) ? saved as MockScenarioId : defaultScenario;
}

export function changeScenario(value: MockScenarioId) {
  sessionStorage.setItem(scenarioKey, value);
}

const previews: Record<ReviewDecisionInput['decision'], string> = {
  confirm_allow: 'سيُسجّل قرار السماح في ملف الحالة.',
  confirm_hold: 'سيُسجّل قرار التعليق في ملف الحالة.',
  needs_more_information: 'ستبقى الحالة قيد المراجعة.',
};

function createVerification(scenario: MockScenarioId): VerificationDetail {
  const result = outcomes[scenario];
  const registryUnavailable = result.evidence_availability === 'registry_unavailable';
  const linked = result.match_found && !registryUnavailable;
  const trace: VerificationTraceStep[] = [
    { id: 'request', label: 'استلام الصورة', status: 'complete', source: 'marketplace' },
    { id: 'visual', label: 'التحقق البصري', status: 'complete', source: 'ai' },
  ];
  if (scenario !== 'allow_no_match') {
    trace.push(
      { id: 'registry', label: 'البحث في سجل الحقوق', status: registryUnavailable ? 'failed' : 'complete', source: 'registry' },
      { id: 'permission', label: 'البحث عن إذن للبائع', status: registryUnavailable ? 'pending' : 'complete', source: 'authorization' },
    );
  }
  trace.push({ id: 'decision', label: 'النتيجة التشغيلية', status: result.decision ? 'complete' : 'pending', source: 'system' });
  return {
    ...result, id: 'ver_1005', created_at: '2026-11-25T14:32:00+03:00',
    marketplace: { id: 'market_01', name: 'سوق المتاجر' },
    seller: scenario === 'allow_authorized' ? { id: 'seller_a', display_name: 'البائع أ' } : { id: 'seller_b', display_name: 'البائع ب' },
    uploaded_image_url: '/media/submission.jpg', matched_image_url: result.match_found || scenario === 'review_ambiguous_match' ? demoImage : null,
    registration_id: linked ? work.registration_id : null, registered_owner: linked ? work.owner_name : null,
    trace, related_work: linked ? work : null,
  };
}

export function createMockServices(scenario = currentScenario()): Services {
  const verification = createVerification(scenario);
  const storageKey = 'idhn.demo.state.' + scenario;
  type AuditRecord = { id: string; actorId: string; recordedAt: string; input: ReviewDecisionInput };
  type RecordState = { read: boolean; revision: number; events?: AuditRecord[]; submitted?: ReviewDecisionInput; audit?: string };
  function state(): RecordState {
    return JSON.parse(sessionStorage.getItem(storageKey) ?? '{"read":false,"revision":0}') as RecordState;
  }
  function save(value: RecordState) {
    sessionStorage.setItem(storageKey, JSON.stringify(value));
  }
  const reviewNeeded = verification.review_status === 'pending';
  function reviewCase(): ReviewCaseDetail {
    const current = state();
    const lastEvent = current.events?.at(-1);
    const submitted = lastEvent?.input ?? current.submitted;
    const status = submitted
      ? submitted.decision === 'needs_more_information' ? 'in_review' : 'resolved'
      : 'pending';
    const item: VerificationDetail = { ...verification, review_status: status, trace: [...verification.trace, {
      id: 'review', label: 'المراجعة البشرية', status: status === 'resolved' ? 'complete' : status === 'in_review' ? 'active' : 'pending', source: 'reviewer',
    }] };
    return {
      id: 'case_001', verification_id: item.id, created_at: item.created_at, status,
      reason: scenario === 'review_ambiguous_match' ? 'borderline_match' : scenario === 'registry_unavailable' ? 'missing_registry_data' : 'unknown_authorization',
      verification: item, verification_detail: item, authorization_records: item.authorization_status === 'authorized' ? [permission] : [],
      revision: current.revision, available_decisions: status === 'resolved' ? [] : ['confirm_allow', 'confirm_hold', 'needs_more_information'],
      humanDecision: submitted?.decision, humanNote: submitted?.note, auditId: lastEvent?.id ?? current.audit,
    };
  }

  function check(role?: UserRole) {
    const actor = getLocalUser();
    if (!actor) throw new ServiceError('expired');
    if (actor.role === 'seller' || (role && actor.role !== role)) throw new ServiceError('denied');
    if (scenario === 'backend_error') throw new ServiceError('unavailable');
    return actor;
  }
  function findCase(id: string) {
    check('reviewer');
    if (!reviewNeeded || id !== 'case_001') throw new ServiceError('missing');
    return reviewCase();
  }
  function ensureOpen(id: string) {
    const item = findCase(id);
    if (item.status === 'resolved') throw new ServiceError('conflict');
    return item;
  }
  function notices(): Notification[] {
    if (verification.notification_status !== 'sent') return [];
    return [{
      id: 'not_001', type: 'unauthorized_usage', title: 'محاولة استخدام تحتاج مراجعة',
      message: 'وجد النظام تطابقًا بصريًا ولم يعثر على إذن مسجّل للبائع.',
      created_at: verification.created_at, read: state().read, verification_id: verification.id, work_id: work.id,
      preview_image_url: verification.uploaded_image_url,
    }];
  }
  function activity() {
    return reviewNeeded ? [reviewCase().verification] : [verification];
  }
  function works() {
    const related = activity().find(entry => entry.registration_id === work.registration_id);
    return [{ ...work, last_activity_at: related?.created_at ?? null }];
  }

  return {
    auth: localAuth,
    rights: {
      async getOverview() {
        check('rights_holder');
        return {
          protected_work_count: 1, unread_notification_count: notices().filter(item => !item.read).length,
          recent_works: works(), recent_verifications: activity(),
          priority_items: reviewNeeded ? [{ id: verification.id, type: 'verification', title: 'صورة تحتاج إلى مراجعة الإذن' }] : [],
          registry_status: scenario === 'registry_unavailable' ? 'unavailable' : 'connected',
        };
      },
      async getProtectedWorks(filters) {
        check('rights_holder');
        const query = filters?.query?.trim().toLowerCase() ?? '';
        return works().filter(item => (item.title + ' ' + item.registration_id).toLowerCase().includes(query)
          && (!filters?.status || filters.status === item.registration_status));
      },
      async getWork(id) {
        check('rights_holder');
        if (id !== work.id) throw new ServiceError('missing');
        if (scenario === 'registry_unavailable') throw new ServiceError('registry_unavailable');
        return { ...work, authorizations: [permission], recent_verifications: activity().filter(row => row.registration_id === work.registration_id) };
      },
      async getUsageActivity(filters) {
        check('rights_holder');
        const query = filters?.query?.trim().toLowerCase() ?? '';
        return activity().filter(item => (item.id + ' ' + item.marketplace.name + ' ' + item.seller.id).toLowerCase().includes(query)
          && (!filters?.decision || item.decision === filters.decision)
          && (!filters?.review_status || item.review_status === filters.review_status)
          && (!filters?.work_id || (filters.work_id === work.id && item.registration_id === work.registration_id)));
      },
    },
    verification: {
      async getVerification(id) {
        check();
        if (id !== verification.id) throw new ServiceError('missing');
        return reviewNeeded ? reviewCase().verification_detail : verification;
      },
    },
    notification: {
      async getNotifications() { check('rights_holder'); return notices(); },
      async markAsRead(id) {
        check('rights_holder');
        if (!notices().some(item => item.id === id)) throw new ServiceError('missing');
        save({ ...state(), read: true });
      },
    },
    review: {
      async getQueue(filters) {
        check('reviewer');
        if (!reviewNeeded) return [];
        const item = reviewCase();
        const query = filters?.query?.trim().toLowerCase() ?? '';
        return (item.id + ' ' + item.verification_id + ' ' + item.verification.marketplace.name).toLowerCase().includes(query)
          && (!filters?.status || filters.status === item.status)
          && (!filters?.reason || filters.reason === item.reason) ? [item] : [];
      },
      async getCase(id) { return findCase(id); },
      async prepareDecision(id, input): Promise<ReviewDecisionPreview> {
        ensureOpen(id);
        if (!Object.hasOwn(previews, input.decision)) throw new ServiceError('invalid');
        return { case_id: id, decision: input.decision, effect_summary: previews[input.decision] };
      },
      async submitDecision(id, input, expectedRevision) {
        const item = ensureOpen(id);
        if (item.revision !== expectedRevision) throw new ServiceError('conflict');
        if (scenario === 'review_conflict' && item.revision === 0) {
          save({ ...state(), revision: 1 });
          throw new ServiceError('conflict');
        }
        if (!Object.hasOwn(previews, input.decision)) throw new ServiceError('invalid');
        const audit = crypto.randomUUID();
        const current = state();
        const actor = check('reviewer');
        const entry = { id: audit, actorId: actor.id, recordedAt: new Date().toISOString(), input };
        save({ ...current, revision: item.revision + 1, events: [...(current.events ?? []), entry] });
        return { case_id: id, status: reviewCase().status, audit_id: audit };
      },
    },
  };
}

