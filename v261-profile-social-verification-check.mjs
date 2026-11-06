import fs from 'node:fs';
import assert from 'node:assert/strict';
const feed=fs.readFileSync('site/chanse3/social-feed.js','utf8');
const hub=fs.readFileSync('site/v162-global-hub.js','utf8');
const identity=fs.readFileSync('site/v199-squad-identity.js','utf8');
const css=fs.readFileSync('site/v199-squad-identity.css','utf8');
const html=fs.readFileSync('site/index.html','utf8');
const checks=[
 ['feed verification comes from public profile projection',feed.includes('publicProfiles/${id}')&&feed.includes("snap.data()?.verified===true")],
 ['feed verification lookups are deduplicated',feed.includes('verificationCache')&&feed.includes('verificationPending')],
 ['feed badges default to hidden and use accessible label',feed.includes('data-dr-verified=')&&feed.includes('hidden')&&feed.includes('aria-label=')],
 ['feed hydration is bounded to visible page authors',feed.includes('.slice(0,PAGE*2)')],
 ['global people search displays server-issued badge only',hub.includes('p.verified===true')&&hub.includes('aria-label=')],
 ['profile verification progress uses public follower count',identity.includes('data-sq199-verification-progress')&&identity.includes('data.followerCount')&&identity.includes('5,000')],
 ['verification remains server-owned; no client grant code',!identity.includes('verified: true')&&!feed.includes("update({verified")],
 ['badge and progress responsive styles exist',css.includes('.sq199-verification-progress')&&css.includes('.dr-post-verified')],
 ['identity stylesheet cache is versioned',html.includes('v199-squad-identity.css?v=261')]
];
for(const [name,ok] of checks)console.log(`${ok?'PASS':'FAIL'} ${name}`);
assert.ok(checks.every(x=>x[1]),'v261 profile/social verification checks failed');
console.log(`v261 profile/social verification: ${checks.filter(x=>x[1]).length}/${checks.length} PASS`);
