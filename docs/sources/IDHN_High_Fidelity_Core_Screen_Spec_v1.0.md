# إذن | IDHN
## High-Fidelity Core Screen Specification
**Version:** 1.0  
**Status:** Source candidate — ready for approval  
**Purpose:** المواصفات التنفيذية عالية الدقة لأربع شاشات جوهرية تحدد اللغة البصرية والتقنية للمنتج: Public Entry، Rights Holder Overview، Verification Details، Review Case.

---

# 0. المرجع الملزم

هذا الملف يبني مباشرة على:
- `IDHN_High_Fidelity_UI_Technical_Direction_v1.0`
- `IDHN_UI_Composition_and_Screen_Design_Spec_v1.0`
- `IDHN_Complete_Screen_Inventory_and_Mock_Contract_v1.1`
- `IDHN_Sitemap_and_Full_Product_Flow_v1.0`
- `IDHN_Production_Product_Architecture_and_User_Flow_v1.0`
- `IDHN_Brand_Source_Package_v1.0`
- `LegalTech_Creative_UI_Direction_and_Design_Rules_v1`

لا تضيف هذه المواصفات وظائف جديدة؛ هي ترجمة واجهات للوظائف والبيانات المثبتة مسبقًا.

---

# 1. Global High-Fidelity Baseline

## 1.1 Desktop Frame
```text
1440 × 1024
Content max-width: 1296
Outer gutter: 72
Base vertical rhythm: 8
```

## 1.2 Mobile Frame
```text
390 × flexible
Outer gutter: 20
```

## 1.3 Core Palette
```text
Canvas          #FFFFFF
Atmosphere      #F3F0FF → #EAE4FF
Ink             #0B0B10
Charcoal        #1A1B22
Royal Purple    #6A3DF7
Stone Purple    #A89BC8
Soft Border     #E4E0ED
Surface          #F8F7FC
Warm Signal     #D69572
```

Semantic:
```text
Allow           #16835D
Review          #B96B00
Hold            #C83C45
Info            #3566C8
```

## 1.4 Typography
```text
Arabic UI       Cairo
Arabic longform Markazi Text
Latin           Inter
Technical IDs   Monospace
```

## 1.5 Technical Label Grammar
Use uppercase English micro-labels for system provenance where useful:
```text
SOURCE
AI EVIDENCE
REGISTRY
AUTHORIZATION
SYSTEM DECISION
HUMAN REVIEW
```

Arabic remains the primary product language.

---

# 2. Screen 01 — Public Entry v2

## 2.1 Purpose
المستخدم يفهم خلال 5 ثوانٍ:
1. ما المشكلة التي يحلها «إذن».
2. أن التحقق يحدث قبل النشر.
3. أن القرار يعتمد على أكثر من مجرد تشابه بصري.

## 2.2 Desktop Composition

```text
┌──────────────────────────────────────────────────────────────────────┐
│ LOGO                                                   تسجيل الدخول │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│                              منصة تحقق قبل النشر                    │
│                       تحقق قبل أن يحدث الضرر                        │
│                                                                      │
│      «إذن» يربط المطابقة البصرية ببيانات التسجيل والإذن            │
│      قبل نشر الصورة في منصة التجارة الإلكترونية.                   │
│                                                                      │
│                                      [ تسجيل الدخول ]               │
│                                                                      │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │ LIVE VERIFICATION TRACE                                        │  │
│  │                                                                │  │
│  │ REQUEST                                                        │  │
│  │ VRF-2041                                                       │  │
│  │ Marketplace Demo                                               │  │
│  │      │                                                         │  │
│  │      ├── Visual Match ................ 0.967                   │  │
│  │      │                                                         │  │
│  │      ├── Registry .................... DEMO-001                │  │
│  │      │                                                         │  │
│  │      ├── Authorization ............... Not Recorded            │  │
│  │      │                                                         │  │
│  │      └── Decision .................... HOLD_FOR_REVIEW         │  │
│  │                                                                │  │
│  └────────────────────────────────────────────────────────────────┘  │
│                                                                      │
│ Source → Evidence → Registry → Permission → Decision                 │
└──────────────────────────────────────────────────────────────────────┘
```

## 2.3 Visual Hierarchy
1. Headline
2. Verification Trace
3. Short explanatory copy
4. CTA
5. Trust principle footer

## 2.4 Technical Trace Card
Width:
```text
720–780 px
```

Contains:
```text
verification_id
source
visual match
registry reference
authorization state
decision
```

This is demo content only.

## 2.5 Trace Visual Treatment
- Fine 1–2px line
- Purple for AI stage
- Stone purple for registry
- Warm signal on authorization checkpoint
- Semantic state only at final decision

## 2.6 Motion
One-time sequence:
```text
Request enters
→ Match node activates
→ Registry node resolves
→ Authorization pauses
→ Decision appears
```

Total:
```text
~700ms
```

Reduced motion:
instant state reveal.

## 2.7 Mobile

```text
Logo / Login
↓
Headline
↓
Support copy
↓
CTA
↓
Verification Trace
↓
Trust principle
```

The trace becomes vertical.

---

# 3. Screen 03 — Rights Holder Overview v2

## 3.1 Purpose
الإجابة على:
**ما الذي يحدث حول حقوقي الآن؟**

## 3.2 Desktop Composition

```text
┌──────────────────────────────────────────────────────────────────────┐
│ Rights Holder                                    REGISTRY ● Connected│
│                                                                      │
│ ما الذي يحتاج انتباهك الآن؟                                         │
│                                                                      │
│ ┌──────────────────────────────────────────────────────────────────┐ │
│ │ VRF-2041                                         HOLD_FOR_REVIEW │ │
│ │                                                                  │ │
│ │ محاولة استخدام مرتبطة بالمصنف DEMO-001                         │ │
│ │                                                                  │ │
│ │ Marketplace → Match → Registry → Authorization → HOLD           │ │
│ │                                                                  │ │
│ │                                      [ عرض عملية التحقق ]        │ │
│ └──────────────────────────────────────────────────────────────────┘ │
│                                                                      │
│ الحقوق المسجلة                         آخر النشاط                   │
│ ─────────────────────                 ────────────────────────────  │
│ IMG  DEMO-001                         14:32  HOLD                  │
│ IMG  DEMO-002                         13:55  ALLOW                 │
│ IMG  DEMO-003                         12:18  REVIEW                │
│                                                                      │
│ Registry Sync ● Connected                          آخر تحديث 14:31 │
└──────────────────────────────────────────────────────────────────────┘
```

## 3.3 No KPI Cards
Allowed:
```text
12 مصنفًا
2 تنبيهات جديدة
```
as inline editorial annotations.

Not allowed:
```text
4 big metric cards
charts
fake percentages
```

## 3.4 Priority Event
Dominant object.

Must include:
```text
verification id
work reference
marketplace
decision trace
current status
CTA
```

## 3.5 Recent Works
Image-led compact records:
```text
thumbnail
title
registration id
registry source
recent activity
```

## 3.6 Recent Activity
Compact trace list:
```text
time
verification id
work
decision
```

## 3.7 Registry Status
Small persistent status:
```text
REGISTRY
● Connected
Last sync 14:31
```

If unavailable:
```text
REGISTRY
○ Unavailable
Data may not be current
```

## 3.8 Mobile
Order:
```text
Registry status
Priority event
Recent activity
Protected works
Notifications
```

---

# 4. Screen 07 — Verification Details v2

## 4.1 Purpose
Answer:
```text
What happened?
Why?
What evidence exists?
What is the current decision?
```

## 4.2 Desktop Layout

```text
┌─────────────────────────────────────────────────────────────────────────┐
│ VRF-2041   Marketplace Demo   seller_b   14:32:08   PRE-PUBLISH       │
├──────────────────────────┬──────────────────────────┬───────────────────┤
│ SOURCE                   │ REGISTERED REFERENCE     │ VERIFICATION TRACE│
│                          │                          │                   │
│ [Uploaded image]         │ [Registered image]       │ 01 Request    ✓  │
│                          │                          │ 02 Match      ✓  │
│ IMG-REQ-2041             │ DEMO-001                 │ 03 Registry   ✓  │
│                          │                          │ 04 Auth       !  │
│                          │                          │ 05 Decision HOLD │
├──────────────────────────┴──────────────────────────┴───────────────────┤
│ AI EVIDENCE                                                            │
│                                                                         │
│ 0.967                                                                   │
│ درجة تشابه بصري                                                        │
│                                                                         │
│ هذه الدرجة تمثل التشابه البصري فقط وليست احتمال تعدٍ.                  │
├──────────────────────────────────┬──────────────────────────────────────┤
│ REGISTRY                         │ AUTHORIZATION                        │
│ Registration   DEMO-001          │ Seller          seller_b             │
│ Owner          صاحب الحق        │ Status          Not Recorded         │
│ Source         Mock Registry     │                                      │
├──────────────────────────────────┴──────────────────────────────────────┤
│ SYSTEM DECISION                                                         │
│                                                                         │
│ HOLD_FOR_REVIEW                                                         │
│ مطابقة قوية ولم يظهر إذن مسجل للبائع.                                 │
│                                                                         │
│ [ التفاصيل التقنية ]                                                   │
└─────────────────────────────────────────────────────────────────────────┘
```

## 4.3 Column Logic
Desktop:
```text
Source       38%
Reference    38%
Trace        24%
```

At < 1100px:
```text
Source + Reference
Trace below
```

Mobile:
full vertical.

## 4.4 Evidence Image Rules
- no aesthetic crop that changes evidence meaning
- contain by default
- consistent aspect frame
- zoom optional only if implementation supports it later

## 4.5 Similarity
Must display:
```text
0.967
درجة تشابه بصري
```

Never:
```text
96.7% سرقة
96.7% تعدي
```

## 4.6 Trace Stages
```text
REQUEST
VISUAL MATCH
REGISTRY
AUTHORIZATION
DECISION
```

Status:
```text
complete
active
pending
failed
```

## 4.7 Registry Failure
If registry unavailable:

```text
REQUEST        ✓
VISUAL MATCH   ✓
REGISTRY       ×
AUTHORIZATION  —
DECISION       —
```

UI explicitly states:
```text
تعذر الوصول إلى مصدر بيانات التسجيل.
لا يعني ذلك عدم وجود تسجيل.
```

## 4.8 Technical Inspector
Collapsed panel.

```text
verification_id       ver_1005
marketplace_id        market_01
seller_id             seller_b
registration_id       DEMO-001
match_found           true
similarity_score      0.967
authorization_status  not_recorded
decision              hold_for_review
review_status         pending
notification_status   sent
```

Use monospace and LTR.

## 4.9 State Variants

### ALLOW — No Match
```text
No strong match
decision = ALLOW
```

Reference column:
```text
لا يوجد مرجع مسجل مطابق بدرجة كافية
```

### ALLOW — Authorized
```text
Match
Registry found
Authorized
ALLOW
```

### REVIEW
```text
Ambiguous match / unknown authorization
REVIEW
```

### HOLD
```text
Strong match
No recorded authorization
HOLD_FOR_REVIEW
```

---

# 5. Screen 10 — Review Case v2

## 5.1 Purpose
أقوى شاشة في المنتج.

Reviewer sees all relevant evidence while preserving:
```text
source
AI
registry
authorization
system recommendation
human decision
```

## 5.2 Desktop Composition

```text
┌──────────────────────────────────────────────────────────────────────────┐
│ CASE-001 / UNKNOWN AUTHORIZATION                         PENDING REVIEW  │
├──────────────────────────┬──────────────────────────┬────────────────────┤
│ SOURCE                   │ REFERENCE                │ CASE TRACE         │
│                          │                          │                    │
│ [image]                  │ [image]                  │ Request        ✓  │
│                          │                          │ AI Match       ✓  │
│ Marketplace Demo         │ DEMO-001                 │ Registry       ✓  │
│ seller_b                 │ Registry                 │ Authorization  !  │
│                          │                          │ Review         ●  │
├──────────────────────────┴──────────────────────────┴────────────────────┤
│ EVIDENCE GRAPH                                                          │
│                                                                          │
│ Marketplace Request ───────┐                                            │
│                             ├── Visual Match 0.967                       │
│ Registered Work ───────────┘                                            │
│                             │                                           │
│                             ├── Registry: DEMO-001                      │
│                             │                                           │
│ Seller: seller_b ───────────┴── Authorization: Not Recorded             │
├─────────────────────────────────┬────────────────────────────────────────┤
│ SOURCE / REGISTRY               │ SYSTEM ASSESSMENT                     │
│                                 │                                        │
│ Owner                           │ Strong visual match                    │
│ Registration                    │ Authorization not recorded             │
│ Registry source                 │ Recommended: HOLD_FOR_REVIEW           │
├─────────────────────────────────┴────────────────────────────────────────┤
│ HUMAN REVIEW                                                             │
│                                                                          │
│ النظام لم يحسم التعدي قانونيًا.                                        │
│ القرار البشري منفصل عن توصية النظام.                                   │
│                                                                          │
│                                     [ متابعة لاتخاذ القرار ]           │
└──────────────────────────────────────────────────────────────────────────┘
```

## 5.3 Evidence Graph Rules
It may only visualize existing relationships.

Nodes:
```text
Marketplace Request
Uploaded Image
Seller Identity
Visual Verification
Registered Work
Registration ID
Owner
Authorization
Decision
```

No hidden reasoning.

## 5.4 Distinction System

### Source
neutral.

### AI Evidence
purple.

### Registry
stone purple.

### System Assessment
semantic decision color + label.

### Human Review
separate focus section.

## 5.5 CTA
Primary:
```text
متابعة لاتخاذ القرار
```

Secondary:
```text
فتح التفاصيل التقنية
العودة لقائمة المراجعة
```

## 5.6 Partial Evidence
Missing evidence remains visible in spatial position.

Example:
```text
REGISTRY
بيانات المصدر غير متاحة حاليًا
```

Not removed.

## 5.7 Conflict
If two evidence sources conflict:

```text
Source A
vs
Source B
```

System does not auto-resolve.

## 5.8 Mobile
```text
Case context
Source image
Reference image
AI evidence
Evidence graph
Registry
Authorization
System assessment
Human review CTA
```

---

# 6. Shared Context Rail v1

For internal product screens.

Desktop width:
```text
72–84px collapsed
180–220px expanded
```

Collapsed visual:
```text
Logo
—
Overview
Works
Activity
Alerts
—
Registry ●
```

Do not use full wide SaaS sidebar by default.

Reviewer rail:
```text
Logo
—
Queue
—
System status
```

---

# 7. High-Fidelity Status Language

Use exact labels:

```text
مسموح
بحاجة إلى مراجعة
معلّق للمراجعة
```

Technical raw labels may appear only in inspector:
```text
allow
review
hold_for_review
```

---

# 8. Core Microcopy

## Similarity
```text
درجة تشابه بصري
هذه الدرجة لا تمثل احتمال تعدٍ.
```

## No Authorization
```text
لم يظهر إذن مسجل لهذا البائع في البيانات المتاحة.
```

## Review
```text
الحالة تحتاج مراجعة بشرية قبل إكمال القرار.
```

## Registry Unavailable
```text
تعذر الوصول إلى مصدر بيانات التسجيل.
لا يمكن اعتبار ذلك عدم وجود تسجيل.
```

## Hold
```text
تم تعليق النشر لحين اكتمال المراجعة.
```

---

# 9. Motion Spec for Core Screens

## Public
```text
Request node → Match → Registry → Authorization → Decision
```

## Overview
Priority event trace resolves on entry once.

## Verification Details
Trace state reveals progressively.

## Review Case
Evidence relation lines anchor to source/reference.

No looping animations.

---

# 10. Responsive QA Requirements

For every core screen:
```text
1440 desktop
1024 tablet landscape
768 tablet
390 mobile
```

Must verify:
- Arabic line breaks
- technical IDs
- image evidence
- trace continuity
- no horizontal overflow
- no hidden CTA
- no clipped source labels

---

# 11. High-Fidelity Engineering Mapping

Every visual block maps to data:

| UI Block | Data |
|---|---|
| Request header | verification.id / marketplace / seller / timestamp |
| Source image | uploaded_image_url |
| Reference | matched_image_url |
| Visual match | similarity_score / match_found |
| Registry | registration_id / registered_owner |
| Authorization | authorization_status |
| Decision | decision |
| Trace | trace[] |
| Review | review_status |
| Notification | notification_status |

No decorative data.

---

# 12. Figma Naming Convention

```text
SCREEN / 01 Public Entry / Desktop
SCREEN / 01 Public Entry / Mobile

SCREEN / 03 Rights Holder Overview / Desktop
SCREEN / 03 Rights Holder Overview / Mobile

SCREEN / 07 Verification Details / Desktop
SCREEN / 07 Verification Details / Mobile

SCREEN / 10 Review Case / Desktop
SCREEN / 10 Review Case / Mobile
```

Subsections:
```text
SECTION / Header
SECTION / Trace
SECTION / Evidence
SECTION / Registry
SECTION / Authorization
SECTION / Decision
```

Components:
```text
CMP / Verification Trace
CMP / Evidence Pair
CMP / Registry Record
CMP / Authorization State
CMP / Decision State
CMP / Source Label
CMP / Technical Inspector
```

---

# 13. Approval Checklist

Core screen is not approved unless:

- [ ] visually distinct from generic SaaS
- [ ] exact source/AI/registry/system separation
- [ ] decision trace visible
- [ ] no unsupported functionality
- [ ] RTL correct
- [ ] mobile designed separately
- [ ] technical IDs readable
- [ ] semantic status not color-only
- [ ] similarity wording correct
- [ ] registry failure is not mistaken for no match
- [ ] evidence images are not distorted
- [ ] all CTAs map to real navigation/state
- [ ] reduced motion still understandable

---

# 14. Stage Position

This file defines the **High-Fidelity specification** for the four signature screens.

It does not replace visual QA.

The High-Fidelity stage is complete only when:
1. all 12 screens are designed,
2. all core screen variants are implemented,
3. Desktop/Mobile/RTL QA is complete,
4. visual screenshots are reviewed,
5. approved screens match this specification.

---

# 15. Next Work After These Four Screens

After visual approval of the four signature screens:

```text
02 Login
04 Protected Works
05 Work Details
06 Usage Activity
08 Notifications
09 Review Queue
11 Review Decision
12 Decision Confirmation
```

These should inherit the established visual grammar rather than inventing new visual languages.
