# تقرير THE SQUAD v244 — تأمين تغيير كلمة المرور والجلسات

## نطاق الدفعة
- تحسين مسار تغيير كلمة المرور داخل إعدادات الحساب.
- اشتراط إعادة التحقق من كلمة المرور الحالية قبل التغيير باستخدام Firebase Authentication.
- رفع الحد الأدنى لكلمة المرور الجديدة إلى 8 أحرف مع اشتراط حرف ورقم.
- منع استخدام عناوين الحسابات الاصطناعية `@squad.id` كأنها بريد إلكتروني قابل لإعادة التحقق.
- معالجة أخطاء Firebase الشائعة برسائل مناسبة، بما فيها كلمة المرور الخاطئة، وضعف كلمة المرور، وانتهاء حداثة تسجيل الدخول، وكثرة المحاولات، وانقطاع الشبكة.
- بعد نجاح التغيير، استدعاء Cloud Function القائمة `revokeMySessions` لإبطال refresh tokens ثم تسجيل خروج الجلسة الحالية محلياً عند نجاح الإبطال.
- إذا تعذر استدعاء وظيفة الإبطال، لا ندّعي إبطال الجلسات؛ تظهر رسالة صريحة بأن تغيير كلمة المرور نجح وأن إنهاء الجلسات الأخرى لم يتأكد.
- تحديث الإصدار إلى v244 وتحديث Service Worker cache namespace ومرايا المصدر وملفات الإصدار المتزامنة.

## ملفات أساسية
- `site/chanse3/settings.js`
- `backend/firebase-functions/index.js` (استخدام الوظيفة الموجودة دون تعديل منطقها)
- `site/version.json`
- `site/chanse4/version.json`
- `site/sw.js`
- `scripts/v244-password-session-check.mjs`

## الاختبارات
- `v243-password-recovery-check.mjs`: PASS
- `v244-password-session-check.mjs`: PASS
- `v241-auth-completion-check.mjs`: PASS
- `v242-email-verification-check.mjs`: PASS
- `release-integrity-check.mjs`: PASS (149 ملف precache صالح، ومزامنة manifests)
- `npm test`: FAIL/BLOCKED بسبب اختبار تاريخي `v158-visual-refresh-check.mjs` ما زال يطلب manifest ثابتاً من v186؛ لم يتم تعطيل الاختبار أو تغيير تاريخه لإخفاء التعارض.
- `npm run build`: BLOCKED لأن Vite غير مثبت في بيئة التنفيذ (`vite: not found`).
- Firebase حي ونشر Cloud Function: NOT TESTED.
- التحقق الفعلي من إبطال الجلسات على أجهزة متعددة: NOT TESTED.

## حدود مهمة
إبطال Firebase refresh tokens لا يلغي بالضرورة كل ID tokens الصادرة بالفعل فوراً؛ قد تظل صالحة حتى انتهاء عمرها المعتاد. كما أن هذه الدفعة لم تنشر أي Cloud Function إلى مشروع Firebase ولم تتصل ببيانات الإنتاج.

## التراجع
النسخة الاحتياطية السابقة لهذه الدفعة هي `THE_SQUAD_v243_PHASE2_PASSWORD_RECOVERY.zip`.
