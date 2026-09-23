import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../..', import.meta.url));
const read = (path) => readFileSync(join(root, path), 'utf8');

const selector = read('lib/catalog-repository/catalog-source.ts');
const index = read('lib/catalog-repository/index.ts');

assert.match(
  selector,
  /DEFAULT_CATALOG_SOURCE\s*=\s*['"]static['"]/,
  'missing safe static default',
);
assert.match(
  selector,
  /process\.env\.CATALOG_SOURCE/,
  'CATALOG_SOURCE must be read centrally',
);
assert.match(
  selector,
  /value === ['"]static['"] \|\| value === ['"]supabase['"]/,
  'selector must only accept static or supabase',
);
assert.match(
  selector,
  /Invalid CATALOG_SOURCE=/,
  'invalid values must fail explicitly',
);
assert.match(
  selector,
  /source === ['"]static['"][\s\S]*return staticCatalogRepository;/,
  'static mode must return the existing static repository',
);
assert.match(
  selector,
  /return createSupabaseCatalogRepository\(\);/,
  'supabase mode must return the Supabase adapter',
);
assert.doesNotMatch(
  selector,
  /catch\s*\(/,
  'selector must not silently catch Supabase errors and fall back to static',
);
assert.match(
  index,
  /from ['"]\.\/catalog-source['"]/,
  'catalog-source exports must be available from repository boundary',
);

const forbiddenInUi = [
  'CATALOG_SOURCE',
  'getCatalogSource',
  'createCatalogRepository',
  'getCatalogRepository',
];

function walk(dir) {
  return readdirSync(dir).flatMap((entry) => {
    const path = join(dir, entry);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
}

const uiFiles = [
  ...walk(join(root, 'app')),
  ...walk(join(root, 'components')),
].filter((path) => /\.(?:js|jsx|ts|tsx|mjs|mts)$/.test(path));

const leaks = [];
for (const path of uiFiles) {
  const content = readFileSync(path, 'utf8');
  for (const token of forbiddenInUi) {
    if (content.includes(token)) {
      leaks.push(`${relative(root, path)} -> ${token}`);
    }
  }
}

assert.deepEqual(
  leaks,
  [],
  `components/app must not know the source flag or factory: ${leaks.join(', ')}`,
);

console.log('SB026_CATALOG_SOURCE_STRUCTURAL_PASS');
console.log('defaultSource=static');
console.log('invalidValue=explicit-error');
console.log('staticRepository=StaticCatalogRepository');
console.log('supabaseRepository=SupabaseCatalogRepository');
console.log('uiFlagReferences=0');
