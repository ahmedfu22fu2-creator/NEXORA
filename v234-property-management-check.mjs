import fs from 'node:fs';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import path from 'node:path';
const root=path.resolve(import.meta.dirname,'..');
const read=(p)=>fs.readFileSync(path.join(root,p),'utf8');
const backend=read('backend/firebase-functions/index.js');
const district=read('site/chanse2/district.js');
assert.match(backend,/case 'selectEstate'/);
assert.match(backend,/case 'selectApartment'/);
assert.match(backend,/!ESTATES\[id\] \|\| !estates\[id\]/);
assert.match(backend,/!APARTMENTS\[id\] \|\| !apartments\[id\]/);
assert.match(backend,/selectedEstate, selectedApartment/);
assert.match(backend,/selectedEstate: typeof d\.selectedEstate === 'string'/);
assert.match(district,/data-primary-estate/);
assert.match(district,/data-primary-apt/);
assert.match(district,/selectPrimaryEstate/);
assert.match(district,/selectPrimaryApartment/);
assert.match(district,/SELECTED_ESTATE=st\.selectedEstate\|\|''/);
assert.match(district,/SELECTED_APARTMENT=st\.selectedApartment\|\|''/);
for (const p of [
 'source/The-Squad-v137/chanse2/district.js',
 'the_squad_handoff/TheSquad/src/site/chanse2/district.js',
 'the_squad_handoff/TheSquad/src/source/The-Squad-v137/chanse2/district.js'
]) assert.equal(read(p),district,`${p} must match deployed district source`);
for (const p of [
 'source/The-Squad-v137/chanse4/firebase-functions/index.js',
 'the_squad_handoff/TheSquad/src/backend/firebase-functions/index.js',
 'the_squad_handoff/TheSquad/src/source/The-Squad-v137/chanse4/firebase-functions/index.js'
]) {
 const s=read(p);
 assert.match(s,/case 'selectEstate'/);
 assert.match(s,/case 'selectApartment'/);
 assert.match(s,/selectedEstate, selectedApartment/);
}
for (const p of ['site/version.json','site/chanse4/version.json']) {
 const v=JSON.parse(read(p)); assert.ok(v.build>=241); assert.equal(v.currentPhase,v.build);
}
assert.match(read('site/sw.js'),/v235-property-room-design-cloud/);
console.log('v234 property management checks passed');
