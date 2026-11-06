import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';
const root=process.cwd();const site=path.join(root,'site');
const html=fs.readFileSync(path.join(site,'index.html'),'utf8');
const css=fs.readFileSync(path.join(site,'v287-unified-ui-redesign.css'),'utf8');
const js=fs.readFileSync(path.join(site,'v287-unified-ui-redesign.js'),'utf8');
const sw=fs.readFileSync(path.join(site,'sw.js'),'utf8');
const checks=[
 ['stylesheet linked',html.includes('v287-unified-ui-redesign.css?v=287')],
 ['runtime linked',html.includes('v287-unified-ui-redesign.js?v=287')],
 ['responsive breakpoints',/@media\(max-width:760px\)/.test(css)&&/@media\(max-width:420px\)/.test(css)],
 ['reduced motion',css.includes('prefers-reduced-motion:reduce')],
 ['keyboard focus treatment',css.includes(':focus-visible')],
 ['social shell redesign',css.includes('#social-shell')&&css.includes('#social-rail')],
 ['mobile navigation safe area',css.includes('env(safe-area-inset-bottom)')],
 ['runtime progressive enhancement',js.includes('sq287-ui-ready')],
 ['mobile aria current',js.includes("setAttribute('aria-current','page')")],
 ['service worker assets',sw.includes('v287-unified-ui-redesign.css')&&sw.includes('v287-unified-ui-redesign.js')]
];for(const [name,ok] of checks){console.log(`${ok?'PASS':'FAIL'} ${name}`);if(!ok)process.exitCode=1}console.log(`v287 UI checks: ${checks.filter(x=>x[1]).length}/${checks.length}`);
