# إذن | IDHN
## High-Fidelity Remaining Screen Specification
**Version:** 1.0  
**Status:** Source candidate — ready for approval  
**Purpose:** إكمال المواصفات التنفيذية عالية الدقة للشاشات الثمانية المتبقية في «إذن»، بحيث تصبح لغة الـHigh-Fidelity مكتملة عبر جميع الشاشات الـ12.

---

# 0. المرجع الملزم

هذا الملف يبني مباشرة على:

- `IDHN_High_Fidelity_Core_Screen_Spec_v1.0`
- `IDHN_High_Fidelity_UI_Technical_Direction_v1.0`
- `IDHN_UI_Composition_and_Screen_Design_Spec_v1.0`
- `IDHN_Complete_Screen_Inventory_and_Mock_Contract_v1.1`
- `IDHN_Sitemap_and_Full_Product_Flow_v1.0`
- `IDHN_Production_Product_Architecture_and_User_Flow_v1.0`
- `IDHN_Brand_Source_Package_v1.0`
- `LegalTech_Creative_UI_Direction_and_Design_Rules_v1`

أي وظيفة أو صلاحية أو تكامل غير مثبت في هذه المصادر لا يتم اختراعه هنا.

---

# 1. Screen 02 — Login / Identity Verification

## 1.1 Purpose
تسجيل المستخدم ثم توجيهه إلى المساحة الصحيحة حسب الدور:

```text
Rights Holder → /portal
Reviewer      → /review
```

## 1.2 High-Fidelity Composition

### Desktop

```text
┌──────────────────────────────────────────────────────────────────────┐
│ LOGO                                                                 │
│                                                                      │
│ ┌─────────────────────────────┬────────────────────────────────────┐ │
│ │ BRAND / SYSTEM CONTEXT      │ AUTHENTICATION                    │ │
│ │                             │                                    │ │
│ │ Content                     │ تسجيل الدخول                       │ │
│ │ ↓                           │                                    │ │
│ │ Verification                │ [ Authentication Provider Area ]   │ │
│ │ ↓                           │                                    │ │
│ │ Permission                  │ [ متابعة تسجيل الدخول ]            │ │
│ │ ↓                           │                                    │ │
│ │ Decision                    │ Status / Error                     │ │
│ │                             │                                    │ │
│ │ “دخول موثق إلى منصة إذن”   │                                    │ │
│ └─────────────────────────────┴────────────────────────────────────┘ │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

## 1.3 Important Constraint
Authentication provider **غير محسوم**.

لذلك:
- لا نعرض شعار نفاذ أو أبشر أو OAuth provider بعينه.
- لا نضع حقول username/password إذا لم يثبت المصدر أنها الآلية النهائية.
- نبني **Authentication Container** مرن يمكن استبداله لاحقًا.

## 1.4 Primary CTA
```text
متابعة تسجيل الدخول
```

## 1.5 Secondary
```text
العودة
```

## 1.6 Visual Behavior
- Composition هادئ ومركز.
- لا يوجد sidebar.
- لا يوجد dashboard context.
- استخدام Verification motif بصري فقط، وليس عملية تحقق وهمية.

## 1.7 States

### Ready
Authentication container visible.

### Loading
- CTA disabled.
- System state text:
```text
جارٍ إكمال تسجيل الدخول...
```

### Invalid / Failed
رسالة واضحة بدون كشف تفاصيل أمنية.

### Success
Role-aware redirect.

### Authentication Expired
```text
انتهت الجلسة.
سجّل الدخول مجددًا للمتابعة.
```

## 1.8 Mobile
Single-column:

```text
Logo
↓
Login context
↓
Authentication container
↓
CTA
↓
Status / Error
```

---

# 2. Screen 04 — Protected Works

## 2.1 Purpose
إيجاد المصنف المسجل بسرعة ثم فتح سجله.

## 2.2 Composition Type
**Image-led Registry Library**

ليست gallery تجارية ولا cards grid تقليدية.

## 2.3 Desktop Composition

```text
┌──────────────────────────────────────────────────────────────────────┐
│ المصنفات المحمية                                  REGISTRY ●         │
│ 12 مصنفًا                                                            │
│                                                                      │
│ Search ____________________________   Filters                         │
├──────────────────────────────────────────────────────────────────────┤
│ IMAGE   TITLE              REGISTRATION       SOURCE        ACTIVITY │
│                                                                      │
│ [img]   صورة المنتج A      DEMO-001           Registry      4        │
│ [img]   صورة المنتج B      DEMO-002           Registry      1        │
│ [img]   صورة المنتج C      DEMO-003           Registry      —        │
└──────────────────────────────────────────────────────────────────────┘
```

## 2.4 Row Anatomy

Each work row contains:
```text
thumbnail
title
registration_id
registry_source
registration_status if available
recent_activity_count
```

## 2.5 Primary Interaction
الصف بالكامل clickable:

```text
فتح المصنف
```

لا نحتاج زر ضخم مستقل لكل صف.

## 2.6 Filters
فقط ما تدعمه البيانات:
- Text search
- Registration ID
- Status if available

Recent activity يمكن استخدامه فقط إن كانت البيانات متوفرة.

## 2.7 Technical Detail
Registration ID يظهر بوضوح كـtechnical anchor:
```text
DEMO-001
```

## 2.8 States

### Loading
Row skeletons بنفس geometry.

### Empty
```text
لا توجد مصنفات مرتبطة بحسابك حاليًا.
```

لا نضيف CTA لإنشاء مصنف لأن هذه الوظيفة غير مثبتة.

### Filtered Empty
```text
لا توجد نتائج مطابقة للفلاتر الحالية.
```

### Sync Unavailable
```text
تعذر تحديث بيانات السجل.
قد لا تكون البيانات الحالية هي الأحدث.
```

### Error
Retry.

### Offline
فقط إذا caching مدعوم فعليًا.

## 2.9 Mobile

```text
Search
Filters
↓
Image
Title
DEMO-001
Registry source
Recent activity
↓
next item
```

No horizontal table squeeze.

---

# 3. Screen 05 — Work Details

## 3.1 Purpose
عرض سجل المصنف ومصدره وبيانات الإذن والنشاط المرتبط به.

## 3.2 Composition Type
**Registry Record + Authorization Relationship**

## 3.3 Desktop Composition

```text
┌──────────────────────────────────────────────────────────────────────┐
│ DEMO-001                                         REGISTRY ● Connected│
├──────────────────────────────┬───────────────────────────────────────┤
│                              │ SOURCE RECORD                         │
│      [ MAIN IMAGE ]          │                                       │
│                              │ صورة المنتج A                         │
│                              │ Registration   DEMO-001              │
│                              │ Owner          مالك حق تجريبي       │
│                              │ Source         Rights Registry       │
│                              │ Registered     2026-11-01            │
├──────────────────────────────┴───────────────────────────────────────┤
│ AUTHORIZATION RELATIONSHIP                                           │
│                                                                      │
│ Work: DEMO-001 ───── Seller A ───── Marketplace Demo ───── Authorized│
├──────────────────────────────────────────────────────────────────────┤
│ RECENT USAGE                                                         │
│                                                                      │
│ VRF-2041   Marketplace Demo   HOLD_FOR_REVIEW   14:32               │
│ ...                                                                  │
│                                                                      │
│                                      [ عرض نشاط الاستخدام ]         │
└──────────────────────────────────────────────────────────────────────┘
```

## 3.4 Source Record
Must label:
```text
REGISTRY DATA
```

وتعرض:
- registration_id
- owner_name
- registry_source
- registered_at if available

## 3.5 Authorization Relationship
لا تعرض كجدول Settings.

تظهر كعلاقة:

```text
Work
→ Seller
→ Marketplace
→ Authorization status
```

Data:
```text
seller_id
seller_name
marketplace
status
valid_from / valid_to if available
```

## 3.6 Primary CTA
```text
عرض نشاط الاستخدام
```

## 3.7 Secondary
- Open Verification
- Back to Protected Works

## 3.8 Important Constraints
لا يوجد:
- Edit ownership
- Add owner
- Change registration
- Claim registration

إلا إذا أضيفت لاحقًا بمصدر معتمد.

## 3.9 States

### Loaded
Full source record.

### Registry Unavailable
Source section remains spatially present:
```text
تعذر الوصول إلى مصدر بيانات التسجيل.
```

إذا عرضت cached/known data يجب توضيح أنها ليست live.

### Permission Denied
Sensitive section hidden.

### Error
Retry.

## 3.10 Mobile
Order:
```text
Image
Source record
Authorization relationship
Recent usage
CTA
```

---

# 4. Screen 06 — Usage Activity

## 4.1 Purpose
متابعة عمليات التحقق والاستخدام المرتبطة بحقوق المستخدم عبر الزمن.

## 4.2 Composition Type
**Verification Activity Stream**

## 4.3 Desktop Composition

```text
┌──────────────────────────────────────────────────────────────────────┐
│ نشاط الاستخدام                                                       │
│ Search __________________________  Decision ▼  Review ▼              │
├──────────────────────────────────────────────────────────────────────┤
│ 14:32:08                                                            │
│ VRF-2041                                                            │
│ Marketplace Demo → seller_b → DEMO-001                              │
│ Request ─ Match ─ Registry ─ Auth ─ HOLD_FOR_REVIEW                 │
│                                                             →       │
├──────────────────────────────────────────────────────────────────────┤
│ 13:55:02                                                            │
│ VRF-2039                                                            │
│ Marketplace Demo → seller_a → DEMO-002                              │
│ Request ─ Match ─ Registry ─ Authorized ─ ALLOW                     │
│                                                             →       │
└──────────────────────────────────────────────────────────────────────┘
```

## 4.4 Row Data
Each activity record exposes:
```text
created_at
verification_id
marketplace
seller
registration_id / work
decision
review_status
notification indicator if relevant
```

## 4.5 Primary CTA
```text
فتح تفاصيل التحقق
```

Interaction on row.

## 4.6 Decision Presentation
Human-readable:
```text
مسموح
بحاجة إلى مراجعة
معلّق للمراجعة
```

Raw enum appears only in technical contexts.

## 4.7 Timeline Logic
Use subtle line/sequence to show process context.

No charts.

## 4.8 States
- Loading
- Empty
- Loaded
- Filtered Empty
- Error

## 4.9 Mobile
Vertical event block:

```text
14:32
VRF-2041
Marketplace Demo
DEMO-001
معلّق للمراجعة
```

Trace can collapse to:
```text
Request → Match → Registry → Hold
```

---

# 5. Screen 08 — Notifications

## 5.1 Purpose
عرض الأحداث المهمة المرتبطة بالحقوق وفتح سياقها.

## 5.2 Composition Type
**Operational Event Stream**

## 5.3 Desktop Composition

```text
┌──────────────────────────────────────────────────────────────────────┐
│ التنبيهات                                        الكل / غير المقروء │
├──────────────────────────────────────────────────────────────────────┤
│ ●  محاولة استخدام تحتاج مراجعة                                 14:33│
│    تم رصد حالة مرتبطة بالمصنف DEMO-001.                           → │
│    VRF-2041                                                         │
├──────────────────────────────────────────────────────────────────────┤
│ ○  تم تحديث حالة المراجعة                                      13:10│
│    ...                                                              │
├──────────────────────────────────────────────────────────────────────┤
│ ○  تعذر تكامل يؤثر على التحقق                                  12:02│
│    ...                                                              │
└──────────────────────────────────────────────────────────────────────┘
```

## 5.4 Supported Notification Types
Only source-defined:
```text
unauthorized_usage
review_started
review_resolved
integration_failure
```

## 5.5 Primary CTA
```text
فتح الحدث
```

Navigation:
```text
verification_id → Verification Details
work_id only → Work Details
```

## 5.6 Read State
Use:
- node emphasis
- typography
- subtle background
- explicit read state if needed

Not purple blocks everywhere.

## 5.7 Secondary
```text
تحديد كمقروء
```

Filter unread/all only if implemented.

## 5.8 Privacy
Notification preview should not expose more sensitive data than necessary.

## 5.9 States
- Loading
- Empty
- Loaded
- Error

## 5.10 Mobile
Full-width event stream.

---

# 6. Screen 09 — Review Queue

## 6.1 Purpose
تمكين المراجع من معرفة أي حالة تحتاج تدخله بسرعة.

## 6.2 Composition Type
**Dense Operational Review Queue**

## 6.3 Desktop Composition

```text
┌────────────────────────────────────────────────────────────────────────┐
│ Review Queue                                                           │
│ Search ______________________ Status ▼ Reason ▼                        │
├─────────┬───────────────┬──────────────┬───────────────┬───────────────┤
│ CASE    │ REASON        │ MARKETPLACE  │ CREATED       │ STATUS        │
├─────────┼───────────────┼──────────────┼───────────────┼───────────────┤
│ 001     │ Unknown Auth  │ Marketplace  │ 14:32         │ Pending       │
│ 002     │ Missing Data  │ Marketplace  │ 14:36         │ In Review     │
│ 003     │ Borderline    │ Marketplace  │ 14:41         │ Pending       │
└─────────┴───────────────┴──────────────┴───────────────┴───────────────┘
```

## 6.4 Row Anatomy
Must include:
```text
case_id
verification_id
reason
status
created_at
marketplace
registration reference if available
priority if backend provides it
```

## 6.5 Primary CTA
```text
فتح الحالة
```

Entire row or contextual action.

## 6.6 Reason Language
UI translates enum into clear text:
```text
borderline_match → تطابق يحتاج مراجعة
unknown_authorization → حالة الإذن غير واضحة
missing_registry_data → بيانات السجل ناقصة
conflicting_registry_data → تعارض في بيانات السجل
other → حالة أخرى للمراجعة
```

## 6.7 Priority
If provided:
- small edge marker
- label

Not giant red alert cards.

## 6.8 States

### Loading
Dense row skeleton.

### Empty
```text
لا توجد حالات تنتظر المراجعة.
```

### Filtered Empty
No results for filters.

### Error
Retry.

### Permission Denied
No case content exposed.

## 6.9 Mobile
Structured case list:

```text
CASE-001
حالة الإذن غير واضحة
Marketplace Demo
14:32
Pending
```

---

# 7. Screen 11 — Review Decision

## 7.1 Purpose
إعداد قرار بشري بشكل منفصل وواضح عن توصية النظام.

## 7.2 Composition Type
**Focused Human Decision Mode**

## 7.3 Desktop Composition

```text
┌──────────────────────────────────────────────────────────────────────┐
│ ← العودة إلى الأدلة                                                 │
│                                                                      │
│ HUMAN REVIEW                                                        │
│ قرار المراجعة                                                       │
│ CASE-001                                                            │
│                                                                      │
│ SYSTEM STATE                                                        │
│ HOLD_FOR_REVIEW                                                     │
│ مطابقة قوية ولم يظهر إذن مسجل للبائع.                              │
│                                                                      │
│ ─────────────────────────────────────────────────────────────────── │
│                                                                      │
│ القرار البشري                                                       │
│                                                                      │
│ ( ) Confirm Allow                                                   │
│ ( ) Confirm Hold                                                    │
│ ( ) Needs More Information                                         │
│                                                                      │
│ ملاحظة                                                              │
│ ┌────────────────────────────────────────────────────────────────┐  │
│ │                                                                │  │
│ └────────────────────────────────────────────────────────────────┘  │
│                                                                      │
│ أثر القرار                                                          │
│ يظهر هنا Preview أولي قبل التأكيد                                  │
│                                                                      │
│                              [ مراجعة القرار قبل التأكيد ]          │
└──────────────────────────────────────────────────────────────────────┘
```

## 7.4 Critical Separation
Visual hierarchy must show:

```text
SYSTEM DECISION
≠
HUMAN DECISION
```

Human control is not pre-selected based solely on system suggestion unless future policy explicitly allows that.

## 7.5 Provisional Decision Values
From approved frontend mock contract:

```text
confirm_allow
confirm_hold
needs_more_information
```

**These are provisional frontend values only.**

They must not be presented as final legal policy.

## 7.6 Primary CTA
```text
مراجعة القرار قبل التأكيد
```

## 7.7 Secondary
- Back to evidence
- Cancel

## 7.8 Note Field
Optional unless future policy makes it required.

Validation must be driven by service/policy configuration, not hardcoded assumptions.

## 7.9 States

### Ready
Decision controls usable.

### Validation Required
Explain missing required input.

### Saving / Preparing Preview
CTA disabled.

### Error
No state mutation.

### Permission Denied
Cannot submit.

## 7.10 Mobile
Single-column focus:
- no queue
- no unrelated navigation
- evidence link remains available

---

# 8. Screen 12 — Decision Confirmation

## 8.1 Purpose
إجبار المستخدم على رؤية **القرار + الأثر** قبل التنفيذ.

## 8.2 Composition Type
**Critical Confirmation Surface**

## 8.3 Desktop Composition

```text
┌──────────────────────────────────────────────────────────────────────┐
│ قرار المراجعة                                                       │
│ CASE-001                                                            │
│                                                                      │
│ HUMAN DECISION                                                      │
│ NEEDS_MORE_INFORMATION                                              │
│                                                                      │
│ ما الذي سيحدث؟                                                      │
│ ─────────────────────────────────────────────────────────────────── │
│ Review status      ستبقى الحالة قيد المراجعة.                       │
│ Marketplace        يبقى النشر معلّقًا لحين اكتمال المراجعة.         │
│ Notification       —                                                │
│                                                                      │
│ AUDIT                                                               │
│ سيتم تسجيل القرار والتغيير في سجل المراجعة.                         │
│                                                                      │
│ [ رجوع للتعديل ]                           [ تأكيد القرار ]          │
└──────────────────────────────────────────────────────────────────────┘
```

## 8.4 Primary CTA
```text
تأكيد القرار
```

## 8.5 Secondary
```text
رجوع للتعديل
إلغاء
```

## 8.6 Effect Preview
Fields are populated from:
```text
effect_summary
marketplace_effect
notification_effect
```

UI does **not invent** downstream effects.

## 8.7 Audit Context
Show that the action is auditable.

Do not claim specific legal evidentiary status.

## 8.8 Conflict State
If case changed after opening:

Replace confirmation action with:

```text
تم تحديث الحالة منذ فتحها.
حدّث البيانات قبل اتخاذ القرار.

[ تحديث البيانات ]
```

No stale submission.

## 8.9 Submitting
- prevent double submit
- disable actions
- clear progress wording

## 8.10 Success
Show concise resolved state:
```text
تم تسجيل القرار.
```

Then:
- updated case
or
- review queue

No confetti.

## 8.11 Error
Do not display success if backend confirmation failed.

## 8.12 Permission Denied
Cannot submit.

---

# 9. Shared Internal Navigation — High-Fidelity

## Rights Holder Context Rail

Collapsed:
```text
IDHN
—
Overview
Works
Activity
Alerts
—
Registry ●
```

Expanded is optional.

Rules:
- low visual weight
- never compete with content
- no giant SaaS sidebar
- current route obvious

## Reviewer Context Rail

```text
IDHN
—
Queue
—
System status
```

No unrelated Rights Holder destinations.

---

# 10. Shared Search & Filter Pattern

Search/filter controls should be:
- compact
- functional
- visually secondary to content

No oversized filter cards.

State:
```text
Search
Filter
Clear
```

Filtered-empty state must preserve active filter visibility.

---

# 11. Shared Data Density Rules

## Public
Low density.

## Rights Holder
Medium density.

## Reviewer
High density.

## Decision screens
Low density + high focus.

This prevents every screen from sharing the same visual rhythm.

---

# 12. Shared Technical Provenance Labels

Use when relevant:

```text
SOURCE
REGISTRY
AUTHORIZATION
SYSTEM
HUMAN REVIEW
```

Not every row needs all labels.

Labels exist to explain origin and responsibility.

---

# 13. Shared State Language

## Loading
No fake percentages.

## Empty
Explain why empty.

## Error
Explain source of failure.

## Registry unavailable
Never equal to:
```text
No registration
```

## Permission denied
Do not expose hidden data.

## Pending review
Workflow state, not generic error.

## Conflict
Stops sensitive action.

---

# 14. Screen-to-Route Mapping

```text
02 Login
/login

04 Protected Works
/portal/works

05 Work Details
/portal/works/:workId

06 Usage Activity
/portal/activity

08 Notifications
/portal/notifications

09 Review Queue
/review

11 Review Decision
/review/cases/:caseId/decision

12 Decision Confirmation
/review/cases/:caseId/confirm
```

Exact route implementation may combine decision/confirm into UI state, but workflow semantics stay unchanged.

---

# 15. High-Fidelity Component Inventory Added by These Screens

```text
CMP / Auth Container
CMP / Registry Work Row
CMP / Authorization Relationship
CMP / Activity Trace Row
CMP / Notification Event
CMP / Review Queue Row
CMP / Human Decision Control
CMP / Decision Effect Preview
CMP / Conflict State
CMP / Registry Status
```

These extend, not replace, the core primitives:

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

# 16. Complete 12-Screen High-Fidelity Inventory

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

---

# 17. High-Fidelity Specification Completion Gate

The **specification layer** is now complete only when both files are approved:

1. `IDHN_High_Fidelity_Core_Screen_Spec_v1.0`
2. `IDHN_High_Fidelity_Remaining_Screen_Spec_v1.0`

Together they define all 12 screens.

This does **not** mean visual implementation QA is complete.

Before moving to frontend implementation, the visual layer still needs:
- screen rendering / Figma implementation
- Desktop review
- Mobile review
- RTL review
- typography review
- state review
- anti-template review

---

# 18. Next Stage After Approval

## High-Fidelity Visual QA & Design Closure

The objective:
- review actual rendered screens
- correct visual hierarchy
- ensure technical depth is visible
- verify no screen looks generic
- validate responsive behavior
- freeze the final visual direction

After that:

## Frontend Implementation — Codex

The frontend is then built against:
- approved screen contracts
- approved mock contracts
- approved high-fidelity specs
- approved design system rules
