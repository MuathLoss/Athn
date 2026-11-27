export type UserRole = "seller" | "rights_holder" | "reviewer";

export interface User {
  id: string;
  name: string;
  role: UserRole;
  avatar_url?: string | null;
  organization_name?: string | null;
}

export interface ProtectedWork {
  id: string;
  registration_id: string;
  title: string;
  image_url: string;
  owner_name: string;
  registry_source: string;
  registration_status?: "active" | "unknown";
  registered_at?: string | null;
  authorization_count?: number | null;
  recent_activity_count?: number;
  last_activity_at?: string | null;
}

export interface AuthorizationRecord {
  id: string;
  seller_id: string;
  seller_name?: string | null;
  marketplace?: string | null;
  status: "authorized" | "not_recorded" | "unknown";
  valid_from?: string | null;
  valid_to?: string | null;
}

export type VerificationDecision =
  | "allow"
  | "review"
  | "hold_for_review";

export type AuthorizationStatus =
  | "authorized"
  | "not_recorded"
  | "unknown"
  | "not_applicable";

export interface Verification {
  id: string;
  created_at: string;

  marketplace: {
    id: string;
    name: string;
  };

  seller: {
    id: string;
    display_name?: string | null;
  };

  uploaded_image_url: string;
  matched_image_url?: string | null;

  match_found: boolean;
  similarity_score?: number | null;

  registration_id?: string | null;
  registered_owner?: string | null;

  authorization_status: AuthorizationStatus;
  decision: VerificationDecision | null;

  review_status?:
    | "not_required"
    | "pending"
    | "in_review"
    | "resolved";

  notification_status?:
    | "not_required"
    | "pending"
    | "sent"
    | "failed";

  evidence_availability:
    | "full"
    | "partial"
    | "registry_unavailable";

  system_reason?: string | null;
}

export interface VerificationTraceStep {
  id: string;
  label: string;
  status: "complete" | "active" | "pending" | "failed";
  timestamp?: string | null;
  source:
    | "marketplace"
    | "ai"
    | "registry"
    | "authorization"
    | "reviewer"
    | "system";
  detail?: string | null;
}

export type NotificationType =
  | "unauthorized_usage"
  | "review_started"
  | "review_resolved"
  | "integration_failure";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  created_at: string;
  read: boolean;
  preview_image_url?: string | null;
  verification_id?: string | null;
  work_id?: string | null;
}

export interface ReviewCase {
  id: string;
  verification_id: string;
  created_at: string;

  reason:
    | "borderline_match"
    | "unknown_authorization"
    | "missing_registry_data"
    | "conflicting_registry_data"
    | "other";

  status:
    | "pending"
    | "in_review"
    | "resolved";

  priority?: "normal" | "high";

  verification: Verification;

  assigned_reviewer?: {
    id: string;
    name: string;
  } | null;
}

export interface RightsHolderOverview {
  protected_work_count: number;
  unread_notification_count: number;

  priority_items: Array<{
    type: "verification" | "notification" | "work";
    id: string;
    title: string;
    description?: string;
  }>;

  recent_works: ProtectedWork[];
  recent_verifications: Verification[];

  registry_status:
    | "connected"
    | "unavailable"
    | "syncing";
}

export interface WorkFilters {
  query?: string;
  status?: "active" | "unknown";
}

export type ProtectedWorksResponse = ProtectedWork[];

export interface ProtectedWorkDetail extends ProtectedWork {
  authorizations: AuthorizationRecord[];
  recent_verifications: Verification[];
}

export interface ActivityFilters {
  query?: string;
  decision?: VerificationDecision;
  review_status?: "pending" | "in_review" | "resolved";
  work_id?: string;
}

export interface VerificationDetail extends Verification {
  trace: VerificationTraceStep[];
  related_work?: ProtectedWork | null;
}

export interface ReviewFilters {
  query?: string;
  status?: "pending" | "in_review" | "resolved";
  reason?:
    | "borderline_match"
    | "unknown_authorization"
    | "missing_registry_data"
    | "conflicting_registry_data"
    | "other";
}

export interface ReviewCaseDetail extends ReviewCase {
  verification_detail: VerificationDetail;
  authorization_records: AuthorizationRecord[];
  registry_notes?: string[];
  revision: number;
  available_decisions?: HumanReviewDecision[];
  humanDecision?: HumanReviewDecision;
  humanNote?: string;
  auditId?: string;
}

export type HumanReviewDecision =
  | "confirm_allow"
  | "confirm_hold"
  | "needs_more_information";

export interface ReviewDecisionInput {
  decision: HumanReviewDecision;
  note?: string;
}

export interface ReviewDecisionPreview {
  case_id: string;
  decision: HumanReviewDecision;
  effect_summary: string;
  marketplace_effect?: string | null;
  notification_effect?: string | null;
}

export type MockScenarioId =
  | "allow_no_match"
  | "allow_authorized"
  | "hold_no_authorization"
  | "review_ambiguous_match"
  | "review_unknown_authorization"
  | "registry_unavailable"
  | "backend_error"
  | "review_conflict";

export interface ReviewDecisionResult {
  case_id: string;
  status: ReviewCase['status'];
  audit_id: string;
}
