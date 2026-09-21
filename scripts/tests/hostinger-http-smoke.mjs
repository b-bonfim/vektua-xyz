/** Read-only HTTP smoke for the actual Hostinger standalone server (or public release).
 * No GitHub Actions, order submission, payment, WhatsApp sending or state mutation.
 * Usage: BASE_URL=http://127.0.0.1:3000 node scripts/tests/hostinger-http-smoke.mjs
 */
import assert from 'node:assert/strict';
import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';

const rawBase = process.env.BASE_URL;
assert.ok(rawBase, 'BASE_URL required: set the URL of the running release explicitly.');
const base = new URL(rawBase);
assert.ok(['http:', 'https:'].includes(base.protocol), 'BASE_URL must be HTTP(S).');
assert.equal(base.username + base.password, '', 'Never put credentials in BASE_URL.');
assert.ok(!base.search && !base.hash, 'BASE_URL must not contain a query or fragment.');
assert.equal(base.pathname, '/', 'BASE_URL must be the site origin, not a nested path.');
const root = resolve(process.env.RELEASE_ROOT || process.cwd());
const source = readFileSync(resolve(root, 'lib/commercial-catalog.ts'), 'utf8');
const imageBlock = source.split('const remixKeyringImages:')[1]?.split('export const commercialProducts:')[0];
assert.ok(imageBlock, 'REMIX image manifest not found; update smoke before release.');
const matches = [...imageBlock.matchAll(/["'](G-CHV-[A-Z0-9-]+)["']\s*:\s*["'](\/images\/products\/remix\/[^"']+_REMIX\.(?:png|webp))["']/gi)];
assert.ok(matches.length, 'No SKU REMIX images found; release manifest may be malformed.');
assert.equal(new Set(matches.map(match => match[1])).size, matches.length, 'Duplicate image SKU.');
const paths = [
  '/', '/busca', '/objetos-colecionaveis', '/datas-colecoes',
  '/feitos-para-voce', '/chaveiros', '/produto/g-chv-blo-01',
  '/produto/g-org-rc-01', '/carrinho', '/politicas/privacidade',
  '/politicas/entrega', '/politicas/trocas-devolucoes', '/politicas/termos',
];
const output = { startedAt: new Date().toISOString(), baseURL: base.href, sha: process.env.RELEASE_SHA || null, checks: [], failures: 0 };
async function check(label, path, isImage) {
  try {
    const url = new URL(path.slice(1), base);
    const response = await fetch(url, { redirect: 'follow', signal: AbortSignal.timeout(30000) });
    assert.equal(response.status, 200, `${url}: expected HTTP 200, got ${response.status}`);
    if (isImage) {
      const type = response.headers.get('content-type') || '';
      const expected = path.toLowerCase().endsWith('.png') ? 'image/png' : 'image/webp';
      assert.ok(type.toLowerCase().startsWith(expected), `${path}: MIME ${type}; expected ${expected}`);
      const reader = response.body?.getReader();
      assert.ok(reader, `${path}: image has no response body`);
      const bytes = [];
      let count = 0;
      while (count < 12) {
        const { done, value } = await reader.read();
        if (done) break;
        bytes.push(value); count += value.length;
      }
      await reader.cancel();
      const start = Buffer.concat(bytes).subarray(0, 12);
      const valid = expected === 'image/png'
        ? start.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
        : start.toString('ascii', 0, 4) === 'RIFF' && start.toString('ascii', 8, 12) === 'WEBP';
      assert.ok(valid, `${path}: invalid image signature`);
    } else {
      const type = response.headers.get('content-type') || '';
      assert.match(type, /text\/html/i, `${path}: expected HTML, got ${type}`);
      const html = await response.text();
      assert.match(html, /Vektua XYZ/i, `${path}: missing site identity`);
      assert.ok(!html.includes('RSC prefetch setup error'), `${path}: known Vinext error in HTML`);
    }
    output.checks.push({ label, path, status: 'PASS' });
    console.log(`PASS ${label} ${path}`);
  } catch (error) {
    output.failures++;
    output.checks.push({ label, path, status: 'FAIL', error: String(error) });
    console.error(`FAIL ${label} ${path}: ${error}`);
  }
}
for (const path of paths) await check('route', path, false);
for (const [, sku, path] of matches) await check(`remix:${sku}`, path, true);
output.finishedAt = new Date().toISOString();
if (process.env.QA_OUTPUT) {
  const file = resolve(process.env.QA_OUTPUT);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, JSON.stringify(output, null, 2) + '\n');
}
console.log(`HOSTINGER_HTTP_SMOKE ${output.failures ? 'FAIL' : 'PASS'} routes=${paths.length} images=${matches.length} failures=${output.failures}`);
console.log('HTTP/MIME/signature checks do not replace Playwright, visual review, payment/WhatsApp acceptance or deploy evidence.');
if (output.failures) process.exitCode = 1;
