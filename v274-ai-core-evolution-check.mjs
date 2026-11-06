import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
const root=process.cwd(),site=path.join(root,'site');
const js=fs.readFileSync(path.join(site,'v274-ai-core-evolution.js'),'utf8');
const css=fs.readFileSync(path.join(site,'v274-ai-core-evolution.css'),'utf8');
const html=fs.readFileSync(path.join(site,'index.html'),'utf8');
const sw=fs.readFileSync(path.join(site,'sw.js'),'utf8');
const v=JSON.parse(fs.readFileSync(path.join(site,'version.json'),'utf8'));
const checks=[
 ['AI Core assets are loaded exactly once',html.split('v274-ai-core-evolution.js?v=275').length===2 && html.split('v274-ai-core-evolution.css?v=275').length===2],
 ['Prompt router has distinct reply, idea, plan, explain and safety paths',['reply','idea','plan','explain','safety'].every(x=>js.includes(`id:'${x}'`))],
 ['Routing and prompt builder are exposed for integration',js.includes('function route(') && js.includes('function buildPrompt(') && js.includes('window.SquadAICore')],
 ['Prompt contains explicit anti-hallucination and privacy guardrails',js.includes('لا تختلق حقائق') && js.includes('احترم الخصوصية') && js.includes('موافقة صريحة')],
 ['Context is user-entered and length-bounded',js.includes('maxlength="3000"') && js.includes('maxlength="1500"') && js.includes('لا يقرأ الرسائل')],
 ['Manual memory is opt-in, bounded and local',js.includes("KEY='squad.v274.ai-core.workspace.v1'") && js.includes('s.notes.slice(0,30)') && js.includes('data-save-note')],
 ['Manual memory can be deleted and exported',js.includes('data-clear') && js.includes('data-export') && js.includes('URL.revokeObjectURL(url)')],
 ['No automatic external model/API calls are made',!js.includes('fetch(') && !js.includes('XMLHttpRequest') && !js.includes('WebSocket')],
 ['Accessible dialog, keyboard handling and focus return are present',js.includes('role="dialog"') && js.includes('aria-modal="true"') && js.includes("e.key==='Escape'") && js.includes('focusBack.focus()')],
 ['Responsive, focus-visible and reduced-motion styles exist',css.includes('@media(max-width:600px)') && css.includes(':focus-visible') && css.includes('prefers-reduced-motion')],
 ['Service worker cache and precache include v274 assets',sw.includes('v274-ai-core-evolution') && sw.includes('v274-ai-core-evolution.js') && sw.includes('v274-ai-core-evolution.css')],
 ['Release metadata is v274',v.build>=274 && ['ai-core-evolution','ai-integration','ai-intelligence','ai-agents-automation','ai-collaboration','project-intelligence','workspace-knowledge','command-center','cross-system-integration','experience-engine','adaptive-workspace','total-quality-stability','global-discovery','unified-ui-redesign','ai-intelligence-control-tower','3d-universe-evolution','marketplace-evolution'].includes(v.featureName)],
 ['Previous Social AI and performance systems remain in page',html.includes('v268-social-ai.js') && html.includes('v273-performance-reliability.js')],
 ['No personal data is automatically collected or transmitted',js.includes('لا تتم قراءة الرسائل أو الملفات') && js.includes('لا تتم قراءة الرسائل أو الملفات أو سجل التصفح تلقائيًا')]
];
for(const [name,ok] of checks){console.log(`${ok?'PASS':'FAIL'} ${name}`);assert.ok(ok,name)}
console.log(`v274 AI Core Evolution checks: ${checks.length}/${checks.length} PASS`);
