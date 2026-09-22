export type CatalogLineId = 'objetos' | 'datas' | 'feitos' | 'chaveiros';

export type CatalogLine = Readonly<{
  id: CatalogLineId;
  name: string;
  path: string;
  verb: string;
  description: string;
  image: string;
}>;

export type CatalogProduct = Readonly<{
  id: string;
  slug: string;
  name: string;
  description: string;
  line: CatalogLineId;
  collection: string;
  image?: string;
  gallery?: readonly string[];
  personalized: boolean;
}>;

export type CatalogProductQuery = Readonly<{
  line?: CatalogLineId;
  query?: string;
  collection?: string;
  excludeProductId?: string;
  limit?: number;
}>;
