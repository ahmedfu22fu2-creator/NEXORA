import fs from 'node:fs';import path from 'node:path';
const root=process.cwd(),site=path.join(root,'site');
const js=fs.readFileSync(path.join(site,'v291-marketplace-evolution.js'),'utf8'),css=fs.readFileSync(path.join(site,'v291-marketplace-evolution.css'),'utf8'),html=fs.readFileSync(path.join(site,'chanse3/store.html'),'utf8'),sw=fs.readFileSync(path.join(site,'sw.js'),'utf8'),pkg=JSON.parse(fs.readFileSync(path.join(root,'package.json'),'utf8')),sitePkg=JSON.parse(fs.readFileSync(path.join(site,'package.json'),'utf8')),version=JSON.parse(fs.readFileSync(path.join(site,'version.json'),'utf8'));
const checks=[
['release metadata 291',pkg.version==='291.0.0'&&sitePkg.version==='291.0.0'&&version.build===291],
['marketplace CSS and JS loaded by store page',html.includes('v291-marketplace-evolution.css?v=291')&&html.includes('v291-marketplace-evolution.js?v=291')],
['service worker cache namespace updated',sw.includes('v291-marketplace-evolution')],
['service worker precaches marketplace assets',sw.includes('"v291-marketplace-evolution.js"')&&sw.includes('"v291-marketplace-evolution.css"')],
['catalog search control',js.includes('type="search"')&&js.includes('state.query')],
['sort by name and price',js.includes("state.sort==='name'")&&js.includes("state.sort==='price-low'")&&js.includes("state.sort==='price-high'")],
['saved products with bounded local storage',js.includes("localStorage.setItem(KEY")&&js.includes('slice(0,100)')],
['saved-only filter with accessible pressed state',js.includes('aria-pressed')&&js.includes('onlySaved')],
['shortlist supports add and remove',js.includes('data-sq291-tray')&&js.includes('data-remove')],
['shortlist explicitly has no checkout or purchase action',js.includes('لا تنفّذ شراءً ولا تخصم عملات')&&!js.includes('httpsCallable')&&!js.includes('economyAction')],
['existing server-authoritative purchase remains untouched',html.includes("httpsCallable('economyAction')")&&html.includes("httpsCallable('economyGet')")],
['dynamic catalog cards are decorated safely',js.includes('MutationObserver')&&js.includes('textContent')],
['mobile responsive styles',css.includes('@media(max-width:760px)')&&css.includes('@media(max-width:430px)')],
['keyboard focus and reduced-motion support',css.includes(':focus-visible')&&css.includes('prefers-reduced-motion')],
['npm test includes v291 check',pkg.scripts.test.includes('v291-marketplace-evolution-check.mjs')]
];let fail=0;for(const [name,ok] of checks){console.log(`${ok?'PASS':'FAIL'} ${name}`);if(!ok)fail++}console.log(`v291 checks: ${checks.length-fail}/${checks.length}`);if(fail)process.exit(1);
