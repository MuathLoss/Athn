# إذن | IDHN
## Production Product Architecture & End-to-End User Flow
**Version:** 1.0  
**Status:** Approved project source  
**Purpose:** تثبيت أن «إذن» يُصمَّم ويُبنى كمنتج حقيقي قابل للتشغيل، وليس مجرد Demo أو Prototype شكلي.

---

## 1. القرار الأساسي

منصة «إذن» يجب أن تُعامل من الآن على أنها **منتج Production حقيقي**.

لا يُبنى الـUX أو الـFrontend أو الـBackend على افتراض أن المستخدم يدخل بدون هوية أو أن `Seller ID` يُكتب يدويًا في المنتج النهائي.

يمكن استخدام بيانات تجريبية أو Mock integrations أثناء التطوير والهاكثون، لكن **معمارية المنتج وتجربة المستخدم يجب أن تعكس النظام الحقيقي المستهدف**.

---

## 2. الأطراف الأساسية في النظام

### 2.1 مالك الحق — Rights Holder
مستخدم موثّق داخل «إذن».

يستطيع:
- تسجيل الدخول إلى حسابه.
- الاطلاع على المصنفات/الصور المرتبطة به.
- إدارة بيانات المأذون لهم عند توفر هذه الصلاحية في التكامل المعتمد.
- متابعة محاولات الاستخدام المرتبطة بحقوقه.
- استقبال التنبيهات عند وجود حالة تستدعي الإشعار.
- مراجعة تفاصيل كل عملية تحقق تخص حقوقه بحسب الصلاحيات.

> ملاحظة: مصدر الحق القانوني وبيانات التسجيل يجب أن يأتي من الجهة أو السجل المعتمد. «إذن» لا يخترع الملكية أو يثبتها بذاته.

---

### 2.2 البائع — Seller
في الاستخدام الحقيقي، البائع يعمل داخل منصة التجارة الإلكترونية.

**لا يعتمد النظام النهائي على أن يكتب البائع `Seller ID` بنفسه داخل «إذن».**

هوية البائع يجب أن تصل من منصة التجارة الإلكترونية بصورة موثوقة عند طلب التحقق.

مثال:
```text
Marketplace
   └── authenticated seller_id
       └── sent to IDHN API with the image
```

هذا يمنع انتحال Seller ID لبائع آخر.

---

### 2.3 منصة التجارة الإلكترونية — Marketplace
جهة تكامل رئيسية مع «إذن».

يكون لديها تكامل تقني موثّق مع «إذن»، مثل:
- API credentials
- OAuth / service authentication
- Signed requests
- أو آلية مصادقة مناسبة يتم اعتمادها عند التنفيذ

وظيفتها:
1. توثيق هوية البائع لديها.
2. إرسال الصورة قبل النشر إلى «إذن».
3. إرسال هوية البائع الموثقة والبيانات المطلوبة.
4. استلام قرار الفحص.
5. تطبيق القرار المناسب داخل رحلة نشر المنتج.

---

### 2.4 المراجع — Reviewer
مستخدم داخلي أو جهة مخوّلة بصلاحية مراجعة الحالات غير الحاسمة.

يستخدم **Review Console** مخصصًا للحالات مثل:
- تطابق حدودي.
- بيانات إذن ناقصة.
- تعارض أو نقص في بيانات السجل.
- حالة تحتاج قرارًا بشريًا.

النظام لا يحوّل نتيجة الذكاء الاصطناعي إلى حكم قانوني قطعي.

---

## 3. البوابات الأساسية للمنتج

يتكون المنتج الحقيقي من ثلاث مساحات رئيسية:

### A. Rights Holder Portal
بوابة مالك الحق.

### B. Marketplace Integration Layer
طبقة API تربط منصات التجارة الإلكترونية بـ«إذن».

### C. Review Console
مساحة مراجعة للحالات التي لا يمكن حسمها آليًا.

هذه المساحات لا يلزم أن تستخدم نفس Layout؛ كل مساحة تُصمم حسب مهمتها.

---

## 4. رحلة المستخدم — من البداية إلى النهاية

### المسار الأول: مالك الحق

```text
فتح منصة «إذن»
        ↓
تسجيل الدخول / التحقق من الهوية
        ↓
الدخول إلى Rights Holder Portal
        ↓
استيراد / مزامنة المصنفات المرتبطة به
من السجل أو الجهة المعتمدة
        ↓
عرض المصنفات المسجلة
        ↓
إدارة بيانات الإذن المتاحة
        ↓
متابعة عمليات الاستخدام والتنبيهات
```

---

## 5. رحلة نشر الصورة في منصة التجارة

```text
البائع يسجل دخوله في منصة التجارة
        ↓
ينشئ / يعدّل منتجًا
        ↓
يرفع صورة المنتج
        ↓
يضغط متابعة / نشر
        ↓
Marketplace توقف النشر مؤقتًا لحين التحقق
        ↓
ترسل الصورة + Seller ID الموثق
إلى IDHN Verification API
```

---

## 6. رحلة التحقق داخل «إذن»

```text
Image + Verified Seller ID
        ↓
Validation
        ↓
Visual Verification
        ↓
البحث عن أقرب صورة/مصنف مسجل
        ↓
هل يوجد تطابق موثوق؟
```

### إذا لم يوجد تطابق موثوق
```text
No strong match
      ↓
ALLOW
      ↓
إرجاع القرار للمتجر
      ↓
استكمال النشر
```

### إذا وجد تطابق
```text
Strong match
      ↓
Registry Lookup
      ↓
استرجاع بيانات المصنف والمالك
      ↓
Authorization Check
      ↓
هل البائع مأذون له؟
```

ثم:

```text
Authorized
    ↓
ALLOW
    ↓
استكمال النشر
```

أو:

```text
No recorded authorization
    ↓
HOLD_FOR_REVIEW
    ↓
تعليق النشر
    ↓
إنشاء حالة مراجعة
    ↓
إشعار مالك الحق عند الحاجة
```

أو:

```text
Unknown / Ambiguous
    ↓
REVIEW
    ↓
إرسال الحالة إلى Review Console
```

---

## 7. القرارات الأساسية للنظام

القرارات الأساسية التي يجب أن يدعمها المنتج:

### `ALLOW`
يمكن للمنصة المتكاملة متابعة رحلة النشر.

### `REVIEW`
الحالة غير حاسمة وتحتاج مراجعة.

### `HOLD_FOR_REVIEW`
توجد مطابقة قوية ولا يوجد إذن مسجل أو توجد حالة تستوجب تعليق النشر لحين المراجعة.

> يجب ألا يُعرض `similarity_score` على أنه «احتمال سرقة» أو «نسبة تعدٍ».  
> هو مؤشر تشابه بصري فقط.

---

## 8. ما يجب أن يسجله النظام

كل عملية تحقق حقيقية يجب أن تنشئ سجلًا قابلًا للتدقيق **Audit Log** يتضمن — بحسب ما يسمح به التصميم الأمني والخصوصية:

- Verification ID
- Timestamp
- Marketplace
- Seller identifier
- Image/request reference
- Match result
- Similarity score
- Registration/reference ID
- Authorization status
- System decision
- Review status
- Notification status
- Actor / service responsible for manual actions
- Relevant state changes

الـAudit Log مهم للثقة، التتبع، المراجعة، والتحقيق في الأخطاء.

---

## 9. التنبيهات

عندما تستدعي الحالة ذلك، يستطيع النظام إنشاء Notification Event.

أمثلة:
- محاولة استخدام صورة مسجلة بدون إذن مسجل.
- انتقال الحالة إلى المراجعة.
- صدور قرار مراجعة.
- فشل تكامل يؤثر على عملية التحقق.

في الـPrototype يمكن محاكاة الإشعار، أما المنتج الحقيقي فيحتاج Notification Service فعليًا.

---

## 10. المصادقة والأمان

المنتج الحقيقي يجب أن يميز بين:

### User Authentication
لأصحاب الحقوق والمراجعين والمستخدمين المباشرين.

### Service Authentication
لمنصات التجارة الإلكترونية والأنظمة الخارجية.

ولا يُسمح بالاعتماد على:
- Seller ID مكتوب يدويًا من المستخدم كهوية موثوقة.
- Request غير موثق من Marketplace.
- قرار حساس بلا سجل Audit.

التنفيذ النهائي لآلية المصادقة يعتمد على البنية التقنية والتكاملات المعتمدة.

---

## 11. التكامل مع الجهة المالكة للسجل

المفهوم المستهدف أن بيانات التسجيل والملكية والمأذون لهم تأتي من **سجل أو جهة موثوقة**.

خلال التطوير يمكن استخدام Mock Registry.

لكن يجب الحفاظ على فصل واضح:

```text
Authoritative Rights Registry
          ↓
        IDHN
          ↓
Verification & Authorization Decision Support
```

«إذن» ليس مصدر الحقيقة القانوني للملكية ما لم يُعتمد رسميًا لذلك.

---

## 12. الفرق بين Prototype وProduction

### Prototype / Hackathon
يمكن استخدام:
- Mock registry
- Demo users
- Simulated notifications
- Local backend
- Sample Marketplace UI
- Test API credentials

### Production Target
يحتاج:
- Authentication حقيقي
- Marketplace service authentication
- Rights registry integration
- Persistent database
- Audit logging
- Secure authorization
- Notification service
- Monitoring
- Error handling
- Privacy/security controls
- Reviewer permissions
- Production deployment

**قاعدة المشروع:**  
حتى عندما نستخدم Mock أثناء التطوير، نصمم الـUX والArchitecture على أساس Production Target.

---

## 13. أثر هذا القرار على تصميم الواجهات

لا يُبنى المنتج كصفحة واحدة فيها:
```text
Upload Image
Seller ID
Analyze
```

هذه قد تكون أداة اختبار للمطور فقط.

المنتج الحقيقي يجب أن يعكس على الأقل:

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

واجهة التحقق الرئيسية داخل المنتج يجب أن تكون **Evidence Workspace / Verification Trace**، لا Dashboard SaaS عام.

---

## 14. Master Production Flow

```text
RIGHTS HOLDER
Login
  ↓
Rights Registry Sync
  ↓
Protected Works
  ↓
Permissions / Alerts
  ↓
────────────────────────────────────

MARKETPLACE
Authenticated Seller
  ↓
Upload Product Image
  ↓
Pre-Publish Verification Request
  ↓
IDHN API
  ↓
Visual Match
  ↓
Registry Lookup
  ↓
Authorization Check
  ↓
┌──────────────┬──────────────┬─────────────────┐
│    ALLOW     │    REVIEW    │ HOLD_FOR_REVIEW │
└──────────────┴──────────────┴─────────────────┘
        ↓              ↓               ↓
     Publish       Reviewer        Hold Publish
                       ↓               ↓
                 Human Decision   Notify / Review
                       ↓               ↓
                       └──────┬────────┘
                              ↓
                          Audit Log
```

---

## 15. قاعدة ملزمة للمشروع

أي تصميم، Prompt، Frontend implementation، Backend contract، Figma file، Codex task أو وثيقة مستقبلية لمنصة «إذن» يجب أن تعتبر أن:

> **«إذن» منتج حقيقي Production-oriented وليس مجرد Demo.**

إذا تعارض اقتراح مستقبلي مع هذا الملف، يجب إيقافه ومراجعته قبل اعتماده.

---

## 16. نقاط لم تُحسم بعد

هذا الملف يثبت المعمارية المستهدفة، لكنه لا يفترض أن التكاملات الخارجية أصبحت متاحة فعليًا.

ما يزال يجب حسمه أثناء التنفيذ:
- مزود Authentication النهائي.
- آلية ربط الحسابات بهوية أصحاب الحقوق.
- API الفعلي للجهة/السجل المعتمد إن توفر.
- آلية Authentication الخاصة بالـMarketplace.
- نموذج الصلاحيات الدقيق للمراجعين.
- سياسة الإشعارات.
- سياسة الاحتفاظ بالصور والسجلات.
- الخصوصية والأمن والامتثال.
- سياسة الاستئناف أو الاعتراض على قرارات المراجعة.
- SLAs والتعامل مع فشل خدمات التكامل.

هذه النقاط لا تُخترع في التصميم قبل اعتمادها.
