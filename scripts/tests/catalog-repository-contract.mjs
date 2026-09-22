import fs from 'node:fs';

const read = (path) => fs.readFileSync(path, 'utf8');

const typesSource = read('lib/catalog-repository/types.ts');
const contractSource = read('lib/catalog-repository/catalog-repository.ts');
const staticAdapterSource = read(
  'lib/catalog-repository/static-catalog-repository.ts',
);
const indexSource = read('lib/catalog-repository/index.ts');

const storefrontSources = [
  'components/commerce-storefront.tsx',
  'components/storefront.tsx',
  'components/chaveiros-v2.tsx',
  'app/[...path]/page.tsx',
].map((path) => [path, read(path)]);

const fail = (message) => {
  throw new Error(`SB-006 contract failure: ${message}`);
};

for (const method of ['listProducts', 'getProductBySlug', 'getLines']) {
  if (!contractSource.includes(`${method}(`)) {
    fail(`CatalogRepository is missing required method: ${method}`);
  }
}

for (const queryField of [
  'line?:',
  'query?:',
  'collection?:',
  'excludeProductId?:',
  'limit?:',
]) {
  if (!typesSource.includes(queryField)) {
    fail(`CatalogProductQuery is missing storefront query field: ${queryField}`);
  }
}

for (const blockedToken of [
  'database.types',
  "Database['public']",
  'Tables<',
  '@supabase/supabase-js',
  '.from(',
]) {
  if (typesSource.includes(blockedToken) || contractSource.includes(blockedToken)) {
    fail(`public repository contract is coupled to persistence type: ${blockedToken}`);
  }
}

if (!staticAdapterSource.includes("from '../commercial-catalog'")) {
  fail('StaticCatalogRepository does not adapt the current commercial catalog');
}

if (!staticAdapterSource.includes('implements CatalogRepository')) {
  fail('StaticCatalogRepository does not implement CatalogRepository');
}

for (const method of ['listProducts', 'getProductBySlug', 'getLines']) {
  if (!staticAdapterSource.includes(`async ${method}(`)) {
    fail(`StaticCatalogRepository is missing implementation: ${method}`);
  }
}

if (!indexSource.includes('staticCatalogRepository')) {
  fail('repository public entrypoint does not export the static adapter');
}

for (const [path, source] of storefrontSources) {
  for (const blockedToken of [
    '@/lib/supabase',
    '@supabase/supabase-js',
    '.from(',
  ]) {
    if (source.includes(blockedToken)) {
      fail(`${path} queries Supabase directly via token: ${blockedToken}`);
    }
  }
}

const liveStorefront = read('components/commerce-storefront.tsx');
if (!liveStorefront.includes("@/lib/commercial-catalog")) {
  fail('SB-006 unexpectedly changed the live storefront away from the static source');
}

console.log('SB006_CATALOG_REPOSITORY_CONTRACT_PASS');
