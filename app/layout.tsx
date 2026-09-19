import type { Metadata } from 'next';
import { CartProvider } from '@/components/cart-context';
import './globals.css';
import './portfolio-overrides.css';
export const metadata: Metadata = {
  title: 'Vektua XYZ — Portfólio inicial em validação',
  description: 'Prévia interna dos nove SKUs selecionados pelo Founder. Renders digitais dos modelos 3D, sem produto físico validado, vendas ou coleta de dados pessoais.',
  robots: { index: false, follow: false },
  icons: { icon: '/favicon.svg', shortcut: '/favicon.svg' },
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="pt-BR"><body><CartProvider>{children}</CartProvider></body></html>;
}
