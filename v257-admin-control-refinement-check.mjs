import fs from 'node:fs';
import assert from 'node:assert/strict';
const read=p=>fs.readFileSync(p,'utf8');
const ui=read('site/chanse3/admin-monitor.js');
const css=read('site/chanse3/admin-monitor.css');
const html=read('site/index.html');
const sw=read('site/sw.js');
const backend=read('backend/firebase-functions/index.js');
const version=JSON.parse(read('site/version.json'));
const checks=[
 ['release metadata is v257',version.build>=257&&version.version===`v${version.build}-${version.currentFeatureName}`&&['admin-control-refinement','content-moderation-refinement','community-channel-discovery-refinement','profile-verification-5000','profile-social-verification','followers-friends-refinement','avatar-capture-3d-call-identity','avatar-expression-lipsync-refinement','avatar-creator-studio','avatar-3d-viewer','avatar-complete-pipeline','social-ai','creator-economy','privacy-safety','quality-upgrade','performance-reliability','ai-core-evolution','ai-integration','ai-intelligence','ai-agents-automation','ai-collaboration','project-intelligence','workspace-knowledge','command-center','cross-system-integration','experience-engine','adaptive-workspace','total-quality-stability','global-discovery','unified-ui-redesign','ai-intelligence-control-tower','3d-universe-evolution','marketplace-evolution'].includes(version.currentFeatureName)],
 ['version manifests stay synchronized',JSON.stringify(version)===JSON.stringify(JSON.parse(read('site/chanse4/version.json')))&&JSON.stringify(version)===JSON.stringify(JSON.parse(read('source/The-Squad-v137/version.json')))&&JSON.stringify(version)===JSON.stringify(JSON.parse(read('source/The-Squad-v137/chanse4/version.json')))],
 ['dashboard remains callable-only',ui.includes("call('checkAdminAccess'")&&ui.includes("call('getAdminDashboard'")&&ui.includes("call('getAdminReports'")&&!ui.includes("firebase.firestore")&&!ui.includes("collectionGroup(")],
 ['server verifies owner UID for privileged requests',backend.includes('async function requireSquadAdmin(request)')&&backend.includes('mapping.data()?.u !== uid')&&['checkAdminAccess','getAdminDashboard','searchAdminAccounts','getAdminAccountActivity','getAdminReports','getPlatformWallet','recordPlatformEarning','requestPlatformWithdrawal','resolvePlatformWithdrawal'].every(n=>{const i=backend.indexOf(`exports.${n} = onCall`);return i>=0&&/requireSquadAdmin\(request\)|adminLookupUid\(request/.test(backend.slice(i,i+900))} )],
 ['account lookup ignores stale responses',ui.includes('accountSearchGeneration')&&ui.includes('generation!==accountSearchGeneration')],
 ['reports requests are de-duplicated',ui.includes('reportsBusy')&&ui.includes("if(!authorized||reportsBusy||!panel.classList.contains('open'))return")],
 ['automatic refresh pauses when hidden',ui.includes("document.visibilityState==='visible'")&&ui.includes("panel.classList.contains('open')")],
 ['keyboard focus is returned and trapped',ui.includes('lastFocus=document.activeElement')&&ui.includes("if(e.key==='Tab')")&&ui.includes('lastFocus.focus()')],
 ['dashboard remains privacy minimized',ui.includes('Private message content and passwords')&&ui.includes('Activity counts are aggregate records only')],
 ['responsive and accessible refinements exist',css.includes('v257 — owner dashboard usability')&&css.includes('@media(max-width:420px)')&&css.includes('focus-visible')&&css.includes('prefers-reduced-motion')],
 ['main page loads versioned dashboard assets',html.includes('chanse3/admin-monitor.css?v=258')&&html.includes('chanse3/admin-monitor.js?v=258')],
 ['service worker cache namespace advanced',sw.includes('v256-global-search-v257-admin-control-refinement')&&sw.includes('chanse3/admin-monitor.js')&&sw.includes('chanse3/admin-monitor.css')]
];
for(const [name,ok] of checks){console.log(`${ok?'PASS':'FAIL'} ${name}`);assert.ok(ok,`FAIL: ${name}`)}
console.log(`v257 ADMIN CONTROL REFINEMENT: PASS (${checks.length}/${checks.length})`);
