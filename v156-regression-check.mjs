import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
const root=process.cwd(),site=path.join(root,'site'),src=path.join(root,'source','The-Squad-v137');
const read=p=>fs.readFileSync(p,'utf8');
const ui=read(path.join(site,'chanse1/ui2.js'));
const stage4=read(path.join(site,'chanse3/stage4-chat-ui.js'));
const authCss=read(path.join(site,'chanse3/auth-v121.css'));
const scroll=read(path.join(site,'v149-scroll-repair.css'));
const html=read(path.join(site,'index.html'));
const sw=read(path.join(site,'sw.js'));
const authJs=read(path.join(site,'chanse1/auth.js'));
const backend=read(path.join(src,'chanse4/firebase-functions/index.js'));
const check=(name,condition)=>{assert.ok(condition,name);console.log(`PASS ${name}`)};

check('Stage 4 bridge is emitted from the actual IIFE-local social renderer',ui.includes("squad:social-rendered")&&ui.includes('getRoute:()=>drRoute'));
check('chat-data changes notify Stage 4 without replacing legacy auth/chat functions',ui.includes("squad:chat-data-changed")&&stage4.includes("addEventListener('squad:chat-data-changed'"));
check('Stage 4 no longer relies on inaccessible window.drRender/drRoute globals',!stage4.includes('const base=window.drRender')&&!stage4.includes("typeof drRoute!=='undefined'")&&stage4.includes("addEventListener('squad:social-rendered'"));
check('Stage 4 filtering, conversation opening and management controls remain wired',stage4.includes('data-chat-filter')&&stage4.includes('data-open-chat')&&stage4.includes('data-s4-menu'));

const imageRel=(authCss.match(/url\(['"]([^'"]*auth-login-v121\.png)['"]\)/)||[])[1];
assert.ok(imageRel,'auth artwork URL must exist in the stylesheet');
check('login artwork URL resolves from its CSS directory',fs.existsSync(path.resolve(path.dirname(path.join(site,'chanse3/auth-v121.css')),imageRel)));
check('login artwork is included in the new service-worker precache',sw.includes('squad-v235-property-room-design-cloud')&&sw.includes('chanse2/assets/design/auth-login-v121.png'));
check('login controls and current Firebase sign-in routes are retained',html.includes('id="lid"')&&html.includes('id="pw"')&&html.includes('id="go"')&&authJs.includes("signInWithEmailAndPassword(raw+'@squad.id',pw)")&&authJs.includes("httpsCallable('usernameLogin')"));
check('backend still exports both server-verified legacy sign-in callables',backend.includes('exports.accountIdLogin = onCall')&&backend.includes('exports.usernameLogin = onCall'));

check('document scrollbar styling targets the real page scroller',scroll.includes('body { overflow-y: auto !important; }')&&scroll.includes('scrollbar-gutter: stable'));
check('nested momentum scrolling is limited to actual overflow panes',scroll.includes('@supports (-webkit-overflow-scrolling: touch)')&&!scroll.includes('#social-main')&&!scroll.includes('.dr-feed {'));
check('large desktop feeds defer off-screen paint without changing scroll containers',scroll.includes('content-visibility: auto')&&scroll.includes('contain-intrinsic-size: auto 620px'));
check('scroll repair is loaded after the platform base stylesheet',html.indexOf('platform-redesign-v151.css')<html.indexOf('v149-scroll-repair.css'));

for(const folder of ['chanse1','chanse2','chanse3','chanse4']){
 check(`source and deployed ${folder} directories are preserved`,fs.statSync(path.join(site,folder)).isDirectory()&&fs.statSync(path.join(src,folder)).isDirectory());
}
console.log('V156 REGRESSION CHECKS PASSED');
