import type { Metadata } from 'next';
import CommerceStorefront from '@/components/commerce-storefront';
import { getCommercialProduct } from '@/lib/commercial-catalog';

type PageProps = {params: Promise<{path:string[]}>};
export async function generateMetadata({params}:PageProps):Promise<Metadata>{
  const route=(await params).path.join('/');
  const product=route.startsWith('produto/')?getCommercialProduct(route.slice('produto/'.length)):undefined;
  return {title:product?product.name:'Produtos e atendimento',description:product?`${product.name}. Consulte preço, disponibilidade e condições comerciais pelo WhatsApp. Não há pagamento no site.`:'Vektua XYZ: objetos com personalidade. Escolha produtos, monte seu carrinho e encaminhe a solicitação pelo WhatsApp.'};
}
export default function DynamicPage(){return <CommerceStorefront/>;}
