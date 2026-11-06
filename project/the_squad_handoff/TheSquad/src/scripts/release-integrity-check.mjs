import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
const root='site';
const manifest=JSON.parse(fs.readFileSync(path.join(root,'version.json'),'utf8'));
assert.ok(manifest.build>=241,'root version manifest must retain the current release baseline');
assert.equal(manifest.version,`v${manifest.build}-${manifest.featureName}`);
const nested=JSON.parse(fs.readFileSync(path.join(root,'chanse4/version.json'),'utf8'));
assert.deepEqual(nested,manifest,'legacy nested manifest must stay in sync');
const sw=fs.readFileSync(path.join(root,'sw.js'),'utf8');
assert.match(sw,/v246-in-game-store/,'service worker cache must include the current release');
const match=sw.match(/const F=(\[[\s\S]*?\]);/);
assert.ok(match,'service worker must expose a static precache list');
const files=JSON.parse(match[1]);
for(const file of files){
 if(file==='./') continue;
 assert.ok(fs.existsSync(path.join(root,file)),`missing Service Worker precache asset: ${file}`);
}
for(const dir of ['chanse1','chanse2','chanse3','chanse4']){
 assert.ok(fs.statSync(path.join(root,dir)).isDirectory(),`missing site/${dir}`);
 assert.ok(fs.statSync(path.join('source/The-Squad-v137',dir)).isDirectory(),`missing source/${dir}`);
}
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
assert.match(html,/fetch\('version\.json'/,'main page must request the root version manifest');
assert.match(html,/A new update is ready/,'release update message must be English');
console.log(`RELEASE INTEGRITY PASSED — v${manifest.build}, root + legacy manifests synced, ${files.length} valid precache entries, all four source/site folders present.`);
