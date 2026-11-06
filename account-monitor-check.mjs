import {readFile} from 'node:fs/promises';
import path from 'node:path';
const root=process.cwd();
const [ui,css,backend,packagedBackend,version,sw]=await Promise.all([
 readFile(path.join(root,'site/chanse3/admin-monitor.js'),'utf8'),
 readFile(path.join(root,'site/chanse3/admin-monitor.css'),'utf8'),
 readFile(path.join(root,'backend/firebase-functions/index.js'),'utf8'),
 readFile(path.join(root,'backend/firebase-functions/index.js'),'utf8'),
 readFile(path.join(root,'site/chanse4/version.json'),'utf8'),
 readFile(path.join(root,'site/sw.js'),'utf8')
]);
const v=JSON.parse(version);
const activityHandler=backend.split('exports.getAdminAccountActivity = onCall')[1]?.split('\n});')[0] || '';
const checks=[
 ['release metadata matches current release',v.build>=241&&v.version.startsWith(`v${v.build}-`)],
 ['account lookup accepts exact SID or username only',backend.includes('exports.searchAdminAccounts')&&backend.includes('ids/${sid}')&&backend.includes('usernames/${query}')&&backend.includes('20, 60 * 1000')],
 ['account endpoints require owner authorization',backend.includes('exports.searchAdminAccounts')&&backend.includes('exports.getAdminAccountActivity')&&backend.includes('await requireSquadAdmin(request)')],
 ['account result is privacy minimized',backend.includes('emailVerified: !!authUser.emailVerified')&&!backend.includes('email: authUser.email')&&!backend.includes('return {ok: true, found: true, email:')],
 ['activity uses aggregate counts, not private message reads',backend.includes("where('authorUid', '==', uid)")&&backend.includes("where('members', 'array-contains', uid)")&&!activityHandler.includes("collectionGroup('messages')")],
 ['legacy and social report formats are both supported',backend.includes("orderBy('t', 'desc')")&&backend.includes("orderBy('createdAt', 'desc')")],
 ['report queue is read-only from the client',ui.includes("call('getAdminReports'")&&!ui.includes('resolveAdminReport')],
 ['account UI calls only secured callable endpoints',ui.includes("call('searchAdminAccounts'")&&ui.includes("call('getAdminAccountActivity'")],
 ['account search and reports are in the owner dashboard',ui.includes('id="am-accounts"')&&ui.includes('id="sqAccountSearch"')&&ui.includes('id="sqAmReports"')],
 ['dynamic account and report fields are escaped',ui.includes('esc(a.name')&&ui.includes('esc(r.reason')&&ui.includes('esc(a.city')],
 ['responsive account monitoring styling exists',css.includes('.am-account-facts')&&css.includes('@media(max-width:520px)')],
 ['deployment copy matches reviewed backend',backend===packagedBackend],
 ['service worker cache matches current release',sw.includes('squad-v235-property-room-design-cloud')&&sw.includes('chanse3/admin-monitor.js')]
];
let failures=0;for(const [name,ok] of checks){console.log(`${ok?'PASS':'FAIL'} ${name}`);if(!ok)failures++}
if(failures){console.error(`${checks.length-failures}/${checks.length} checks passed`);process.exit(1)}
console.log(`${checks.length}/${checks.length} ACCOUNT MONITOR CHECKS PASSED`);
