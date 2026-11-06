# تقرير المرحلة 9 — المكالمات الصوتية والمرئية (v228)

## ما تمت مراجعته
تم الحفاظ على محرك WebRTC الموجود في `site/chanse3/calls.js`، وغرفة المشاركين ثلاثية الأبعاد، ومشاركة الشاشة، وTURN/STUN، وسجل المكالمات الحالي. لم يتم إنشاء محرك مكالمات موازٍ.

## التعديلات
- إظهار حالة الاتصال للمستخدم: تجهيز الاتصال، الاتصال المستقر، انقطاع مؤقت، محاولة إعادة الاتصال، أو فشل الاتصال.
- إضافة فحص مسبق لـ HTTPS ودعم WebRTC والمايك قبل محاولة بدء/قبول المكالمة، مع معالجة رفض صلاحية المايك بدل خطأ JavaScript غير معالج.
- إعادة محاولة ICE مع رسائل حالة أوضح، مع الإبقاء على TURN/STUN الحاليين.
- تحسين إنهاء المكالمات: استخدام `st: end` بدل حذف مستند المكالمة الفردية، وإبقاء سجلها، وإنهاء المكالمة الجماعية عندما يغادر آخر مشارك.
- إغلاق واجهة المكالمة عند وصول حالة النهاية من Firestore، وإخفاء دعوة الجروب المنتهية.
- تشديد قواعد Firestore لإنشاء مستندات المكالمات وإشارات WebRTC، ومنع تعديل مستندات الإشارات بعد إنشائها، وتقييد إشارات المستخدم بالمشاركين.
- إضافة استعلام للمكالمات النشطة فقط (ring/live) مع فهرس Firestore مركّب حتى لا تتراكم سجلات المكالمات المنتهية داخل حدّ الاستعلام.
- تحديث إعدادات Firebase الثلاثة لتشير إلى ملف الفهارس، بالإضافة إلى manifest وService Worker ونسخ قواعد Firestore.

## الملفات المعدلة/المضافة
- `site/chanse3/calls.js`
- `site/v201-3d-calls.css`
- `site/chanse1/firestore.rules`
- `source/The-Squad-v137/chanse1/firestore.rules`
- `FIRESTORE-RULES-v217.rules` و`site/chanse4/FIRESTORE-RULES-v217.rules` (نسخ قواعد متزامنة)
- `FIRESTORE-RULES-v228.rules` و`site/chanse4/FIRESTORE-RULES-v228.rules` (نسخ المرحلة)
- `site/sw.js`
- `firestore.indexes.json`
- `firebase.json` و`backend/firebase.json` و`site/chanse4/firebase.json`
- `site/version.json` و`site/chanse4/version.json`
- `package.json` و`site/package.json`
- `scripts/v228-call-lifecycle-check.mjs`
- `PHASE9-CALLS-REPORT-v228-AR.md`

## حدود الاختبار
الاختبارات الآلية هنا تتحقق من سلامة التعديلات والربط والملفات، ولا تثبت نجاح اتصال WebRTC بين أجهزة فعلية. لم يتم نشر قواعد Firebase أو فهرس المكالمات المركّب، ولم يتم توفير بيانات TURN حية أو تشغيل Firebase Emulator، ولم يتم اختبار مكالمة حقيقية بين حسابين أو على أجهزة محمولة. كما أن `npm run build` قد يتعذر إذا لم تكن تبعيات Vite مثبتة في البيئة.
