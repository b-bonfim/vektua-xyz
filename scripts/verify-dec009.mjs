// Offline consistency check: node scripts/verify-dec009.mjs
// Does not validate rights, fabrication, or commercial release.
import { readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('../', import.meta.url));
const catalog = readFileSync(join(root, 'lib/catalog.ts'), 'utf8');
const expected = {
  'G-ORG-RC-01':'objetos', 'G-VAS-ESC-01':'objetos', 'G-VAS-MIN-01':'objetos',
  'G-ORG-HS-01':'objetos', 'G-CHV-JJ-01':'objetos',
  'S-HAL-DEC-01':'datas', 'S-NAT-PRE-01':'datas',
  'CAN-PESSOA-001':'feitos', 'CAN-PET-001':'feitos',
};
const physical = Object.keys(expected).filter(code => !code.startsWith('CAN-'));
const personalized = Object.keys(expected).filter(code => code.startsWith('CAN-'));
const rows = [...catalog.matchAll(/\bid:'((?:G|S|CAN)-[^']+)'[^\n]*?line:'(objetos|datas|feitos)'/g)];
assert.equal(rows.length, 9, 'Exactly nine catalog rows');
assert.deepEqual([...rows.map(x => x[1])].sort(), Object.keys(expected).sort(), 'Exact Founder SKU IDs');
for (const [,code,line] of rows) assert.equal(line, expected[code], `${code} category`);
for (const code of physical) {
  const path = join(root,'public/images/products',`${code}-main.webp`);
  const file = readFileSync(path);
  assert.ok(file.length > 100, `${code} image has data`);
  assert.equal(file.toString('ascii',0,4),'RIFF',`${code} RIFF header`);
  assert.equal(file.toString('ascii',8,12),'WEBP',`${code} WEBP header`);
  assert.ok(catalog.includes(`source3mf:'${code}.3mf'`),`${code} model provenance`);
  assert.ok(catalog.includes(`${code}-main.webp`),`${code} image binding`);
}
for (const code of personalized) {
  const path = join(root,'public/images/products',`${code}-placeholder.svg`);
  const illustration = readFileSync(path,'utf8');
  assert.ok(illustration.includes('AMOSTRA PENDENTE'), `${code} honest placeholder`);
  assert.ok(catalog.includes(`${code}-placeholder.svg`), `${code} asset bound`);
}
for (const [line,count] of Object.entries({objetos:5,datas:2,feitos:2})) {
  assert.equal(rows.filter(row=>row[2]===line).length,count, `${line} count`);
}
assert.ok(!/DEMO-0[1-6]/.test(catalog), 'Old mock products removed');
assert.ok(catalog.includes("statusGate:'EVIDENCE_PENDING'"), 'Gates remain pending');
assert.ok(catalog.includes('Não é a versão de parede'), 'Remote organizer is not wall-mounted');
console.log('PASS DEC-009: 9 exact SKUs, lines 5/2/2, 7 valid WebP headers, 2 honest placeholders, model provenance, no legacy DEMO products, no gates released.');
console.log('NOTE: This is a static/integrity test, not lint, full build, browser QA, license review, geometry proof or print validation.');
