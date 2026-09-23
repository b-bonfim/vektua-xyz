import type { SupabaseClient } from '@supabase/supabase-js';

import { createServerSupabaseClient } from '../supabase/server';
import type { Database, Tables } from '../supabase/database.types';
import type { CatalogRepository } from './catalog-repository';
import type {
  CatalogLine,
  CatalogLineId,
  CatalogProduct,
  CatalogProductQuery,
} from './types';

type ProductRow = Pick<
  Tables<'products'>,
  | 'id'
  | 'sku'
  | 'slug'
  | 'name'
  | 'description'
  | 'collection'
  | 'personalized'
  | 'product_line_id'
>;

type ProductLineRow = Pick<
  Tables<'product_lines'>,
  'id' | 'slug' | 'name' | 'description' | 'position'
>;

type ProductMediaRow = Pick<
  Tables<'product_media'>,
  | 'id'
  | 'product_id'
  | 'storage_bucket'
  | 'storage_path'
  | 'gallery_position'
  | 'is_primary'
>;

type ActiveLine = Omit<ProductLineRow, 'slug'> & {
  slug: CatalogLineId;
};

type MediaView = ProductMediaRow & {
  publicUrl: string;
};

const PUBLIC_PRODUCT_STATUS = 'published';
const PUBLIC_PRODUCT_VISIBILITY = 'public';
const ACTIVE_LINE_STATUS = 'active';
const PUBLIC_MEDIA_BUCKET = 'product-media';
const PUBLIC_MEDIA_TYPE = 'remix';
const VERIFIED_MEDIA_STATE = 'verified';

const LINE_PRESENTATION: Record<
  CatalogLineId,
  Pick<CatalogLine, 'path' | 'verb' | 'image'>
> = {
  objetos: {
    path: '/objetos-colecionaveis',
    verb: 'Escolher',
    image: '/images/products/remix/G-ORG-RC-01_REMIX.webp',
  },
  datas: {
    path: '/datas-colecoes',
    verb: 'Celebrar',
    image: '/images/products/remix/S-HAL-DEC-01_REMIX.webp',
  },
  feitos: {
    path: '/feitos-para-voce',
    verb: 'Personalizar',
    image: '/images/pet.webp',
  },
  chaveiros: {
    path: '/chaveiros',
    verb: 'Descobrir',
    image: '/images/products/remix/G-CHV-JJ-01_REMIX.webp',
  },
};

const normalize = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();

const toCatalogLineId = (slug: string): CatalogLineId => {
  if (slug in LINE_PRESENTATION) {
    return slug as CatalogLineId;
  }

  throw new Error(
    `[SupabaseCatalogRepository] Unsupported product line slug: ${slug}`,
  );
};

const toCatalogLine = (row: ActiveLine): CatalogLine => {
  const presentation = LINE_PRESENTATION[row.slug];

  return {
    id: row.slug,
    name: row.name,
    path: presentation.path,
    verb: presentation.verb,
    description: row.description ?? '',
    image: presentation.image,
  };
};

const compareMediaRows = (left: ProductMediaRow, right: ProductMediaRow) => {
  const leftPosition = left.gallery_position ?? Number.MAX_SAFE_INTEGER;
  const rightPosition = right.gallery_position ?? Number.MAX_SAFE_INTEGER;

  return (
    leftPosition - rightPosition ||
    left.storage_path.localeCompare(right.storage_path) ||
    left.id.localeCompare(right.id)
  );
};

const repositoryError = (
  operation: string,
  error: { message: string },
): Error =>
  new Error(
    `[SupabaseCatalogRepository] ${operation} failed: ${error.message}`,
  );

export class SupabaseCatalogRepository implements CatalogRepository {
  constructor(
    private readonly client: SupabaseClient<Database> =
      createServerSupabaseClient(),
  ) {}

  async listProducts(
    query: CatalogProductQuery = {},
  ): Promise<readonly CatalogProduct[]> {
    const activeLines = await this.loadActiveLines();
    const lineById = new Map(activeLines.map((line) => [line.id, line]));

    const eligibleLineIds = query.line
      ? activeLines
          .filter((line) => line.slug === query.line)
          .map((line) => line.id)
      : activeLines.map((line) => line.id);

    if (eligibleLineIds.length === 0) {
      return [];
    }

    const { data, error } = await this.client
      .from('products')
      .select(
        'id,sku,slug,name,description,collection,personalized,product_line_id',
      )
      .eq('status', PUBLIC_PRODUCT_STATUS)
      .eq('visibility', PUBLIC_PRODUCT_VISIBILITY)
      .in('product_line_id', eligibleLineIds)
      .order('sku', { ascending: true });

    if (error) {
      throw repositoryError('listProducts', error);
    }

    const normalizedQuery = normalize(query.query ?? '');
    const normalizedCollection = normalize(query.collection ?? '');

    let rows = (data ?? []) as ProductRow[];

    rows = rows.filter((row) => {
      if (query.excludeProductId && row.sku === query.excludeProductId) {
        return false;
      }

      if (
        normalizedCollection &&
        normalize(row.collection ?? '') !== normalizedCollection
      ) {
        return false;
      }

      if (!normalizedQuery) {
        return true;
      }

      const line = lineById.get(row.product_line_id);
      const searchable = normalize(
        `${row.sku} ${row.name} ${row.description ?? ''} ${row.collection ?? ''} ${line?.name ?? ''}`,
      );

      return searchable.includes(normalizedQuery);
    });

    if (query.limit !== undefined) {
      rows = rows.slice(0, Math.max(0, Math.floor(query.limit)));
    }

    const mediaByProduct = await this.loadPublicMedia(
      rows.map((row) => row.id),
    );

    return rows.flatMap((row) => {
      const line = lineById.get(row.product_line_id);

      if (!line) {
        return [];
      }

      return [this.toCatalogProduct(row, line.slug, mediaByProduct.get(row.id))];
    });
  }

  async getProductBySlug(slug: string): Promise<CatalogProduct | null> {
    const normalizedSlug = slug.trim().toLowerCase();

    if (!normalizedSlug) {
      return null;
    }

    const activeLines = await this.loadActiveLines();
    const lineById = new Map(activeLines.map((line) => [line.id, line]));

    if (lineById.size === 0) {
      return null;
    }

    const { data, error } = await this.client
      .from('products')
      .select(
        'id,sku,slug,name,description,collection,personalized,product_line_id',
      )
      .eq('slug', normalizedSlug)
      .eq('status', PUBLIC_PRODUCT_STATUS)
      .eq('visibility', PUBLIC_PRODUCT_VISIBILITY)
      .in('product_line_id', [...lineById.keys()])
      .maybeSingle();

    if (error) {
      throw repositoryError('getProductBySlug', error);
    }

    if (!data) {
      return null;
    }

    const row = data as ProductRow;
    const line = lineById.get(row.product_line_id);

    if (!line) {
      return null;
    }

    const mediaByProduct = await this.loadPublicMedia([row.id]);

    return this.toCatalogProduct(
      row,
      line.slug,
      mediaByProduct.get(row.id),
    );
  }

  async getLines(): Promise<readonly CatalogLine[]> {
    const rows = await this.loadActiveLines();
    return rows.map(toCatalogLine);
  }

  private async loadActiveLines(): Promise<readonly ActiveLine[]> {
    const { data, error } = await this.client
      .from('product_lines')
      .select('id,slug,name,description,position')
      .eq('status', ACTIVE_LINE_STATUS)
      .order('position', { ascending: true })
      .order('slug', { ascending: true });

    if (error) {
      throw repositoryError('getLines', error);
    }

    return ((data ?? []) as ProductLineRow[]).map((row) => ({
      ...row,
      slug: toCatalogLineId(row.slug),
    }));
  }

  private async loadPublicMedia(
    productIds: readonly string[],
  ): Promise<Map<string, readonly MediaView[]>> {
    const mediaByProduct = new Map<string, MediaView[]>();

    if (productIds.length === 0) {
      return mediaByProduct;
    }

    const { data, error } = await this.client
      .from('product_media')
      .select(
        'id,product_id,storage_bucket,storage_path,gallery_position,is_primary',
      )
      .in('product_id', [...productIds])
      .eq('is_public', true)
      .eq('file_state', VERIFIED_MEDIA_STATE)
      .eq('media_type', PUBLIC_MEDIA_TYPE)
      .eq('storage_bucket', PUBLIC_MEDIA_BUCKET)
      .order('product_id', { ascending: true })
      .order('gallery_position', { ascending: true })
      .order('storage_path', { ascending: true });

    if (error) {
      throw repositoryError('loadPublicMedia', error);
    }

    for (const row of ((data ?? []) as ProductMediaRow[]).sort(
      compareMediaRows,
    )) {
      const { data: publicUrlData } = this.client.storage
        .from(row.storage_bucket)
        .getPublicUrl(row.storage_path);

      const group = mediaByProduct.get(row.product_id) ?? [];
      group.push({
        ...row,
        publicUrl: publicUrlData.publicUrl,
      });
      mediaByProduct.set(row.product_id, group);
    }

    return mediaByProduct;
  }

  private toCatalogProduct(
    row: ProductRow,
    line: CatalogLineId,
    media: readonly MediaView[] = [],
  ): CatalogProduct {
    const orderedMedia = [...media].sort(compareMediaRows);
    const gallery = orderedMedia.map((item) => item.publicUrl);
    const primaryImage =
      orderedMedia.find((item) => item.is_primary)?.publicUrl ?? gallery[0];

    return {
      id: row.sku,
      slug: row.slug,
      name: row.name,
      description: row.description ?? '',
      line,
      collection: row.collection ?? '',
      image: primaryImage,
      gallery: gallery.length > 0 ? gallery : undefined,
      personalized: row.personalized,
    };
  }
}

export const createSupabaseCatalogRepository = (
  client?: SupabaseClient<Database>,
): SupabaseCatalogRepository =>
  new SupabaseCatalogRepository(client ?? createServerSupabaseClient());
