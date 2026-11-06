import fs from 'node:fs';
import assert from 'node:assert/strict';
const r=p=>fs.readFileSync(`site/${p}`,'utf8');
const html=r('index.html'),css=r('v203-design-system.css'),js=r('v203-design-system.js'),sw=r('sw.js');
// wiring
assert.match(html,/<link rel="stylesheet" href="v203-design-system\.css">/);
assert.match(html,/<script src="v203-design-system\.js" defer><\/script>/);
assert.ok(html.indexOf('v203-design-system.css')<html.indexOf('v202-portal-login.css'),'tokens load before v202 layers');
for(const f of ['v202-portal-login.css','v202-portal-login.js','v202-social-feed.css','v202-social-feed.js','v203-design-system.css','v203-design-system.js'])assert.ok(sw.includes(`"${f}"`),`precache has ${f}`);
// palette + required design-system parts
for(const t of ['--sq-blue-600','--sq-violet-500','--sq-gold-500','--sq-grad-brand','--sq-ease','--sq-safe-b'])assert.ok(css.includes(t),`token ${t}`);
for(const c of ['.sq-btn','.sq-btn--primary','.sq-card','.sq-input','.sq-chip','.sq-avatar','.sq-icon','.sq-skeleton','.sq-toast','.sq-grid','.sq-reveal'])assert.ok(css.includes(c),`component ${c}`);
assert.match(css,/prefers-reduced-motion:reduce/);assert.match(css,/html\.squad-lite/);assert.match(css,/hover:none\) and \(pointer:coarse/);assert.match(css,/max-width:640px/);
// icon set: >= 30 icons, all well-formed, no network/storage/firebase use
const names=[...js.matchAll(/^\s{2}'?([a-z-]+)'?:'</gm)].map(m=>m[1]);
assert.ok(names.length>=30,`icon count ${names.length}`);
assert.equal(new Set(names).size,names.length,'unique icon names');
assert.doesNotMatch(js,/fetch\(|XMLHttpRequest|localStorage|sessionStorage|firebase|eval\(|innerHTML\s*=/);
assert.match(js,/prefers-reduced-motion/);assert.match(js,/squad-lite/);
// version sync
const v=JSON.parse(r('version.json'));assert.deepEqual(v,JSON.parse(r('chanse4/version.json')));
assert.ok(v.build>=206);assert.equal(v.version,`v${v.build}-${v.featureName}`);
assert.ok(Number.parseInt(JSON.parse(r('package.json')).version,10)>=241);
assert.match(sw,/squad-v235-property-room-design-cloud/);assert.doesNotMatch(sw,/squad-v201/);
// every precache file exists
const list=JSON.parse(sw.match(/const F=(\[[\s\S]*?\]);/)[1]);
for(const f of list)if(f!=='./')assert.ok(fs.existsSync(`site/${f}`),`precache exists: ${f}`);
console.log(`V203 DESIGN SYSTEM CHECK PASSED — ${names.length} icons, tokens/components/motion/responsive/a11y present, v202 assets now precached, ${list.length} precache entries valid.`);
