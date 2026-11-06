# حالة بناء وتسليم THE SQUAD v217

## التغييرات الفعلية في هذه الدفعة
- حجز الموقف أصبح يمر عبر `reserveGarageBay` على Firebase Functions.
- الخادم يتحقق من حالة إغلاق الموقف، ومن عدم ملكية لاعب آخر له، ويضمن حجزاً واحداً فقط لكل حساب داخل Firestore transaction.
- إلغاء الحجز أصبح عبر `releaseGarageBay`.
- Firestore Rules تمنع العميل من إنشاء/تعديل/حذف حجوزات الجراج مباشرة؛ القراءة فقط للحسابات المسجلة.
- تحديث واجهة الجراج والمرايا المصدرية ونسخة قواعد النشر ونسخة Service Worker إلى v217.

## التحقق المحلي
- `node --check backend/firebase-functions/index.js`: PASS
- `node --check site/chanse2/district.js`: PASS
- `node scripts/v217-garage-reservation-check.mjs`: PASS
- `npm test`: PASS، بما في ذلك اختبارات الانحدار السابقة واختبارات الجراج v213-v217.
- `npm run build`: NOT RUN — فشل لأن Vite غير مثبت في بيئة التنفيذ (`vite: not found`).

## غير منفذ/غير مختبر
- لم يتم نشر Firebase Functions أو Firestore Rules إلى مشروع حي.
- لم يتم اختبار الحجز بحسابين حقيقيين/محاكي Firebase.
- أنظمة v216 الأخرى لها حدودها السابقة: حركة Valet والاستدعاء محلية وليست مزامنة authoritative، الكاميرات مناظير داخل جلسة اللاعب فقط بلا بث مركزي أو تسجيل، والبوابة ليست مرتبطة باقتراب المركبة تلقائياً.
- لذلك لا تعتبر أنظمة الجراج الستة مكتملة بعد.

## النشر المطلوب بعد مراجعة إعدادات المشروع
من مجلد `site/chanse4`، وبعد ضبط Firebase project الصحيح وتثبيت الاعتمادات:
- نشر Functions من المصدر المحدد في `firebase.json`.
- نشر Firestore Rules من `../chanse1/firestore.rules`.
يجب اختبار الحسابين والإدارة قبل إتاحة المزايا للمستخدمين.
