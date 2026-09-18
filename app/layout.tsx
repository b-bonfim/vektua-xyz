import type { Metadata } from 'next';
import { CartProvider } from '@/components/cart-context';
import './globals.css';
export const metadata: Metadata = {
  title: 'Vektua XYZ — Objetos com personalidade',
  description: 'Explore objetos, coleções e miniaturas estilizadas. Protótipo demonstrativo da Vektua XYZ, sem vendas ou recebimento de dados pessoais.',
  robots: { index: false, follow: false },
  icons: { icon: '/favicon.svg', shortcut: '/favicon.svg' },
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="pt-BR"><body><CartProvider>{children}</CartProvider></body></html>;
}
