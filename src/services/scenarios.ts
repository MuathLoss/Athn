import type { MockScenarioId, Verification } from '../domain';

export const scenarios: Record<MockScenarioId, string> = {
  hold_no_authorization: 'تطابق · لا إذن مسجّل',
  allow_no_match: 'لا يوجد تطابق',
  allow_authorized: 'تطابق · إذن مسجّل',
  review_ambiguous_match: 'تطابق غير حاسم',
  review_unknown_authorization: 'تعذّر تأكيد الإذن',
  registry_unavailable: 'السجل غير متاح',
  backend_error: 'خطأ في الخدمة',
  review_conflict: 'تعارض عند التأكيد',
};

export const defaultScenario: MockScenarioId = 'hold_no_authorization';

export const outcomes: Record<MockScenarioId, Pick<Verification, 'match_found' | 'similarity_score' | 'authorization_status' | 'decision' | 'evidence_availability' | 'review_status' | 'notification_status'>> = {
  hold_no_authorization: { match_found: true, similarity_score: .967, authorization_status: 'not_recorded', decision: 'hold_for_review', evidence_availability: 'full', review_status: 'pending', notification_status: 'sent' },
  allow_no_match: { match_found: false, similarity_score: null, authorization_status: 'not_applicable', decision: 'allow', evidence_availability: 'full', review_status: 'not_required', notification_status: 'not_required' },
  allow_authorized: { match_found: true, similarity_score: .932, authorization_status: 'authorized', decision: 'allow', evidence_availability: 'full', review_status: 'not_required', notification_status: 'not_required' },
  review_ambiguous_match: { match_found: false, similarity_score: .782, authorization_status: 'unknown', decision: 'review', evidence_availability: 'partial', review_status: 'pending', notification_status: 'not_required' },
  review_unknown_authorization: { match_found: true, similarity_score: .949, authorization_status: 'unknown', decision: 'review', evidence_availability: 'partial', review_status: 'pending', notification_status: 'not_required' },
  registry_unavailable: { match_found: true, similarity_score: .948, authorization_status: 'unknown', decision: null, evidence_availability: 'registry_unavailable', review_status: 'pending', notification_status: 'not_required' },
  backend_error: { match_found: false, similarity_score: null, authorization_status: 'unknown', decision: null, evidence_availability: 'partial' },
  review_conflict: { match_found: true, similarity_score: .967, authorization_status: 'not_recorded', decision: 'hold_for_review', evidence_availability: 'full', review_status: 'pending', notification_status: 'sent' },
};
