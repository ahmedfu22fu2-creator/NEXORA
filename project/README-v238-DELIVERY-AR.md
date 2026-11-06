# THE SQUAD v238 — تسليم المرحلة 19

هذه نسخة تطويرية مبنية على v237، وتحافظ على شجرة المشروع والملفات والأنظمة السابقة.

## التغيير الأساسي
إشعارات فورية لصاحب المنشور عند تلقي إعجاب أو تعليق من عضو آخر، مع قواعد Firestore تتحقق من ملكية المنشور وحالته.

## الملفات الأساسية
- `site/chanse3/social-feed.js`
- `source/The-Squad-v137/chanse3/social-feed.js`
- `FIRESTORE-RULES-v238.rules`
- `site/FIRESTORE-RULES-v238.rules`
- `site/chanse4/FIRESTORE-RULES-v238.rules`
- `site/version.json`
- `site/sw.js`
- `scripts/v238-social-interaction-notifications-check.mjs`

## الاختبار والتشغيل
- Node.js 20.19 أو أحدث.
- `npm install`
- `npm test`
- `npm run build`

لم يتم نشر أي شيء إلى Firebase أو استضافة الموقع من هذه البيئة. انشر قواعد v238 بعد مراجعتها، ثم ملفات الموقع، واختبر بحسابين منفصلين قبل اعتبار المرحلة مفعّلة.
