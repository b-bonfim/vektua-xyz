import type { Metadata } from 'next';
import ChaveirosV2 from '@/components/chaveiros-v2';
import './chaveiros.css';
import './keyring-preview.css';

export const metadata: Metadata = {
  title: 'Chaveiros | Temáticos e articulados',
  description: 'Conheça a linha de chaveiros da Vektua XYZ e prévias de novos modelos em desenvolvimento. Site demonstrativo sem vendas, preços ou disponibilidade confirmados.',
  robots: { index: false, follow: false },
};
export default function ChaveirosPage() { return <ChaveirosV2 />; }
