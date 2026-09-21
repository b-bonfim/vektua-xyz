import type { Metadata, Viewport } from 'next';
import { CartProvider } from '@/components/cart-context';
import { WhatsAppContact } from '@/components/whatsapp-contact';
import './globals.css';
import './brand-v2.css';
import './impeccable-audit-fixes.css';
import './whatsapp-contact.css';
import './commerce-launch.css';

// Founder-authorized internal catalog; payment and automatic order capture remain disabled.
// Search indexing remains paused until production domain and public release are verified.
export const metadata:Metadata={
 applicationName:'Vektua XYZ',
 title:{default:'Vektua XYZ | Objetos com personalidade',template:'%s | Vektua XYZ'},
 description:'Explore objetos, coleções, miniaturas estilizadas e chaveiros. Monte seu carrinho e envie sua solicitação pelo WhatsApp. Sem pagamento no site.',
 keywords:['Vektua XYZ','objetos com personalidade','chaveiros','miniaturas personalizadas','decoração'],
 robots:{index:false,follow:false},
 icons:{icon:[{url:'/favicon.svg',type:'image/svg+xml'}],shortcut:'/favicon.svg'},
 openGraph:{type:'website',locale:'pt_BR',siteName:'Vektua XYZ',title:'Vektua XYZ | Objetos com personalidade',description:'Quatro linhas de produtos. Carrinho com solicitação pelo WhatsApp.'},
 twitter:{card:'summary',title:'Vektua XYZ | Objetos com personalidade',description:'Monte seu carrinho e solicite pelo WhatsApp.'},
};
export const viewport:Viewport={themeColor:'#F7F5F0',colorScheme:'light',width:'device-width',initialScale:1};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="pt-BR"><body><CartProvider>{children}<WhatsAppContact/></CartProvider></body></html>;}
