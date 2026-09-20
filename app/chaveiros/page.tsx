import type { Metadata } from 'next';
import ChaveirosV2 from '@/components/chaveiros-v2';
import './chaveiros.css';

export const metadata: Metadata = {
  title: 'Chaveiros | Temáticos e articulados',
  description: 'Conheça a linha independente de chaveiros da Vektua XYZ: acessórios diversos, temáticos e articulados. Protótipo sem vendas ou estabelecimentos parceiros confirmados.',
  robots: { index: false, follow: false },
};
export default function ChaveirosPage() { return <ChaveirosV2 />; }
