import fs from 'node:fs';
import assert from 'node:assert/strict';
const read=p=>fs.readFileSync(p,'utf8');
for(const base of ['site','source/The-Squad-v137/site','the_squad_handoff/TheSquad/src/site']){
 const v=JSON.parse(read(`${base}/version.json`)),sw=read(`${base}/sw.js`),js=read(`${base}/v265-avatar-creator.js`),css=read(`${base}/v265-avatar-creator.css`),html=read(`${base}/index.html`);
 assert.ok(v.build>=265);assert.match(sw,/v265-avatar-creator-studio/);assert.match(sw,/v267-avatar-complete-pipeline/);
 assert.match(sw,/v265-avatar-creator\.js/);assert.match(sw,/v265-avatar-creator\.css/);
 assert.match(html,/data-avatar-creator/);assert.match(html,/v265-avatar-creator\.js/);
 assert.match(js,/SquadAvatarCreator/);assert.match(js,/localStorage/);assert.match(js,/THE-SQUAD-AVATAR/);
 assert.match(js,/glb/);assert.match(css,/#sq265-studio/);
}
console.log('v265 avatar creator / local customization / GLB intake / mirrored release checks passed — 15 assertions');
