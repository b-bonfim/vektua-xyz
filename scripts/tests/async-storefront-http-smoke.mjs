/** Read-only smoke for SB-027 async storefront.
 * Run against the exact local candidate twice: CATALOG_SOURCE=static and CATALOG_SOURCE=supabase.
 * This script never writes orders, sends WhatsApp messages, mutates Supabase, or triggers payment.
 */
import assert from 'node:assert/strict';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

const rawBase = process.env.BASE_URL;
const source = process.env.CATALOG_SOURCE_EXPECTED;
assert.ok(rawBase, 'BASE_URL is required.');
assert.ok(source === 'static' || source === 'supabase', 'CATALOG_SOURCE_EXPECTED must be static or supabase.');

const base = new URL(rawBase);
assert.ok(['http:', 'https:'].includes(base.protocol), 'BASE_URL must use HTTP(S).');
assert.equal(base.username + base.password, '', 'Do not place credentials in BASE_URL.');

const checks = [];
let failures = 0;

async function check(path, verify) {
  try {
    const response = await fetch(new URL(path.slice(1), base), {
      redirect: 'follow',
      signal: AbortSignal.timeout(30000),
    });
    assert.equal(response.status, 200, `${path}: expected 200, got ${response.status}`);
    const type = response.headers.get('content-type') || '';
    assert.match(type, /text\/html/i, `${path}: expected HTML, got ${type}`);
    const html = await response.text();
    assert.match(html, /Vektua XYZ/i, `${path}: missing site identity`);
    assert.ok(!/Internal Server Error|Application error/i.test(html), `${path}: application error rendered`);
    if (verify) verify(html);
    checks.push({ path, status: 'PASS' });
    console.log(`PASS [${source}] ${path}`);
  } catch (error) {
    failures += 1;
    checks.push({ path, status: 'FAIL', error: String(error) });
    console.error(`FAIL [${source}] ${path}: ${error}`);
  }
}

await check('/', (html) => {
  assert.match(html, /Quatro linhas\. Uma marca\./i);
  assert.match(html, /\/produto\/g-org-rc-01/i, 'home must expose the expected featured catalog when source data is publishable');
});
await check('/busca', (html) => assert.match(html, /Todos os produtos/i));
await check('/objetos-colecionaveis', (html) => assert.match(html, /Objetos &amp; Colecionáveis|Objetos & Colecionáveis/i));
await check('/datas-colecoes', (html) => assert.match(html, /Datas &amp; Coleções|Datas & Coleções/i));
await check('/feitos-para-voce', (html) => assert.match(html, /Feitos para Você/i));
await check('/chaveiros', (html) => assert.match(html, /Chaveiros/i));
await check('/produto/g-org-rc-01', (html) => assert.doesNotMatch(html, /Página não encontrada/i));
await check('/produto/g-chv-blo-01', (html) => assert.doesNotMatch(html, /Página não encontrada/i));
await check('/produto/sku-inexistente-sb027', (html) => assert.match(html, /Página não encontrada/i));
await check('/carrinho', (html) => assert.match(html, /Seu carrinho/i));

const output = {
  card: 'SB-027',
  source,
  baseURL: base.href,
  checkedAt: new Date().toISOString(),
  checks,
  failures,
};

if (process.env.QA_OUTPUT) {
  const file = resolve(process.env.QA_OUTPUT);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, JSON.stringify(output, null, 2) + '\n');
}

console.log(`SB027_HTTP_SMOKE_${failures ? 'FAIL' : 'PASS'} source=${source} checks=${checks.length} failures=${failures}`);
if (failures) process.exitCode = 1;
