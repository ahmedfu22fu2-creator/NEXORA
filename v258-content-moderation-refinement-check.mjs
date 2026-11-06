import fs from 'node:fs';
import assert from 'node:assert/strict';
const read=p=>fs.readFileSync(p,'utf8');
const ui=read('site/chanse3/admin-monitor.js');
const css=read('site/chanse3/admin-monitor.css');
const html=read('site/index.html');
const sw=read('site/sw.js');
const version=JSON.parse(read('site/version.json'));
const backend=read('backend/firebase-functions/index.js');
const checks=[
 ['release metadata is v258',version.build>=258&&version.version===`v${version.build}-${version.currentFeatureName}`&&['content-moderation-refinement','community-channel-discovery-refinement','profile-verification-5000','profile-social-verification','followers-friends-refinement','avatar-capture-3d-call-identity','avatar-expression-lipsync-refinement','avatar-creator-studio','avatar-3d-viewer','avatar-complete-pipeline','social-ai','creator-economy','privacy-safety','quality-upgrade','performance-reliability','ai-core-evolution','ai-integration','ai-intelligence','ai-agents-automation','ai-collaboration','project-intelligence','workspace-knowledge','command-center','cross-system-integration','experience-engine','adaptive-workspace','total-quality-stability','global-discovery','unified-ui-redesign','ai-intelligence-control-tower','3d-universe-evolution','marketplace-evolution'].includes(version.currentFeatureName)],
 ['all release manifests are synchronized',JSON.stringify(version)===JSON.stringify(JSON.parse(read('site/chanse4/version.json')))&&JSON.stringify(version)===JSON.stringify(JSON.parse(read('source/The-Squad-v137/version.json')))&&JSON.stringify(version)===JSON.stringify(JSON.parse(read('source/The-Squad-v137/chanse4/version.json')))&&JSON.stringify(version)===JSON.stringify(JSON.parse(read('the_squad_handoff/TheSquad/src/site/version.json')))&&JSON.stringify(version)===JSON.stringify(JSON.parse(read('the_squad_handoff/TheSquad/src/site/chanse4/version.json')))],
 ['report filters cover query, status and category',ui.includes('sqAmReportQuery')&&ui.includes('sqAmReportStatus')&&ui.includes('sqAmReportCategory')&&ui.includes('renderReports')],
 ['report filtering is client-side over bounded callable response',ui.includes("call('getAdminReports',{limit:30})")&&!ui.includes('firebase.firestore')],
 ['report requests ignore stale or closed-panel responses',ui.includes('reportsGeneration')&&ui.includes("!panel.classList.contains('open')")],
 ['report text is escaped before rendering',ui.includes('esc(r.reason||\'No reason provided\')')&&ui.includes('esc(r.category||\'Report\')')],
 ['report queue clearly avoids unsupported moderation actions',ui.includes('this view does not change report decisions')&&!ui.includes('resolveAdminReport')],
 ['no new client-side admin authorization or database access',!ui.includes('firebase.firestore')&&!ui.includes('collectionGroup(')&&ui.includes("call('checkAdminAccess'")],
 ['responsive and keyboard-visible report controls exist',css.includes('v258 — searchable report review queue')&&css.includes('@media(max-width:620px)')&&css.includes('.am-report-tools input:focus-visible')],
 ['main page loads v258 dashboard assets',html.includes('chanse3/admin-monitor.css?v=258')&&html.includes('chanse3/admin-monitor.js?v=258')],
 ['service worker cache namespace advanced',sw.includes('v257-admin-control-refinement-v258-content-moderation-refinement')],
 ['source and handoff dashboard mirrors are synchronized',read('source/The-Squad-v137/chanse3/admin-monitor.js')===ui&&read('the_squad_handoff/TheSquad/src/site/chanse3/admin-monitor.js')===ui&&read('source/The-Squad-v137/chanse3/admin-monitor.css')===css&&read('the_squad_handoff/TheSquad/src/site/chanse3/admin-monitor.css')===css],
 ['backend report callable remains present',backend.includes('exports.getAdminReports = onCall')]
];
for(const [name,ok] of checks){console.log(`${ok?'PASS':'FAIL'} ${name}`);assert.ok(ok,`FAIL: ${name}`)}
console.log(`v258 CONTENT MODERATION REFINEMENT: PASS (${checks.length}/${checks.length})`);
