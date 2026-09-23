import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { extractSnapshot } from '../catalog/extract-static-catalog.mjs';

function fixture(fn) {
  const base = mkdtempSync(path.join(os.tmpdir(), 'sb020-'));
  const publicDir = path.join(base, 'public');
  mkdirSync(path.join(publicDir, 'images'), { recursive: true });
  writeFileSync(path.join(publicDir, 'images', 'SKU_REMIX.webp'), 'fixture');
  const lines = [{ id: 'chaveiros', name: 'Chaveiros', path: '/chaveiros', verb: 'Descobrir', description: 'Descrição literal', image: '/images/SKU_REMIX.webp' }];
  const products = [{ id: 'SKU-001', slug: 'sku-001', name: 'Título literal', description: 'Texto literal', line: 'chaveiros', collection: 'Halloween', personalized: false, image: '/images/SKU_REMIX.webp', gallery: ['/images/SKU_REMIX.webp'] }];
  try { fn({ publicDir, lines, products, extract: () => extractSnapshot({ lines, products, publicDir, sourceDigest: 'abc' }) }); }
  finally { rmSync(base, { recursive: true, force: true }); }
}

test('preserves data and repeated media; produces deterministic bytes', () => fixture(({ extract }) => {
  const a = extract(), b = extract();
  assert.equal(a.validation.valid, true);
  assert.equal(a.datasetText, b.datasetText);
  assert.equal(a.reportText, b.reportText);
  const row = JSON.parse(a.datasetText).products[0];
  assert.equal(row.name, 'Título literal');
  assert.equal(row.description, 'Texto literal');
  assert.equal(row.collection, 'Halloween');
  assert.equal(row.personalized, false);
  assert.deepEqual(row.media, { primary: '/images/SKU_REMIX.webp', gallery: ['/images/SKU_REMIX.webp'] });
}));
test('detects duplicate SKU', () => fixture(({ products, extract }) => {
  products.push({ ...products[0], slug: 'different' });
  assert(extract().validation.issues.some(x => x.code === 'DUPLICATE_SKU'));
}));
test('detects duplicate slug', () => fixture(({ products, extract }) => {
  products.push({ ...products[0], id: 'DIFFERENT' });
  assert(extract().validation.issues.some(x => x.code === 'DUPLICATE_SLUG'));
}));
test('detects invalid product line', () => fixture(({ products, extract }) => {
  products[0].line = 'unknown';
  assert(extract().validation.issues.some(x => x.code === 'INVALID_PRODUCT_LINE'));
}));
test('detects missing gallery files', () => fixture(({ products, extract }) => {
  products[0].gallery = ['/images/missing.webp'];
  assert(extract().validation.issues.some(x => x.code === 'MISSING_FILE' && x.field === 'gallery[0]'));
}));
test('rejects path traversal', () => fixture(({ products, extract }) => {
  products[0].image = '/images/../secret.webp';
  assert(extract().validation.issues.some(x => x.code === 'INVALID_LOCAL_PATH'));
}));
test('permits an absent personalized primary without inventing an asset', () => fixture(({ products, extract }) => {
  products[0].image = undefined;
  products[0].gallery = undefined;
  products[0].personalized = true;
  assert.equal(extract().validation.valid, true);
  assert.equal(JSON.parse(extract().datasetText).products[0].media.primary, null);
}));
