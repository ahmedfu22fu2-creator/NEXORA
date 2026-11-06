import fs from 'node:fs';
import assert from 'node:assert/strict';
const html=fs.readFileSync('site/chanse3/store.html','utf8');
const mirror=fs.readFileSync('source/The-Squad-v137/chanse3/store.html','utf8');
const fn=fs.readFileSync('backend/firebase-functions/index.js','utf8');
assert.equal(html,mirror,'store source mirror must match deployed site');
for(const token of ['economyGet','economyAction','buyCar','buyEstate','buyApartment','europe-west1','auth.onAuthStateChanged']) assert.ok(html.includes(token),`store missing ${token}`);
for(const token of ["case 'buyCar'","case 'buyEstate'","case 'buyApartment'",'spend(price)','ESTATES[id]','APARTMENTS[id]','CARS[id]']) assert.ok(fn.includes(token),`server economy missing ${token}`);
assert.ok(html.includes('لا توجد مدفوعات بنكية أو تحويلات أموال حقيقية مفعّلة'),'real-money limitation must be explicit');
assert.ok(!/011\d{8,}/.test(html),'personal phone number must not be embedded');
for(const p of ['site/version.json','site/chanse4/version.json','source/The-Squad-v137/version.json','source/The-Squad-v137/chanse4/version.json']){const v=JSON.parse(fs.readFileSync(p,'utf8'));assert.ok(v.build>=246,p+' release regressed below v246'); assert.equal(v.version,`v${v.build}-${v.featureName}`,p+' version metadata mismatch')}
console.log('PASS v246 store: source mirror, Firebase auth/functions integration, server-owned purchase actions, real-money boundary, manifests.');
