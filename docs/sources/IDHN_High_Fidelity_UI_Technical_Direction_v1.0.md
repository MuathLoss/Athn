# إذن | IDHN
## High-Fidelity UI Technical Direction
**Version:** 1.0  
**Status:** Source candidate — requires visual QA before final approval  
**Purpose:** رفع مستوى الواجهة من “منتج قانوني جميل” إلى “منتج LegalTech تقني متقدم” مع الحفاظ على البساطة، الثقة، والوضوح.

---

# 0. القرار التصميمي الجديد

واجهة «إذن» يجب أن تُظهر أن المنتج **نظام تحقق متكامل** وليس Dashboard أو Landing Page تجميلية.

المستخدم يجب أن يشعر بصريًا أن هناك طبقات حقيقية تعمل:

```text
Marketplace Request
      ↓
Image / Content Input
      ↓
Visual Verification
      ↓
Registry Lookup
      ↓
Authorization State
      ↓
Decision
      ↓
Review / Audit
```

لكن هذه البنية التقنية لا تُعرض كـdeveloper console، بل تُترجم إلى **Evidence-driven UI** ذكي وواضح.

---

# 1. مبدأ الهوية التقنية

## 1.1 Technical, not Cyberpunk

التقنية تظهر عبر:
- Structured traces
- source labels
- IDs
- timestamps
- registry states
- relationship lines
- evidence layers
- request lifecycle
- system state transitions
- audit context
- compact technical inspector

ولا تظهر عبر:
- Neon
- Matrix grids
- binary backgrounds
- robot/brain icons
- fake terminal visuals
- meaningless code decorations

---

# 2. Product-Specific Visual Grammar

## 2.1 Signal Line

الخط الأفقي الموجود في الشعار يصبح **Verification Signal**.

وظيفته:
- يربط source بالreference.
- يمر عبر مراحل الفحص.
- يتوقف عند نقطة تحتاج مراجعة.
- يصل إلى decision node.

لا يستخدم كزخرفة عامة.

---

## 2.2 Verification Node

العقدة الموجودة في الشعار تتحول إلى عنصر وظيفي متكرر.

يمكن أن تمثل:
- active verification step
- registry checkpoint
- authorization checkpoint
- decision state

الحجم والحالة يتغيران حسب أهمية اللحظة.

---

## 2.3 Evidence Layers

شكل الطبقات في الشعار يستخدم في:
- Uploaded content
- Registered reference
- Registry source
- Authorization context

كل طبقة تحمل **Source Label** واضح.

---

# 3. Trust Architecture داخل الواجهة

أي شاشة Evidence يجب أن تميز 5 أنواع بيانات:

```text
01 SOURCE
02 AI INFERENCE
03 REGISTRY DATA
04 SYSTEM DECISION
05 HUMAN DECISION
```

## Visual treatment

### SOURCE
Neutral / Ink  
مثال:
`Marketplace Request`

### AI INFERENCE
Royal Purple  
مثال:
`Visual Similarity: 0.967`

### REGISTRY DATA
Stone Purple / structured source panel  
مثال:
`Registration ID: DEMO-001`

### SYSTEM DECISION
Semantic state  
مثال:
`HOLD_FOR_REVIEW`

### HUMAN DECISION
Separate confirmation layer  
لا يُدمج مع قرار النظام بصريًا.

---

# 4. Screen 01 — Public Entry / Technical Hero v2

## الهدف
إثبات فكرة المنتج خلال ثوانٍ بدون صفحة تسويق تقليدية.

## Composition

```text
┌─────────────────────────────────────────────────────────────────┐
│ IDHN                                           [تسجيل الدخول]   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│                                          منصة تحقق قبل النشر     │
│                                   تحقق قبل أن يحدث الضرر        │
│                                                                 │
│                       وصف قصير جدًا                             │
│                                                                 │
│                               [تسجيل الدخول]                    │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ LIVE VERIFICATION TRACE                                   │  │
│  │                                                           │  │
│  │ Marketplace Request                                      │  │
│  │ IMG-REQ-2041                                              │  │
│  │         │                                                 │  │
│  │         ├──── Visual Match ──── 0.967                    │  │
│  │         │                                                 │  │
│  │         ├──── Registry ──────── DEMO-001                 │  │
│  │         │                                                 │  │
│  │         ├──── Authorization ─── Not Recorded             │  │
│  │         │                                                 │  │
│  │         └──── Decision ──────── HOLD FOR REVIEW          │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                 │
│ Source → Evidence → Registry → Permission → Decision            │
└─────────────────────────────────────────────────────────────────┘
```

## لماذا أقوى؟
الزائر لا يرى رسمًا رمزيًا فقط؛ يرى **كيف يعمل المنتج** خلال 5 ثوانٍ.

## Hero copy
Primary:
**تحقق قبل أن يحدث الضرر**

Support:
**«إذن» يربط المطابقة البصرية ببيانات التسجيل والإذن قبل نشر الصورة في منصة التجارة الإلكترونية.**

## Technical Microcopy
```text
VERIFICATION ID   VRF-2041
SOURCE            Marketplace
STATUS            Pre-Publish
```

هذه تفاصيل demo/visual فقط ولا تدعي اتصالًا حقيقيًا.

---

# 5. Screen 03 — Rights Holder Overview v2

## الفكرة
ليست Dashboard.

هي **Rights Control Surface**.

## السؤال الرئيسي
**ما الذي يحدث حول حقوقي الآن؟**

## Composition

```text
┌───────────────────────────────────────────────────────────────┐
│ عبدالله / Rights Holder               Registry ● Connected   │
├───────────────────────────────────────────────────────────────┤
│                                                               │
│  أهم حدث الآن                                                 │
│                                                               │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │ VRF-2041                                                │  │
│  │ محاولة استخدام مرتبطة بـ DEMO-001                     │  │
│  │                                                         │  │
│  │ Marketplace → Visual Match → Authorization → HOLD      │  │
│  │                                                         │  │
│  │                     [عرض عملية التحقق]                 │  │
│  └─────────────────────────────────────────────────────────┘  │
│                                                               │
│  الحقوق المسجلة                              آخر النشاط       │
│                                                               │
│  IMG / DEMO-001                              14:32 HOLD       │
│  IMG / DEMO-002                              13:55 ALLOW      │
│  IMG / DEMO-003                              12:18 REVIEW     │
│                                                               │
│  Registry Sync                                             ✓  │
└───────────────────────────────────────────────────────────────┘
```

## Technical Layer
بدل KPI cards:
- inline counters
- latest request IDs
- registry connection state
- verification outcomes
- timestamps

## ممنوع
- Donut charts
- fake analytics
- “AI Accuracy 98%”
- numbers without operational value

---

# 6. Screen 07 — Verification Details / Core Technical Screen

هذه الشاشة يجب أن تجعل الحكم يشعر أن المنصة **حقيقية وقابلة للتطبيق**.

## Desktop Composition

```text
┌──────────────────────────────────────────────────────────────────────────┐
│ VRF-2041     Marketplace Demo     seller_b     14:32:08                │
│ PRE-PUBLISH VERIFICATION                                                │
├─────────────────────────────┬─────────────────────────────┬──────────────┤
│ SOURCE                      │ REGISTERED REFERENCE        │ TRACE        │
│                             │                             │              │
│ [uploaded image]            │ [registered image]          │ 01 Request   │
│                             │                             │    ✓         │
│ request_ref                 │ registration_id             │ 02 Match     │
│ IMG-REQ-2041                │ DEMO-001                    │    ✓         │
│                             │                             │ 03 Registry  │
│                             │                             │    ✓         │
│                             │                             │ 04 Auth      │
│                             │                             │    !         │
│                             │                             │ 05 Decision  │
│                             │                             │    HOLD      │
├─────────────────────────────┴─────────────────────────────┴──────────────┤
│                                                                          │
│ VISUAL EVIDENCE                                                          │
│                                                                          │
│ 0.967                                                                    │
│ درجة تشابه بصري                                                         │
│                                                                          │
│ هذه الدرجة تمثل التشابه البصري وليست احتمال تعدٍ.                       │
│                                                                          │
├───────────────────────────────────┬──────────────────────────────────────┤
│ REGISTRY                          │ AUTHORIZATION                        │
│                                   │                                      │
│ Registration     DEMO-001         │ Seller           seller_b           │
│ Owner            صاحب الحق       │ Status           Not Recorded       │
│ Source           Registry         │                                      │
│                                   │                                      │
├───────────────────────────────────┴──────────────────────────────────────┤
│ SYSTEM DECISION                                                          │
│                                                                          │
│ HOLD_FOR_REVIEW                                                          │
│ مطابقة قوية ولم يظهر إذن مسجل للبائع.                                  │
│                                                                          │
│ [عرض التفاصيل التقنية]                                                  │
└──────────────────────────────────────────────────────────────────────────┘
```

---

# 7. Verification Details — Technical Inspector

Collapsed by default.

```text
TECHNICAL INSPECTOR

verification_id       ver_1005
marketplace_id        market_01
seller_id             seller_b
registration_id       DEMO-001

match_found           true
similarity_score      0.967
authorization_status  not_recorded
decision              hold_for_review

review_status          pending
notification_status    sent
```

## قاعدة
هذا inspector يجعل المنتج تقنيًا وقابلًا للفهم من الفريق والحكم، بدون إفساد الواجهة الأساسية.

---

# 8. Screen 10 — Review Case / Evidence Command Center

هذه الشاشة يجب أن تكون أقوى شاشة في المنتج.

## Composition

```text
┌───────────────────────────────────────────────────────────────────────────┐
│ CASE-001 / UNKNOWN AUTHORIZATION                         PENDING REVIEW   │
├────────────────────────────┬────────────────────────────┬─────────────────┤
│ SOURCE                     │ REFERENCE                  │ CASE TRACE      │
│                            │                            │                 │
│ [image]                    │ [image]                    │ Request      ✓ │
│                            │                            │ AI Match     ✓ │
│ Marketplace                │ Registry                   │ Registry     ✓ │
│ seller_b                   │ DEMO-001                   │ Permission   ! │
│                            │                            │ Review       ● │
├────────────────────────────┴────────────────────────────┴─────────────────┤
│                                                                           │
│ EVIDENCE GRAPH                                                            │
│                                                                           │
│ Marketplace Request ─────┐                                                │
│                           ├── Visual Match 0.967                           │
│ Registered Work ─────────┘                                                │
│                           │                                               │
│                           ├── Registry: DEMO-001                          │
│                           │                                               │
│ Seller: seller_b ─────────┴── Authorization: Not Recorded                 │
│                                                                           │
├────────────────────────────────┬──────────────────────────────────────────┤
│ SOURCE / REGISTRY              │ SYSTEM ASSESSMENT                        │
│                                │                                          │
│ owner                          │ Strong visual match                      │
│ registration                   │ Authorization not recorded               │
│ registry source                │ Recommended: HOLD_FOR_REVIEW             │
│                                │                                          │
├────────────────────────────────┴──────────────────────────────────────────┤
│ HUMAN REVIEW                                                             │
│                                                                           │
│ النظام لم يحسم التعدي قانونيًا.                                         │
│ القرار البشري منفصل عن استنتاج النظام.                                  │
│                                                                           │
│                                      [متابعة لاتخاذ القرار]              │
└───────────────────────────────────────────────────────────────────────────┘
```

---

# 9. Evidence Graph

ميزة بصرية أساسية وليست وظيفة جديدة.

هي طريقة لعرض البيانات الموجودة أصلًا:

```text
Marketplace Request
       │
       ├───────────── Uploaded Image
       │
       ├───────────── Seller Identity
       │
       ↓
Visual Verification
       │
       ├───────────── Similarity
       ↓
Registered Work
       │
       ├───────────── Registration ID
       ├───────────── Owner
       ↓
Authorization
       │
       ↓
Decision
```

لا تضيف reasoning أو بيانات غير موجودة.

---

# 10. System Status Language

بدل badges عامة فقط:

```text
SYSTEM
● Operational

REGISTRY
● Connected

REQUEST
● Verified source

AI MATCH
● Completed

AUTHORIZATION
● Not recorded

REVIEW
● Pending
```

كل status يجب أن يكون:
- text
- symbol
- color secondary

وليس اللون وحده.

---

# 11. IDs as Visual Texture

لأن المنتج تقني، الـIDs جزء من الهوية وليس شيء مخفي.

يمكن عرض:
```text
VRF-2041
DEMO-001
seller_b
market_01
14:32:08
```

Typography:
- Inter / Monospace
- small
- muted
- LTR

لكن لا نملأ كل الشاشة بالـIDs.

---

# 12. System Rail

بدل Sidebar SaaS تقليدي:

يمكن استخدام **Context Rail** بعرض صغير.

```text
[logo]

● Overview
○ Works
○ Activity
○ Alerts

────────
Registry ●
```

خصائصه:
- narrow
- low visual weight
- collapsible
- not full navigation dashboard

---

# 13. Loading as System State

بدل spinner:

```text
Request received        ✓
Visual verification     ●
Registry lookup         ○
Authorization check     ○
Decision                ○
```

هذا يعرض progress حقيقي فقط إذا الـbackend يرسل المراحل.

قبل توفره:
استخدم generic:
```text
جارٍ التحقق من الطلب...
```

ولا تزيف progress.

---

# 14. Error Architecture

الأخطاء ليست كلها “حدث خطأ”.

## Backend unavailable
```text
تعذر إكمال عملية التحقق.
```

## Registry unavailable
```text
تعذر الوصول إلى مصدر بيانات التسجيل.
لا يمكن اعتبار ذلك عدم وجود تسجيل.
```

## Permission denied
```text
ليست لديك صلاحية لعرض هذه البيانات.
```

## Conflict
```text
تم تحديث الحالة بعد فتحها.
حدّث البيانات قبل اتخاذ القرار.
```

---

# 15. Mobile Technical Strategy

لا نحاول نقل desktop كما هو.

## Verification
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
Decision Trace
↓
Decision
```

## Reviewer
```text
Case
↓
Evidence
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

# 16. Interaction Density

Desktop:
- dense but calm
- operational information visible
- less decorative whitespace than public page

Reviewer:
- highest density

Rights holder:
- medium density

Public:
- lowest density

---

# 17. Signature Microinteractions

## A. Request enters trace
Marketplace request node activates.

## B. Match relationship
A line connects source to reference.

## C. Registry anchor
Registry evidence expands from the registered reference.

## D. Permission checkpoint
Signal stops briefly on authorization node.

## E. Decision resolution
State resolves once.

No repeated infinite animation.

---

# 18. Engineering-first Design Test

أي شاشة لازم تجيب نعم على هذه الأسئلة:

1. هل يستطيع المهندس معرفة أي data object يغذي كل section؟
2. هل كل state يمكن ربطه بقيمة API واضحة؟
3. هل يمكن استبدال Mock Adapter بـHTTP Adapter بدون redesign؟
4. هل الفرق واضح بين source / AI / registry / system / human؟
5. هل الخطأ الخارجي يظهر كمصدر فشل وليس قرارًا؟
6. هل الواجهة تعمل بدون animation؟
7. هل UI لا يحتوي legal claim اخترعناه؟
8. هل كل CTA له transition معروف؟
9. هل الـIDs والtimestamps تظهر عند الحاجة؟
10. هل الحكم أمام الديمو يستطيع رؤية أن النظام Production-oriented؟

---

# 19. Visual Quality Bar

المنتج لا يعتمد إذا بدا:
- startup landing template
- AI SaaS dashboard
- generic admin panel
- legal website
- purple CRM

الهدف:
**Legal verification infrastructure presented as a premium human-centered product.**

---

# 20. Figma Upgrade Plan

عند استكمال Figma:

## Public Entry
استبدال visual panel الرمزي بـ:
**Live Verification Trace**

## Rights Holder Overview
تحويلها إلى:
**Rights Control Surface**

## Verification Details
تكون:
**Verification Workspace**

## Review Case
تكون:
**Evidence Command Center**

هذه الأربع شاشات تحدد لغة المنتج كلها.

---

# 21. Approval Gate

هذه الوثيقة لا تعتبر High-Fidelity UI final وحدها.

لا بد من:
- Visual implementation
- Desktop QA
- Mobile QA
- RTL QA
- typography QA
- screen screenshot review

بعد ذلك فقط تُعتمد شاشة High-Fidelity كمخرج نهائي.
