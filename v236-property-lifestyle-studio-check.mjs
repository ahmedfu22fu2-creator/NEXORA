import fs from 'node:fs';
import assert from 'node:assert/strict';
import path from 'node:path';
const root=path.resolve(import.meta.dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const district=read('site/chanse2/district.js'), backend=read('backend/firebase-functions/index.js');
const types=['rug','dining','wardrobe','bookshelf','piano','chandelier'];
for(const type of types){assert.match(district,new RegExp("data-room-add=\\\""+type));assert.match(district,new RegExp("item.type==='"+type+"'"));assert.ok(backend.includes("'"+type+"'"));}
assert.match(district,/roomDecorSnap=true/);assert.match(district,/roomDecorSnapValue/);
for(const direction of ['left','right','up','down'])assert.ok(district.includes("move-"+direction));
for(const p of ['source/The-Squad-v137/chanse2/district.js','the_squad_handoff/TheSquad/src/site/chanse2/district.js','the_squad_handoff/TheSquad/src/source/The-Squad-v137/chanse2/district.js'])assert.equal(read(p),district);
for(const p of ['source/The-Squad-v137/chanse4/firebase-functions/index.js','the_squad_handoff/TheSquad/src/backend/firebase-functions/index.js','the_squad_handoff/TheSquad/src/source/The-Squad-v137/chanse4/firebase-functions/index.js'])assert.equal(read(p),backend);
for(const p of ['site/version.json','site/chanse4/version.json'])assert.ok(JSON.parse(read(p)).build>=242);
console.log('v236 property lifestyle studio checks: PASS');
