import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const site = path.join(root, 'site');
const htmlPath = path.join(site, 'index.html');
const html = await readFile(htmlPath, 'utf8');
const errors = [];
const markupOnly = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '<script></script>');
const localRefs = [...markupOnly.matchAll(/(?:src|href)=["']([^"']+)["']/gi)]
  .map(match => match[1])
  .filter(ref => !/^(?:https?:|data:|#|mailto:|tel:|javascript:)/i.test(ref));
for (const ref of localRefs) {
  const clean = decodeURIComponent(ref.split(/[?#]/)[0]);
  if (!clean) continue;
  try { await stat(path.resolve(site, clean)); }
  catch { errors.push(`Missing local HTML reference: ${ref}`); }
}
for (const folder of ['chanse1', 'chanse2', 'chanse3', 'chanse4']) {
  try { await stat(path.join(root, 'source', 'The-Squad-v137', folder)); }
  catch { errors.push(`Preserved source folder missing: ${folder}`); }
  try { await stat(path.join(site, folder)); }
  catch { errors.push(`Static site folder missing: ${folder}`); }
}
const productionFiles = await walk(site);
for (const file of productionFiles) {
  const rel = path.relative(site, file).replaceAll('\\', '/').toLowerCase();
  if (/(^|\/)(tests?|__tests__)(\/|$)/.test(rel)) errors.push(`Test directory leaked into production: ${rel}`);
  if (/(^|\/)(fakefb2?|fake-firebase)(\.|\/)/.test(rel)) errors.push(`Fake Firebase fixture leaked into production: ${rel}`);
}
const rules = await readFile(path.join(site, 'chanse1', 'firestore.rules'), 'utf8');
if (/allow\s+(?:read|write|read\s*,\s*write)\s*:\s*if\s+true\s*;/i.test(rules)) {
  errors.push('Firestore rules contain an unconditional public allow rule.');
}
if (!/request\.auth\s*!=\s*null/.test(rules)) errors.push('Firestore rules do not appear to require authenticated requests.');
if (errors.length) {
  console.error('PRODUCTION AUDIT FAILED');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}
console.log(`PRODUCTION AUDIT PASSED — ${localRefs.length} local HTML references checked; four source and site folders present; test fixtures excluded; basic Firestore guard checks passed.`);

async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...await walk(full)); else out.push(full);
  }
  return out;
}
