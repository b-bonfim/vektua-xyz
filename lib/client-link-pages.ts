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
  theme?: 'vektua' | 'orion';
  linksHeading?: string;
  pix?: { key: string; label: string; description: string };
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
  'vektua': {
    slug: 'vektua',
    name: 'Vektua XYZ',
    category: 'Objetos com personalidade',
    theme: 'vektua',
    headline: 'Objetos com personalidade.',
    headlineAccent: 'personalidade',
    intro: 'Acompanhe nossos achados, converse com a gente e tenha nossa chave PIX à mão.',
    linksHeading: 'Por onde vamos começar?',
    artwork: {
      src: '/brand/vektua-wordmark.svg',
      alt: 'Logotipo Vektua XYZ — assinatura principal Rev02.',
      width: 755,
      height: 190,
    },
    palette: {
      blue: '#176D67',
      yellow: '#C45C3B',
      white: '#FFFFFF',
    },
    links: [
      {
        id: 'instagram',
        label: 'Acompanhe nossos achados',
        description: 'Novidades, bastidores e objetos com personalidade',
        href: 'https://www.instagram.com/vektua.xyz/',
        kind: 'instagram',
      },
      {
        id: 'whatsapp',
        label: 'Converse com a Vektua',
        description: 'Dúvidas, encomendas e ideias para criar',
        href: 'https://wa.me/5535984445677?text=' + encodeURIComponent('Olá, Vektua! Encontrei sua página de links e gostaria de saber mais sobre os produtos e personalizações.'),
        kind: 'whatsapp',
      },
    ],
    pix: {
      key: '9e36b089-7423-4384-8c6e-60daf7646d90',
      label: 'Copiar chave PIX',
      description: 'Chave aleatória · para pagamentos combinados',
    },
  },
  'orion-tattoo': {
    slug: 'orion-tattoo',
    name: 'Orion Tattoo',
    category: 'Arte · Pele · Liberdade',
    theme: 'orion',
    headline: 'Oiee! Que bom te ver por aqui.',
    headlineAccent: 'Oiee!',
    intro: 'Acompanhe meus trabalhos, entre em contato ou compartilhe sua experiência com a Orion Tattoo.',
    linksHeading: 'Meus canais',
    artwork: {
      // Identidade da campanha Orion, já utilizada em /congrats/orion-tattoo.
      src: '/images/campaigns/orion-tattoo/orion-tattoo-round-header.webp',
      alt: 'Arte circular Orion Tattoo com musa de cabelos azuis.',
      width: 384,
      height: 384,
    },
    palette: {
      blue: '#075FBE',
      yellow: '#EDAE00',
      white: '#FFFFFF',
    },
    links: [
      {
        id: 'avaliacao-google',
        label: 'Avaliar no Google',
        description: 'Gostou do resultado? Conta pra gente no Google',
        href: 'https://search.google.com/local/writereview?placeid=ChIJ__f7Dgyjy5QRY5_Z-L-7acc',
        kind: 'review',
      },
      {
        id: 'instagram',
        label: 'Ver trabalhos no Instagram',
        description: 'Portfólio e novidades da Orion Tattoo',
        href: 'https://www.instagram.com/oriontattoo.404/',
        kind: 'instagram',
      },
      {
        id: 'whatsapp',
        label: 'Me chama no WhatsApp',
        description: 'Vamos conversar sobre a sua ideia?',
        href: 'https://wa.me/5535998940158?text=' + encodeURIComponent('Oiee, Laura! Vim pela página de links da Orion Tattoo e queria conversar sobre uma ideia de tatuagem.'),
        kind: 'whatsapp',
      },
    ],
    pix: {
      key: '40555585000120',
      label: 'Copiar chave PIX',
      description: 'CNPJ · 40.555.585/0001-20',
    },
  },
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
