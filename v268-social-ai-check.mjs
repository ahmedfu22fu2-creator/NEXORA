import fs from 'node:fs';import assert from 'node:assert/strict';import path from 'node:path';
const root=process.cwd(),site=path.join(root,'site');
const js=fs.readFileSync(path.join(site,'v268-social-ai.js'),'utf8'),css=fs.readFileSync(path.join(site,'v268-social-ai.css'),'utf8'),html=fs.readFileSync(path.join(site,'index.html'),'utf8'),sw=fs.readFileSync(path.join(site,'sw.js'),'utf8');
const checks=[
['Social AI module is loaded',html.includes('v268-social-ai.js')],
['Social AI stylesheet is loaded',html.includes('v268-social-ai.css')],
['Wingman offers reply suggestions',js.includes('makeReplies')&&js.includes('data-generate-replies')],
['Wingman supports respectful tone',js.includes('respectful')],
['Feed preferences parse travel and cooking',js.includes("travel:")&&js.includes("cooking:")],
['Feed control supports political exclusions',js.includes("exclude.push('politics')")],
['Feed filter is local and bounded to visible cards',js.includes('function applyFilter')&&js.includes('document.querySelectorAll')],
['Collaborative prompt draft is local',js.includes('squad.v268.social-ai.collab-draft')],
['No API key or remote AI endpoint is embedded',!/(sk-[A-Za-z0-9]{12,}|api\.openai\.com|generativelanguage\.googleapis\.com)/.test(js)],
['Accessibility and responsive styles exist',css.includes(':focus-visible')&&css.includes('@media(max-width:600px)')],
['Service worker cache namespace updated',sw.includes('v268-social-ai')],
['Version metadata is v268',JSON.parse(fs.readFileSync(path.join(site,'version.json'),'utf8')).build>=268]
];for(const [name,ok]of checks){console.log(`${ok?'PASS':'FAIL'} ${name}`);assert.ok(ok,name)}console.log(`v268 Social AI checks: ${checks.length}/${checks.length} PASS`);
