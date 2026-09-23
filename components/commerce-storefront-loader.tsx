import CommerceStorefront from '@/components/commerce-storefront';
import { getCatalogRepository } from '@/lib/catalog-repository/runtime';

export default async function CommerceStorefrontLoader() {
  const repository = getCatalogRepository();
  const [lines, products] = await Promise.all([
    repository.getLines(),
    repository.listProducts(),
  ]);

  return <CommerceStorefront lines={lines} products={products} />;
}
