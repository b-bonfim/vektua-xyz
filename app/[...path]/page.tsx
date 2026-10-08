import type { Metadata } from 'next';
import CommerceStorefrontLoader from '@/components/commerce-storefront-loader';
import { getCatalogRepository } from '@/lib/catalog-repository/runtime';

type PageProps = {params: Promise<{path:string[]}>};

export async function generateMetadata({params}:PageProps):Promise<Metadata>{
  const route=(await params).path.join('/');
  let product = null;

  if(route.startsWith('produto/')){
    try {
      product=await getCatalogRepository().getProductBySlug(route.slice('produto/'.length));
    } catch {
      product=null;
    }
  }

  return {
    title:product?product.name:'Produtos e atendimento',
    description:product?`${product.name}. Consulte preço, disponibilidade e condições comerciais pelo WhatsApp. Não há pagamento no site.`:'Vektua XYZ: objetos com personalidade. Escolha produtos, monte seu carrinho e encaminhe a solicitação pelo WhatsApp.'
  };
}

export default function DynamicPage(){return <CommerceStorefrontLoader/>;}
