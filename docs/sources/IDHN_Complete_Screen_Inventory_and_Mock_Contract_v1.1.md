# إذن | IDHN
## Complete Screen Inventory, Content Specification, States & Mock Data Contract
**Version:** 1.1  
**Status:** Approved project source candidate — supersedes v1.0 after approval  
**Purpose:** المرجع الكامل لكل شاشة في Frontend «إذن» قبل التصميم التفصيلي والبرمجة. يجمع Screen Inventory + Screen States + Content Specification + CTA + Mock Data + Frontend/Backend handoff expectations في ملف واحد.

---

# 0. قاعدة هذا الملف

هذا الملف مبني على المصادر المعتمدة للمشروع:

- `IDHN_Production_Product_Architecture_and_User_Flow_v1.0`
- `IDHN_Sitemap_and_Full_Product_Flow_v1.0`
- `LegalTech_Creative_UI_Direction_and_Design_Rules_v1`
- Brand Source Package المعتمد

ويجب اعتباره المرجع المباشر لتصميم الشاشات وبناء الـFrontend.

**قاعدة ملزمة:**
- Frontend يُبنى أولًا كمنتج Production-oriented.
- أثناء التطوير تستخدم Mock Data / Mock Services.
- لاحقًا يتم استبدال الـMock Services بالـBackend الحقيقي دون إعادة تصميم الواجهات.
- لا يتم اختراع وظيفة قانونية أو تكامل خارجي غير مثبت في المصادر.
- Seller ID لا يُكتب يدويًا داخل منتج «إذن» الحقيقي.
- `similarity_score` مؤشر تشابه بصري وليس احتمال سرقة أو حكمًا قانونيًا.

---

# 1. الأدوار الرئيسية

## 1.1 Rights Holder
مستخدم موثق يستطيع:
- الدخول إلى بوابة صاحب الحق.
- استعراض المصنفات المرتبطة به.
- مراجعة بيانات التسجيل.
- مراجعة بيانات الإذن المتاحة.
- متابعة محاولات الاستخدام.
- الاطلاع على تفاصيل التحقق.
- استقبال التنبيهات.

## 1.2 Reviewer
مستخدم مخوّل يستطيع:
- الدخول إلى Review Console.
- مشاهدة الحالات التي تحتاج تدخلًا بشريًا.
- مراجعة الأدلة.
- اتخاذ قرار ضمن الصلاحيات التي سيتم اعتمادها لاحقًا.
- تأكيد القرار وتسجيله.

## 1.3 Marketplace / External Service
ليس مستخدم Portal.
يتعامل مع «إذن» عبر API / service authentication.

---

# 2. Shared Frontend Domain Models

هذه الـmodels تمثل شكل البيانات المقترح للـFrontend Mock Layer.  
هي **Frontend contracts** وليست Backend implementation نهائية.

---

## 2.1 User

```ts
type UserRole = "rights_holder" | "reviewer";

interface User {
  id: string;
  name: string;
  role: UserRole;
  avatar_url?: string | null;
  organization_name?: string | null;
}
```

---

## 2.2 ProtectedWork

```ts
interface ProtectedWork {
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
}
```

---

## 2.3 AuthorizationRecord

```ts
interface AuthorizationRecord {
  id: string;
  seller_id: string;
  seller_name?: string | null;
  marketplace?: string | null;
  status: "authorized" | "not_recorded" | "unknown";
  valid_from?: string | null;
  valid_to?: string | null;
}
```

---

## 2.4 VerificationDecision

```ts
type VerificationDecision =
  | "allow"
  | "review"
  | "hold_for_review";
```

---

## 2.5 AuthorizationStatus

```ts
type AuthorizationStatus =
  | "authorized"
  | "not_recorded"
  | "unknown"
  | "not_applicable";
```

---

## 2.6 Verification

```ts
interface Verification {
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
  decision: VerificationDecision;

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
```

---

## 2.7 VerificationTraceStep

```ts
interface VerificationTraceStep {
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
```

---

## 2.8 Notification

```ts
type NotificationType =
  | "unauthorized_usage"
  | "review_started"
  | "review_resolved"
  | "integration_failure";

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  created_at: string;
  read: boolean;
  verification_id?: string | null;
  work_id?: string | null;
}
```

---

## 2.9 ReviewCase

```ts
interface ReviewCase {
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
```

---

# 3. Shared Frontend Service Layer

الـUI لا يتعامل مباشرة مع hardcoded arrays.

يجب إنشاء Service Layer من البداية.

```text
authService
rightsService
verificationService
notificationService
reviewService
```

أثناء تطوير الـFrontend:
```text
UI
↓
Service Interface
↓
Mock Adapter
```

لاحقًا:
```text
UI
↓
نفس Service Interface
↓
HTTP API Adapter
↓
Backend
```

---

## 3.1 authService

```ts
interface AuthService {
  getCurrentUser(): Promise<User | null>;
  signIn(): Promise<User>;
  signOut(): Promise<void>;
}
```

> طريقة Authentication الحقيقية غير محسومة في المصادر. لا يتم تثبيت Provider داخل الـUI Contract الآن.

---

## 3.2 rightsService

```ts
interface RightsService {
  getOverview(): Promise<RightsHolderOverview>;
  getProtectedWorks(filters?: WorkFilters): Promise<ProtectedWork[]>;
  getWork(workId: string): Promise<ProtectedWorkDetail>;
  getUsageActivity(filters?: ActivityFilters): Promise<Verification[]>;
}
```

---

## 3.3 verificationService

```ts
interface VerificationService {
  getVerification(id: string): Promise<VerificationDetail>;
}
```

---

## 3.4 notificationService

```ts
interface NotificationService {
  getNotifications(): Promise<Notification[]>;
  markAsRead(id: string): Promise<void>;
}
```

---

## 3.5 reviewService

```ts
interface ReviewService {
  getQueue(filters?: ReviewFilters): Promise<ReviewCase[]>;
  getCase(id: string): Promise<ReviewCaseDetail>;
  prepareDecision(
    caseId: string,
    input: ReviewDecisionInput
  ): Promise<ReviewDecisionPreview>;
  submitDecision(
    caseId: string,
    input: ReviewDecisionInput
  ): Promise<ReviewDecisionResult>;
}
```

> أنواع القرار النهائية للمراجع غير محسومة بالكامل في المصادر، لذلك لا يتم توسيعها قانونيًا قبل الاعتماد.

---

# 4. Navigation Model

## Public
```text
Public Entry
↓
Login
↓
Role-aware redirect
```

## Rights Holder
```text
Overview
├── Protected Works
│   └── Work Details
├── Usage Activity
│   └── Verification Details
└── Notifications
    └── Verification Details / Work Details
```

## Reviewer
```text
Review Queue
↓
Review Case
↓
Review Decision
↓
Decision Confirmation
↓
Review Queue / Updated Case
```

---

# 5. Screen 01 — Public Entry

## User
غير مسجل.

## Goal
فهم سريع جدًا لما تفعله «إذن» ثم الدخول.

## Primary CTA
**تسجيل الدخول**

## Secondary Actions
- معرفة مختصرة عن آلية العمل، إن احتاج التصميم ذلك.
- لا نضيف روابط تسويقية كثيرة.

## Required Elements
1. Logo / brand mark
2. Product name
3. Short value proposition
4. One concise flow visual:
   ```text
   Image → Verification → Permission → Decision
   ```
5. Primary Login CTA
6. Trust / system note مختصر عند الحاجة

## Must Not Include
- Dashboard preview مكرر.
- 8 أقسام تسويقية.
- Pricing.
- Testimonials.
- Fake metrics.

## Mock Data
لا تحتاج domain data.

```ts
const publicEntryMock = {
  service_status: "available"
};
```

## States

### Default
- الهوية ظاهرة.
- CTA متاح.

### Loading
يستخدم فقط إن كانت الصفحة تنتظر bootstrap/auth check.

### Service Unavailable
يظهر:
- أن الخدمة غير متاحة حاليًا.
- إمكانية إعادة المحاولة.
- لا يعرض نتيجة قانونية أو حالة وهمية.

## Navigation
`Login CTA → /login`

## Future Backend Dependency
- Auth bootstrap
- Service health optional

---

# 6. Screen 02 — Login / Identity Verification

## Users
Rights Holder / Reviewer

## Goal
توثيق المستخدم ثم توجيهه حسب الدور.

## Primary CTA
**متابعة تسجيل الدخول**

## Secondary Actions
- رجوع إلى Public Entry

## Required Elements
1. Logo
2. Login context
3. Authentication container / provider placeholder
4. Loading state
5. Auth error message area

## Important
مزود التحقق غير محسوم.  
واجهة الفرونت يجب أن تسمح بتبديل provider لاحقًا.

## Mock Data

```ts
const mockRightsHolderUser: User = {
  id: "usr_rh_001",
  name: "مالك حق تجريبي",
  role: "rights_holder"
};

const mockReviewerUser: User = {
  id: "usr_rev_001",
  name: "مراجع تجريبي",
  role: "reviewer"
};
```

## States

### Empty / Ready
زر الدخول ظاهر.

### Loading
تعطيل CTA + processing indicator.

### Invalid / Failed
رسالة واضحة بدون كشف تفاصيل أمنية.

### Success
Redirect based on role.

### Authentication Expired
رسالة:
- انتهت الجلسة.
- تسجيل الدخول مجددًا.

## Navigation
```text
rights_holder → /portal
reviewer      → /review
```

## Future Backend Dependency
`authService`

---

# 7. Screen 03 — Rights Holder Overview

## User
Rights Holder

## Goal
الإجابة فورًا عن:
**ما الذي يحتاج انتباهي الآن؟**

## Primary CTA
**عرض المصنفات**

## Secondary Actions
- فتح نشاط استخدام مهم.
- فتح تنبيه جديد.
- فتح مصنف محدد.

## Required Elements
1. User greeting / context
2. Priority activity section
3. Recent protected works
4. Recent verification activity
5. Unread notifications
6. Registry sync / availability status
7. Contextual quick access

## Important Layout Rule
لا تستخدم:
```text
4 KPI Cards
+ Chart
+ Table
```

يمكن عرض أرقام إن كانت مفيدة، لكن كـeditorial annotations وليس cards إلزامية.

## Data Contract

```ts
interface RightsHolderOverview {
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
```

## Mock Data

```ts
const overviewMock: RightsHolderOverview = {
  protected_work_count: 12,
  unread_notification_count: 2,
  priority_items: [
    {
      type: "verification",
      id: "ver_1005",
      title: "حالة استخدام تحتاج مراجعة",
      description: "مرتبطة بالمصنف DEMO-001"
    }
  ],
  recent_works: [],
  recent_verifications: [],
  registry_status: "connected"
};
```

## States

### Loading
Skeletons مرتبطة بتكوين الصفحة.

### Empty
إذا لم توجد مصنفات:
- شرح واضح.
- لا نعرض Dashboard فارغ.
- نوضح أن المصنفات ستظهر عند توفر الربط/المزامنة.

### Normal
يعرض الأولويات والأنشطة.

### Registry Unavailable
- بقية الواجهة تعمل إن كانت البيانات المحلية متاحة.
- يظهر Status Banner دقيق.
- لا نمثل البيانات وكأنها محدثة.

### Error
رسالة قابلة لإعادة المحاولة.

## Navigation
- Protected Works
- Verification Details
- Notifications

## Future Backend Dependency
`rightsService.getOverview()`

---

# 8. Screen 04 — Protected Works

## User
Rights Holder

## Goal
العثور على مصنف مسجل وفتح تفاصيله.

## Primary CTA
**فتح المصنف**

> CTA سياقي على العنصر المختار، وليس زرًا عملاقًا ثابتًا.

## Secondary Actions
- Search
- Filter
- Clear filters

## Required Elements
1. Page title
2. Search input
3. Filters
4. Work results
5. Registration/reference ID
6. Image preview
7. Registry source
8. Relevant status / activity annotation

## Suggested Filters
فقط ما تدعمه البيانات:
- Registration ID
- Text search
- Status if provided
- Recent activity if useful

## Data Contract

```ts
interface WorkFilters {
  query?: string;
  status?: "active" | "unknown";
}

type ProtectedWorksResponse = ProtectedWork[];
```

## Mock Data

```ts
const protectedWorksMock: ProtectedWork[] = [
  {
    id: "work_001",
    registration_id: "DEMO-001",
    title: "صورة المنتج A",
    image_url: "/mock/works/work-001.jpg",
    owner_name: "مالك حق تجريبي",
    registry_source: "Mock Rights Registry",
    registration_status: "active",
    registered_at: "2026-11-01T10:00:00+03:00",
    authorization_count: 2,
    recent_activity_count: 4
  }
];
```

## States

### Loading
نتائج skeleton.

### Empty
لا توجد مصنفات مرتبطة.

### Loaded
قائمة / grid مدروسة حسب كثافة الصور.

### Filtered Empty
"لا توجد نتائج مطابقة للفلاتر الحالية."

### Sync Unavailable
تنبيه أن البيانات قد لا تكون محدثة.

### Error
Retry.

### Offline
إن تم دعم caching:
- عرض cached data بوضوح.
- إظهار آخر تحديث إن توفر.

## Navigation
`work → /portal/works/:workId`

## Future Backend Dependency
`rightsService.getProtectedWorks(filters)`

---

# 9. Screen 05 — Work Details

## User
Rights Holder

## Goal
فهم سجل المصنف، مصدره، الإذن المرتبط به، ونشاط الاستخدام.

## Primary CTA
**عرض نشاط الاستخدام**

## Secondary Actions
- فتح Verification محدد.
- العودة للمصنفات.

## Required Elements
1. Main image
2. Title
3. Registration ID
4. Registry source
5. Owner information
6. Registration date if available
7. Authorization section
8. Related usage activity
9. Data source label
10. Registry availability status

## Data Contract

```ts
interface ProtectedWorkDetail extends ProtectedWork {
  authorizations: AuthorizationRecord[];
  recent_verifications: Verification[];
}
```

## Mock Data

```ts
const workDetailMock: ProtectedWorkDetail = {
  id: "work_001",
  registration_id: "DEMO-001",
  title: "صورة المنتج A",
  image_url: "/mock/works/work-001.jpg",
  owner_name: "مالك حق تجريبي",
  registry_source: "Mock Rights Registry",
  registration_status: "active",
  registered_at: "2026-11-01T10:00:00+03:00",
  authorization_count: 2,
  recent_activity_count: 4,
  authorizations: [
    {
      id: "auth_001",
      seller_id: "seller_a",
      seller_name: "Seller A",
      marketplace: "Marketplace Demo",
      status: "authorized"
    }
  ],
  recent_verifications: []
};
```

## States

### Loading
Image + details placeholders.

### Loaded
البيانات كاملة.

### Registry Unavailable
- أظهر آخر بيانات معروفة فقط إذا النظام يدعمها.
- Label واضح لمصدر/تاريخ البيانات.

### Permission Denied
إذا جزء من البيانات لا تسمح الصلاحية بعرضه.

### Error
Retry.

## Must Not Do
- تعديل الملكية كوظيفة مؤكدة.
- ادعاء أن «إذن» هو مصدر الملكية الأصلي.

## Navigation
- Usage Activity
- Verification Details
- Protected Works

## Future Backend Dependency
`rightsService.getWork(workId)`

---

# 10. Screen 06 — Usage Activity

## User
Rights Holder

## Goal
متابعة محاولات استخدام المصنفات عبر الزمن.

## Primary CTA
**فتح تفاصيل التحقق**

## Secondary Actions
- Search
- Filter
- Clear filters

## Required Elements
1. Activity list / dense data view
2. Marketplace
3. Seller
4. Work
5. Timestamp
6. Decision
7. Review status
8. Notification indicator when relevant

## Data Contract

```ts
interface ActivityFilters {
  query?: string;
  decision?: VerificationDecision;
  review_status?: "pending" | "in_review" | "resolved";
  work_id?: string;
}
```

## Mock Data

```ts
const usageActivityMock: Verification[] = [
  {
    id: "ver_1005",
    created_at: "2026-11-25T14:32:00+03:00",
    marketplace: {
      id: "market_01",
      name: "Marketplace Demo"
    },
    seller: {
      id: "seller_b",
      display_name: "Seller B"
    },
    uploaded_image_url: "/mock/uploads/upload-1005.jpg",
    matched_image_url: "/mock/works/work-001.jpg",
    match_found: true,
    similarity_score: 0.967,
    registration_id: "DEMO-001",
    registered_owner: "مالك حق تجريبي",
    authorization_status: "not_recorded",
    decision: "hold_for_review",
    review_status: "pending",
    notification_status: "sent",
    evidence_availability: "full",
    system_reason: "Strong visual match; no recorded authorization."
  }
];
```

## States
- Loading
- Empty
- Loaded
- Filtered Empty
- Error

## Navigation
`verification → /portal/verifications/:id`

## Future Backend Dependency
`rightsService.getUsageActivity(filters)`

---

# 11. Screen 07 — Verification Details

## User
Rights Holder

## Goal
فهم:
**ماذا حدث؟ لماذا؟ وما الأدلة؟**

## Primary CTA
**عرض الأدلة الكاملة**
إذا كانت الأدلة في نفس الشاشة:
**فتح التفاصيل التقنية** يكون secondary وليس primary.

## Secondary Actions
- Open related work
- Back to activity
- Expand technical evidence
- Open review status if applicable

## Required Elements

### A. Verification Header
- Verification ID
- Timestamp
- Marketplace
- Seller

### B. Image Comparison
- Uploaded/used image
- Registered image when available

### C. Visual Evidence
- Match found / no match
- Similarity score
- clear label:
  **درجة تشابه بصري**
- Explanation note

### D. Registry Evidence
- Registration ID
- Registered owner
- Registry source
- Evidence availability

### E. Authorization
- Authorized
- Not recorded
- Unknown
- Not applicable

### F. Decision
- ALLOW
- REVIEW
- HOLD_FOR_REVIEW

### G. Verification Trace
- Request received
- Visual verification
- Registry lookup
- Authorization check
- Decision
- Review step if applicable

### H. Review / Notification Context
- review_status
- notification_status

## Data Contract

```ts
interface VerificationDetail extends Verification {
  trace: VerificationTraceStep[];
  related_work?: ProtectedWork | null;
}
```

## Mock Data

```ts
const verificationDetailMock: VerificationDetail = {
  id: "ver_1005",
  created_at: "2026-11-25T14:32:00+03:00",

  marketplace: {
    id: "market_01",
    name: "Marketplace Demo"
  },

  seller: {
    id: "seller_b",
    display_name: "Seller B"
  },

  uploaded_image_url: "/mock/uploads/upload-1005.jpg",
  matched_image_url: "/mock/works/work-001.jpg",

  match_found: true,
  similarity_score: 0.967,

  registration_id: "DEMO-001",
  registered_owner: "مالك حق تجريبي",

  authorization_status: "not_recorded",
  decision: "hold_for_review",

  review_status: "pending",
  notification_status: "sent",

  evidence_availability: "full",

  system_reason:
    "Strong visual match; no recorded authorization.",

  trace: [
    {
      id: "trace_1",
      label: "استلام طلب التحقق",
      status: "complete",
      source: "marketplace"
    },
    {
      id: "trace_2",
      label: "التحقق البصري",
      status: "complete",
      source: "ai"
    },
    {
      id: "trace_3",
      label: "التحقق من السجل",
      status: "complete",
      source: "registry"
    },
    {
      id: "trace_4",
      label: "التحقق من الإذن",
      status: "complete",
      source: "authorization"
    },
    {
      id: "trace_5",
      label: "تعليق للنظر",
      status: "complete",
      source: "system"
    }
  ],

  related_work: null
};
```

## States

### Loading
Comparison workspace skeleton.

### Allow — no match
- No strong registered match.
- Decision = ALLOW.
- لا تعرض matched image وهمية.

### Allow — authorized
- Strong match.
- authorization = authorized.
- Decision = ALLOW.

### Review
- Explain uncertainty.
- لا تستخدم red danger language تلقائيًا.

### Hold For Review
- Strong match.
- no recorded authorization.
- publication held for review.
- لا تكتب "سرقة مؤكدة" أو "تعدٍ مثبت".

### Evidence Partial
- يظهر أي evidence متاح.
- Missing source واضح.

### Registry Unavailable
- لا تصدر واجهة توحي أن registry lookup اكتمل.
- Status واضح.

### Error
Retry / return.

### Permission Denied
No sensitive evidence.

## Navigation
- Related Work
- Usage Activity
- Notification context

## Future Backend Dependency
`verificationService.getVerification(id)`

---

# 12. Screen 08 — Notifications

## User
Rights Holder

## Goal
معرفة الأحداث المهمة والتصرف عليها.

## Primary CTA
**فتح الحدث**

## Secondary Actions
- Mark as read
- Filter unread/all if needed

## Required Elements
1. Notification type
2. Title
3. Message
4. Timestamp
5. Read state
6. Related verification/work link

## Mock Data

```ts
const notificationsMock: Notification[] = [
  {
    id: "notif_001",
    type: "unauthorized_usage",
    title: "محاولة استخدام تحتاج مراجعة",
    message: "تم رصد حالة مرتبطة بالمصنف DEMO-001.",
    created_at: "2026-11-25T14:33:00+03:00",
    read: false,
    verification_id: "ver_1005",
    work_id: "work_001"
  }
];
```

## States
- Loading
- Empty
- Loaded
- Error

## Navigation
Notification decides:
```text
verification_id → Verification Details
work_id only    → Work Details
```

## Future Backend Dependency
`notificationService`

---

# 13. Screen 09 — Review Queue

## User
Reviewer

## Goal
العثور بسرعة على الحالة التي تحتاج تدخلًا.

## Primary CTA
**فتح الحالة**

## Secondary Actions
- Search
- Filter
- Sort if later supported

## Required Elements
1. Case ID
2. Verification ID
3. Reason
4. Status
5. Created at
6. Marketplace
7. Work / registration reference if available
8. Priority if backend supports it

## Data Contract

```ts
interface ReviewFilters {
  query?: string;
  status?: "pending" | "in_review" | "resolved";
  reason?:
    | "borderline_match"
    | "unknown_authorization"
    | "missing_registry_data"
    | "conflicting_registry_data"
    | "other";
}
```

## Mock Data

```ts
const reviewQueueMock: ReviewCase[] = [
  {
    id: "case_001",
    verification_id: "ver_1005",
    created_at: "2026-11-25T14:32:30+03:00",
    reason: "unknown_authorization",
    status: "pending",
    priority: "high",
    verification: usageActivityMock[0],
    assigned_reviewer: null
  }
];
```

## States
- Loading
- Empty
- Results
- Filtered Empty
- Error
- Permission Denied

## Navigation
`case → /review/cases/:caseId`

## Future Backend Dependency
`reviewService.getQueue(filters)`

---

# 14. Screen 10 — Review Case / Evidence Workspace

## User
Reviewer

## Goal
اتخاذ قرار بشري مبني على الأدلة، لا على Summary فقط.

## Primary CTA
**متابعة لاتخاذ القرار**

## Secondary Actions
- Expand technical detail
- Open registry evidence
- Open related verification
- Back to queue

## Required Elements

### A. Case Context
- Case ID
- Reason
- Status
- Created at

### B. Image Split View
- Uploaded image
- Registered image

### C. Visual Evidence Layer
- Similarity score
- Match status
- AI/source label

### D. Registry Evidence Layer
- Registration ID
- Registered owner
- Registry availability/source
- Missing/conflicting data state

### E. Authorization Layer
- Authorization status
- authorization records when available

### F. Verification Trace
- كل steps

### G. Source vs AI vs System Separation
يجب تمييز بصري واضح بين:
```text
Source Data
AI Inference
System Recommendation
Human Decision
```

### H. Technical Inspector
عند الحاجة فقط:
- IDs
- timestamps
- raw status values
- source labels

## Data Contract

```ts
interface ReviewCaseDetail extends ReviewCase {
  verification_detail: VerificationDetail;
  authorization_records: AuthorizationRecord[];
  registry_notes?: string[];
}
```

## Mock Data

```ts
const reviewCaseDetailMock: ReviewCaseDetail = {
  ...reviewQueueMock[0],
  verification_detail: verificationDetailMock,
  authorization_records: [],
  registry_notes: [
    "No active authorization record found for seller_b."
  ]
};
```

## States

### Loading
Preserve workspace geometry.

### Full Evidence
كل evidence متوفر.

### Partial Evidence
Missing source clearly marked.

### Missing Registry Data
Reviewer sees:
- registry data unavailable
- system cannot confirm

### Conflicting Evidence
Evidence sources shown separately.
لا يقوم UI بحسم التعارض تلقائيًا.

### Error
Retry.

### Permission Denied
No case evidence.

## Future Backend Dependency
`reviewService.getCase(caseId)`

---

# 15. Screen 11 — Review Decision

## User
Reviewer

## Goal
إعداد قرار للمراجعة قبل تنفيذه.

## Primary CTA
**مراجعة القرار قبل التأكيد**

## Secondary Actions
- Back to evidence
- Cancel

## Required Elements
1. Case summary
2. Current system decision
3. Human decision control
4. Reason / note field if required by future policy
5. Consequence preview placeholder
6. Validation messages

## Important Constraint
أنواع Human Decision النهائية لم تُحسم قانونيًا في المصادر.

لذلك نستخدم في الـFrontend Mock Contract صيغة قابلة للتغيير:

```ts
type HumanReviewDecision =
  | "confirm_allow"
  | "confirm_hold"
  | "needs_more_information";
```

**هذه قيم frontend provisional فقط**  
ولا تصبح policy معتمدة قبل اعتمادها لاحقًا.

## Data Contract

```ts
interface ReviewDecisionInput {
  decision: HumanReviewDecision;
  note?: string;
}
```

## Mock Data

```ts
const reviewDecisionMock: ReviewDecisionInput = {
  decision: "needs_more_information",
  note: ""
};
```

## States
- Ready
- Validation Required
- Saving draft / preparing preview
- Error
- Permission Denied

## Navigation
`Continue → Decision Confirmation`

## Future Backend Dependency
`reviewService.prepareDecision(caseId, input)`

---

# 16. Screen 12 — Decision Confirmation

## User
Reviewer

## Goal
رؤية القرار وأثره ثم تنفيذ القرار عن قصد.

## Primary CTA
**تأكيد القرار**

## Secondary Actions
- Back and edit
- Cancel

## Required Elements
1. Case ID
2. Proposed human decision
3. Decision effect
4. Related marketplace impact
5. Notification impact if any
6. Audit warning / confirmation context

## Data Contract

```ts
interface ReviewDecisionPreview {
  case_id: string;
  decision: HumanReviewDecision;
  effect_summary: string;
  marketplace_effect?: string | null;
  notification_effect?: string | null;
}
```

## Mock Data

```ts
const decisionPreviewMock: ReviewDecisionPreview = {
  case_id: "case_001",
  decision: "needs_more_information",
  effect_summary: "ستبقى الحالة قيد المراجعة.",
  marketplace_effect: "يبقى النشر معلّقًا لحين اكتمال المراجعة.",
  notification_effect: null
};
```

## States

### Confirmation Ready
CTA enabled.

### Submitting
Prevent double-submit.

### Success
- Result recorded.
- Audit entry acknowledged.
- Navigate to updated case or queue.

### Error
No false success.

### Conflict
Case changed after it was opened:
- show updated status
- prevent stale decision submission

### Permission Denied
Cannot submit.

## Future Backend Dependency
`reviewService.submitDecision(caseId, input)`

---

# 17. Shared State Behavior Specification

## Loading
- لا تستخدم fake progress percentage إذا backend لا يوفر progress.
- استخدم skeleton / state transition مرتبط بشكل الشاشة.

## Empty
- اشرح لماذا الصفحة فارغة.
- أعطِ action فقط إذا هناك action حقيقي.

## Error
يتضمن:
- ماذا فشل؟
- هل يمكن retry؟
- لا تحول الخطأ إلى ALLOW أو REVIEW.

## Offline
- يظهر فقط إذا frontend يدعم offline/cache.
- البيانات القديمة يجب أن توسم بوضوح.

## Permission Denied
- لا تكشف sensitive content.
- Explain insufficient access.

## Pending Review
- لا تظهر كـerror.
- تظهر كحالة workflow مستقلة.

## Conflict
- مهم خاصة في reviewer flow.
- يمنع overwrite لقرار أحدث.

## Registry Unavailable
- لا تخلطها مع "no match".
- "لم نتمكن من الوصول للسجل" ≠ "لا يوجد مصنف مطابق".

## Partial Evidence
- لا تخفي النقص.
- Label missing source.

---

# 18. Frontend Mock Scenarios Required

يجب أن يكون المشروع قادرًا على تشغيل هذه السيناريوهات من الـMock Layer:

## Scenario A — No Match
```text
match_found = false
authorization = not_applicable
decision = allow
```

## Scenario B — Match + Authorized
```text
match_found = true
authorization = authorized
decision = allow
```

## Scenario C — Match + No Recorded Authorization
```text
match_found = true
authorization = not_recorded
decision = hold_for_review
review_status = pending
notification_status = sent
```

## Scenario D — Ambiguous Match
```text
match_found = false / borderline candidate exists
decision = review
```

## Scenario E — Unknown Authorization
```text
match_found = true
authorization = unknown
decision = review
```

## Scenario F — Registry Unavailable
```text
evidence_availability = registry_unavailable
decision must not be fabricated
```

## Scenario G — Backend Error
UI displays error.

## Scenario H — Review Conflict
Case state changes before reviewer confirms.

---

# 19. Suggested Mock Scenario IDs

```ts
type MockScenarioId =
  | "allow_no_match"
  | "allow_authorized"
  | "hold_no_authorization"
  | "review_ambiguous_match"
  | "review_unknown_authorization"
  | "registry_unavailable"
  | "backend_error"
  | "review_conflict";
```

يسمح هذا أثناء التطوير بتغيير حالة النظام بدون إعادة كتابة الـUI.

---

# 20. Route Map

مقترح Frontend routing قابل للتعديل تقنيًا:

```text
/
├── /login
│
├── /portal
│   ├── /works
│   │   └── /works/:workId
│   │
│   ├── /activity
│   │   └── /verifications/:verificationId
│   │
│   └── /notifications
│
└── /review
    └── /cases/:caseId
        ├── /decision
        └── /confirm
```

يمكن دمج decision/confirm في نفس route باستخدام UI state، لكن يجب الحفاظ على نفس workflow semantics.

---

# 21. Component Families Needed Later

هذا ليس Component Design System كامل، لكنه inventory وظيفي.

## Shared
- App shell
- Header / context navigation
- Status label
- Source label
- Empty state
- Error state
- Loading state
- Confirmation surface
- Search/filter controls

## Rights Holder
- Work item
- Activity item/row
- Notification item
- Registry source block

## Verification
- Image comparison
- Similarity evidence
- Registry evidence
- Authorization status
- Verification trace
- Decision state
- Technical inspector

## Reviewer
- Review queue item
- Evidence workspace
- Decision control
- Decision consequence preview
- Conflict state

**قاعدة:**  
هذه families لا تعني تحويل كل شيء إلى Cards.

---

# 22. Data Source Mapping

| Frontend Data | Mock Now | Real Source Later |
|---|---|---|
| Current user | Mock user | Authentication backend |
| Role | Mock user | Authorization backend |
| Protected works | Mock registry | Rights registry integration / backend |
| Registration data | Mock registry | Authoritative registry |
| Authorization records | Mock registry | Backend / registry integration |
| Usage activity | Mock dataset | Verification database |
| Similarity score | Mock result | AI verification backend |
| Match status | Mock result | AI/backend |
| Verification decision | Mock logic/result | Backend decision engine |
| Notifications | Mock list | Notification service |
| Review queue | Mock cases | Review backend |
| Audit state | Mock confirmation | Audit logging backend |

---

# 23. What Frontend Must Not Hardcode

ممنوع وضع القواعد التالية داخل UI components:

- threshold تحديد match.
- authorization decision logic.
- legal decision logic.
- reviewer permission policy.
- notification delivery truth.
- registry truth.
- seller identity trust.

الـFrontend **يعرض** النتيجة القادمة من الـService Layer.

مثال سيئ:
```ts
if (similarity > 0.90) {
  decision = "hold_for_review";
}
```

هذا ممنوع في الـUI.

الصحيح:
```ts
const result = await verificationService.getVerification(id);
render(result.decision);
```

---

# 24. Frontend Handoff Requirements to Backend Teammate

عند اكتمال الفرونت، يجب تسليم:

1. Route map
2. Service interfaces
3. Type definitions
4. Mock fixtures
5. Scenario list
6. Expected API fields
7. Loading/error states
8. Nullable fields
9. Decision enums
10. Image URL handling rules
11. Authentication assumptions
12. Environment configuration
13. Backend adapter location
14. No hardcoded thresholds confirmation

---

# 25. Completion Criteria for This Stage

يعتبر Screen Inventory مكتملًا فقط إذا:

- [x] كل الشاشات محددة.
- [x] كل شاشة لها User.
- [x] كل شاشة لها Goal.
- [x] Primary CTA محدد.
- [x] Secondary Actions محددة.
- [x] عناصر الشاشة محددة.
- [x] البيانات المطلوبة محددة.
- [x] Mock data contract موجود.
- [x] States موصوفة وظيفيًا.
- [x] Navigation محدد.
- [x] Future service/backend dependency محدد.
- [x] Shared domain models موجودة.
- [x] Service layer contract موجود.
- [x] Mock scenarios محددة.
- [x] Route map موجود.
- [x] Data source mapping موجود.
- [x] Frontend hardcoding restrictions محددة.
- [x] Backend handoff requirements محددة.

---

# 26. Final Core Screen Inventory

## Public
01. Public Entry  
02. Login / Identity Verification  

## Rights Holder
03. Rights Holder Overview  
04. Protected Works  
05. Work Details  
06. Usage Activity  
07. Verification Details  
08. Notifications  

## Reviewer
09. Review Queue  
10. Review Case / Evidence Workspace  
11. Review Decision  
12. Decision Confirmation  

**Total Core Screens: 12**

---

# 27. Next Stage

بعد اعتماد هذا الملف فقط، ننتقل إلى:

## UI Composition & Screen Design Specification

وفيها نحدد لكل شاشة:
- Composition
- hierarchy
- layout behavior
- responsive behavior
- exact visual components
- motion behavior
- design-system usage

ثم بعدها يبدأ تنفيذ الـFrontend في Codex.
