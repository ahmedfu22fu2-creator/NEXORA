import fs from 'node:fs';import path from 'node:path';
const root=process.cwd(),site=path.join(root,'site');
const js=fs.readFileSync(path.join(site,'v284-adaptive-workspace.js'),'utf8'),css=fs.readFileSync(path.join(site,'v284-adaptive-workspace.css'),'utf8'),html=fs.readFileSync(path.join(site,'index.html'),'utf8'),sw=fs.readFileSync(path.join(site,'sw.js'),'utf8'),v=JSON.parse(fs.readFileSync(path.join(site,'version.json'),'utf8')),pkg=JSON.parse(fs.readFileSync(path.join(root,'package.json'),'utf8'));
const checks=[
['public adaptive workspace API',js.includes('window.SquadAdaptiveWorkspace={version:284,read,search,prefs,open:openTab,openPalette:showPalette}')],
['four explicit workspace modes',js.includes("focus:{label:'تركيز'")&&js.includes("planning:{label:'تخطيط'")&&js.includes("review:{label:'مراجعة'")&&js.includes("explore:{label:'استكشاف'")],
['reads only exposed project/workspace APIs',js.includes('SquadCrossSystemIntegration')&&js.includes('SquadAICollaboration')&&js.includes('SquadWorkspaceKnowledge')],
['unified local search across supported record types',js.includes("type:'project'")&&js.includes("type:'task'")&&js.includes("type:'decision'")&&js.includes("type:'note'")&&js.includes("type:'milestone'")],
['command palette supports keyboard shortcut',js.includes("e.key.toLowerCase()==='k'")&&js.includes('showPalette()')],
['command palette is accessible dialog',js.includes('role="dialog"')&&js.includes('aria-modal="true"')&&js.includes('aria-labelledby="sq284-title"')],
['search results navigate to source modules',js.includes('data-v284-hit')&&js.includes('data-tab=')&&js.includes('SquadAICollaboration?.open?.()')],
['recent searches bounded',js.includes('MAX_RECENT=12')&&js.includes('slice(-MAX_RECENT)')],
['local preferences guarded',js.includes('squad.v284.adaptive-workspace.v1')&&js.includes('try{localStorage.setItem')],
['export preferences as JSON',js.includes('the-squad-v284-workspace-preferences.json')],
['dynamic content escaped',js.includes('esc(title)')&&js.includes('esc(detail)')&&js.includes('esc(r.title)')],
['no network calls or autonomous execution',!js.includes('fetch(')&&!js.includes('httpsCallable')&&!js.includes('setInterval(')],
['responsive and keyboard focus styles',css.includes('@media(max-width:760px)')&&css.includes(':focus-visible')],
['HTML loads v284 assets',html.includes('v284-adaptive-workspace.js')&&html.includes('v284-adaptive-workspace.css')],
['service worker caches assets and advances namespace',sw.includes('v284-adaptive-workspace.js')&&sw.includes('v284-adaptive-workspace.css')&&sw.includes('v284-adaptive-workspace')],
['release metadata and package version',v.build>=284&&['adaptive-workspace','total-quality-stability','global-discovery','unified-ui-redesign','ai-intelligence-control-tower','3d-universe-evolution','marketplace-evolution'].includes(v.featureName)&&Number(pkg.version.split('.')[0])>=284],
['test registered in npm test',pkg.scripts.test.includes('v284-adaptive-workspace-check.mjs')]
];let fail=0;for(const [name,ok] of checks){console.log(`${ok?'PASS':'FAIL'} ${name}`);if(!ok)fail++}console.log(`${checks.length-fail}/${checks.length} passed`);if(fail)process.exit(1);
