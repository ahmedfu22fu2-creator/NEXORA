import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
const root=process.cwd(); const site=path.join(root,'site'); const fail=[];
const main=await readFile(path.join(site,'index.html'),'utf8');
const translator=await readFile(path.join(site,'chanse4/english-ui-v152.js'),'utf8');
if(!/<html lang="en" dir="ltr">/.test(main)) fail.push('Main page is not English/LTR.');
if(!main.includes('chanse4/english-ui-v152.js')) fail.push('Main page does not load the localization layer.');
if(!translator.includes("activeLanguage==='ar'?'rtl':'ltr'")||!translator.includes('setLanguage(lang)')) fail.push('Localization layer does not support selectable English/Arabic metadata.');
if(!translator.includes('window.SquadEnglishUI')) fail.push('Localization API marker missing.');
const count=(translator.match(/\\u0600|[\u0600-\u06ff]/g)||[]).length;
if(count<100) fail.push('Localization dictionary unexpectedly small.');
for(const file of ['chanse3/services-hub.html','chanse4/app-preview.html']){const html=await readFile(path.join(site,file),'utf8');if(!/<html lang="en" dir="ltr">/.test(html))fail.push(`${file} is not English/LTR.`);if(!html.includes('english-ui-v152.js'))fail.push(`${file} does not load localization.`)}
for(const file of ['chanse3/ai-hub.html','chanse3/store.html']){const html=await readFile(path.join(site,file),'utf8');if(!/<html lang="ar" dir="rtl">/.test(html))fail.push(`${file} is not explicitly Arabic/RTL.`);if(!html.includes('العودة إلى NEXORA'))fail.push(`${file} is missing its localized return navigation.`)}
const sw=await readFile(path.join(site,'sw.js'),'utf8');if(!sw.includes('nexora-v240-cinematic-identity-v238-social-interaction-notifications-v237-luxury-outdoor-estates-v236-property-lifestyle-studio-v235-property-room-design-cloud-v220-cinematic-door-auth')||!sw.includes('chanse4/english-ui-v152.js'))fail.push('Service Worker cache/precache not updated.');
if(fail.length){console.error('LOCALIZATION CHECK FAILED');for(const x of fail)console.error('- '+x);process.exit(1)}
console.log('LOCALIZATION CHECK PASSED — English/Arabic selectable entry points, shared translator, and Service Worker cache are wired.');
