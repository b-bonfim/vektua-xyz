// Static SKU/image integrity check. Run against the exact candidate checkout; no network or GitHub Actions.
import assert from 'node:assert/strict';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const source = readFileSync(join(root, 'lib/commercial-catalog.ts'), 'utf8');
const skuSection = source.split('const newKeyrings:')[1]?.split('const remixKeyringImages:')[0];
const imageSection = source.split('const remixKeyringImages:')[1]?.split('export const commercialProducts:')[0];
assert.ok(skuSection && imageSection, 'Commercial catalog structure changed; review this test.');
const skus = [...skuSection.matchAll(/\[\s*'(G-CHV-[A-Z0-9-]+)'\s*,/g)].map(match => match[1]);
const mappings = [...imageSection.matchAll(/["'](G-CHV-[A-Z0-9-]+)["']\s*:\s*["'](\/images\/products\/remix\/[^"']+)["']/g)];
assert.ok(skus.length > 0, 'No new keyring SKUs found.');
assert.equal(new Set(skus).size, skus.length, 'Duplicate keyring SKU.');
assert.equal(mappings.length, skus.length, 'Image mappings count does not match keyring SKU count.');
const paths = new Set();
for (const [, sku, url] of mappings) {
  assert.ok(skus.includes(sku), `Image mapping without keyring: ${sku}`);
  assert.equal(url.split('/').at(-1)?.split('_REMIX.')[0], sku, `Incorrect SKU/image mapping: ${sku}`);
  assert.match(url, /_REMIX\.(png|webp)$/i, `Non-REMIX image: ${sku}`);
  assert.ok(!paths.has(url), `Image reused across different SKUs: ${url}`);
  paths.add(url);
  const file = join(root, 'public', url.slice(1));
  assert.ok(existsSync(file), `Missing REMIX file: ${file}`);
  assert.ok(statSync(file).size > 128, `Empty or invalid-size image: ${file}`);
  const bytes = readFileSync(file);
  const png = bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
  const webp = bytes.toString('ascii', 0, 4) === 'RIFF' && bytes.toString('ascii', 8, 12) === 'WEBP';
  assert.ok(url.endsWith('.png') ? png : webp, `Image signature does not match extension: ${file}`);
  console.log(`PASS ${sku} => ${url} (${bytes.length} bytes)`);
}
for (const sku of skus) assert.ok(mappings.some(match => match[1] === sku), `Missing image mapping: ${sku}`);
console.log(`GO_LIVE_STATIC_PASS keyrings=${skus.length} images=${mappings.length}`);
