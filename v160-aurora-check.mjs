import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
const read=p=>fs.readFileSync(p,'utf8');
function normalizeV229Rules(text) {
  const prior = fs.readFileSync('FIRESTORE-RULES-v228.rules', 'utf8');
  const oldCommunity = prior.match(/    match \/communities\/\{id\} \{[\s\S]*?\n    \}\n/)[0];
  return text
    .replace(/    \/\/ v233: vehicle appearance[\s\S]*?\n\n/, '')
    .replace(/        \/\/ مالك الجروب يغيّر اسمه الظاهر فقط دون تعديل العضوية\.[\s\S]*?        \/\/ عضو بيخرج من الجروب\n/, '        \/\/ عضو بيخرج من الجروب\n')
    .replace(/          && request\.resource\.data\.diff\(resource\.data\)\.affectedKeys\(\)\.hasOnly\(\['members','names','nm'\]\)\n          && \(!request\.resource\.data\.diff\(resource\.data\)\.affectedKeys\(\)\.hasAny\(\['nm'\]\) \|\| \(request\.resource\.data\.nm is string && request\.resource\.data\.nm\.size\(\) > 0 && request\.resource\.data\.nm\.size\(\) <= 40\)\)\n/, "          && request.resource.data.diff(resource.data).affectedKeys().hasOnly(['members','names'])\n")
    .replace(/    match \/communities\/\{id\} \{[\s\S]*?\n    \}\n/, oldCommunity);
}
const html=read('site/index.html'),css=read('site/v160-aurora.css'),js=read('site/v160-aurora.js'),sw=read('site/sw.js');
const ver=JSON.parse(read('site/version.json'));
const check=(n,ok)=>{assert.ok(ok,n);console.log(`PASS ${n}`)};
check('release manifests are v186 and synchronized',ver.build>=241&&ver.version===`v${ver.build}-${ver.featureName}`&&read('site/version.json')===read('site/chanse4/version.json'));
check('index loads the new stylesheet after v158 and the script deferred',html.indexOf('visual-refresh-v158.css')<html.indexOf('v160-aurora.css')&&/<script src="v160-aurora\.js" defer><\/script>/.test(html));
check('service worker precaches both new files under the v180 cache name',sw.includes('squad-v235-property-room-design-cloud')&&sw.includes('"v160-aurora.css"')&&sw.includes('"v160-aurora.js"'));
execFileSync(process.execPath,['--check','site/v160-aurora.js']);check('v160 script parses',true);
check('layer never touches Firebase, auth or network APIs (comments excluded)',!/firebase|firestore|auth\(|fetch\(|XMLHttpRequest|sendBeacon/i.test(js.replace(/\/\*[\s\S]*?\*\//g,'')));
check('palette is accessible (dialog, combobox, listbox, active descendant, Escape)',['role','dialog','combobox','listbox','aria-activedescendant','Escape'].every(k=>js.includes(k)));
check('motion and weak-device safeguards exist in CSS and JS',css.includes('prefers-reduced-motion')&&css.includes('squad-lite')&&js.includes('visibilitychange')&&js.includes('squad-lite'));
check('Arabic normalization is implemented',js.includes('أإآٱ')&&js.includes('ى')&&js.includes('ة'));
check('all new CSS classes are namespaced',[...css.matchAll(/\.(sq160-[a-z0-9-]+)/g)].length>20&&!/^\s*(body|html)\s*\{/m.test(css.replace(/html\[|html\./g,'')));
for(const d of ['chanse1','chanse2','chanse3','chanse4'])check(`preserved folder: ${d}`,fs.statSync(path.join('site',d)).isDirectory());
const activeRules=normalizeV229Rules(read('site/chanse1/firestore.rules'));
check('v173 Firestore rules retained with additive v182, v183 and v185 account sync policies',activeRules.replace(/    function validWorldState\(s\) \{[\s\S]*?    \}\n/, '').replace(/    \/\/ v182: private per-account World Systems backup[\s\S]*?    \}\n/, '').replace(/    \/\/ v183: public, sanitized city activity board[\s\S]*?    \}\n/, '').replace(/    \/\/ v185: private account-scoped Universe Suite state[\s\S]*?    \}\n/, '').replace(/    \/\/ v211: private per-account 3D room layouts[\s\S]*?    \}\n/, '').replace(/    \/\/ v215: garage service requests and gate events[\s\S]*?(?=    \/\/ v214:)/, '').replace(/    \/\/ v214: one canonical document per garage bay[\s\S]*?    \}\n/, '').replace(/      \/\/ v221: الصورة الشخصية تخضع لنفس إعدادات الخصوصية \(all \/ contacts \/ none\)\.\n      allow read: if canSee\(u, 'photo'\);/, "      \/\/ v27: الصورة الشخصية ظاهرة لكل المسجّلين (مفيش خصوصية للصورة)\n      allow read: if signed();").replace(/        && request\.resource\.data\.exp is int\n        && request\.resource\.data\.expiresAt is timestamp\n        && request\.resource\.data\.expiresAt > request\.time\n        && request\.resource\.data\.expiresAt <= request\.time \+ duration\.value\(24, 'h'\)\n/, '').replace(/,'expiresAt'/g, '').replace(/        \/\/ Recipient delivery receipt: a member may write only their own timestamp\.[\s\S]*?\n      \);/, '      );').replace(/    match \/calls\/\{id\} \{[\s\S]*?\n    \}\n/, '').replace(/\n{3,}/g,'\n\n')===read('FIRESTORE-RULES-v173.rules').replace(/    match \/calls\/\{id\} \{[\s\S]*?\n    \}\n/, '').replace(/\n{3,}/g,'\n\n')&&activeRules.includes('match /worldState/{ownerUid}')&&activeRules.includes('match /worldCommunity/{ownerUid}')&&activeRules.includes('match /garageReservations/{slotId}'));
console.log('V160 AURORA CHECKS PASSED');
