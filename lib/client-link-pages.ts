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
  headlineAccent?: string;
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
    headlineAccent: 'achado',
    intro: 'Que bom ter você por aqui! Acompanhe nossas novidades e fique pertinho da Tem de Tudo.',
    artwork: {
      // Reconstrução digital do logo a partir de referência visual da loja; não é o arquivo-mestre oficial.
      src: '/images/clients/tem-de-tudo/logo-clean.webp',
      alt: 'Logo Tem de Tudo: letras amarelas, carrinho de compras e casa em branco sobre base azul.',
      width: 1357,
      height: 554,
    },
    palette: {
      blue: '#0A3FC2',
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
        label: 'Avalie sua experiência no Google',
        description: 'Gostou de visitar a Tem de Tudo? Sua opinião é muito importante para nós!',
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
