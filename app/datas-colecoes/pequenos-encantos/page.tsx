import type { Metadata } from 'next';
import CommerceStorefrontLoader from '@/components/commerce-storefront-loader';
export const metadata:Metadata={title:'Pequenos Encantos',description:'Explore a coleção de Halloween e solicite seus produtos pelo WhatsApp.'};
export default function ColecaoPage(){return <CommerceStorefrontLoader/>;}
