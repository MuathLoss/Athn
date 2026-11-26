# إذن

واجهة عربية للتحقق من حقوق الصور قبل النشر. تشمل المدخل العام ورحلتي صاحب الحق والمراجع.

## نقطة الاستئناف

- آخر مرحلة مكتملة: تنفيذ المراجع الخمسة لشاشة الدخول، وصندوق التنبيهات، وسجل المصنفات، ورحلة التحقق من النظرة العامة، ومساحة البائع من الرفع إلى النتيجة.
- آخر فحص: نجحت `build` و`lint` و`typecheck` و19 اختبار Playwright. شملت المراجعة البصرية الواجهات وحالاتها عند 390 و1440 بكسل.
- عند الاستئناف شغّل `npm run dev` من مجلد المشروع وافتح `/login`. بيانات الحسابات المحلية أدناه.
- العمل المتبقي عند توافر أنظمة الإنتاج: ربط مصادقة HTTP، وبوابة السوق، وخدمات التحقق والسجل. إعدادات الربط موثقة في الأسفل.
- الصور والـprompts الأصلية محفوظة في [ملف مراجع الواجهات](docs/ui-inspiration.md).

## التشغيل محليًا

تم التحقق من التشغيل باستخدام Node.js 24. بعد قبول دعوة GitHub، استنسخ المستودع بحسابك وأكمل من فرع عمل.

```sh
git clone https://github.com/Abdullah-MSA/IDHN.git
cd IDHN
git switch -c backend-integration
npm ci
npm run dev
```

افتح الرابط الذي يطبعه Vite. في خادم التطوير دون عنوان API، استخدم [نموذج تسجيل الدخول](http://127.0.0.1:5173/login) بالحسابات المحلية أدناه. يبقى تسجيل الدخول في علامة التبويب بعد إعادة التحميل، وتنهيه وظيفة تسجيل الخروج. يتيح `/_dev` تبديل سيناريو التحقق.

| الحساب المحلي للمطور | كلمة المرور | الوجهة |
| --- | --- | --- |
| `seller@example.test` | `Seller-4826` | `/marketplace/pre-publish` |
| `owner@example.test` | `Owner-4826` | `/portal` |
| `reviewer@example.test` | `Review-4826` | `/review` |

### رحلة البائع في السوق

افتح [واجهة السوق المستقلة](http://127.0.0.1:5173/marketplace/pre-publish) مباشرة بعد تشغيل Vite. إذا اختار Vite منفذًا مختلفًا، استخدم المنفذ الذي يطبعه مع المسار `/marketplace/pre-publish`.

محليًا، ادخل بحساب البائع من النموذج الموحد للوصول إلى محرر السوق. أدخل اسم المنتج واختر صورة أو التقطها وراجع المعاينة، ثم اضغط «التحقق ومتابعة النشر». يعرض التشغيل المحلي دون API نتيجة من بيانات التطوير، ويتطلب النشر الفعلي ربط بوابة السوق.

## الفحوص

```sh
npm run typecheck
npm run lint
npm run build
npx playwright install chromium
npm test
```

اختبارات Playwright تغطي المسارات، وتصفية البيانات، ورفض الوصول، وسيناريوهات التحقق، ومعاينة القرار والتعارض، ورفع صور السوق، وعروضًا من 360 إلى 1920 بكسل، وفحوص axe. يمكن ضبط متغير `IDHN_BROWSER` لاستخدام قناة Chromium مثبّتة محليًا مثل `msedge`.

## المسارات

| المساحة | المسارات |
| --- | --- |
| عام | `/`، `/login` |
| السوق | `/marketplace/pre-publish` |
| صاحب الحق | `/portal`، `/portal/works`، `/portal/works/:workId`، `/portal/activity`، `/portal/verifications/:verificationId`، `/portal/notifications` |
| المراجع | `/review`، `/review/cases/:caseId`، `/review/cases/:caseId/decision`، `/review/cases/:caseId/confirm` |

## ربط الخدمات

### ترتيب التسليم لمطوّر الباك إند

1. شغّل الواجهة محليًا قبل ضبط عناوين API وجرب الحسابات الثلاثة أعلاه لفهم المسارات. انسخ [قالب الإعداد](.env.example) إلى `.env.local` عند بدء الربط. متغيرات `VITE_*` تظهر في كود المتصفح، فاحتفظ بمفاتيح الخدمات والأسرار على الخادم.
2. اربط المصادقة أولًا في [محوّل البوابة](src/services/portal-http.ts). تحقّق من تسجيل الدخول واسترجاع الجلسة وتسجيل الخروج، ومن توجيه كل حساب حسب الدور الذي يرجعه الخادم. استخدم [عقود الخدمات](src/services/contracts.ts) و[نماذج المجال](src/domain.ts) لمواءمة الاستجابات داخل المحوّل.
3. اربط بيانات صاحب الحق والمراجع في المحوّل نفسه. افحص رفض الوصول لحساب غير مخوّل، وتعارض نسخة الحالة إذا تغيّرت أثناء معاينة قرار المراجع.
4. اربط رفع الصورة في [محوّل السوق](src/services/marketplace.ts). افحص السماح، والإحالة للمراجعة، وتعليق النشر، وفشل الخدمة. يستخرج خادم السوق هوية البائع من جلسته ويعيد التحقق من قرار النشر عند تنفيذ العملية في السوق.
5. شغّل الفحوص أعلاه، ثم أعد اختبار هذه الرحلات على بيئة الباك إند الفعلية. اختبارات الواجهة المحلية تستخدم بيانات تطوير. راجع [مصادر المشروع](docs/sources/) للمعنى الوظيفي والقانوني.

- `src/domain.ts` يعرّف عقود المجال مستقلة عن React. تمثل `decision: null` تحققًا بلا نتيجة تشغيلية مكتملة. يستخدم تأكيد المراجعة رقم نسخة الحالة التجريبي لمنع الإرسال من معاينة قديمة.
- `src/services/contracts.ts` يعرّف واجهات المصادقة والمصنفات والتحقق والإشعارات والمراجعة. `src/services/mock.ts` يزوّد التطبيق ببيانات العرض ويطبق حفظ قرارات العرض.
- `src/services/http.ts` يهيئ طلبات HTTP بالجلسة ويحوّل أخطاء الوصول والتعارض إلى حالات الواجهة. يحدد `src/services/portal-http.ts` ربط عمليات البوابات، ويحدد `src/services/marketplace.ts` ربط فحص صورة السوق.
- نتائج المطابقة والتسجيل والإذن والقرار وحالة تسليم الإشعار تأتي عبر الخدمات. تستمد الهوية ودرجة التشابه والنتيجة معناها من [مصادر المشروع](docs/sources/)، وتعرضها الواجهة وفق مصدرها.
- الصور `public/media/ceramic.jpg` و`public/media/submission.jpg` عيّنتان مولّدتان للعرض. الرمز من الحزمة المعتمدة.

### إعداد HTTP

اضبط القيم في `.env.local` وفق `.env.example` قبل تشغيل Vite أو البناء. يفعّل `VITE_IDHN_API_BASE_URL` وضع HTTP في التطوير أيضًا. يستخدم بناء الإنتاج HTTP فقط، ويعرض فقدان الخدمة بوضوح عند غياب ربطها.

- يستخدم النموذج `AuthService.signIn({ identifier, password })`. اضبط `VITE_IDHN_API_BASE_URL` وخريطة المسارات، بما فيها عملية `signIn` من نوع POST إلى نقطة المصادقة الفعلية. يرسل المحوّل البيانات بصيغة JSON. بعد نجاح الطلب وإنشاء جلسة الخادم، يقرأ المحوّل `session` ويتوقع `id` و`name` و`role` بقيمة `seller` أو `rights_holder` أو `reviewer`. تعني HTTP 401 من عملية `signIn` أن بيانات الدخول غير صحيحة. استخدم `signOut` لإنهاء الجلسة على الخادم.
- `VITE_IDHN_API_ROUTES` خريطة JSON من اسم العملية إلى `path` و`method` الاختياري. العمليات هي `session` و`signIn` و`signOut` و`overview` و`works` و`work` و`activity` و`verification` و`notifications` و`markAsRead` و`reviewQueue` و`reviewCase` و`prepareDecision` و`submitDecision`. يمكن تضمين `{id}` في المسار، وترسل المرشحات في الاستعلام. افصل تحويلات استجابات النظام الحقيقي داخل المحوّل. ترجع الحالة خيارات القرار في `available_decisions` وفق سياسة الخادم، وتُرسل النسخة المتوقعة عند التأكيد.
- سطح البائع المستقل في `src/marketplace.tsx` ومساره `/marketplace/pre-publish`. يفتح من حساب البائع داخل السوق لإنشاء بيانات واجهة المنتج أو لتعديل عنوانه إذا أرسله المضيف. عند تهيئة `VITE_MARKETPLACE_SESSION_URL`، يقرأ المحوّل من بوابة السوق حالة `authenticated` وعنوان `productTitle` الاختياري. يستخدم `VITE_MARKETPLACE_LOGIN_URL` للعودة إلى مصادقة السوق عند انتهاء جلسته. في التضمين داخل سوق قائم يمكن للمضيف إنشاء الجلسة قبل فتح الصفحة.
- `VITE_MARKETPLACE_ANALYZE_URL` عنوان بوابة السوق الموثقة. في `src/services/marketplace.ts` ترسل الواجهة `image` بصيغة multipart مع الجلسة. تستخرج البوابة هوية البائع الموثوقة من الجلسة، ثم تكيّف الطلب مع عقد التحليل الفعلي مثل `POST /analyze`. تعرض الواجهة القرار الوارد. عند السماح يظهر رابط `VITE_MARKETPLACE_PUBLISH_URL` إن ضُبط. يتحقق السوق من القرار مرة أخرى عند النشر ويحفظ المنتج في أنظمته.
- وفّر جلسة صالحة لطلبات HTTP الموثقة. يحتاج الربط عبر نطاق مختلف إلى إعداد CORS مع بيانات الاعتماد على الخادم. يعتمد تكامل السجل والإشعارات والتدقيق على الخادم الفعلي.

## مراجع التصميم وأصول العرض

- المدخل يستخدم عنوانًا تحريريًا وصورة منتج محورية. [Awwwards · Waka](https://assets.awwwards.com/awards/gallery/2020/09/live-presentation-jonas-bruno.pdf)
- تعرض بوابة صاحب الحق صفوفًا قابلة للمسح البصري بأولوية للمحتوى. [Linear · UI redesign](https://linear.app/now/how-we-redesigned-the-linear-ui)
- يربط مسار المراجع معاينة الأدلة بتسلسل الحالة ثم الإجراء. [Linear · Triage](https://linear.app/docs/triage) · [Sentry · Improved Breadcrumbs on Issues](https://sentry.io/changelog/improved-breadcrumbs-on-issues/)

أُنشئت العينتان باستخدام ImageGen المدمج.

- `ceramic.jpg` — “A premium realistic product photograph for a demo visual-rights registry. One matte cobalt-blue sculptural ceramic vase with narrow neck, soft off-white studio plinth, cool lavender gray backdrop, directional side light and long shadow. Contemporary editorial product photography, restrained, landscape aspect ratio, centered subject with breathing room. No text or graphics.”
- `submission.jpg` — “Edit this demo rights registry photo into a marketplace submission of the same photo: slightly cropped tighter, horizontally reframed and slightly warmer and brighter, preserve the unmistakable same blue vase, same shape and original photo angle. Landscape. No text.”
