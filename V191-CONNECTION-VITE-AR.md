# THE SQUAD v191 — الاتصال وVite المجاني

## Vite
أُضيف إعداد Vite المجاني داخل جذر الموقع:
- `npm install`
- `npm run dev` للتطوير المحلي
- `npm run build` لإنتاج مجلد `dist`
- `npm run preview` لمعاينة نسخة البناء

Vite أداة تطوير وبناء مجانية ومفتوحة المصدر، وليست استضافة ولا TURN ولا خادم إشارات للمكالمات.

## الاتصال
العميل الحالي في `chanse3/calls.js` يستخدم STUN عامًّا، ويحاول طلب TURN من Firebase callable باسم `getCallIceServers` في `europe-west1`.
ملفات هذا الأرشيف لا تتضمن مصدر Cloud Functions الخاص بهذا endpoint؛ لذلك لا يمكن إثبات أن endpoint منشور أو إنشاء بيانات TURN سرية من طرفنا.

لإكمال TURN مجانًا:
1. أنشئ حسابًا مجانيًا لدى مزود TURN مثل Metered.ca، وتحقق من حدود الخطة الحالية.
2. أنشئ بيانات TURN وفق تعليمات المزود.
3. خزّن بيانات الاعتماد في بيئة الخادم فقط، لا في ملفات JavaScript المنشورة.
4. انشر Firebase callable `getCallIceServers` لإرجاع `iceServers` و`relayAvailable`.
5. اختبر مكالمة بين شبكتين مختلفتين، ثم اختبر `iceTransportPolicy: "relay"` في بيئة اختبار.

## الحالة
- لم تتم إضافة أسرار TURN أو مفاتيح API.
- لم يتم الادعاء بتفعيل TURN؛ ذلك يتطلب حساب المزود ونشر وظيفة الخادم.
- لم يتم تشغيل `npm install` أو بناء Vite لعدم توفر اتصال npm registry في بيئة التنفيذ.
- لم يتم إجراء مكالمة حقيقية بين جهازين أو نشر Firebase Functions.
