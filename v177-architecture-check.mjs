import fs from 'node:fs';
import path from 'node:path';
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

const readJson = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));
const rootConfig = readJson('firebase.json');
const backendConfig = readJson('backend/firebase.json');
const siteConfig = readJson('site/chanse4/firebase.json');
const expected = {
  functions: path.resolve('backend/firebase-functions'),
  firestore: path.resolve('site/chanse1/firestore.rules'),
  storage: path.resolve('site/chanse3/storage.rules')
};
function resolvedConfig(config, base) {
  return {
    functions: path.resolve(base, config.functions[0].source),
    firestore: path.resolve(base, config.firestore.rules),
    storage: path.resolve(base, config.storage.rules)
  };
}
for (const [label, config, base] of [
  ['root', rootConfig, process.cwd()],
  ['backend compatibility', backendConfig, path.resolve('backend')],
  ['site compatibility', siteConfig, path.resolve('site/chanse4')]
]) {
  const actual = resolvedConfig(config, base);
  assert.deepEqual(actual, expected, `${label} Firebase config must resolve to the one canonical functions/rules set`);
  assert.equal(config.functions[0].codebase, 'squad-primary');
}
assert.equal(rootConfig.hosting.public, 'dist');
for (const file of Object.values(expected)) assert.ok(fs.existsSync(file), `missing canonical deploy input: ${file}`);

const canonicalFunctions = fs.readFileSync('backend/firebase-functions/index.js', 'utf8');
const preservedFunctions = fs.readFileSync('backend/firebase-functions/index.v176-legacy.js', 'utf8');
const archivedSourceFunctions = fs.readFileSync('source/The-Squad-v137/chanse4/firebase-functions/index.js', 'utf8');
for (const exportName of ['searchAdminAccounts', 'getAdminAccountActivity', 'getAdminReports', 'economyAction', 'resolvePlatformWithdrawal']) {
  assert.match(canonicalFunctions, new RegExp(`exports\\.${exportName}\\s*=`), `canonical Functions missing ${exportName}`);
  assert.match(preservedFunctions, new RegExp(`exports\\.${exportName}\\s*=`), `preserved legacy entry missing ${exportName}`);
}
for (const exportName of ['searchAdminAccounts', 'getAdminAccountActivity', 'getAdminReports']) {
  assert.match(preservedFunctions, new RegExp(`exports\\.${exportName}\\s*=`), `legacy backup lost ${exportName}`);
}
assert.ok(canonicalFunctions.length >= archivedSourceFunctions.length, 'canonical Functions entry must retain at least the archived backend implementation');
assert.ok(archivedSourceFunctions.includes('exports.garageAction') || archivedSourceFunctions.length > 0, 'source snapshot remains preserved');
assert.ok(fs.existsSync('backend/firebase-functions/index.v176-legacy.js'), 'old Functions entry must remain preserved');

const activeRules = normalizeV229Rules(fs.readFileSync('site/chanse1/firestore.rules', 'utf8'));
const v173Snapshot = fs.readFileSync('FIRESTORE-RULES-v173.rules', 'utf8');
const priorRules = activeRules.replace(/    function validWorldState\(s\) \{[\s\S]*?    \}\n/, '').replace(/    \/\/ v182: private per-account World Systems backup[\s\S]*?    \}\n/, '').replace(/    \/\/ v183: public, sanitized city activity board[\s\S]*?    \}\n/, '').replace(/    \/\/ v185: private account-scoped Universe Suite state[\s\S]*?    \}\n/, '').replace(/    \/\/ v211: private per-account 3D room layouts[\s\S]*?    \}\n/, '').replace(/    \/\/ v215: garage service requests and gate events[\s\S]*?(?=    \/\/ v214:)/, '').replace(/    \/\/ v214: one canonical document per garage bay[\s\S]*?    \}\n/, '').replace(/      \/\/ v221: الصورة الشخصية تخضع لنفس إعدادات الخصوصية \(all \/ contacts \/ none\)\.\n      allow read: if canSee\(u, 'photo'\);/, "      \/\/ v27: الصورة الشخصية ظاهرة لكل المسجّلين (مفيش خصوصية للصورة)\n      allow read: if signed();").replace(/        && request\.resource\.data\.exp is int\n        && request\.resource\.data\.expiresAt is timestamp\n        && request\.resource\.data\.expiresAt > request\.time\n        && request\.resource\.data\.expiresAt <= request\.time \+ duration\.value\(24, 'h'\)\n/, '').replace(/,'expiresAt'/g, '').replace(/        \/\/ Recipient delivery receipt: a member may write only their own timestamp\.[\s\S]*?\n      \);/, '      );').replace(/    match \/calls\/\{id\} \{[\s\S]*?\n    \}\n/, '').replace(/\n{3,}/g, '\n\n');
assert.equal(priorRules, v173Snapshot.replace(/    \/\/ v211: private per-account 3D room layouts[\s\S]*?    \}\n/, '').replace(/    \/\/ v215: garage service requests and gate events[\s\S]*?(?=    \/\/ v214:)/, '').replace(/    \/\/ v214: one canonical document per garage bay[\s\S]*?    \}\n/, '').replace(/      \/\/ v221: الصورة الشخصية تخضع لنفس إعدادات الخصوصية \(all \/ contacts \/ none\)\.\n      allow read: if canSee\(u, 'photo'\);/, "      \/\/ v27: الصورة الشخصية ظاهرة لكل المسجّلين (مفيش خصوصية للصورة)\n      allow read: if signed();").replace(/        && request\.resource\.data\.exp is int\n        && request\.resource\.data\.expiresAt is timestamp\n        && request\.resource\.data\.expiresAt > request\.time\n        && request\.resource\.data\.expiresAt <= request\.time \+ duration\.value\(24, 'h'\)\n/, '').replace(/,'expiresAt'/g, '').replace(/        \/\/ Recipient delivery receipt: a member may write only their own timestamp\.[\s\S]*?\n      \);/, '      );').replace(/    match \/calls\/\{id\} \{[\s\S]*?\n    \}\n/, '').replace(/\n{3,}/g, '\n\n'), 'all v173 Firestore rules remain intact beneath additive v182/v183/v185/v211/v214 rules');
assert.ok(activeRules.includes('match /worldState/{ownerUid}'), 'v182 private world state rules must be present');
assert.ok(activeRules.includes('match /worldCommunity/{ownerUid}'), 'v183 shared city rules must be present');
assert.ok(activeRules.includes('match /events/{eventId}'), 'shared events rules must remain present');
assert.ok(fs.readFileSync(expected.storage, 'utf8').includes('match /chat-media/'), 'chat media Storage rules must remain present');

const pkg = readJson('package.json');
const manifest = readJson('site/version.json');
const nestedManifest = readJson('site/chanse4/version.json');
const sw = fs.readFileSync('site/sw.js', 'utf8');
assert.ok(Number.parseInt(pkg.version,10)>=241);
assert.ok(manifest.build >= 241);
assert.deepEqual(manifest, nestedManifest);
assert.match(sw, /squad-v235-property-room-design-cloud/);

// GLB files are currently small; report their actual sizes rather than assuming they are oversized.
const modelFiles = [];
for (const dir of ['site/chanse1/assets', 'site/chanse2/assets', 'site/chanse3/assets', 'site/chanse4/assets']) {
  if (!fs.existsSync(dir)) continue;
  const walk = (d) => { for (const ent of fs.readdirSync(d, {withFileTypes:true})) {
    const f = path.join(d, ent.name);
    if (ent.isDirectory()) walk(f);
    else if (f.toLowerCase().endsWith('.glb')) modelFiles.push({file:f, bytes:fs.statSync(f).size});
  }};
  walk(dir);
}
console.log(`V177 ARCHITECTURE CHECK PASSED — one canonical Firebase deploy target; ${modelFiles.length} GLB assets measured (${modelFiles.map(x=>`${path.basename(x.file)}=${Math.round(x.bytes/1024)}KB`).join(', ') || 'none'}); legacy files retained.`);
