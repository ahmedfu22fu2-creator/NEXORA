import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';
const root=process.cwd(),site=path.join(root,'site'),js=fs.readFileSync(path.join(site,'v271-privacy-safety.js'),'utf8'),css=fs.readFileSync(path.join(site,'v271-privacy-safety.css'),'utf8'),html=fs.readFileSync(path.join(site,'index.html'),'utf8'),sw=fs.readFileSync(path.join(site,'sw.js'),'utf8'),v=JSON.parse(fs.readFileSync(path.join(site,'version.json'),'utf8'));
const checks=[
['Privacy module and stylesheet loaded',html.includes('v271-privacy-safety.js')&&html.includes('v271-privacy-safety.css')],
['Ghost mode is limited to local public-preview alias',js.includes('getPublicAlias')&&js.includes('لا يغيّر الرسائل أو التعليقات المنشورة')],
['Ghost mode does not bypass moderation or blocks',js.includes('لا يتجاوز الحظر أو الإشراف')],
['Alias is pseudonymous and scoped locally',js.includes('squad.privacySafety.alias.')&&js.includes('عضو-')],
['Audience preference is disclosed as local-only',js.includes('لا يغيّر صلاحيات المنشورات القديمة أو إعدادات خادم Firebase')],
['AI provenance is an author disclosure, not a detector',js.includes('هذه إفادة اختيارية وليست فحصًا تقنيًا')&&js.includes('لا يتم رفع ملفاتك إلى خدمة خارجية')],
['Reports are stored locally and not claimed submitted',js.includes("status:'local-only'")&&js.includes('لم يتم إرسالها إلى فريق الإشراف')],
['Verified-only access is explicitly server-enforced only',js.includes('يتطلب الوصول الحقيقي تحققًا موثوقًا من الخادم')&&js.includes('لا تمنح شارة توثيق')],
['No client-side verified/trust flag assignment',!(/(?:verified|isVerified)\s*=\s*true/.test(js))],
['Accessible dialog, focus and responsive styling',js.includes('aria-modal="true"')&&css.includes(':focus')||css.includes('@media(max-width:600px)')],
['Service worker cache namespace and precache updated',sw.includes('v271-privacy-safety')&&sw.includes('v271-privacy-safety.js')&&sw.includes('v271-privacy-safety.css')],
['Release metadata remains compatible with v271+',v.build>=271]
];for(const [name,ok]of checks){console.log(`${ok?'PASS':'FAIL'} ${name}`);assert.ok(ok,name)}console.log(`v271 Privacy & Safety checks: ${checks.length}/${checks.length} PASS`);
