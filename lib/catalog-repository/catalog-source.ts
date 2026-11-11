import type { CatalogRepository } from './catalog-repository';
import { staticCatalogRepository } from './static-catalog-repository';
import { createSupabaseCatalogRepository } from './supabase-catalog-repository';

export const DEFAULT_CATALOG_SOURCE = 'static' as const;
export const CATALOG_SOURCES = ['static', 'supabase'] as const;

export type CatalogSource = (typeof CATALOG_SOURCES)[number];

export function getCatalogSource(
  rawValue: string | undefined = process.env.CATALOG_SOURCE,
): CatalogSource {
  const value = rawValue?.trim();

  if (!value) {
    return DEFAULT_CATALOG_SOURCE;
  }

  if (value === 'static' || value === 'supabase') {
    return value;
  }

  throw new Error(
    `[CatalogRepository] Invalid CATALOG_SOURCE="${value}". Expected "static" or "supabase".`,
  );
}

export function createCatalogRepository(
  source: CatalogSource = getCatalogSource(),
): CatalogRepository {
  if (source === 'static') {
    return staticCatalogRepository;
  }

  return createSupabaseCatalogRepository();
}

export function getCatalogRepository(): CatalogRepository {
  return createCatalogRepository(getCatalogSource());
}
