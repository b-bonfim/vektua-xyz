import type { Metadata } from 'next';
import CommerceStorefrontLoader from '@/components/commerce-storefront-loader';
export const metadata:Metadata={title:'Como funciona',description:'Adicione SKUs ao carrinho e envie uma solicitação de pedido pelo WhatsApp. Pagamento indisponível no site.'};
export default function ComoFuncionaPage(){return <CommerceStorefrontLoader/>;}
