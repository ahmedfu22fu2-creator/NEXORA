import fs from 'node:fs';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import os from 'node:os';
import path from 'node:path';
const root=process.cwd();
const html=fs.readFileSync(path.join(root,'site/chanse3/store.html'),'utf8');
const mirror=fs.readFileSync(path.join(root,'source/The-Squad-v137/chanse3/store.html'),'utf8');
assert.equal(html,mirror,'deployed store and source mirror must match');
for(const token of ['v247 — premium store refinement','prefers-reduced-motion','focus-visible','content-visibility:auto','aria-label="تصفية عناصر المتجر"','aria-live="polite"','economyGet','economyAction','buyCar','buyEstate','buyApartment','auth?.currentUser','جارٍ التأكيد…']) assert.ok(html.includes(token),`store missing ${token}`);
assert.equal((html.match(/\{id:'[^']+',type:'/g)||[]).length,11,'expected 11 existing catalog items; refinement must not change inventory');
assert.ok(html.includes('لا توجد مدفوعات بنكية أو تحويلات أموال حقيقية مفعّلة'),'real-money boundary must remain explicit');
assert.ok(!/011\d{8,}/.test(html),'personal phone number must not be embedded');
for(const rel of ['site/version.json','site/chanse4/version.json','source/The-Squad-v137/version.json','source/The-Squad-v137/chanse4/version.json']) {const v=JSON.parse(fs.readFileSync(path.join(root,rel),'utf8'));assert.ok(v.build>=247,`${rel} build must retain v247+ store refinement`);}
for(const rel of ['site/sw.js','source/The-Squad-v137/sw.js']) assert.ok(fs.readFileSync(path.join(root,rel),'utf8').includes('v247-store-experience-refinement'),`${rel} cache namespace mismatch`);
const inline=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(x=>x[1]).at(-1);
assert.ok(inline,'inline store controller missing');
const tmp=path.join(os.tmpdir(),`squad-v247-${process.pid}.mjs`);fs.writeFileSync(tmp,inline);
try{execFileSync(process.execPath,['--check',tmp],{stdio:'pipe'});}finally{fs.rmSync(tmp,{force:true});}
console.log('PASS v247 store refinement: source mirror, existing catalog preserved, accessible premium styling, reduced-motion support, purchase busy/error states, Firebase server-owned purchase path, release metadata and inline JS syntax.');
