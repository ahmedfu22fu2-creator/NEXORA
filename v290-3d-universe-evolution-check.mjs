import fs from 'node:fs';import path from 'node:path';
const root=process.cwd(),site=path.join(root,'site');
const js=fs.readFileSync(path.join(site,'v290-3d-universe-evolution.js'),'utf8'),css=fs.readFileSync(path.join(site,'v290-3d-universe-evolution.css'),'utf8'),html=fs.readFileSync(path.join(site,'index.html'),'utf8'),sw=fs.readFileSync(path.join(site,'sw.js'),'utf8'),pkg=JSON.parse(fs.readFileSync(path.join(root,'package.json'),'utf8')),version=JSON.parse(fs.readFileSync(path.join(site,'version.json'),'utf8'));
const checks=[
['v290 assets retained in v291 release metadata',Number(pkg.version.split('.')[0])>=291&&version.build>=291&&version.featureName==='marketplace-evolution'],
['JS and CSS loaded by main page',html.includes('v290-3d-universe-evolution.js?v=290')&&html.includes('v290-3d-universe-evolution.css?v=290')],
['service worker cache namespace',sw.includes('v290-3d-universe-evolution')],
['service worker precaches both assets',sw.includes('"v290-3d-universe-evolution.js"')&&sw.includes('"v290-3d-universe-evolution.css"')],
['lazy Three.js loading',js.includes('function loadThree()')&&js.includes('cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js')],
['three district presets',js.includes("central:{label:")&&js.includes("garden:{label:")&&js.includes("neon:{label:")],
['day and night lighting modes',js.includes("prefs.time==='day'")&&js.includes("data-time")],
['adaptive graphics quality',js.includes("prefs.quality==='auto'")&&js.includes('deviceMemory')||js.includes('navigator.connection?.saveData')],
['interactive camera controls',js.includes('pointermove')&&js.includes("addEventListener('wheel'")&&js.includes('updateCamera()')],
['pause and motion controls',js.includes('data-pause')&&js.includes('data-motion')],
['FPS indicator',js.includes('data-fps')&&js.includes('Math.round(frames*1000')],
['resource cleanup on close',js.includes('function dispose()')&&js.includes('renderer.forceContextLoss()')],
['bounded local preferences only',js.includes("localStorage.setItem(KEY,JSON.stringify(prefs))")&&!js.includes('fetch(')],
['keyboard escape and responsive layout',js.includes("e.key==='Escape'")&&css.includes('@media(max-width:650px)')],
['reduced motion and focus visibility',css.includes('prefers-reduced-motion')&&css.includes('focus-visible')],
['npm test includes v290 check',pkg.scripts.test.includes('v290-3d-universe-evolution-check.mjs')]
];let fail=0;for(const [name,ok] of checks){console.log(`${ok?'PASS':'FAIL'} ${name}`);if(!ok)fail++}console.log(`v290 checks: ${checks.length-fail}/${checks.length}`);if(fail)process.exit(1);
