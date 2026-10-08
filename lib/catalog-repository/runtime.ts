import type { CatalogRepository } from './catalog-repository';
import { staticCatalogRepository } from './static-catalog-repository';
import { createSupabaseCatalogRepository } from './supabase-catalog-repository';

export type CatalogSource = 'static' | 'supabase';

const DEFAULT_CATALOG_SOURCE: CatalogSource = 'static';

export function resolveCatalogSource(
  rawValue: string | undefined = process.env.CATALOG_SOURCE,
): CatalogSource {
  const value = rawValue?.trim().toLowerCase();

  if (!value) {
    return DEFAULT_CATALOG_SOURCE;
  }

  if (value === 'static' || value === 'supabase') {
    return value;
  }

  throw new Error(
    `[CatalogRepository] Invalid CATALOG_SOURCE="${rawValue}". Expected "static" or "supabase".`,
  );
}

export function getCatalogRepository(
  source: CatalogSource = resolveCatalogSource(),
): CatalogRepository {
  return source === 'static'
    ? staticCatalogRepository
    : createSupabaseCatalogRepository();
}
