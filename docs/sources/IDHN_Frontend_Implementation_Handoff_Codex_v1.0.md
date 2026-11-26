# إذن | IDHN
## Frontend Implementation Handoff — Codex
**Version:** 1.0  
**Status:** Final implementation handoff candidate  
**Purpose:** المرجع التنفيذي المباشر لبناء Frontend «إذن» في Codex اعتمادًا على مصادر المشروع المعتمدة، دون إعادة اختراع المنتج أو التصميم أو منطق القرار.

---

# 0. مهمتك في Codex

أنت تبني **Frontend Production-oriented** لمنصة «إذن | IDHN».

المنتج ليس Demo من صفحة واحدة، وليس Dashboard SaaS عامًا.

ابنِ الواجهة كاملة اعتمادًا على مصادر المشروع المعتمدة، باستخدام Mock Data وMock Services في البداية، بحيث يمكن استبدال الـMock Adapter لاحقًا بـHTTP/API Adapter دون إعادة تصميم الشاشات أو تغيير عقود الـUI.

---

# 1. اقرأ هذه الملفات أولًا وبالترتيب

هذه الملفات تشكل **Frontend Source of Truth**:

```text
01 LegalTech_Creative_UI_Direction_and_Design_Rules_v1
02 IDHN_Brand_Source_Package_v1.0
03 IDHN_Production_Product_Architecture_and_User_Flow_v1.0
04 IDHN_Sitemap_and_Full_Product_Flow_v1.0
05 IDHN_Complete_Screen_Inventory_and_Mock_Contract_v1.1
06 IDHN_UI_Composition_and_Screen_Design_Spec_v1.0
07 IDHN_High_Fidelity_UI_Technical_Direction_v1.0
08 IDHN_High_Fidelity_Core_Screen_Spec_v1.0
09 IDHN_High_Fidelity_Remaining_Screen_Spec_v1.0
10 IDHN_High_Fidelity_Visual_QA_and_Design_Closure_v1.0
```

لا تبدأ البناء قبل قراءة هذه المصادر.

إذا تعارض اقتراح تنفيذي مع المصادر، التزم بالمصادر.

---

# 2. هدف المنتج

«إذن» طبقة تحقق مسبق لحقوق الصور في التجارة الإلكترونية.

المسار الحقيقي:

```text
Marketplace
→ authenticated seller
→ image upload
→ pre-publish verification request
→ IDHN
→ visual verification
→ registry lookup
→ authorization check
→ ALLOW / REVIEW / HOLD_FOR_REVIEW
→ audit / review / notification when relevant
```

البائع لا يكتب `Seller ID` يدويًا داخل المنتج النهائي.

---

# 3. المستخدمون

## Rights Holder

يستخدم:
```text
Rights Holder Portal
```

لـ:
- Protected Works
- Work Details
- Usage Activity
- Verification Details
- Notifications

## Reviewer

يستخدم:
```text
Review Console
```

لـ:
- Review Queue
- Review Case
- Review Decision
- Decision Confirmation

## Marketplace

ليس Portal user.

يتكامل لاحقًا عبر service/API authentication.

---

# 4. الشاشات المطلوبة — 12 شاشة

## Public

```text
01 Public Entry
02 Login / Identity Verification
```

## Rights Holder

```text
03 Rights Holder Overview
04 Protected Works
05 Work Details
06 Usage Activity
07 Verification Details
08 Notifications
```

## Reviewer

```text
09 Review Queue
10 Review Case / Evidence Workspace
11 Review Decision
12 Decision Confirmation
```

ابنِ جميع الشاشات.

---

# 5. Route Map

استخدم semantics التالية:

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

يمكن دمج `decision` و`confirm` في route واحد تقنيًا إذا كان ذلك أنسب للـstack، لكن يجب الحفاظ على:

```text
Review Decision
→ Decision Confirmation
→ Submit
```

كخطوات منفصلة في تجربة المستخدم.

---

# 6. Frontend Architecture

يجب أن يكون الفصل كالتالي:

```text
UI
↓
Service Interface
↓
Mock Adapter
```

ثم لاحقًا:

```text
UI
↓
نفس Service Interface
↓
HTTP Adapter
↓
Backend
```

لا تجعل الـcomponents تتعامل مباشرة مع hardcoded arrays.

---

# 7. Service Layer

أنشئ interfaces من هذا النوع:

```ts
interface AuthService {
  getCurrentUser(): Promise<User | null>;
  signIn(): Promise<User>;
  signOut(): Promise<void>;
}
```

```ts
interface RightsService {
  getOverview(): Promise<RightsHolderOverview>;
  getProtectedWorks(filters?: WorkFilters): Promise<ProtectedWork[]>;
  getWork(workId: string): Promise<ProtectedWorkDetail>;
  getUsageActivity(filters?: ActivityFilters): Promise<Verification[]>;
}
```

```ts
interface VerificationService {
  getVerification(id: string): Promise<VerificationDetail>;
}
```

```ts
interface NotificationService {
  getNotifications(): Promise<Notification[]>;
  markAsRead(id: string): Promise<void>;
}
```

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

---

# 8. Domain Types

التزم بالـtypes الموجودة في:

```text
IDHN_Complete_Screen_Inventory_and_Mock_Contract_v1.1
```

ومنها على الأقل:

```text
User
ProtectedWork
AuthorizationRecord
Verification
VerificationTraceStep
Notification
ReviewCase
VerificationDetail
ReviewCaseDetail
ReviewDecisionInput
ReviewDecisionPreview
```

القرارات الأساسية:

```ts
type VerificationDecision =
  | "allow"
  | "review"
  | "hold_for_review";
```

Authorization:

```ts
type AuthorizationStatus =
  | "authorized"
  | "not_recorded"
  | "unknown"
  | "not_applicable";
```

---

# 9. Human Review Decision

القيم الحالية في الـfrontend mock contract:

```ts
type HumanReviewDecision =
  | "confirm_allow"
  | "confirm_hold"
  | "needs_more_information";
```

هذه **provisional frontend values**.

لا تعاملها كسياسة قانونية نهائية.

يجب أن يكون تصميم القرار قابلًا لتغيير هذه القيم لاحقًا دون إعادة بناء الشاشة.

---

# 10. Required Mock Scenarios

يجب أن يستطيع التطبيق تشغيل كل السيناريوهات التالية:

```text
allow_no_match
allow_authorized
hold_no_authorization
review_ambiguous_match
review_unknown_authorization
registry_unavailable
backend_error
review_conflict
```

لا تبنِ happy path فقط.

---

# 11. Scenario Semantics

## allow_no_match

```text
match_found = false
authorization = not_applicable
decision = allow
```

## allow_authorized

```text
match_found = true
authorization = authorized
decision = allow
```

## hold_no_authorization

```text
match_found = true
authorization = not_recorded
decision = hold_for_review
review_status = pending
notification_status = sent
```

## review_ambiguous_match

```text
ambiguous visual evidence
decision = review
```

## review_unknown_authorization

```text
match_found = true
authorization = unknown
decision = review
```

## registry_unavailable

```text
evidence_availability = registry_unavailable
```

لا تختلق decision إذا السجل غير متاح.

## backend_error

تعرض UI error state.

## review_conflict

الحالة تتغير قبل تأكيد المراجع، ويجب منع stale submit.

---

# 12. ما يمنع Hardcoding داخل الـUI

ممنوع أن تحسب أو تقرر داخل React/Vue/UI component:

```text
match threshold
authorization decision
legal decision
reviewer permission policy
notification delivery truth
registry truth
seller identity trust
```

مثال مرفوض:

```ts
if (similarity > 0.90) {
  decision = "hold_for_review";
}
```

الصحيح:

```ts
const result = await verificationService.getVerification(id);
render(result.decision);
```

---

# 13. UI Language

التصميم يجب أن يعبر عن:

```text
Verification Trace
Evidence Relationship
Registry Context
Authorization State
Decision State
Auditability
```

وليس عن:

```text
cards
charts
KPI dashboard
generic sidebar
AI decorations
```

---

# 14. Core Product Visual Primitives

ابنِ reusable primitives مرنة:

```text
VerificationCanvas
EvidencePair
VerificationTrace
RegistryRecord
AuthorizationState
DecisionState
TechnicalInspector
SourceLabel
StateLabel
ContextPanel
ConfirmationSurface
```

Supporting:

```text
WorkRow
ActivityRow
NotificationRow
ReviewQueueRow
EvidenceSection
RegistryStatus
HumanDecisionControl
DecisionEffectPreview
ConflictState
```

لا تحوّل هذه primitives إلى نفس layout في كل شاشة.

---

# 15. Four Signature Screens

أعطِ أعلى مستوى من الجودة لهذه الشاشات:

```text
01 Public Entry
03 Rights Holder Overview
07 Verification Details
10 Review Case
```

هي التي تحدد لغة المنتج كلها.

---

# 16. Public Entry

ليست Landing Page تسويقية طويلة.

يجب أن تشرح النظام خلال ثوانٍ.

Core visual:

```text
LIVE VERIFICATION TRACE
```

مثال بصري:

```text
Request
→ Visual Match
→ Registry
→ Authorization
→ Decision
```

لا تضف:
- pricing
- testimonials
- fake metrics
- feature card wall

---

# 17. Rights Holder Overview

ليست Dashboard.

هي:

```text
Rights Control Surface
```

أهم سؤال:

```text
ما الذي يحتاج انتباهي الآن؟
```

Dominant content:
```text
Priority Verification Event
```

لا تبنِ:

```text
4 KPI cards
chart
table
```

كقالب افتراضي.

---

# 18. Verification Details

هي:

```text
Verification Workspace
```

يجب أن تعرض العلاقة:

```text
Source Image
↔
Registered Reference
↓
Visual Evidence
↓
Registry
↓
Authorization
↓
Decision
```

وتجيب:

```text
What happened?
Why?
What evidence exists?
What is the current decision?
```

---

# 19. Review Case

هي:

```text
Evidence Command Center
```

يجب أن يكون واضحًا جدًا:

```text
SOURCE
AI EVIDENCE
REGISTRY DATA
AUTHORIZATION
SYSTEM ASSESSMENT
HUMAN REVIEW
```

والقاعدة:

```text
System Recommendation ≠ Human Decision
```

---

# 20. Similarity Score

اعرضه دائمًا كالتالي:

```text
درجة تشابه بصري
```

مثال:

```text
0.967
درجة تشابه بصري
```

وأضف سياقًا يفهم منه أنه:

```text
ليس احتمال سرقة
ليس نسبة تعدٍ
ليس حكمًا قانونيًا
```

---

# 21. Authorization Language

`not_recorded` لا يعني أن النظام أثبت عدم وجود إذن قانوني.

استخدم معنى من هذا النوع:

```text
لم يظهر إذن مسجل لهذا البائع في البيانات المتاحة.
```

---

# 22. Registry Failure

هذا فرق حاسم:

```text
Registry unavailable
≠
No registration
```

عند تعذر السجل:

```text
تعذر الوصول إلى مصدر بيانات التسجيل.
لا يمكن اعتبار ذلك عدم وجود تسجيل.
```

ولا تكمل trace بقرار مختلق.

---

# 23. Provenance Layers

ميّز بصريًا دائمًا بين:

```text
SOURCE
AI EVIDENCE
REGISTRY DATA
AUTHORIZATION
SYSTEM DECISION
HUMAN DECISION
```

لا تعتمد فقط على اللون.

استخدم:
- label
- context
- placement
- typography
- state

---

# 24. Technical Inspector

في:

```text
Verification Details
Review Case
```

أضف Technical Inspector قابل للفتح/الإغلاق.

يعرض عند الحاجة:

```text
verification_id
marketplace_id
seller_id
registration_id
match_found
similarity_score
authorization_status
decision
review_status
notification_status
```

LTR + monospace.

Collapsed by default.

---

# 25. Design System Direction

## Palette

```text
Canvas          #FFFFFF
Surface         #F8F7FC
Ink             #0B0B10
Charcoal        #1A1B22
Royal Purple    #6A3DF7
Stone Purple    #A89BC8
Soft Border     #E4E0ED
Warm Signal     #D69572
```

Semantic:

```text
Allow           #16835D
Review          #B96B00
Hold            #C83C45
Info            #3566C8
```

## Rule

Purple is a signal.

Purple is not the whole interface.

---

# 26. Typography

Use the approved package/source typography:

```text
Arabic UI       Cairo
Arabic editorial/long-form where relevant  Markazi Text
Latin           Inter
Technical IDs   monospace
```

Do not silently substitute another visual identity if the fonts are available.

---

# 27. RTL

The app is Arabic-first.

Set RTL at root level.

Requirements:

- Arabic layout designed RTL.
- English technical IDs preserve LTR.
- IDs/numbers do not reorder incorrectly.
- arrows and directional icons follow actual meaning.
- tables remain readable.
- traces preserve causal logic.
- text does not clip.
- mobile is separately designed.

---

# 28. Responsive Behavior

Test at:

```text
1440
1024
768
390
```

Principle:

```text
Desktop = relationships visible simultaneously
Tablet  = selective collapse
Mobile  = evidence sequence
```

For Verification mobile:

```text
Request
↓
Source Image
↓
Registered Reference
↓
Visual Evidence
↓
Registry
↓
Authorization
↓
Trace
↓
Decision
```

For Reviewer mobile:

```text
Case
↓
Source
↓
Reference
↓
AI Evidence
↓
Registry
↓
Authorization
↓
System Assessment
↓
Human Decision
```

---

# 29. Motion

Motion must explain:

```text
state
causality
progress
relationship
```

Signature:

```text
Content In
→ Verification
→ Registry / Permission
→ Decision
```

No looping decorative animations.

Support:

```css
prefers-reduced-motion
```

The app must remain understandable with motion disabled.

---

# 30. Accessibility

Target:

```text
WCAG 2.2 AA
```

Include:

- keyboard navigation
- visible focus
- semantic controls
- form labels
- dialog focus management
- alt text for evidence images
- states not conveyed by color only
- no hover-only critical information
- reduced motion

---

# 31. Performance

Do not require:
- WebGL
- heavy 3D
- decorative video backgrounds

Requirements:
- optimize images
- lazy-load noncritical media
- keep evidence rendering high priority
- animation must not block input/search
- avoid heavy animation dependencies unless truly necessary

---

# 32. Authentication

Authentication provider is **غير محسوم**.

Do not hardcode:

```text
Nafath
Absher
Google
Microsoft
username/password
```

unless the repository/source is later updated.

Build a flexible Authentication Container.

Mock roles:

```text
rights_holder
reviewer
```

---

# 33. Navigation

Do not default to a large SaaS sidebar.

Use the approved:

```text
Context Rail
```

Rights Holder:

```text
IDHN
—
Overview
Works
Activity
Alerts
—
Registry status
```

Reviewer:

```text
IDHN
—
Queue
—
System status
```

Keep visual weight low.

---

# 34. State Handling

Implement real states, not just the happy path:

```text
Loading
Empty
Success
Error
Offline when applicable
Permission Denied
Pending Review
Conflict
Registry Unavailable
Authentication Expired
Partial Evidence
Filtered Empty
```

Not every screen uses every state; follow the screen contract.

---

# 35. Error Semantics

Do not use one generic error for everything.

Distinguish:

```text
network / backend failure
registry unavailable
permission denied
conflict
authentication expired
```

A backend failure must never be converted into an `ALLOW` or `REVIEW`.

---

# 36. Demo Data

Clearly identify demo/test data where appropriate.

Use realistic IDs:

```text
VRF-2041
DEMO-001
seller_b
market_01
```

But do not imply they are live legal records.

---

# 37. Repository / Stack Rule

Before coding:
- inspect the existing repository.
- preserve the existing frontend stack if one exists.
- do not migrate frameworks without a clear technical need.
- implementation-level choices are allowed only if they do not change the approved product contracts.

If the repository is blank, choose a production-capable TypeScript frontend stack suitable for the 12-screen web application, but keep all product contracts framework-agnostic.

---

# 38. Recommended Frontend Folder Responsibilities

Adapt names to the existing framework, but preserve separation:

```text
src/
  app-or-routes/
  components/
    shared/
    verification/
    rights/
    review/
  services/
    contracts/
    mock/
    http/
  domain/
    types/
  mocks/
    fixtures/
    scenarios/
  design-system/
    tokens/
  utilities/
  tests/
```

Do not create empty architectural layers for appearance only.

---

# 39. Mock Adapter

Create one centralized way to select scenario.

Conceptually:

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

The UI must not need rewriting when scenario changes.

---

# 40. HTTP Adapter Boundary

Even if backend is not ready, reserve a clear adapter boundary.

Conceptually:

```text
services/
  contracts/
  mock/
  http/
```

Do not implement fake backend rules inside `http/`.

When teammate integrates backend, they should implement interfaces rather than rewrite pages.

---

# 41. Known Verification API Contract

The existing technical handoff defines the core verification call as:

```text
POST /analyze
multipart/form-data
image
seller_id
```

Example result shape includes:

```json
{
  "similarity_score": 0.967,
  "match_found": true,
  "registration_id": "DEMO-001",
  "registered_owner": "Seller A",
  "matched_image_url": "/images/IMG-001.jpg",
  "authorized": false,
  "risk_level": "high",
  "decision": "hold_for_review",
  "notify_owner": true
}
```

Important:

- `similarity_score` is raw visual similarity, not infringement probability.
- `authorized: false` means no recorded permission in the demo registry.
- `notify_owner` is a system recommendation/simulation unless real notification delivery is integrated.
- Frontend production contracts use richer `authorization_status` and verification models; adapt backend response at the HTTP adapter boundary rather than leaking backend-specific semantics through every component.

---

# 42. Do Not Build This as the Product

Never make the main product:

```text
Upload Image
Seller ID
Analyze
```

That is allowed only as:
```text
developer tool
or
clearly labeled Marketplace Simulation for demo
```

Seller identity in production comes from Marketplace.

---

# 43. Marketplace Simulation

Not part of the 12 core product screens.

If built later for hackathon demo, clearly label:

```text
Demo / Marketplace Simulation
```

Possible flow:

```text
Authenticated demo seller
→ upload product image
→ pre-publish verification
→ show ALLOW / REVIEW / HOLD_FOR_REVIEW
```

Do not mix this simulation into Rights Holder Portal.

---

# 44. Implementation Order

Build in this order:

```text
01 design tokens + RTL root
02 routing
03 service interfaces
04 domain types
05 mock scenarios
06 shared state primitives
07 verification primitives
08 shared app shell / context rail

09 Public Entry
10 Login
11 Rights Holder Overview
12 Protected Works
13 Work Details
14 Usage Activity
15 Verification Details
16 Notifications

17 Review Queue
18 Review Case
19 Review Decision
20 Decision Confirmation

21 responsive pass
22 accessibility pass
23 mock-scenario pass
24 visual QA
25 test / build cleanup
```

Do not begin with generic dashboard components.

---

# 45. Testing Requirements

At minimum validate:

## Routing
All routes work.

## Scenario coverage
All 8 required mock scenarios render.

## State coverage
Relevant loading/error/empty/conflict states render.

## Reviewer safety
Conflict blocks stale submit.

## Registry semantics
Registry unavailable does not become “no registration”.

## Similarity semantics
No UI label interprets score as infringement probability.

## Responsive
No horizontal overflow at supported widths.

## RTL
Arabic + English IDs render correctly.

## Accessibility
Keyboard path works across primary flows.

---

# 46. Visual QA Gate

Before declaring frontend complete, inspect actual rendered screenshots.

Required widths:

```text
1440
1024
768
390
```

Core screens:

```text
Public Entry
Rights Holder Overview
Verification Details
Review Case
```

Then inspect all remaining screens.

Check:

```text
no clipping
no overflow
Arabic line breaks
technical IDs
image containment
semantic state clarity
source/AI/system distinction
mobile spacing
focus states
```

---

# 47. Anti-Template Gate

Reject your own implementation if:

- changing logo/name turns it into CRM.
- Overview becomes KPI cards + chart.
- every page is same grid.
- every block is a rounded card.
- purple dominates.
- Review Case looks like a dashboard.
- evidence is secondary.
- AI uses robot/brain/sparkle cliché.
- legal identity uses gavel/scales.
- motion is decorative only.
- mobile is compressed desktop.
- user cannot answer “what happened and why?”

---

# 48. Definition of Done

Frontend is done only when:

## Product
- [ ] all 12 screens exist.
- [ ] route flow works.
- [ ] role-aware mock navigation works.
- [ ] Rights Holder and Reviewer experiences are distinct.

## Architecture
- [ ] UI uses service interfaces.
- [ ] Mock adapter is separate.
- [ ] HTTP adapter boundary exists.
- [ ] no decision thresholds hardcoded in UI.
- [ ] no legal logic hardcoded in UI.

## Data
- [ ] domain types match approved contracts.
- [ ] nullable fields handled.
- [ ] 8 mock scenarios supported.
- [ ] demo data clearly non-production.

## UX
- [ ] Loading states.
- [ ] Error states.
- [ ] Empty states.
- [ ] Registry unavailable.
- [ ] Permission denied where relevant.
- [ ] Review state.
- [ ] Conflict state.

## Design
- [ ] light-first.
- [ ] Arabic-first RTL.
- [ ] approved palette roles.
- [ ] source / AI / registry / system / human layers distinguishable.
- [ ] four signature screens have product-specific compositions.
- [ ] no generic SaaS dashboard.

## Responsive
- [ ] 1440.
- [ ] 1024.
- [ ] 768.
- [ ] 390.
- [ ] no horizontal overflow.

## Accessibility
- [ ] keyboard usable.
- [ ] visible focus.
- [ ] semantic controls.
- [ ] labels.
- [ ] state not color-only.
- [ ] reduced motion support.

## Engineering
- [ ] production build passes.
- [ ] no obvious console errors.
- [ ] no dead visible buttons.
- [ ] no decorative fake actions.
- [ ] images are optimized appropriately.
- [ ] component boundaries are reusable but not over-abstracted.

## QA
- [ ] screenshots reviewed.
- [ ] anti-template gate passed.
- [ ] similarity language verified.
- [ ] registry failure semantics verified.
- [ ] review conflict behavior verified.

---

# 49. Required Handoff Back to Backend Teammate

When frontend implementation is complete, provide:

```text
1 Route map
2 Service interfaces
3 Type definitions
4 Mock fixtures
5 Scenario list
6 Expected API fields
7 Loading/error states
8 Nullable fields
9 Decision enums
10 Image URL handling
11 Authentication assumptions
12 Environment configuration
13 HTTP adapter location
14 Confirmation that no thresholds are hardcoded in UI
```

---

# 50. Completion Report Required from Codex

At the end of implementation, do not only say “done”.

Return:

```text
Implemented:
- ...

Routes:
- ...

Mock scenarios:
- ...

Tests/build:
- ...

Known gaps:
- ...

Backend integration points:
- ...

Visual QA status:
- ...

Files changed:
- ...
```

Any missing requirement must be stated explicitly.

---

# 51. Non-Negotiable Rules

1. Do not redesign the product architecture.
2. Do not invent new screens.
3. Do not invent legal powers.
4. Do not turn similarity into guilt/infringement probability.
5. Do not trust manually typed Seller ID in production UX.
6. Do not hardcode verification thresholds in UI.
7. Do not merge system recommendation and human decision.
8. Do not treat registry failure as no registration.
9. Do not build a generic SaaS dashboard.
10. Do not call the implementation complete before real render QA.

---

# 52. Start Command for Codex

ابدأ التنفيذ الآن.

أولًا:
1. اقرأ جميع مصادر Frontend Source of Truth.
2. افحص الـrepository الحالي.
3. أنشئ خطة تنفيذ قصيرة مبنية على الموجود فعليًا في المشروع.
4. ثم ابدأ مباشرة بالبناء حسب Implementation Order.
5. لا تطلب إعادة شرح المنتج طالما المعلومات موجودة في المصادر.
6. لا تغيّر قرارات المنتج أو التصميم دون وجود تعارض تقني حقيقي؛ إذا ظهر تعارض، وثّقه بوضوح واختر أقل تعديل ممكن يحافظ على المصادر.
7. نفّذ التطبيق فعليًا، وشغّل الاختبارات/build المتاحة، وافحص الرندر على المقاسات المطلوبة.
