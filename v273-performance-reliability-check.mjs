import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';
const root=process.cwd(),site=path.join(root,'site'),js=fs.readFileSync(path.join(site,'v273-performance-reliability.js'),'utf8'),css=fs.readFileSync(path.join(site,'v273-performance-reliability.css'),'utf8'),html=fs.readFileSync(path.join(site,'index.html'),'utf8'),sw=fs.readFileSync(path.join(site,'sw.js'),'utf8'),v=JSON.parse(fs.readFileSync(path.join(site,'version.json'),'utf8'));
const checks=[
['Performance lab script and stylesheet are loaded',html.includes('v273-performance-reliability.js?v=273')&&html.includes('v273-performance-reliability.css?v=273')],
['PerformanceObserver feature detection is guarded',js.includes("typeof PerformanceObserver!=='undefined'")&&js.includes('supportedEntryTypes')],
['LCP, CLS, interaction and long-task observers are implemented',js.includes("'largest-contentful-paint'")&&js.includes("'layout-shift'")&&js.includes("'event'")&&js.includes("'longtask'")],
['Runtime failures are counted without retaining messages',js.includes("addEventListener('error',()=>{state.errors++")&&js.includes("addEventListener('unhandledrejection',()=>{state.rejections++")&&!js.includes('event.message')],
['Network state and data-saver hints are included',js.includes('navigator.onLine')&&js.includes('saveData')],
['Memory metrics are optional and guarded',js.includes('performance.memory')&&js.includes('mem?')],
['Export is local JSON and revokes object URL',js.includes('URL.createObjectURL(blob)')&&js.includes('URL.revokeObjectURL(url)')&&!js.includes('fetch(')],
['Export explicitly excludes telemetry and personal identifiers',js.includes('local-only-no-telemetry')&&js.includes('No URLs, content, user identifiers')],
['Accessible dialog and Escape handling are present',js.includes('role="dialog"')&&js.includes('aria-modal="true"')&&js.includes("e.key==='Escape'")],
['Refresh and export actions are available',js.includes('data-v273-refresh')&&js.includes('data-v273-export')],
['Responsive and reduced-motion styles exist',css.includes('@media(max-width:560px)')&&css.includes('prefers-reduced-motion')&&css.includes(':focus-visible')],
['Service worker cache namespace and precache include v273',sw.includes('v273-performance-reliability')&&sw.includes('v273-performance-reliability.js')&&sw.includes('v273-performance-reliability.css')],
['Release metadata is v273',v.build>=273&&['performance-reliability','ai-core-evolution','ai-integration','ai-intelligence','ai-agents-automation','ai-collaboration','project-intelligence','workspace-knowledge','command-center','cross-system-integration','experience-engine','adaptive-workspace','total-quality-stability','global-discovery','unified-ui-redesign','ai-intelligence-control-tower','3d-universe-evolution','marketplace-evolution'].includes(v.featureName)],
['Public API is isolated and versioned',js.includes('window.SquadPerformanceLab')&&js.includes('version:273')],
['Existing v272 quality center remains loaded',html.includes('v272-quality-upgrade.js?v=272')&&fs.existsSync(path.join(site,'v272-quality-upgrade.js'))]
];for(const [name,ok] of checks){console.log(`${ok?'PASS':'FAIL'} ${name}`);assert.ok(ok,name)}console.log(`v273 Performance & Reliability checks: ${checks.length}/${checks.length} PASS`);
