# إذن | IDHN
## Sitemap & Full Product Flow
**Version:** 1.0  
**Status:** Approved project source  
**Purpose:** المرجع الرسمي لخريطة المنتج والمسارات الرئيسية قبل تصميم الواجهات أو البرمجة.

---

## 1. Sitemap — خريطة المنتج

```text
إذن IDHN
│
├── 01. Public Entry
│      └── تعريف مختصر بالمنصة
│          + تسجيل الدخول / التحقق من الهوية
│
├── 02. Rights Holder Portal
│      │
│      ├── Overview
│      │
│      ├── Protected Works
│      │      └── Work Details
│      │            ├── بيانات المصنف
│      │            ├── بيانات التسجيل
│      │            └── بيانات الإذن المتاحة
│      │
│      ├── Usage Activity
│      │      └── Verification Details
│      │
│      └── Notifications
│
├── 03. Review Console
│      │
│      ├── Review Queue
│      │
│      └── Review Case
│             ├── الصورة المرفوعة
│             ├── الصورة المسجلة
│             ├── Similarity Evidence
│             ├── Registry Evidence
│             ├── Authorization Status
│             ├── Verification Trace
│             └── Human Decision
│
└── 04. System Layer
       │
       ├── Authentication
       ├── Marketplace API
       ├── Rights Registry Integration
       ├── Notification Service
       └── Audit Log
```

---

## 2. رحلة مالك الحق — Rights Holder Flow

```text
يفتح «إذن»
     ↓
تسجيل الدخول / التحقق من الهوية
     ↓
Rights Holder Portal
     ↓
مزامنة المصنفات مع السجل المعتمد
     ↓
Protected Works
     ↓
اختيار مصنف
     ↓
Work Details
     ↓
يشاهد:
بيانات المصنف
+ التسجيل
+ بيانات الإذن
+ عمليات الاستخدام
     ↓
إذا حدثت محاولة استخدام مهمة
     ↓
Notification
     ↓
Verification Details
```

---

## 3. رحلة البائع — Seller Flow

البائع لا يدخل «إذن» مباشرة في المنتج الحقيقي.

```text
البائع
   ↓
يدخل منصة التجارة
Amazon / Noon / غيرها
   ↓
ينشئ منتج
   ↓
يرفع الصورة
   ↓
يضغط نشر
   ↓
Marketplace
توقف النشر مؤقتًا
   ↓
ترسل إلى «إذن»:

Image
+
Verified Seller ID
   ↓
IDHN API
```

**قاعدة ملزمة:**  
Seller ID لا يكتبه البائع يدويًا داخل «إذن» في النظام الحقيقي.  
هوية البائع يجب أن تصل من منصة التجارة الإلكترونية بصورة موثوقة.

---

## 4. رحلة محرك التحقق — Verification Engine Flow

```text
Image + Verified Seller ID
          ↓
       Validation
          ↓
 Visual Verification
          ↓
البحث في الصور المسجلة
          ↓
    هل يوجد Match؟
```

ثم:

```text
           MATCH؟
       ┌─────┴─────┐
       │           │
      لا          نعم
       │           │
       ▼           ▼
    ALLOW      Registry Lookup
       │           ↓
       │     Authorization Check
       │           ↓
       │      هل البائع مأذون؟
       │
       │      ┌────┼──────────┐
       │      │    │          │
       │     نعم  غير واضح    لا
       │      │    │          │
       ▼      ▼    ▼          ▼
    Publish ALLOW REVIEW  HOLD_FOR_REVIEW
              │    │          │
              │    ▼          ▼
              │ Reviewer   تعليق النشر
              │              +
              │          إشعار عند الحاجة
              │
              └───────────────┐
                              ▼
                          Audit Log
```

---

## 5. رحلة المراجع — Reviewer Flow

```text
المراجع يسجل الدخول
        ↓
Review Console
        ↓
Review Queue
        ↓
يفتح Case
        ↓
┌───────────────────────────────┐
│     Verification Workspace    │
│                               │
│ الصورة المرفوعة ←→ المسجلة   │
│                               │
│ Visual Match Evidence         │
│ Registry Evidence             │
│ Authorization Status          │
│ Verification Trace            │
└───────────────────────────────┘
        ↓
يتخذ قرار بشري
        ↓
تحديث الحالة
        ↓
إرجاع النتيجة للـMarketplace
        ↓
Notification عند الحاجة
        ↓
Audit Log
```

---

## 6. Master Product Flow

```text
                  ┌──────────────────────┐
                  │ Authoritative Rights │
                  │       Registry       │
                  └──────────┬───────────┘
                             │
                             ▼
┌──────────────┐       ┌──────────────┐
│ Rights Holder│──────▶│     IDHN     │
│    Portal    │       │     إذن      │
└──────────────┘       └──────┬───────┘
                              ▲
                              │ API
                              │
                       ┌──────┴───────┐
                       │ Marketplace  │
                       │ Seller/Image │
                       └──────┬───────┘
                              │
                              ▼
                      Visual Verification
                              ↓
                       Registry Lookup
                              ↓
                    Authorization Check
                              ↓
             ┌────────────────┼────────────────┐
             ▼                ▼                ▼
          ALLOW             REVIEW      HOLD_FOR_REVIEW
             │                │                │
          Publish       Review Console    Hold Publish
                              │                │
                              └───────┬────────┘
                                      ▼
                               Notifications
                                      ↓
                                  Audit Log
```

---

## 7. المساحات الأساسية المعتمدة

### A. Rights Holder Portal
بوابة مالك الحق لمتابعة المصنفات، الاستخدامات، التنبيهات، وبيانات الإذن المتاحة.

### B. Marketplace Integration Layer
طبقة التكامل بين منصات التجارة الإلكترونية و«إذن».

### C. Review Console
مساحة مخصصة للحالات غير الحاسمة أو التي تحتاج قرارًا بشريًا.

---

## 8. القرارات الأساسية للنظام

- `ALLOW`
- `REVIEW`
- `HOLD_FOR_REVIEW`

**ملاحظة:**  
`similarity_score` هو مؤشر تشابه بصري، وليس احتمال سرقة أو حكمًا قانونيًا.

---

## 9. قاعدة تصميم وتنفيذ ملزمة

لا يُبنى المنتج الحقيقي كواجهة واحدة فيها:

```text
Upload Image
Seller ID
Analyze
```

هذه تصلح فقط كأداة اختبار داخلية أو Demo تقني.

المنتج الحقيقي يجب أن يعكس:

```text
Public / Entry Experience
        ↓
Authentication
        ↓
Role-aware Experience
        ↓
Rights Holder Portal
        OR
Review Console

Marketplace users
        ↓
Marketplace UI
        ↓
IDHN API
```

واجهة التحقق الأساسية يجب أن تكون:
**Evidence Workspace / Verification Trace**

وليست Dashboard SaaS عامة أو متكررة.

---

## 10. أثر هذا الملف على المراحل القادمة

أي خطوة لاحقة في:
- UI/UX
- Figma
- Frontend
- Codex implementation
- Backend contract
- Mock API
- Review workflow
- Marketplace integration

يجب أن تبنى على هذا الملف.

إذا تعارض اقتراح لاحق مع هذه الخريطة، يجب مراجعته قبل اعتماده.

---

## 11. المخرج التالي

بعد اعتماد هذا الملف، المخرج التالي هو:

**Screen Inventory & Screen States**

ويحدد:
- كل شاشة مطلوبة
- هدف الشاشة
- المستخدم الذي يراها
- الإجراء الأساسي
- البيانات المطلوبة
- حالات Loading / Empty / Error / Success / Review / Permission Denied
- ارتباطها بالـMock API والـBackend لاحقًا
