/**
 * NFC client microsites: data is reviewed before publication.
 * Keep slugs permanent once printed/written to a tag.
 * Do not add unverified WhatsApp numbers, addresses, or social accounts.
 */
export type ClientLinkKind = 'instagram' | 'whatsapp' | 'website' | 'location' | 'review' | 'other';

export interface ClientLink {
  id: string;
  label: string;
  description?: string;
  href: string;
  kind: ClientLinkKind;
}

export interface ClientLinkPage {
  slug: string;
  name: string;
  category: string;
  headline: string;
  intro: string;
  artwork: {
    src: string;
    alt: string;
    width: number;
    height: number;
  };
  palette: {
    blue: string;
    yellow: string;
    white: string;
  };
  links: ClientLink[];
}

export const clientLinkPages: Record<string, ClientLinkPage> = {
  'tem-de-tudo': {
    slug: 'tem-de-tudo',
    name: 'Tem de Tudo',
    category: 'Variedades & Utilidades',
    headline: 'Sempre tem um achado esperando por você.',
    intro: 'Que bom ter você por aqui! Acompanhe nossas novidades e fique pertinho da Tem de Tudo.',
    artwork: {
      // Arte do chaveiro FDM em 3 cores (20/10/2026), não logotipo-mestre da loja.
      src: '/images/clients/tem-de-tudo/keychain-art.svg',
      alt: 'Arte do chaveiro Tem de Tudo: letras amarelas, fundo azul, carrinho de compras e casinha em branco.',
      width: 1266,
      height: 543,
    },
    palette: {
      blue: '#0033AB',
      yellow: '#FDE802',
      white: '#FFFFFF',
    },
    links: [
      {
        id: 'instagram',
        label: 'Nosso Instagram',
        description: 'Novidades e conteúdos da loja',
        href: 'https://www.instagram.com/tem_de_tudo_srs/',
        kind: 'instagram',
      },
      {
        id: 'whatsapp',
        label: 'Fale com a gente no WhatsApp',
        description: 'Dúvidas e atendimento direto',
        href: 'https://wa.me/5535998914282?text=' + encodeURIComponent('Olá! Acessei a página da Tem de Tudo e gostaria de mais informações sobre os produtos da loja.'),
        kind: 'whatsapp',
      },
      {
        id: 'avaliacao-google',
        label: 'Avalie a loja no Google',
        description: 'Compartilhe sua experiência com a Tem de Tudo',
        href: 'https://search.google.com/local/writereview?placeid=ChIJW5Ans4Kjy5QRd4MJayPOPz4',
        kind: 'review',
      },
    ],
  },
};

export function getClientLinkPage(slug: string): ClientLinkPage | undefined {
  return Object.prototype.hasOwnProperty.call(clientLinkPages, slug)
    ? clientLinkPages[slug]
    : undefined;
}
