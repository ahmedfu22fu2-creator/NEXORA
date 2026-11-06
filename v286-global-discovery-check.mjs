import fs from 'node:fs';import assert from 'node:assert/strict';
const js=fs.readFileSync('site/v286-global-discovery.js','utf8'),css=fs.readFileSync('site/v286-global-discovery.css','utf8'),html=fs.readFileSync('site/index.html','utf8'),sw=fs.readFileSync('site/sw.js','utf8'),pkg=JSON.parse(fs.readFileSync('package.json','utf8')),v=JSON.parse(fs.readFileSync('site/version.json','utf8'));
const tests=[
['public discovery API',/window\.SquadGlobalDiscovery=\{version:286,open,close,read,search,prefs,clearHistory/.test(js)],
['reads only explicit workspace APIs',/SquadCrossSystemIntegration/.test(js)&&/SquadWorkspaceKnowledge/.test(js)&&/SquadProjectIntelligence/.test(js)],
['no private messaging collections',!/privateMessages|directMessages|inboxMessages|chatMessages/.test(js)],
['relevance scoring exact/prefix/substring/context',/t===z/.test(js)&&/t\.startsWith\(z\)/.test(js)&&/t\.includes\(z\)/.test(js)&&/d\.includes\(z\)/.test(js)],
['advanced type filter',/data-286-type/.test(js)&&/type==='all'\|\|r\.type===type/.test(js)],
['suggestions derived from local records',/data-286-suggest/.test(js)&&/records\(\)\.flatMap/.test(js)],
['bounded result and history sizes',/MAX_RESULTS=60/.test(js)&&/MAX_HISTORY=12/.test(js)],
['history opt-out, single-item deletion and clear controls',/historyEnabled/.test(js)&&/data-286-clear-history/.test(js)&&/data-286-remove/.test(js)&&/p\.history=p\.history\.filter/.test(js)],
['debounced input',/setTimeout\(paint,120\)/.test(js)],
['keyboard shortcut and escape',/e\.shiftKey&&e\.key\.toLowerCase\(\)==='f'/.test(js)&&/e\.key==='Escape'/.test(js)],
['accessible dialog and live status',/aria-modal="true"/.test(js)&&/aria-live="polite"/.test(js)],
['mobile responsive design',/max-width:560px/.test(css)],
['HTML loads v286 assets',/v286-global-discovery\.css\?v=286/.test(html)&&/v286-global-discovery\.js\?v=286/.test(html)],
['service worker precaches v286 assets',sw.includes('v286-global-discovery.js')&&sw.includes('v286-global-discovery.css')&&sw.includes('squad-v286-global-discovery')],
['release metadata and package version',Number(pkg.version.split('.')[0])>=286&&v.build>=286&&/^v(?:286|287|288|289|290|291)-/.test(v.version)],
['test registered in npm test',pkg.scripts.test.includes('v286-global-discovery-check.mjs')]
];for(const [name,ok] of tests){console.log(`${ok?'PASS':'FAIL'} ${name}`);assert.ok(ok,name)}console.log(`v286 Global Discovery: ${tests.length}/${tests.length} PASS`);
