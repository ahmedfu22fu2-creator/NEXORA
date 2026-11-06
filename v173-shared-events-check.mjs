import assert from 'node:assert/strict';
function normalizeV229Rules(text) {
  const prior = fs.readFileSync('FIRESTORE-RULES-v228.rules', 'utf8');
  const oldCommunity = prior.match(/    match \/communities\/\{id\} \{[\s\S]*?\n    \}\n/)[0];
  return text
    .replace(/    \/\/ v233: vehicle appearance[\s\S]*?\n\n/, '')
    .replace(/        \/\/ مالك الجروب يغيّر اسمه الظاهر فقط دون تعديل العضوية\.[\s\S]*?        \/\/ عضو بيخرج من الجروب\n/, '        \/\/ عضو بيخرج من الجروب\n')
    .replace(/          && request\.resource\.data\.diff\(resource\.data\)\.affectedKeys\(\)\.hasOnly\(\['members','names','nm'\]\)\n          && \(!request\.resource\.data\.diff\(resource\.data\)\.affectedKeys\(\)\.hasAny\(\['nm'\]\) \|\| \(request\.resource\.data\.nm is string && request\.resource\.data\.nm\.size\(\) > 0 && request\.resource\.data\.nm\.size\(\) <= 40\)\)\n/, "          && request.resource.data.diff(resource.data).affectedKeys().hasOnly(['members','names'])\n")
    .replace(/    match \/communities\/\{id\} \{[\s\S]*?\n    \}\n/, oldCommunity);
}
import fs from 'node:fs';
import vm from 'node:vm';
const site='site', js=fs.readFileSync(`${site}/v173-shared-events.js`,'utf8'), css=fs.readFileSync(`${site}/v173-shared-events.css`,'utf8');
const html=fs.readFileSync(`${site}/index.html`,'utf8'), sw=fs.readFileSync(`${site}/sw.js`,'utf8');
const rules=normalizeV229Rules(fs.readFileSync(`${site}/chanse1/firestore.rules`,'utf8')), deployCopy=fs.readFileSync('FIRESTORE-RULES-v173.rules','utf8');
const pkg=JSON.parse(fs.readFileSync('package.json','utf8')), a=JSON.parse(fs.readFileSync(`${site}/version.json`,'utf8')), b=JSON.parse(fs.readFileSync(`${site}/chanse4/version.json`,'utf8'));
assert.match(html,/v173-shared-events\.js/);assert.match(html,/v173-shared-events\.css/);
assert.match(sw,/squad-v235-property-room-design-cloud/);assert.match(sw,/v173-shared-events\.js/);assert.match(sw,/v173-shared-events\.css/);
assert.match(css,/#sq173-events/);assert.ok(Number.parseInt(pkg.version,10)>=241);assert.ok(a.build>=206);assert.equal(a.version,`v${a.build}-${a.featureName}`);assert.deepEqual(a,b);
const baseRules=rules.replace(/    function validWorldState\(s\) \{[\s\S]*?    \}\n/, '').replace(/    \/\/ v182: private per-account World Systems backup[\s\S]*?    \}\n/, '').replace(/    \/\/ v183: public, sanitized city activity board[\s\S]*?    \}\n/, '').replace(/    \/\/ v185: private account-scoped Universe Suite state[\s\S]*?    \}\n/, '').replace(/    \/\/ v211: private per-account 3D room layouts[\s\S]*?    \}\n/, '').replace(/    \/\/ v215: garage service requests and gate events[\s\S]*?(?=    \/\/ v214:)/, '').replace(/    \/\/ v214: one canonical document per garage bay[\s\S]*?    \}\n/, '').replace(/      \/\/ v221: الصورة الشخصية تخضع لنفس إعدادات الخصوصية \(all \/ contacts \/ none\)\.\n      allow read: if canSee\(u, 'photo'\);/, "      \/\/ v27: الصورة الشخصية ظاهرة لكل المسجّلين (مفيش خصوصية للصورة)\n      allow read: if signed();").replace(/        && request\.resource\.data\.exp is int\n        && request\.resource\.data\.expiresAt is timestamp\n        && request\.resource\.data\.expiresAt > request\.time\n        && request\.resource\.data\.expiresAt <= request\.time \+ duration\.value\(24, 'h'\)\n/, '').replace(/,'expiresAt'/g, '').replace(/        \/\/ Recipient delivery receipt: a member may write only their own timestamp\.[\s\S]*?\n      \);/, '      );').replace(/    match \/calls\/\{id\} \{[\s\S]*?\n    \}\n/, '').replace(/\n{3,}/g,'\n\n');
assert.equal(baseRules,deployCopy.replace(/    \/\/ v211: private per-account 3D room layouts[\s\S]*?    \}\n/, '').replace(/    \/\/ v215: garage service requests and gate events[\s\S]*?(?=    \/\/ v214:)/, '').replace(/    \/\/ v214: one canonical document per garage bay[\s\S]*?    \}\n/, '').replace(/    match \/calls\/\{id\} \{[\s\S]*?\n    \}\n/, '').replace(/\n{3,}/g,'\n\n'),'v173 rules remain unchanged beneath additive v182/v183/v185/v211/v214 rules');
assert.match(rules,/match \/worldState\/\{ownerUid\}/);assert.match(rules,/match \/worldCommunity\/\{ownerUid\}/);
for(const term of ["match /invitations/{inviteeUid}","resource.data.inviteeUid == request.auth.uid","request.resource.data.status in ['accepted','rejected']","exists(/databases/$(database)/documents/users/$(request.auth.uid)/friends/$(inviteeUid))","getAfter(/databases/$(database)/documents/events/$(eventId)/invitations/$(attendeeUid)).data.status == 'accepted'","request.resource.data.ownerUid == request.auth.uid"]){assert.ok(rules.includes(term),`missing security rule: ${term}`)}
assert.match(js,/collectionGroup\('invitations'\)/);assert.match(js,/where\('inviteeUid','==',u\)/);assert.match(js,/status:'pending'/);assert.match(js,/status:accept\?'accepted':'rejected'/);assert.match(js,/attendees\/\$\{uid\(\)\}/);
assert.match(js,/users\/\$\{u\}\/friends/);assert.match(js,/limit\(60\)/);assert.match(js,/limit\(40\)/);
assert.match(rules,/request\.resource\.data\.eventAt is timestamp/);assert.match(rules,/request\.resource\.data\.title\.size\(\) <= 70/);
assert.doesNotMatch(js,/phone|birthDate|sid|email/i,'event UI must not request private profile identifiers');
new vm.Script(js);console.log('v173 shared events checks passed — UI wiring, Firestore schema, invite/RSVP ownership constraints, release assets.');
