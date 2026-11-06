import fs from 'node:fs';import path from 'node:path';
const root=process.cwd(),site=path.join(root,'site'),js=fs.readFileSync(path.join(site,'v280-workspace-knowledge.js'),'utf8'),css=fs.readFileSync(path.join(site,'v280-workspace-knowledge.css'),'utf8'),html=fs.readFileSync(path.join(site,'index.html'),'utf8'),sw=fs.readFileSync(path.join(site,'sw.js'),'utf8'),v=JSON.parse(fs.readFileSync(path.join(site,'version.json'),'utf8')),pkg=JSON.parse(fs.readFileSync(path.join(root,'package.json'),'utf8'));
const checks=[
['workspace knowledge public API and version',js.includes('window.SquadWorkspaceKnowledge')&&js.includes('version:280')],
['reads existing collaboration projects without replacing them',js.includes('window.SquadAICollaboration?.read?.()')],
['bounded local persistence for links, tasks and decisions',js.includes('MAX=160')&&js.includes('squad.v280.workspace-knowledge.v1')],
['project relationships reject self-links and duplicates',js.includes('from===to')&&js.includes('العلاقة موجودة بالفعل')],
['unified task inbox supports priority, status and live counter refresh',js.includes('data-v280-add-task')&&js.includes('data-v280-task-status')&&js.includes('if(save(s))render()')],
['decision register supports superseding records',js.includes('data-v280-add-decision')&&js.includes('data-v280-supersede')],
['consistency review is explicitly heuristic',js.includes('function conflicts(s,p)')&&js.includes('قد يشير إلى تحديث مشروع وليس تعارضًا حقيقيًا')],
['export and scoped clear actions',js.includes('data-v280-export')&&js.includes('data-v280-clear')],
['no external network or autonomous execution',!js.includes('fetch(')&&!js.includes('httpsCallable')&&!js.includes('setInterval(')],
['accessible responsive styling',css.includes(':focus-visible')&&css.includes('@media(max-width:700px)')],
['HTML loads v280 assets',html.includes('v280-workspace-knowledge.js')&&html.includes('v280-workspace-knowledge.css')],
['service worker precaches v280 assets and cache namespace updated',sw.includes('v280-workspace-knowledge.js')&&sw.includes('v280-workspace-knowledge.css')&&sw.includes('v280-workspace-knowledge')&&sw.includes('v281-command-center')],
['release metadata and test wired',v.build>=280&&v.featurePhase>=280&&pkg.scripts.test.includes('v280-workspace-knowledge-check.mjs')]
];let failed=0;for(const [n,ok] of checks){console.log(`${ok?'PASS':'FAIL'} ${n}`);if(!ok)failed++}console.log(`${checks.length-failed}/${checks.length} passed`);if(failed)process.exit(1);
