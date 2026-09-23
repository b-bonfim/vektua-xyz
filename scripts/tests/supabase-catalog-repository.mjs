import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const read = (relativePath) =>
  fs.readFileSync(path.join(root, relativePath), 'utf8');

const adapter = read(
  'lib/catalog-repository/supabase-catalog-repository.ts',
);
const index = read('lib/catalog-repository/index.ts');
const server = read('lib/supabase/server.ts');
const browser = read('lib/supabase/client.ts');
const databaseTypes = read('lib/supabase/database.types.ts');

assert.match(adapter, /implements CatalogRepository/);
assert.match(adapter, /async listProducts\(/);
assert.match(adapter, /async getProductBySlug\(/);
assert.match(adapter, /async getLines\(/);

assert.match(adapter, /\.eq\('status', PUBLIC_PRODUCT_STATUS\)/);
assert.match(adapter, /PUBLIC_PRODUCT_STATUS = 'published'/);
assert.match(adapter, /PUBLIC_PRODUCT_VISIBILITY = 'public'/);
assert.match(adapter, /ACTIVE_LINE_STATUS = 'active'/);
assert.match(adapter, /PUBLIC_MEDIA_TYPE = 'remix'/);
assert.match(adapter, /VERIFIED_MEDIA_STATE = 'verified'/);
assert.match(adapter, /PUBLIC_MEDIA_BUCKET = 'product-media'/);

assert.match(adapter, /compareMediaRows/);
assert.match(adapter, /gallery_position/);
assert.match(adapter, /storage_path\.localeCompare/);
assert.match(adapter, /getPublicUrl\(row\.storage_path\)/);

assert.match(adapter, /\.maybeSingle\(\)/);
assert.match(adapter, /if \(!data\) \{\s*return null;/s);
assert.match(adapter, /if \(!normalizedSlug\) \{\s*return null;/s);

assert.match(adapter, /SupabaseClient<Database>/);
assert.match(server, /SupabaseClient<Database>/);
assert.match(browser, /SupabaseClient<Database>/);
assert.match(databaseTypes, /can_access_admin:/);

const publicReadSources = [adapter, server, browser].join('\n');
assert.doesNotMatch(
  publicReadSources,
  /service[_-]?role|SUPABASE_SERVICE_ROLE/i,
);
assert.match(server, /publishableKey/);
assert.match(browser, /publishableKey/);

assert.match(
  index,
  /SupabaseCatalogRepository[\s\S]*createSupabaseCatalogRepository/,
);

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const publishableKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (url && publishableKey) {
  const { createClient } = await import('@supabase/supabase-js');
  const client = createClient(url, publishableKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });

  const lines = await client
    .from('product_lines')
    .select('slug,status')
    .order('position', { ascending: true });
  assert.ifError(lines.error);
  assert.ok((lines.data ?? []).every((row) => row.status === 'active'));

  const products = await client
    .from('products')
    .select('slug,status,visibility')
    .order('sku', { ascending: true });
  assert.ifError(products.error);
  assert.ok(
    (products.data ?? []).every(
      (row) =>
        row.status === 'published' && row.visibility === 'public',
    ),
  );

  const media = await client
    .from('product_media')
    .select(
      'product_id,is_public,file_state,media_type,storage_bucket,gallery_position,storage_path',
    )
    .order('product_id', { ascending: true })
    .order('gallery_position', { ascending: true })
    .order('storage_path', { ascending: true });
  assert.ifError(media.error);
  assert.ok(
    (media.data ?? []).every(
      (row) =>
        row.is_public === true &&
        row.file_state === 'verified' &&
        row.media_type === 'remix' &&
        row.storage_bucket === 'product-media',
    ),
  );

  console.log(
    JSON.stringify({
      live: true,
      activeLinesVisible: lines.data?.length ?? 0,
      publicProductsVisible: products.data?.length ?? 0,
      publicMediaVisible: media.data?.length ?? 0,
    }),
  );
} else {
  console.log(
    JSON.stringify({
      live: false,
      reason:
        'NEXT_PUBLIC_SUPABASE_URL/NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY not provided',
    }),
  );
}

console.log('SB025_SUPABASE_CATALOG_REPOSITORY_PASS');
