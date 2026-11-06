import fs from 'node:fs';
import assert from 'node:assert/strict';
const hub=fs.readFileSync('site/v162-global-hub.js','utf8');
const css=fs.readFileSync('site/v162-global-hub.css','utf8');
const html=fs.readFileSync('site/index.html','utf8');
const sw=fs.readFileSync('site/sw.js','utf8');
const version=JSON.parse(fs.readFileSync('site/version.json','utf8'));
const checks=[
 ['Arabic-aware normalization',hub.includes('normalizeSearch=')&&hub.includes("normalize('NFKC')")],
 ['diacritic and tatweel normalization',hub.includes('064B-\\u065F')&&hub.includes('0640')],
 ['separate search data loader',hub.includes('async function loadSearchData()')],
 ['partial dataset loading',hub.includes('Promise.allSettled(tasks)')],
 ['short in-memory cache',hub.includes('now-searchCache.at<30000')],
 ['public published post filtering',hub.includes("p.status==='published'&&p.visibility==='public'")],
 ['member-scoped chat query',hub.includes("where('members','array-contains',uid())")],
 ['clear search control',hub.includes('data-sq162-clear')],
 ['accessible live status',hub.includes('role="status" aria-live="polite"')],
 ['chat filtering',hub.includes('data.chats.filter')],
 ['privacy note',hub.includes('لا يتم البحث في رسائل الآخرين الخاصة')],
 ['search styling',css.includes('v256 — refined global search experience')],
 ['reduced motion support',css.includes('prefers-reduced-motion:reduce')],
 ['versioned stylesheet',html.includes('v162-global-hub.css?v=256')],
 ['service worker cache version',sw.includes('v256-global-search')],
 ['build number',version.build>=256],
 ['feature name',['global-search-refinement','admin-control-refinement','content-moderation-refinement','community-channel-discovery-refinement','profile-verification-5000','profile-social-verification','followers-friends-refinement','avatar-capture-3d-call-identity','avatar-expression-lipsync-refinement','avatar-creator-studio','avatar-3d-viewer','avatar-complete-pipeline','social-ai','creator-economy','privacy-safety','quality-upgrade','performance-reliability','ai-core-evolution','ai-integration','ai-intelligence','ai-agents-automation','ai-collaboration','project-intelligence','workspace-knowledge','command-center','cross-system-integration','experience-engine','adaptive-workspace','total-quality-stability','global-discovery','unified-ui-redesign','ai-intelligence-control-tower','3d-universe-evolution','marketplace-evolution'].includes(version.currentFeatureName)]
];
for(const [name,ok] of checks){assert.ok(ok,`FAIL: ${name}`)}
console.log(`v256 global search refinement checks: PASS (${checks.length} assertions)`);
