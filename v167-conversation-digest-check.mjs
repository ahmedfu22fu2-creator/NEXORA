import fs from 'node:fs';
import assert from 'node:assert/strict';
const js=fs.readFileSync('site/v166-global-connect.js','utf8');
const sw=fs.readFileSync('site/sw.js','utf8');
const pkg=JSON.parse(fs.readFileSync('package.json','utf8'));
const version=JSON.parse(fs.readFileSync('site/version.json','utf8'));
for(const marker of ['CONVERSATION DIGEST','sq166-digest-source','data-digest','data-copy-digest','function makeDigest','maxlength=\"20000\"','لا يتم حفظ النص أو إرساله إلى خادم']) assert(js.includes(marker),`missing ${marker}`);
assert(js.includes('version:167'));
assert(sw.includes('squad-v235-property-room-design-cloud'));
assert.ok(Number.parseInt(pkg.version,10)>=241);
assert.ok(version.build>=206);
assert.equal(version.version,`v${version.build}-${version.featureName}`);
console.log('v167 Conversation Digest checks passed — local-only extractive summary, follow-up candidates, manual review notice, and release metadata.');


// Run the actual pure function declaration in isolation and check Arabic/English examples.
const fnStart=js.indexOf('function summarizeText(raw){');
const fnEnd=js.indexOf('\nfunction makeDigest()',fnStart);
assert(fnStart>=0&&fnEnd>fnStart,'pure summarizer function must exist');
const summarize=Function(js.slice(fnStart,fnEnd)+'; return summarizeText;')();
const arabic=summarize('اتفقنا على تطوير التطبيق. لازم نختبر تسجيل الدخول غدًا. هل نضيف الترجمة للمكالمات؟');
assert(arabic.includes('اتفقنا على تطوير التطبيق'));
assert(arabic.includes('نقاط متابعة محتملة'));
assert(arabic.includes('أسئلة ظهرت في النقاش'));
const english=summarize('The team will do the interface review tomorrow. We need to test account creation. Should we schedule another meeting?');
assert(english.includes('The team will do the interface review tomorrow'));
assert(english.includes('Should we schedule another meeting?'));
assert.throws(()=>summarize('قصير'),/أضف نصًا/);
console.log('v167 summarizer behavior checks passed — Arabic/English summary, follow-up extraction, question extraction, and minimum-length guard.');
