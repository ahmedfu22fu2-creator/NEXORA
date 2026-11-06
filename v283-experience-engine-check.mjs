import fs from 'node:fs';import path from 'node:path';
const root=process.cwd(),site=path.join(root,'site'),js=fs.readFileSync(path.join(site,'v283-experience-engine.js'),'utf8'),css=fs.readFileSync(path.join(site,'v283-experience-engine.css'),'utf8'),html=fs.readFileSync(path.join(site,'index.html'),'utf8'),sw=fs.readFileSync(path.join(site,'sw.js'),'utf8'),v=JSON.parse(fs.readFileSync(path.join(site,'version.json'),'utf8')),pkg=JSON.parse(fs.readFileSync(path.join(root,'package.json'),'utf8'));
const checks=[
['public experience engine API',js.includes('window.SquadExperienceEngine={version:283,read,recommend,prefs,open')],
['reads only exposed local project/workspace/intelligence APIs',js.includes('SquadAICollaboration')&&js.includes('SquadWorkspaceKnowledge')&&js.includes('SquadProjectIntelligence')],
['recommendations include open tasks and overdue milestones',js.includes(",'task',")&&js.includes(",'milestone',")],
['recommendations include project progress and relationships',js.includes(",'progress',")&&js.includes(",'connection',")],
['user controls enabled and compact preferences',js.includes('data-v283-enabled')&&js.includes('data-v283-compact')],
['dismiss and reset recommendations',js.includes('data-v283-dismiss')&&js.includes('data-v283-reset')],
['navigation targets existing workspace modules',js.includes('data-v283-go=')&&js.includes('data-tab="${CSS.escape(b.dataset.v283Go)}"')],
['local preferences bounded and guarded',js.includes('squad.v283.experience-preferences.v1')&&js.includes('slice(-MAX_ITEMS)')&&js.includes('try{localStorage.setItem')],
['dynamic content escaped',js.includes('esc(x.title)')&&js.includes('esc(x.reason)')&&js.includes('esc(x.action)')],
['no network, autonomous timers or remote calls',!js.includes('fetch(')&&!js.includes('httpsCallable')&&!js.includes('setInterval(')],
['responsive accessible CSS',css.includes(':focus-visible')&&css.includes('@media(max-width:760px)')],
['HTML loads v283 assets',html.includes('v283-experience-engine.js')&&html.includes('v283-experience-engine.css')],
['service worker caches assets and advances namespace',sw.includes('v283-experience-engine.js')&&sw.includes('v283-experience-engine.css')&&sw.includes('v283-experience-engine')],
['release metadata',v.build>=283&&['experience-engine','adaptive-workspace','total-quality-stability','global-discovery','unified-ui-redesign','ai-intelligence-control-tower','3d-universe-evolution','marketplace-evolution'].includes(v.featureName)&&Number(pkg.version.split('.')[0])>=283],
['test registered',pkg.scripts.test.includes('v283-experience-engine-check.mjs')]
];let fail=0;for(const [name,ok] of checks){console.log(`${ok?'PASS':'FAIL'} ${name}`);if(!ok)fail++}console.log(`${checks.length-fail}/${checks.length} passed`);if(fail)process.exit(1);
