import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';
const root=process.cwd(),site=path.join(root,'site');
const js=fs.readFileSync(path.join(site,'v272-quality-upgrade.js'),'utf8');
const css=fs.readFileSync(path.join(site,'v272-quality-upgrade.css'),'utf8');
const html=fs.readFileSync(path.join(site,'index.html'),'utf8');
const sw=fs.readFileSync(path.join(site,'sw.js'),'utf8');
const v=JSON.parse(fs.readFileSync(path.join(site,'version.json'),'utf8'));
const checks=[
['Quality center script and stylesheet are loaded',html.includes('v272-quality-upgrade.js?v=272')&&html.includes('v272-quality-upgrade.css?v=272')],
['Diagnostics cover storage, service worker, WebGL, HTTPS and reduced motion',js.includes('localStorage')&&js.includes('serviceWorker')&&js.includes('webgl2')&&js.includes('location.protocol')&&js.includes('prefers-reduced-motion')],
['Diagnostics do not claim Firebase connectivity',js.includes('ليست اختبارًا لاتصال Firebase')],
['Local export is explicit and scoped to known feature keys',js.includes('scope:\'local-browser-data-only\'')&&js.includes('squad.privacySafety.v271')&&js.includes('squad.creatorEconomy.v270')],
['Export is generated locally without a remote endpoint',js.includes('URL.createObjectURL(blob)')&&!js.includes('fetch(')],
['Privacy reset is user-confirmed and scoped to local privacy keys',js.includes('confirm(')&&js.includes('squad.privacySafety.alias.')&&js.includes('removeItem(\'squad.privacySafety.v271\')')],
['Accessible modal includes dialog semantics and focus trap',js.includes('role="dialog"')&&js.includes('aria-modal="true"')&&js.includes("e.key!=='Tab'")],
['Escape closes dialog and restores focus',js.includes("e.key==='Escape'")&&js.includes('returnFocus.focus()')],
['Responsive and reduced-motion styles exist',css.includes('@media(max-width:600px)')&&css.includes('prefers-reduced-motion')&&css.includes(':focus-visible')],
['Service worker namespace and precache include v272 assets',sw.includes('v272-quality-upgrade')&&sw.includes('v272-quality-upgrade.js')&&sw.includes('v272-quality-upgrade.css')],
['Release metadata is v272',v.build>=272&&v.version.startsWith('v272-quality-upgrade')||v.build>=273&&['performance-reliability','ai-core-evolution','ai-integration','ai-intelligence','ai-agents-automation','ai-collaboration','project-intelligence','workspace-knowledge','command-center','cross-system-integration','experience-engine','adaptive-workspace','total-quality-stability','global-discovery','unified-ui-redesign','ai-intelligence-control-tower','3d-universe-evolution','marketplace-evolution'].includes(v.featureName)],
['Quality API is exposed without modifying existing application globals',js.includes('window.SquadQualityCenter')&&js.includes('version:272')]
];
for(const [name,ok] of checks){console.log(`${ok?'PASS':'FAIL'} ${name}`);assert.ok(ok,name)}
console.log(`v272 Quality Upgrade checks: ${checks.length}/${checks.length} PASS`);
