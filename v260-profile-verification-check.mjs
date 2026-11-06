import fs from 'node:fs';
import assert from 'node:assert/strict';
const backend=fs.readFileSync('backend/firebase-functions/index.js','utf8');
const ui=fs.readFileSync('site/v199-squad-identity.js','utf8');
const css=fs.readFileSync('site/v199-squad-identity.css','utf8');
const rules=fs.readFileSync('site/chanse1/firestore.rules','utf8');
const html=fs.readFileSync('site/index.html','utf8');
const accounts=fs.readFileSync('site/chanse3/accounts.js','utf8');
const checks=[
 ['server trigger watches actual follower documents',backend.includes("document: 'users/{userId}/followers/{followerId}'")&&backend.includes('onDocumentWritten')],
 ['threshold is exactly 5,000',backend.includes('count >= 5000')],
 ['existing accounts can self-refresh through authenticated rate-limited callable',backend.includes('exports.refreshMyProfileVerification = onCall')&&backend.includes('6 * 60 * 60 * 1000')&&backend.includes('request.auth?.uid')],
 ['count is derived by Firestore aggregation',backend.includes('followers.count().get()')],
 ['verified state is written by Admin SDK trigger',backend.includes('profileRef.set(patch, {merge: true})')],
 ['verification timestamp is server generated',backend.includes('FieldValue.serverTimestamp()')],
 ['verification is permanent after first reaching the threshold',backend.includes('Once granted at 5,000 followers, the badge is permanent')&&backend.includes('Verification remains granted after first crossing the threshold')&&!backend.includes('patch.verifiedAt = FieldValue.delete()')],
 ['client UI reads public profile projection',ui.includes('publicProfiles/${uid}')],
 ['client UI never awards verification locally',ui.includes('data.verified!==true')],
 ['profile UI requests a server-side self refresh',ui.includes('refreshMyProfileVerification')],
 ['public profile card shows only server-issued verification',accounts.includes('pub.verified===true')&&accounts.includes('pub.followerCount')],
 ['verified mark is accessible and hidden by default',ui.includes('aria-label="حساب موثّق"')&&ui.includes('data-sq199-verified hidden')],
 ['badge visual style is present',css.includes('.sq199-verified')],
 ['public profile client updates cannot alter verification fields',rules.includes("affectedKeys().hasOnly(['name','bio','city'])")],
 ['identity script remains loaded',html.includes('v199-squad-identity.js')]
];
for(const [name,ok] of checks)console.log(`${ok?'PASS':'FAIL'} ${name}`);
assert.ok(checks.every(x=>x[1]),'v260 profile verification regression checks failed');
console.log(`v260 profile verification: ${checks.filter(x=>x[1]).length}/${checks.length} PASS`);
