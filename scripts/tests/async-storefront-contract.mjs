import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = process.cwd();
const read = (path) => readFileSync(resolve(root, path), 'utf8');

const runtime = read('lib/catalog-repository/runtime.ts');
assert.match(runtime, /type CatalogSource = 'static' \| 'supabase'/);
assert.match(runtime, /DEFAULT_CATALOG_SOURCE: CatalogSource = 'static'/);
assert.match(runtime, /Invalid CATALOG_SOURCE/);
assert.match(runtime, /createSupabaseCatalogRepository/);

const loader = read('components/commerce-storefront-loader.tsx');
assert.match(loader, /await Promise\.all/);
assert.match(loader, /repository\.getLines\(\)/);
assert.match(loader, /repository\.listProducts\(\)/);

const storefront = read('components/commerce-storefront.tsx');
assert.doesNotMatch(storefront, /commercial-catalog/);
assert.doesNotMatch(storefront, /supabase/i);
assert.match(storefront, /readonly CatalogLine\[\]/);
assert.match(storefront, /readonly CatalogProduct\[\]/);
assert.match(storefront, /Nenhum produto disponível no momento/);
assert.match(storefront, /Página não encontrada/);

const cart = read('components/cart-context.tsx');
assert.doesNotMatch(cart, /commercial-catalog/);

const whatsapp = read('lib/whatsapp-order.ts');
assert.doesNotMatch(whatsapp, /commercial-catalog/);
assert.match(whatsapp, /CatalogProduct/);

for (const path of [
  'app/page.tsx',
  'app/chaveiros/page.tsx',
  'app/como-funciona/page.tsx',
  'app/contato/page.tsx',
  'app/datas-colecoes/pequenos-encantos/page.tsx',
  'app/produto/can-pessoa-001/page.tsx',
  'app/sobre/page.tsx',
  'app/[...path]/page.tsx',
]) {
  const source = read(path);
  assert.match(source, /CommerceStorefrontLoader/, `${path} must use async storefront loader`);
  assert.doesNotMatch(source, /from '@\/lib\/commercial-catalog'/);
}

console.log('SB027_ASYNC_STOREFRONT_CONTRACT_PASS');
