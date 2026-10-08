/** SB-029 — functional HTTP smoke in Supabase mode.
 * Read-only. Does not mutate Supabase, send WhatsApp messages, or initiate payment.
 */
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

const rawBase = process.env.BASE_URL;
assert.ok(rawBase, 'BASE_URL is required.');
assert.equal(
  (process.env.CATALOG_SOURCE_EXPECTED || '').toLowerCase(),
  'supabase',
  'CATALOG_SOURCE_EXPECTED=supabase is required.'
);

const base = new URL(rawBase);
assert.ok(['http:', 'https:'].includes(base.protocol), 'BASE_URL must use HTTP(S).');
assert.equal(base.username + base.password, '', 'Do not place credentials in BASE_URL.');

let commit = null;
try {
  commit = execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
} catch {
  // Keep null if git metadata is unavailable; the report will not claim a commit.
}

if (process.env.EXPECTED_COMMIT) {
  assert.ok(commit, 'Git commit could not be resolved.');
  assert.equal(commit, process.env.EXPECTED_COMMIT, 'Running commit differs from EXPECTED_COMMIT.');
}

const checks = [];
let failures = 0;
let fiveXX = 0;

async function check(name, path, verify) {
  try {
    const response = await fetch(new URL(path.slice(1), base), {
      redirect: 'follow',
      signal: AbortSignal.timeout(30000),
    });
    if (response.status >= 500) fiveXX += 1;
    assert.equal(response.status, 200, `${path}: expected 200, got ${response.status}`);
    const type = response.headers.get('content-type') || '';
    assert.match(type, /text\/html/i, `${path}: expected HTML, got ${type}`);
    const html = await response.text();
    assert.match(html, /Vektua XYZ/i, `${path}: missing site identity`);
    assert.ok(!/Internal Server Error|Application error/i.test(html), `${path}: application error rendered`);
    if (verify) verify(html);
    checks.push({ name, path, status: 'PASS', httpStatus: response.status });
    console.log(`PASS [supabase] ${name} ${path}`);
  } catch (error) {
    failures += 1;
    checks.push({ name, path, status: 'FAIL', error: String(error) });
    console.error(`FAIL [supabase] ${name} ${path}: ${error}`);
  }
}

await check('home', '/', html => {
  assert.match(html, /Quatro linhas\. Uma marca\./i);
  assert.match(html, /\/produto\/g-org-rc-01/i, 'home must expose a publishable product');
});
await check('busca', '/busca', html => assert.match(html, /Todos os produtos/i));
await check('linha-objetos', '/objetos-colecionaveis', html => assert.match(html, /Objetos/i));
await check('linha-datas', '/datas-colecoes', html => assert.match(html, /Datas/i));
await check('linha-personalizados', '/feitos-para-voce', html => assert.match(html, /Feitos para Você/i));
await check('linha-chaveiros', '/chaveiros', html => assert.match(html, /Chaveiros/i));
await check('produto-objeto', '/produto/g-org-rc-01', html => assert.doesNotMatch(html, /Página não encontrada/i));
await check('produto-chaveiro', '/produto/g-chv-blo-01', html => assert.doesNotMatch(html, /Página não encontrada/i));
await check('carrinho', '/carrinho', html => {
  assert.match(html, /Seu carrinho/i);
  assert.match(html, /WhatsApp/i);
});
await check('politica-privacidade', '/politicas/privacidade', html => assert.match(html, /Privacidade/i));
await check('politica-entrega', '/politicas/entrega', html => assert.match(html, /Entrega/i));
await check('politica-trocas', '/politicas/trocas-devolucoes', html => assert.match(html, /Trocas|Devoluções/i));

const report = {
  card: 'SB-029',
  catalogSourceExpected: 'supabase',
  baseURL: base.href,
  commit,
  expectedCommit: process.env.EXPECTED_COMMIT || null,
  checkedAt: new Date().toISOString(),
  checks,
  failures,
  fiveXX,
  whatsappE2E: 'Run scripts/tests/sb-028-cart-whatsapp-browser.mjs on the same commit.',
};

if (process.env.QA_OUTPUT) {
  const file = resolve(process.env.QA_OUTPUT);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, JSON.stringify(report, null, 2) + '\n');
}

console.log(`SB029_FUNCTIONAL_HTTP_${failures ? 'FAIL' : 'PASS'} checks=${checks.length} failures=${failures} fiveXX=${fiveXX} commit=${commit || 'unresolved'}`);
if (failures || fiveXX) process.exitCode = 1;
