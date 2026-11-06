import fs from 'node:fs';
import assert from 'node:assert/strict';
const read=p=>fs.readFileSync(p,'utf8');
const js=read('site/chanse1/community.js'),channel=read('site/chanse4/channel.js'),css=read('site/v255-communities-channels.css'),html=read('site/index.html'),sw=read('site/sw.js');
const v=JSON.parse(read('site/version.json'));
const mirrors=['source/The-Squad-v137/chanse1/community.js','the_squad_handoff/TheSquad/src/site/chanse1/community.js','the_squad_handoff/TheSquad/src/source/The-Squad-v137/chanse1/community.js'];
const channelMirrors=['source/The-Squad-v137/chanse4/channel.js','the_squad_handoff/TheSquad/src/site/chanse4/channel.js','the_squad_handoff/TheSquad/src/source/The-Squad-v137/chanse4/channel.js'];
const versions=['site/chanse4/version.json','source/The-Squad-v137/version.json','source/The-Squad-v137/chanse4/version.json','the_squad_handoff/TheSquad/src/site/version.json','the_squad_handoff/TheSquad/src/site/chanse4/version.json','the_squad_handoff/TheSquad/src/source/The-Squad-v137/chanse4/version.json'];
const checks=[
 ['release metadata retains v259 community phase or newer',v.build>=259&&/^v(?:259|260|261|262|263|264|265|266|267|270|271|272|273|274|275|276|277|278|279|280|281|282|283|284|285|286|287|288|289|290|291)-/.test(v.version)],
 ['all release manifests synchronized',versions.every(p=>JSON.stringify(JSON.parse(read(p)))===JSON.stringify(v))],
 ['Arabic search normalization handles tashkeel and letter variants',js.includes('function cmNorm')&&js.includes('replace(/[أإآٱ]/g,\'ا\')')&&js.includes('replace(/ى/g,\'ي\')')],
 ['search covers community name, description and category',js.includes('[c.nm,c.ds,c.cat].filter(Boolean).join(\' \')')],
 ['search input is debounced',js.includes('clearTimeout(cmDebounce)')&&js.includes('setTimeout(()=>{cq=cmNorm(value);cRender()},90)')],
 ['loading and error states are accessible',js.includes('aria-busy','')&&js.includes('role="status"')&&js.includes('role="alert"')],
 ['retry action is available after loading failure',js.includes("if(k=='retry'){loadComm()}")],
 ['stale community requests are ignored',js.includes('cmLoadSeq')&&js.includes('seq!==cmLoadSeq')],
 ['empty state distinguishes no data from no matches',js.includes('ملقيناش نتائج مطابقة')&&js.includes('مفيش مجتمعات هنا لسه')],
 ['community cards remain escaped',js.includes('esc(c.nm)')&&js.includes('esc(c.ds||\'\')')],
 ['responsive and keyboard focus refinements exist',css.includes('v259 — community discovery refinement')&&css.includes('button:focus-visible')&&css.includes('@media(max-width:560px)')],
 ['main page loads refined stylesheet',html.includes('v255-communities-channels.css?v=259')],
 ['service worker cache namespace advanced',sw.includes('v258-content-moderation-refinement-v259-community-channel-discovery')],
 ['channel feed has an accessible loading state',channel.includes('aria-busy=\"true\"')&&channel.includes('role=\"status\"')],
 ['channel feed preserves reading position on live updates',channel.includes('const nearBottom=f.scrollHeight-f.scrollTop-f.clientHeight<120')&&channel.includes('if(nearBottom)f.scrollTop=f.scrollHeight')],
 ['channel images have alt text and lazy loading',channel.includes('alt=\"صورة منشور القناة\"')&&channel.includes('loading=\"lazy\"')],
 ['source and handoff community scripts synchronized',mirrors.every(p=>read(p)===js)],
 ['source and handoff channel scripts synchronized',channelMirrors.every(p=>read(p)===channel)]
];
for(const [name,ok] of checks){console.log(`${ok?'PASS':'FAIL'} ${name}`);assert.ok(ok,`FAIL: ${name}`)}
console.log(`v259 COMMUNITY CHANNEL DISCOVERY REFINEMENT: PASS (${checks.length}/${checks.length})`);
