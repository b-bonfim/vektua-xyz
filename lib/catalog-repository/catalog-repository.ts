import type {
  CatalogLine,
  CatalogProduct,
  CatalogProductQuery,
} from './types';

export interface CatalogRepository {
  listProducts(query?: CatalogProductQuery): Promise<readonly CatalogProduct[]>;
  getProductBySlug(slug: string): Promise<CatalogProduct | null>;
  getLines(): Promise<readonly CatalogLine[]>;
}
