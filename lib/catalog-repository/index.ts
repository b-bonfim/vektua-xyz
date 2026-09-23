export type { CatalogRepository } from './catalog-repository';
export type {
  CatalogLine,
  CatalogLineId,
  CatalogProduct,
  CatalogProductQuery,
} from './types';
export {
  StaticCatalogRepository,
  staticCatalogRepository,
} from './static-catalog-repository';
export {
  SupabaseCatalogRepository,
  createSupabaseCatalogRepository,
} from './supabase-catalog-repository';
export {
  CATALOG_SOURCES,
  DEFAULT_CATALOG_SOURCE,
  createCatalogRepository,
  getCatalogRepository,
  getCatalogSource,
  isStaticCatalogRepository,
  isSupabaseCatalogRepository,
} from './catalog-source';
export type { CatalogSource } from './catalog-source';
