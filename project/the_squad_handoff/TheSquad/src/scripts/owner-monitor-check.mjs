import { readFile } from 'node:fs/promises';
import path from 'node:path';
const root=process.cwd(),site=path.join(root,'site');
const [ui,css,html,sw,version,backend]=await Promise.all([
 readFile(path.join(site,'chanse3/admin-monitor.js'),'utf8'),
 readFile(path.join(site,'chanse3/admin-monitor.css'),'utf8'),
 readFile(path.join(site,'index.html'),'utf8'),
 readFile(path.join(site,'sw.js'),'utf8'),
 readFile(path.join(site,'chanse4/version.json'),'utf8'),
 readFile(path.join(root,'source/The-Squad-v137/chanse4/firebase-functions/index.js'),'utf8')
]);
const v=JSON.parse(version),checks=[
 ['release metadata matches current release',v.build>=241&&v.version.startsWith(`v${v.build}-`)],
 ['dashboard is English and explicitly private',ui.includes('Owner Control Center')&&ui.includes('Private platform monitoring')],
 ['owner identity remains server-verified',ui.includes("const ADMIN_SID='1000000000'")&&backend.includes("const SQUAD_ADMIN_SID = '1000000000'")&&backend.includes('mapping.data()?.u !== uid')],
 ['all privileged dashboard requests use callable endpoints',ui.includes("call('checkAdminAccess'")&&ui.includes("call('getAdminDashboard'")],
 ['financial changes require explicit confirmation',ui.includes('window.confirm(`Record')&&ui.includes('window.confirm(`Create a withdrawal request')&&ui.includes('window.confirm(prompts[decision]')],
 ['wallet ID is read from the backend response, not hardcoded as the admin ID',ui.includes("d.walletId||'Not available'")&&!ui.includes('10000000000</span>')],
 ['private message bodies and passwords are not rendered',!ui.includes('collectionGroup')&&!ui.includes('messages/')&&!ui.includes('password:')],
 ['report text and service names are escaped',ui.includes('esc(String(r.reason')&&ui.includes('esc(name)')],
 ['wallet payout is clearly described as manual only',ui.includes('No automatic bank or wallet transfer')&&ui.includes('No money will be transferred automatically')],
 ['dashboard handles narrow layouts and reduced motion',css.includes('@media(max-width:480px)')&&css.includes('prefers-reduced-motion')],
 ['dashboard assets are loaded by the main page',html.includes('chanse3/admin-monitor.js')&&html.includes('chanse3/admin-monitor.css')],
 ['dashboard assets are included in the new Service Worker cache',sw.includes('squad-v235-property-room-design-cloud')&&sw.includes('chanse3/admin-monitor.js')&&sw.includes('chanse3/admin-monitor.css')]
];
let failures=0;for(const [name,ok] of checks){console.log(`${ok?'PASS':'FAIL'} ${name}`);if(!ok)failures++}
if(failures){console.error(`${checks.length-failures}/${checks.length} checks passed`);process.exit(1)}
console.log(`${checks.length}/${checks.length} OWNER MONITOR CHECKS PASSED`);
