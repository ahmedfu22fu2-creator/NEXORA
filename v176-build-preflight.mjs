import fs from 'node:fs';
import { createRequire } from 'node:module';
const require=createRequire(import.meta.url);
const pkg=JSON.parse(fs.readFileSync('package.json','utf8'));
const required=['vite','esbuild'];
const missing=required.filter(name=>{try{require.resolve(name+'/package.json')}catch{return true}});
const nodeMajor=Number(process.versions.node.split('.')[0]);
console.log(`Node ${process.versions.node}; required engine ${pkg.engines?.node||'not specified'}`);
if(nodeMajor<20){console.error('FAIL: Node 20 or newer is required.');process.exitCode=1;}
if(missing.length){console.error(`BUILD NOT READY: missing ${missing.join(', ')}.`);console.error('Run: npm install --no-audit --no-fund');console.error('Then run: npm run build');process.exitCode=1;}
else {console.log('BUILD READY: Vite and esbuild are installed. Run npm run build.');}
