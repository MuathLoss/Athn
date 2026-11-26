# إذن | IDHN
## UI Composition & Screen Design Specification
**Version:** 1.0  
**Status:** Project source candidate — ready for approval  
**Purpose:** تحويل الـScreen Inventory المعتمد إلى مواصفات تصميم واجهات قابلة للتنفيذ في Frontend، مع الالتزام الكامل بالهوية، الـDesign System، الـMotion Grammar، الـRTL، والـAnti-Template rules.

---

# 0. المرجع الملزم

هذا الملف يعتمد على:
- `IDHN_Complete_Screen_Inventory_and_Mock_Contract_v1.1`
- `IDHN_Sitemap_and_Full_Product_Flow_v1.0`
- `IDHN_Production_Product_Architecture_and_User_Flow_v1.0`
- `IDHN_Brand_Source_Package_v1.0`
- `LegalTech_Creative_UI_Direction_and_Design_Rules_v1`

أي تعارض مع هذه الملفات يُحسم لصالح المصادر المعتمدة الأعلى.

---

# 1. الفكرة التصميمية العامة

## 1.1 Product Primitive
العنصر الأساسي للمنتج هو:

**Verification Trace / Evidence Relationship**

وليس:
- Card
- Dashboard
- KPI widget
- Generic table

كل شاشة يجب أن توضح علاقة بين:
```text
Source
→ Evidence
→ Registry / Permission
→ Decision
```

---

## 1.2 Art Direction
الشخصية:
**Intelligent / Precise / Editorial / Human / Confident / Fluid**

المطلوب:
- Light-first
- Arabic-first RTL
- White canvas with controlled lavender atmosphere
- Royal Purple as signal, not wallpaper
- Evidence-first layout
- Meaningful motion
- Strong whitespace
- Engineering-level precision

---

# 2. Global Visual System

## 2.1 Canvas
Default:
```css
background:
linear-gradient(
  135deg,
  #FFFFFF 0%,
  #FBFAFE 50%,
  #F1ECFF 100%
);
```

لكن في مساحات القراءة الطويلة:
- استخدم `#FFFFFF` أو `#FBFAFE`
- خفف الـlavender atmosphere أكثر

الهدف:
**90% neutral / 10% lavender atmosphere**

---

## 2.2 Core Colors

```text
Obsidian       #0B0B10
Charcoal       #1A1B22
Royal Purple   #6A3DF7
Stone Purple   #A89BC8
Soft Stone     #E7E5ED
White          #FFFFFF / #F6F5F8
Warm Signal    #D69572
```

Semantic:
```text
Allowed        #16835D
Review         #B96B00
Blocked/Hold   #C83C45
Info           #3566C8
```

**Rule:** semantic colors do not replace text labels.

---

## 2.3 Typography

Arabic UI:
- Cairo

Arabic evidence/long-form:
- Markazi Text

Latin:
- Inter

Technical:
- monospace stack

Recommended hierarchy:
```text
Display   56
H1        40
H2        32
H3        24
Body LG   18
Body      16
Small     14
Caption   12
```

---

# 3. Global Layout Rules

## Desktop
```text
Max content width: 1440px
Workspace gutter: 32px
Reading column: max 760px
```

## Mobile
```text
Gutter: 16px
```

---

# 4. Navigation Philosophy

لا نعتمد Sidebar كبير كهيكل ثابت لكل شيء.

## Rights Holder
يستخدم navigation هادئ يمكن أن يكون:
- Compact rail
- Contextual top navigation
- Collapsible navigation

الأولوية لمساحة العمل.

## Reviewer
يمكن أن يستخدم navigation أكثر عملية لأن Review Queue كثيفة،
لكن يظل أقل بروزًا من Evidence Workspace.

## Public / Login
بدون app shell كامل.

---

# 5. Shared App Shell

## Desktop
يتكون من:
1. Brand mark / product identity
2. Contextual navigation
3. Current role / user
4. Page context
5. Main workspace

لا يوجد:
- topbar ضخم
- sidebar مليان عشرات الروابط
- persistent KPI widgets

## Mobile
- Header صغير
- Context title
- menu/drawer عند الحاجة
- primary action يبقى ظاهرًا إذا مهم

---

# 6. Signature Graphic Language

## 6.1 Verification Wave
يستخدم:
- Public Entry
- loading/processing transition
- background transition بين states

لا يستخدم:
- خلفية متحركة أثناء قراءة Evidence

## 6.2 Content Layers
يستخدم:
- image/evidence relationships
- registry context
- source layering
- contextual expansions

## 6.3 Decision Trace
يستخدم:
- Verification Details
- Review Case
- State transitions
- Decision summary

---

# 7. Motion Grammar

Signature:
```text
Content In
→ Verification
→ Permission Check
→ Decision
```

Durations:
```text
press/hover          120–160ms
local reveal         180–240ms
workspace state      260ms
panel expansion      240–320ms
major transition     260–350ms
signature sequence   600–900ms
```

Reduced motion:
- no travel
- no parallax
- state swap <=120ms

---

# 8. Screen 01 — Public Entry

## Composition Type
**Editorial Entry / Signature Moment**

## Desktop Structure

```text
┌────────────────────────────────────────────────────────────┐
│ Logo                                      تسجيل الدخول    │
│                                                            │
│                                                            │
│                 إذن                                        │
│         تحقق قبل أن يحدث الضرر                             │
│                                                            │
│     وصف قصير للمنتج                                        │
│                                                            │
│     [ تسجيل الدخول ]                                       │
│                                                            │
│              Content                                       │
│                 ↓                                          │
│        Verification Trace                                  │
│                 ↓                                          │
│            Permission                                      │
│                 ↓                                          │
│             Decision                                       │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

## Hierarchy
1. Brand
2. One strong statement
3. One short explanation
4. Primary CTA
5. Product mechanism visual

## Visual Signature
- Layered gateway geometry derived from logo
- Decision Trace enters from content visual and resolves to decision node
- Lavender atmosphere only around product mechanism

## Motion
On first entry:
1. Content layer appears
2. trace moves
3. node pauses
4. final state resolves

Non-blocking.

## Mobile
Stack:
```text
Logo
Headline
Explanation
CTA
Mechanism visual
```

No two-column hero squeeze.

---

# 9. Screen 02 — Login / Identity Verification

## Composition Type
**Focused Authentication Surface**

## Desktop
Two unequal zones:

```text
┌──────────────────────────────────────────────┐
│ Brand context      │ Authentication surface │
│                    │                        │
│ Verification motif │ Login provider        │
│                    │ Error/status          │
│                    │ CTA                    │
└──────────────────────────────────────────────┘
```

Right side or center contains actual auth interaction depending RTL composition.

## Rule
Authentication provider is not hardcoded visually yet.
Use flexible container.

## Motion
- only state transition
- no decorative animation during authentication

## Mobile
Single-column focus mode.

---

# 10. Screen 03 — Rights Holder Overview

## Composition Type
**Editorial Overview**

Goal:
answer:
**ماذا يحتاج انتباهي الآن؟**

## Desktop Structure

```text
┌────────────────────────────────────────────────────────────┐
│ Context / greeting                         Registry status │
│                                                            │
│ أهم شيء الآن                                                │
│ ────────────────────────────────────────────────────────── │
│ [Priority activity — large editorial treatment]            │
│                                                            │
│ Recent Works                    Recent Activity             │
│ image-led strip                 timeline/list              │
│                                                            │
│ Notifications / context                                  → │
└────────────────────────────────────────────────────────────┘
```

## Not Allowed
```text
[12 works] [4 alerts] [6 matches] [3 reviews]
[chart]
[table]
```

## Key Visual
One dominant priority item,
then quieter supporting content.

## Numbers
Can appear inline:
```text
12 مصنفًا محميًا
2 تنبيهات جديدة
```
as typography, not cards.

## Mobile
Priority-first:
```text
Priority
↓
Recent activity
↓
Recent works
↓
Notifications
```

---

# 11. Screen 04 — Protected Works

## Composition Type
**Image-led Dense Library**

## Desktop

```text
Title + count
Search ______________________ Filters
─────────────────────────────────────

[image] Work title         Registration ID   Activity
[image] Work title         Registration ID   Activity
[image] Work title         Registration ID   Activity
```

Can use hybrid row:
- image preview
- metadata
- activity annotation

Avoid generic e-commerce card grid unless image density genuinely benefits.

## Primary Interaction
row/image opens work.

## Search
sticky only if data density requires.

## Mobile
Each item:
```text
Image
Title + ID
Registry source
Recent activity
```
No dense desktop columns squeezed.

---

# 12. Screen 05 — Work Details

## Composition Type
**Source Record + Context**

## Desktop

```text
┌────────────────────────┬───────────────────────────────────┐
│                        │ Work title                        │
│    Main source image   │ Registration ID                   │
│                        │ Registry source                   │
│                        │ Owner                             │
│                        │ Registered at                     │
├────────────────────────┴───────────────────────────────────┤
│ Authorization relationship                                │
│ Owner → Work → Seller / Marketplace                       │
├────────────────────────────────────────────────────────────┤
│ Recent usage activity                                     │
└────────────────────────────────────────────────────────────┘
```

## Key Visual
Content Layers can express:
```text
Owner
→ Work
→ Authorization
```

Do not use a form-like settings layout.

## Mobile
Image first,
then source record,
then authorizations,
then usage activity.

---

# 13. Screen 06 — Usage Activity

## Composition Type
**Process Timeline / Dense Activity**

## Desktop

Header:
```text
Usage Activity
Search / filters
```

Main:
```text
DATE/TIME ─ Marketplace ─ Seller ─ Work ─ Decision
          │
          ├── event
          ├── event
          └── event
```

Could mix timeline and structured rows.

## Decision State
Text + icon + semantic color:
```text
مسموح
بحاجة إلى مراجعة
معلق للمراجعة
```

## Mobile
Vertical timeline:
```text
Time
Marketplace
Work
Decision
```

No horizontal table scroll as default.

---

# 14. Screen 07 — Verification Details

## Composition Type
**Verification Workspace**
This is one of the two signature screens.

## Desktop Layout

```text
┌──────────────────────────────────────────────────────────────────┐
│ Verification ID / Marketplace / Seller / Time                   │
├───────────────────────┬───────────────────────┬──────────────────┤
│                       │                       │ Verification     │
│ Uploaded Image        │ Registered Reference │ Trace            │
│                       │                       │                  │
│                       │                       │ Content In       │
│                       │                       │ ↓                │
│                       │                       │ Visual Match     │
│                       │                       │ ↓                │
│                       │                       │ Registry         │
│                       │                       │ ↓                │
│                       │                       │ Permission       │
│                       │                       │ ↓                │
│                       │                       │ Decision         │
├───────────────────────┴───────────────────────┴──────────────────┤
│ Evidence annotation strip                                       │
├──────────────────────────────────────────────────────────────────┤
│ Registry Evidence       Authorization        Decision             │
└──────────────────────────────────────────────────────────────────┘
```

## Image Relationship
Images should feel connected,
not two unrelated cards.

Use:
- shared alignment
- connecting trace
- subtle layer relation
- optional compare focus

## Similarity
Display:
```text
0.967
درجة تشابه بصري
```

Never:
```text
96.7% احتمال سرقة
```

## Trust Layering
Visually identify:
```text
SOURCE
AI EVIDENCE
REGISTRY
SYSTEM DECISION
```

## Technical Inspector
Optional expandable contextual panel:
- IDs
- raw fields
- source labels

Do not make JSON the main UI.

## Decision
Placed at end of causal trace,
not top-left badge detached from evidence.

## States

### Allow — no match
Registered reference area becomes:
```text
لا يوجد مرجع مسجل مطابق بدرجة كافية
```
No fake empty image.

### Allow — authorized
Trace resolves:
```text
Match
→ Registry
→ Authorized
→ ALLOW
```

### Review
Trace pauses at uncertain node.

### Hold
Trace stops at permission node then resolves to hold.

### Registry unavailable
Trace visually ends at registry stage with explicit unavailable state.
Do not continue to a fabricated decision.

## Motion
This is the main signature animation:
- comparison content anchors in place
- trace reveals progressively
- current node highlights
- decision resolves once

## Mobile
Do not display three columns.

Use:
```text
Uploaded Image
↓
Registered Image
↓
Visual Evidence
↓
Registry
↓
Authorization
↓
Decision Trace
↓
Decision
```

Allow contextual details to collapse.

---

# 15. Screen 08 — Notifications

## Composition Type
**Event Stream**

## Desktop
```text
Notifications
────────────────────────────────────
● Event title
  Context / message
  Timestamp                     →
────────────────────────────────────
○ Event title
...
```

Read/unread via:
- typography
- node emphasis
- subtle surface
not just bold purple blocks.

## Notification content
Keep sensitive detail limited.

## Mobile
Same stream; full-width.

---

# 16. Screen 09 — Review Queue

## Composition Type
**Dense Review Queue**

## Desktop

```text
Review Queue
Search _____________  Filters

CASE     REASON         MARKETPLACE      TIME      STATUS
001      unknown auth   Marketplace A    14:32     Pending
002      missing data   Marketplace B    14:36     In review
```

Can use:
- dense list
- smart table
- row annotations

No KPI dashboard above it unless a real operational need is approved later.

## Priority
Use restrained edge marker / annotation,
not giant red cards.

## Mobile
Case list:
```text
Case
Reason
Marketplace
Status
Time
```

---

# 17. Screen 10 — Review Case / Evidence Workspace

## Composition Type
**Evidence Workspace**
This is the main signature screen of the whole product.

## Desktop Layout

```text
┌────────────────────────────────────────────────────────────────────┐
│ Case ID / Reason / Status / Time                                  │
├────────────────────────┬────────────────────────┬──────────────────┤
│                        │                        │ Verification     │
│ Uploaded Image         │ Registered Image       │ Trace            │
│                        │                        │                  │
│                        │                        │ Source           │
│                        │                        │ ↓                │
│                        │                        │ AI Evidence      │
│                        │                        │ ↓                │
│                        │                        │ Registry         │
│                        │                        │ ↓                │
│                        │                        │ Permission       │
│                        │                        │ ↓                │
│                        │                        │ System rec.      │
├────────────────────────┴────────────────────────┴──────────────────┤
│                                                                    │
│ VISUAL EVIDENCE                                                    │
│ similarity / match annotation                                     │
│                                                                    │
├───────────────────────────────┬────────────────────────────────────┤
│ REGISTRY EVIDENCE             │ AUTHORIZATION                      │
│ source / registration         │ records / unknown / missing        │
├───────────────────────────────┴────────────────────────────────────┤
│ Technical Inspector (collapsed by default)                        │
├────────────────────────────────────────────────────────────────────┤
│                         [ متابعة لاتخاذ القرار ]                   │
└────────────────────────────────────────────────────────────────────┘
```

## Strong Rule
Reviewer must never lose:
- source images
- evidence relationship
- current trace
- current case status

when opening details.

Use contextual expansion instead of navigating away for every detail.

## Distinction System

### Source Data
neutral/ink treatment

### AI Evidence
purple + label

### Registry Data
stone/layered treatment

### System Recommendation
semantic state + explicit label

### Human Decision
separate confirmation surface

## Partial Evidence
Missing evidence occupies its real spatial position:
```text
Registry data unavailable
```
not hidden.

## Conflict
Show sources side by side with conflict annotation.
Do not auto-resolve.

## Motion
- anchored reveal
- trace update
- contextual panel expansion
- no background motion

## Mobile
Sequential Evidence Workspace:
```text
Case Context
↓
Uploaded Image
↓
Registered Image
↓
Visual Evidence
↓
Registry Evidence
↓
Authorization
↓
Trace
↓
Decision CTA
```

Use sticky bottom CTA only if it does not obscure evidence.

---

# 18. Screen 11 — Review Decision

## Composition Type
**Focus Mode**

## Desktop

```text
Back to evidence

قرار المراجعة
Case #001

Current system state
────────────────────

[ decision options ]

Reason / note
_____________________

Effect preview

[ مراجعة القرار قبل التأكيد ]
```

No side dashboard.
No unrelated navigation noise.

## Decision Options
Must be built from backend/policy-capable config later,
not buried in component logic.

## Motion
Option selection:
120–160ms tactile response.

Continue:
content morph/shared transition to confirmation.

## Mobile
Single-column focus.

---

# 19. Screen 12 — Decision Confirmation

## Composition Type
**Critical Confirmation Surface**

## Desktop

```text
قرار المراجعة

CASE
Decision

ما الذي سيحدث؟
──────────────────────────
Marketplace effect
Notification effect
Review status effect

Audit note
──────────────────────────

[ رجوع للتعديل ]    [ تأكيد القرار ]
```

## Hierarchy
1. Decision
2. Consequence
3. Confirmation

## Conflict State
If case changed:
replace confirm CTA with:
```text
تم تحديث الحالة منذ فتحها
[ تحديث البيانات ]
```

Never allow stale submit.

## Success State
Shared-element transition:
decision node resolves,
then concise success state.

No confetti.

---

# 20. State Design Rules Across Screens

## Loading
Skeleton follows actual page geometry.

Never:
- spinner in empty screen only
- fake 73% progress

## Empty
Explain:
- what is empty
- why
- what happens next

## Error
Must distinguish:
```text
Network error
Registry unavailable
Permission denied
Backend processing error
```

## Permission Denied
Hide sensitive content.

## Registry Unavailable
Visually tied to registry node.

## Pending Review
Not styled as generic warning.

## Conflict
Distinct from error.

---

# 21. Responsive Strategy

## Breakpoints
Do not treat these as strict implementation values yet; exact framework breakpoints can be chosen in code.

Principle:
```text
Desktop = relationship visible simultaneously
Tablet  = relationship + contextual collapse
Mobile  = evidence sequence
```

## Verification / Review
Desktop:
side-by-side evidence

Mobile:
stacked evidence with preserved causal order

## Dense tables
Desktop:
table/hybrid

Mobile:
structured rows/list

---

# 22. Accessibility

Must include:
- visible focus ring
- semantic buttons
- keyboard navigation
- dialog focus management
- alt text for evidence images
- state labels beyond color
- no critical hover-only content
- WCAG 2.2 AA target

Evidence comparison must remain understandable without color.

---

# 23. Image Behavior

## Evidence Images
Use:
- contained view
- zoom/open detail if later needed
- correct aspect handling

Do not:
- crop evidence aggressively for aesthetics
- apply decorative filters
- obscure image with gradients

## Work thumbnails
Can crop carefully,
but full source image remains available in Work Details.

---

# 24. Surface / Border / Radius Rules

Not every element is a card.

Use surfaces only when they communicate:
- elevation
- context boundary
- interaction group
- evidence source

Radii:
```text
xs 6
sm 10
md 14
lg 20
xl 28
```

Do not use same radius everywhere.

---

# 25. Shadow Rules

Use:
```text
surface:
0 8px 28px rgba(23,18,44,.08)

floating:
0 18px 60px rgba(39,23,79,.16)
```

Only for:
- contextual floating panels
- selected evidence layer
- modal/confirmation

Do not shadow every list item.

---

# 26. Verification Trace Visual Specification

Core anatomy:

```text
──────────────■──────────────
              ↑
         active node
```

Can be:
- horizontal
- vertical
- stepped
depending screen.

Node roles:
```text
Content
Visual Verification
Registry
Authorization
Decision
```

Default:
- fine line
- quiet inactive nodes
- one emphasized active/resolved node

Warm Signal `#D69572`
used selectively for verification node / signal, not whole trace.

---

# 27. Decision State Presentation

## ALLOW
```text
مسموح
```
Semantic green + text + icon/context.

## REVIEW
```text
بحاجة إلى مراجعة
```
Amber + explanation + next action.

## HOLD_FOR_REVIEW
```text
معلّق للمراجعة
```
Red/crimson + explanation.
Avoid:
```text
سرقة
مجرم
تعدٍ مؤكد
```

---

# 28. Technical Inspector

Use only in:
- Verification Details
- Review Case

Collapsed by default.

Can show:
```text
Verification ID
Registration ID
Seller ID
Marketplace ID
Raw decision
Raw authorization status
Similarity score
Timestamp
```

Technical fragments:
LTR + monospace.

---

# 29. Design System Component Mapping

## Primitive Components
```text
VerificationCanvas
EvidencePair
VerificationTrace
RegistryRecord
AuthorizationNode
DecisionState
TechnicalInspector
ContextPanel
```

## Supporting
```text
SourceLabel
StateLabel
ActivityRow
WorkRow
NotificationRow
ReviewQueueRow
EvidenceSection
ConfirmationSurface
```

These are flexible primitives.
Do not enforce same composition on every page.

---

# 30. Page-to-Primitive Mapping

| Screen | Primary Primitive |
|---|---|
| Public Entry | Decision Trace / Content Layers |
| Login | Context Panel |
| Overview | Editorial Overview |
| Protected Works | Work Row / Dense Library |
| Work Details | Registry Record / Content Layers |
| Usage Activity | Activity Row / Process Trace |
| Verification Details | VerificationCanvas |
| Notifications | Notification Row / Event Stream |
| Review Queue | ReviewQueueRow / Dense Data |
| Review Case | VerificationCanvas + EvidencePair |
| Review Decision | Focus Mode / Decision control |
| Confirmation | ConfirmationSurface / DecisionState |

---

# 31. Motion Mapping Per Screen

| Screen | Motion |
|---|---|
| Public Entry | Full signature once |
| Login | state transition only |
| Overview | contextual reveal |
| Protected Works | filter/result transition |
| Work Details | anchored context expansion |
| Usage Activity | state/list transition |
| Verification Details | verification trace |
| Notifications | read-state microinteraction |
| Review Queue | list/filter transition |
| Review Case | anchored evidence reveal + trace |
| Review Decision | option tactile + shared transition |
| Confirmation | decision resolve |

---

# 32. Design QA Gate

Before approving any screen:

## Task
- Is the main task obvious in 3 seconds?

## Composition
- Does this layout exist because of the task?
- Could this be a generic CRM screen?

## Evidence
- Are source, AI, registry, system and human layers distinguishable?

## Color
- Is purple acting as signal, not wallpaper?

## Motion
- Does it explain causality or state?

## RTL
- Was it designed RTL first?

## Mobile
- Is mobile actually redesigned?

## Accessibility
- Is state understandable without color?

## Engineering
- Does every visible action map to a real action/state?

---

# 33. Anti-Template Rejection Gate

Reject screen if:
- sidebar dominates workspace
- same hero repeats on internal pages
- same grid repeats across different tasks
- every section is a rounded card
- decorative gradients dominate evidence
- glassmorphism becomes default surface
- AI is represented by sparkle/robot/brain
- legal identity uses gavel/scales/shield cliché
- verification result appears without evidence
- score appears as guilt probability
- review screen hides original sources
- mobile is compressed desktop
- motion exists only as fade-up

---

# 34. Frontend Implementation Order

When moving to Codex:

```text
1. Design tokens + RTL root
2. App routing
3. Shared shell
4. Shared state primitives
5. Verification primitives
6. Public Entry
7. Login
8. Rights Holder Overview
9. Protected Works
10. Work Details
11. Usage Activity
12. Verification Details
13. Notifications
14. Review Queue
15. Review Case
16. Review Decision
17. Decision Confirmation
18. Responsive QA
19. Accessibility QA
20. Mock scenario QA
```

Why:
Verification primitives are created early so later screens share the real product language, not generic components.

---

# 35. Required Mock Scenarios During UI QA

Every relevant screen must be tested with:

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

---

# 36. Stage Completion Criteria

This UI Composition stage is complete when:

- [x] All 12 screens have a defined composition.
- [x] Each composition is task-derived.
- [x] Desktop structure is defined.
- [x] Mobile behavior is defined.
- [x] Motion role is defined.
- [x] Visual hierarchy is defined.
- [x] Evidence hierarchy is defined.
- [x] Design-system primitives are mapped.
- [x] Anti-template rules are explicit.
- [x] Accessibility rules are explicit.
- [x] Responsive rules are explicit.
- [x] Implementation order is defined.
- [x] No unsupported product functionality was introduced.

---

# 37. Next Stage

بعد اعتماد هذا الملف، ننتقل إلى:

## Screen-by-Screen High-Fidelity UI Design

الترتيب المقترح:
1. Public Entry
2. Rights Holder Overview
3. Verification Details
4. Review Case
5. ثم بقية الشاشات

ويتم اعتماد كل واجهة بصريًا قبل نقلها إلى Codex للتنفيذ.
