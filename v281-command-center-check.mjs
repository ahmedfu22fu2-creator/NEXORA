import fs from 'node:fs';import path from 'node:path';
const root=process.cwd(),site=path.join(root,'site'),js=fs.readFileSync(path.join(site,'v281-command-center.js'),'utf8'),css=fs.readFileSync(path.join(site,'v281-command-center.css'),'utf8'),html=fs.readFileSync(path.join(site,'index.html'),'utf8'),sw=fs.readFileSync(path.join(site,'sw.js'),'utf8'),v=JSON.parse(fs.readFileSync(path.join(site,'version.json'),'utf8')),pkg=JSON.parse(fs.readFileSync(path.join(root,'package.json'),'utf8'));
const checks=[
['public command-center API',js.includes('window.SquadCommandCenter={version:281,read:snapshot')],
['aggregates only exposed collaboration, intelligence and workspace APIs',js.includes('window.SquadAICollaboration')&&js.includes('window.SquadProjectIntelligence')&&js.includes('window.SquadWorkspaceKnowledge')],
['search covers projects, tasks, decisions, notes and milestones',js.includes("kind:'project'")&&js.includes("kind:'task'")&&js.includes("kind:'decision'")&&js.includes("kind:'note'")&&js.includes("kind:'milestone'")],
['filters and navigation shortcuts exist',js.includes('data-v281-filter')&&js.includes('data-v281-go')],
['export contains schema and timestamp',js.includes('the-squad-command-center-v1')&&js.includes('exportedAt')],
['no network calls or autonomous timers',!js.includes('fetch(')&&!js.includes('httpsCallable')&&!js.includes('setInterval(')],
['all rendered dynamic content is escaped',js.includes("=>String(v??'').replace")&&js.includes('esc(x.title)')&&js.includes('esc(e.text)')],
['responsive accessible styling',css.includes(':focus-visible')&&css.includes('@media(max-width:760px)')],
['HTML loads v281 assets',html.includes('v281-command-center.js')&&html.includes('v281-command-center.css')],
['service worker caches v281 assets and namespace',sw.includes('v281-command-center.js')&&sw.includes('v281-command-center.css')&&sw.includes('v281-command-center')],
['release metadata and test registration',v.build>=281&&v.featurePhase>=281&&pkg.scripts.test.includes('v281-command-center-check.mjs')]
];let fail=0;for(const [n,ok] of checks){console.log(`${ok?'PASS':'FAIL'} ${n}`);if(!ok)fail++}console.log(`${checks.length-fail}/${checks.length} passed`);if(fail)process.exit(1);
