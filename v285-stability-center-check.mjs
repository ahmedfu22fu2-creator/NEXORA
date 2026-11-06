import fs from 'node:fs';
import assert from 'node:assert/strict';
const js=fs.readFileSync('site/v285-stability-center.js','utf8');
const css=fs.readFileSync('site/v285-stability-center.css','utf8');
const html=fs.readFileSync('site/index.html','utf8');
const sw=fs.readFileSync('site/sw.js','utf8');
const pkg=JSON.parse(fs.readFileSync('package.json','utf8'));
const version=JSON.parse(fs.readFileSync('site/version.json','utf8'));
const checks=[
['public stability API',/window\.SquadStabilityCenter=\{open,close,checks,version:285\}/.test(js)],
['user-initiated diagnostics only',/function open\(/.test(js)&&!/setInterval\(/.test(js)&&/if\(e\.target===panel/.test(js)],
['local storage probe is removed',/localStorage\.removeItem\(k\)/.test(js)],
['privacy notice and no telemetry',/local-only-no-telemetry/.test(js)&&/لا يرسل بيانات/.test(js)],
['Firebase connection is not falsely claimed',/لا تختبر Firebase/.test(js)&&/لا يختبر صلاحية الخدمة أو اتصالها/.test(js)],
['sensitive content is not collected',!/messageBody|privateMessages|chatHistory|password/i.test(js)],
['export is bounded to diagnostic checks',/checks:rows\.map/.test(js)&&!/localStorage\.getItem\([^)]*message/i.test(js)],
['accessible dialog and keyboard close',/role="dialog"/.test(js)&&/aria-modal="true"/.test(js)&&/e\.key==='Escape'/.test(js)],
['responsive diagnostic layout',/@media\(max-width:600px\)/.test(css)],
['HTML loads v285 assets',/v285-stability-center\.css\?v=285/.test(html)&&/v285-stability-center\.js\?v=285/.test(html)],
['service worker precaches v285 assets',sw.includes('v285-stability-center.js')&&sw.includes('v285-stability-center.css')&&sw.includes('squad-v285-stability-center')],
['release metadata and package version',Number(pkg.version.split('.')[0])>=286&&version.build>=286&&/^v(?:286|287|288|289|290|291)-/.test(version.version)],
['test registered in npm test',pkg.scripts.test.includes('v285-stability-center-check.mjs')]
];
for(const [name,ok] of checks){console.log(`${ok?'PASS':'FAIL'} ${name}`);assert.ok(ok,name)}
console.log(`${checks.length}/${checks.length} passed`);
