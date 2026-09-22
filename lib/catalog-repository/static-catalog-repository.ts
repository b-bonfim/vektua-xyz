import {
  commercialLines,
  commercialProducts,
} from '../commercial-catalog';
import type { CatalogRepository } from './catalog-repository';
import type {
  CatalogLine,
  CatalogProduct,
  CatalogProductQuery,
} from './types';

const normalize = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();

const toLine = (line: (typeof commercialLines)[number]): CatalogLine => ({
  id: line.id,
  name: line.name,
  path: line.path,
  verb: line.verb,
  description: line.description,
  image: line.image,
});

const toProduct = (
  product: (typeof commercialProducts)[number],
): CatalogProduct => ({
  id: product.id,
  slug: product.slug,
  name: product.name,
  description: product.description,
  line: product.line,
  collection: product.collection,
  image: product.image,
  gallery: product.gallery ? [...product.gallery] : undefined,
  personalized: product.personalized,
});

export class StaticCatalogRepository implements CatalogRepository {
  async listProducts(
    query: CatalogProductQuery = {},
  ): Promise<readonly CatalogProduct[]> {
    const normalizedQuery = normalize(query.query ?? '');
    const normalizedCollection = normalize(query.collection ?? '');

    let result = commercialProducts.filter((product) => {
      if (query.line && product.line !== query.line) return false;
      if (query.excludeProductId && product.id === query.excludeProductId) {
        return false;
      }
      if (
        normalizedCollection &&
        normalize(product.collection) !== normalizedCollection
      ) {
        return false;
      }

      if (!normalizedQuery) return true;

      const lineName =
        commercialLines.find((line) => line.id === product.line)?.name ?? '';

      return normalize(
        `${product.id} ${product.name} ${product.description} ${product.collection} ${lineName}`,
      ).includes(normalizedQuery);
    });

    if (query.limit !== undefined) {
      const limit = Math.max(0, Math.floor(query.limit));
      result = result.slice(0, limit);
    }

    return result.map(toProduct);
  }

  async getProductBySlug(slug: string): Promise<CatalogProduct | null> {
    const normalizedSlug = slug.trim().toLowerCase();
    const product = commercialProducts.find(
      (item) => item.slug.toLowerCase() === normalizedSlug,
    );

    return product ? toProduct(product) : null;
  }

  async getLines(): Promise<readonly CatalogLine[]> {
    return commercialLines.map(toLine);
  }
}

export const staticCatalogRepository = new StaticCatalogRepository();
