import type { Metadata } from 'next';
import CommerceStorefront from '@/components/commerce-storefront';
export const metadata:Metadata={title:'Pequenos Encantos',description:'Explore a coleção de Halloween e solicite seus produtos pelo WhatsApp.'};
export default function ColecaoPage(){return <CommerceStorefront/>;}
