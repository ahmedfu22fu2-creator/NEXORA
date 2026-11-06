import fs from 'node:fs';
import assert from 'node:assert/strict';
const js=fs.readFileSync('site/v265-avatar-creator.js','utf8');
const calls=fs.readFileSync('site/v201-3d-calls.js','utf8');
const css=fs.readFileSync('site/v265-avatar-creator.css','utf8');
const html=fs.readFileSync('site/index.html','utf8');
const sw=fs.readFileSync('site/sw.js','utf8');
const pkg=JSON.parse(fs.readFileSync('package.json','utf8'));
const checks=[
 ['actual GLB canvas exists',/id="sq266-canvas"/.test(js)],
 ['GLB parser is connected',/loader\.parse\(buffer/.test(js)],
 ['animation clips are played',/AnimationMixer/.test(js)&&/clipAction\(c\)\.play/.test(js)],
 ['morph targets are driven by microphone level',/morphTargetInfluences/.test(js)&&/callAnalyser/.test(js)],
 ['model persists in IndexedDB',/indexedDB\.open\(DB,1\)/.test(js)&&/put\(\{buffer,name/.test(js)],
 ['saved model can be restored',/async function restoreModel/.test(js)],
 ['local model deletion exists',/async function clearModel/.test(js)],
 ['canvas video track is captured',/captureStream\(24\)/.test(js)],
 ['outgoing WebRTC video sender is replaced',/replaceTrack\(callTrack\)/.test(js)],
 ['original camera track is restored',/stopCallAvatar/.test(js)&&/replaceTrack\(x\.track\|\|restore\)/.test(js)],
 ['call UI exposes avatar toggle',/sq267-avatar-toggle/.test(calls)],
 ['avatar stops on call end',/stopCallAvatar\?\.\(currentCall\(\)\)/.test(calls)],
 ['viewer controls styled',/sq266-model-tools/.test(css)&&/sq266-viewer-wrap/.test(css)],
 ['asset versions bumped',/v265-avatar-creator\.js\?v=267/.test(html)&&/v267-avatar-complete-pipeline/.test(sw)],
 ['test is part of npm test',pkg.scripts.test.includes('v267-avatar-complete-pipeline-check.mjs')]
];
for(const [name,ok] of checks){assert.ok(ok,`FAIL ${name}`);console.log(`PASS ${name}`)}
console.log(`PASS v267 complete avatar pipeline ${checks.length}/${checks.length}`);
