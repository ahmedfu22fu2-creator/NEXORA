# المرحلة 16 — توثيق الحساب عند 5000 متابع (v260)

## الهدف
إضافة شارة توثيق لحساب THE SQUAD عند وصول الحساب إلى 5000 متابع حقيقي، مع منع منح الشارة من المتصفح أو التلاعب بعدّاد المتابعين.

## ما تم تنفيذه
- إضافة Cloud Function باسم `syncProfileVerification` تراقب إنشاء/حذف مستندات `users/{userId}/followers/{followerId}`.
- العدّ يتم من Firestore على الخادم باستخدام Aggregation Count، وليس من رقم يرسله العميل.
- عند وصول العدد إلى 5000 أو أكثر، يكتب الخادم `verified: true` ووقت التوثيق `verifiedAt` داخل `publicProfiles/{userId}`.
- التوثيق يظل قائمًا بعد منحه حتى لو انخفض عدد المتابعين لاحقًا؛ الوصول إلى 5000 هو شرط المنح مرة واحدة.
- إضافة callable باسم `refreshMyProfileVerification` للحسابات التي كانت قد تجاوزت 5000 قبل إصدار v260؛ يتحقق الخادم من هوية المستخدم ويحدّ الطلب مرة كل 6 ساعات.
- إضافة علامة توثيق زرقاء إلى لوحة الملف الشخصي وبطاقة الملف العامة، ولا تظهر إلا عندما تكون قيمة `verified` صادرة من الخادم.
- لا يستطيع العميل كتابة `verified` أو `followerCount`؛ قواعد `publicProfiles` الحالية تسمح للمالك بتعديل الاسم والنبذة والمدينة فقط، بينما Admin SDK يتجاوز القواعد في Cloud Functions.
- تحديث رقم الإصدار إلى v260 ومزامنة مرايا المصدر وملفات التسليم.

## قاعدة التوثيق
التوثيق تلقائي عند `followerCount >= 5000`، ويعتمد على مستندات المتابعة المتبادلة الفعلية داخل Firestore. لا يشمل متابعات القنوات أو أرقامًا يدوية.

## الاختبارات
- `npm test`: PASS — كل سلسلة اختبارات المشروع، بما فيها اختبار v260 الجديد.
- اختبار v260: PASS — 15/15.
- `node --check` لملفات JavaScript المعدلة: PASS.
- `backend/firebase-functions` lint: PASS.
- release integrity: PASS — v260، ومزامنة manifests، و159 عنصر precache صالح.
- مزامنة backend وواجهة الملف الشخصي ومرايا CSS/JS: PASS.
- سلامة أرشيف ZIP: PASS.
- `npm run build`: BLOCKED — Vite غير مثبت في بيئة التنفيذ (`vite: not found`).

## ما لم يتم اختباره / ما يتطلب إجراءً خارجيًا
- لم يتم نشر Cloud Functions إلى Firebase؛ لذلك لا تبدأ الشارة بالعمل على الموقع الحي حتى نشر `backend/firebase-functions/index.js` ضمن مشروع Firebase الصحيح.
- لم يتم اختبار Firebase الحي أو محاكي Firebase أو المتصفح الفعلي.
- لم يتم نشر GitHub Pages.
- Cloud Function trigger يعيد احتساب العدد عند تغيّر مستندات المتابعين، وcallable يعيد فحص الحساب الحالي مرة كل 6 ساعات. يحتاج نشر الدوال إلى صلاحيات مالك/مسؤول مشروع Firebase.

## الملفات الأساسية المعدلة
- `backend/firebase-functions/index.js`
- `site/v199-squad-identity.js`
- `site/v199-squad-identity.css`
- `site/chanse3/accounts.js`
- `site/version.json` و`site/chanse4/version.json`
- `site/sw.js`
- `scripts/v260-profile-verification-check.mjs`
- `package.json` وملفات اختبارات التوافق السابقة.
