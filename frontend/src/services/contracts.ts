import type {
  User, RightsHolderOverview, ProtectedWork, ProtectedWorkDetail, WorkFilters,
  ActivityFilters, Verification, VerificationDetail, Notification, ReviewFilters,
  ReviewCase, ReviewCaseDetail, ReviewDecisionInput, ReviewDecisionPreview, ReviewDecisionResult,
} from '../domain';

export interface SignInCredentials {
  identifier: string;
  password: string;
}

export interface AuthService {
  getCurrentUser(): Promise<User | null>;
  signIn(credentials: SignInCredentials): Promise<User>;
  signOut(): Promise<void>;
}

export interface RightsService {
  getOverview(): Promise<RightsHolderOverview>;
  getProtectedWorks(filters?: WorkFilters): Promise<ProtectedWork[]>;
  getWork(workId: string): Promise<ProtectedWorkDetail>;
  getUsageActivity(filters?: ActivityFilters): Promise<Verification[]>;
}

export interface VerificationService {
  getVerification(id: string): Promise<VerificationDetail>;
}

export interface NotificationService {
  getNotifications(): Promise<Notification[]>;
  markAsRead(id: string): Promise<void>;
}

export interface ReviewService {
  getQueue(filters?: ReviewFilters): Promise<ReviewCase[]>;
  getCase(id: string): Promise<ReviewCaseDetail>;
  prepareDecision(
    caseId: string,
    input: ReviewDecisionInput
  ): Promise<ReviewDecisionPreview>;
  submitDecision(
    caseId: string,
    input: ReviewDecisionInput,
    expectedRevision: number
  ): Promise<ReviewDecisionResult>;
}

export interface Services {
  auth: AuthService;
  rights: RightsService;
  verification: VerificationService;
  notification: NotificationService;
  review: ReviewService;
}

export class ServiceError extends Error {
  constructor(public readonly kind: 'denied' | 'expired' | 'missing' | 'unavailable' | 'registry_unavailable' | 'conflict' | 'invalid' | 'invalid_credentials') {
    super(kind);
  }
}
