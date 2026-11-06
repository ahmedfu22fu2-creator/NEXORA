import fs from 'node:fs';
import assert from 'node:assert/strict';
const fn=fs.readFileSync('backend/firebase-functions/index.js','utf8');
const checks=[
  ['all platform wallet mutations remain server-admin authorized', (fn.match(/await requireSquadAdmin\(request\)/g)||[]).length >= 5],
  ['wallet amounts are converted to integer cents', fn.includes('function moneyToCents') && fn.includes('function moneyFromCents')],
  ['stored wallet values reject negative, non-finite and excessive values', fn.includes('!Number.isFinite(n)') && fn.includes('n < 0') && fn.includes('n > 1000000000000')],
  ['earning ledger guards balance and lifetime-earned overflow', fn.includes("moneyToCents(old.balance, 'balance') + amountCents") && fn.includes("moneyToCents(old.totalEarned, 'totalEarned') + amountCents")],
  ['withdrawal requests validate balance and pending totals', fn.includes("moneyToCents(old.pendingWithdrawals, 'pendingWithdrawals')") && fn.includes('amountCents > balanceCents')],
  ['settlement refuses inconsistent pending ledger instead of clamping silently', fn.includes('requestCents > pendingCents') && !fn.includes('Math.max(0,Number(w.pendingWithdrawals')],
  ['manual payout remains manual and status-gated', fn.includes("decision === 'mark_paid'") && fn.includes("r.status !== 'approved_for_manual_payout'") && fn.includes("status:'paid_manually_recorded'")],
  ['wallet callable exports remain available', ['getPlatformWallet','recordPlatformEarning','requestPlatformWithdrawal','resolvePlatformWithdrawal'].every(x=>fn.includes(`exports.${x} = onCall`))]
];
let fail=0;for(const [name,ok] of checks){console.log(`${ok?'PASS':'FAIL'} ${name}`);if(!ok)fail++;}
assert.equal(fail,0,`${fail} wallet hardening checks failed`);
console.log(`${checks.length}/${checks.length} V177 WALLET HARDENING CHECKS PASSED`);
