import type { Metadata } from 'next';
import CommerceStorefront from '@/components/commerce-storefront';
export const metadata:Metadata={title:'Como funciona',description:'Adicione SKUs ao carrinho e envie uma solicitação de pedido pelo WhatsApp. Pagamento indisponível no site.'};
export default function ComoFuncionaPage(){return <CommerceStorefront/>;}
