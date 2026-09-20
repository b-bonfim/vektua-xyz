import type { Metadata, Viewport } from 'next';
import { CartProvider } from '@/components/cart-context';
import './globals.css';
import './brand-v2.css';
import './impeccable-audit-fixes.css';

// SEO-ready metadata without falsely indexing a non-commercial, unapproved mockup.
// Do not set metadataBase/canonical until the actual domain and public release are verified.
export const metadata: Metadata = {
  applicationName: 'Vektua XYZ',
  title: { default: 'Vektua XYZ | Objetos com personalidade', template: '%s | Vektua XYZ' },
  description: 'Explore as quatro linhas da Vektua XYZ: Objetos & Colecionáveis, Datas & Coleções, Feitos para Você e Chaveiros. Protótipo demonstrativo sem vendas.',
  keywords: ['Vektua XYZ', 'objetos com personalidade', 'objetos de decoração', 'coleções temáticas', 'miniaturas estilizadas', 'chaveiros'],
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
  icons: { icon: [{ url: '/favicon.svg', type: 'image/svg+xml' }], shortcut: '/favicon.svg' },
  openGraph: { type: 'website', locale: 'pt_BR', siteName: 'Vektua XYZ', title: 'Vektua XYZ | Objetos com personalidade', description: 'Peças de catálogo, coleções, miniaturas estilizadas e chaveiros. Prévia demonstrativa sem vendas.' },
  twitter: { card: 'summary', title: 'Vektua XYZ | Objetos com personalidade', description: 'Quatro linhas para escolher, celebrar, personalizar e descobrir. Prévia demonstrativa.' },
};
export const viewport: Viewport = { themeColor: '#F7F5F0', colorScheme: 'light', width: 'device-width', initialScale: 1 };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="pt-BR"><body><CartProvider>{children}</CartProvider></body></html>;
}
