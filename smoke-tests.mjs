import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';

const site = path.resolve('site');
const html = await readFile(path.join(site, 'index.html'), 'utf8');
const scriptRefs = [...html.matchAll(/<script\b[^>]*\bsrc=["']([^"']+)["'][^>]*>/gi)]
  .map(m => m[1]).filter(ref => !/^https?:/i.test(ref));
assert(scriptRefs.length > 0, 'main page should load local application scripts');
for (const ref of scriptRefs) {
  const target = path.resolve(site, decodeURIComponent(ref.split(/[?#]/)[0]));
  await stat(target);
}
const jsFiles = (await walk(site)).filter(file => file.endsWith('.js'));
for (const file of jsFiles) {
  const source = await readFile(file, 'utf8');
  const check = spawnSync(process.execPath, ['--check', file], { encoding: 'utf8' });
  assert.equal(check.status, 0, `JavaScript syntax error in ${path.relative(site, file)}: ${check.stderr}`);
}
const rules = await readFile(path.join(site, 'chanse1', 'firestore.rules'), 'utf8');
assert.match(rules, /request\.auth\s*!=\s*null/, 'Firestore rules should contain authenticated-user checks');
assert.doesNotMatch(rules, /allow\s+(?:read|write|read\s*,\s*write)\s*:\s*if\s+true\s*;/i, 'Firestore rules must not grant public unconditional access');
console.log(`SMOKE TESTS PASSED — ${scriptRefs.length} local scripts resolved; ${jsFiles.length} JavaScript files parsed; basic Firestore checks passed.`);

async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...await walk(full)); else out.push(full);
  }
  return out;
}
