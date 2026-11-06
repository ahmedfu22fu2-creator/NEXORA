import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';
const root=process.cwd(),site=path.join(root,'site'),backend=path.join(root,'backend/firebase-functions');
const client=fs.readFileSync(path.join(site,'v274-ai-core-evolution.js'),'utf8');
const integration=fs.readFileSync(path.join(site,'v275-ai-integration.js'),'utf8');
const fn=fs.readFileSync(path.join(backend,'index.js'),'utf8');const html=fs.readFileSync(path.join(site,'index.html'),'utf8');
const ver=JSON.parse(fs.readFileSync(path.join(site,'version.json'),'utf8'));
const checks=[
 ['callable is exported',fn.includes('exports.generateSquadAIResponse')],
 ['API key uses Firebase secret',fn.includes("defineSecret('SQUAD_AI_API_KEY')")&&fn.includes('secrets: [SQUAD_AI_API_KEY]')],
 ['authentication required',fn.includes("if (!uid) throw new HttpsError('unauthenticated'")],
 ['server rate limit',fn.includes('AI_RATE_LIMIT_PER_MINUTE = 8')&&fn.includes('AI_RATE_LIMIT_PER_DAY = 60')&&fn.includes('runTransaction')],
 ['input bounded',fn.includes('AI_MAX_INPUT_CHARS = 4500')],
 ['prompts not persisted',!fn.includes("collection('squadAIPrompts')")],
 ['timeout protection',fn.includes('AbortController')&&fn.includes('timeoutSeconds: 30')],
 ['explicit consent UI',client.includes('هل توافق؟')&&client.includes('data-generate')],
 ['no automatic submission',!integration.includes('httpsCallable(\'generateSquadAIResponse\')')],
 ['UI assets wired',html.includes('v275-ai-integration.css')&&html.includes('v275-ai-integration.js')],
 ['version manifest current',ver.build>=275&&['ai-integration','ai-intelligence','ai-agents-automation','ai-collaboration','project-intelligence','workspace-knowledge','command-center','cross-system-integration','experience-engine','adaptive-workspace','total-quality-stability','global-discovery','unified-ui-redesign','ai-intelligence-control-tower','3d-universe-evolution','marketplace-evolution'].includes(ver.featureName),'ai-intelligence'],
 ['response rendered as text',client.includes('body.textContent=answer')]
];for(const [name,ok] of checks){console.log(`${ok?'PASS':'FAIL'} ${name}`);assert.ok(ok,name)}console.log(`v275 AI integration checks: ${checks.length}/${checks.length} PASS`);
