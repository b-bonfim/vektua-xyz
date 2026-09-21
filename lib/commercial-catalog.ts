import { products as legacyProducts, lines, type Line } from './catalog';
import { optimizedSkuCopy } from './sku-copy';

/** Snapshot: shortlist-sku, Página1 rows 5–32, 21/09/2026. Approval is an INTERNAL Founder decision, not proof of external rights, test, stock or price. */
export type CommercialProduct = {
  id: string; slug: string; name: string; description: string; line: Line; collection: string;
  image?: string; gallery?: string[]; personalized: boolean; founderApproved: true;
  rightsReview?: boolean;
};
const stripHeading = (text: string) => text.includes(' | ') ? text.slice(text.indexOf(' | ') + 3) : text;
const existing: CommercialProduct[] = legacyProducts.map(p => ({
  id: p.id, slug: p.slug, name: p.name,
  description: stripHeading(optimizedSkuCopy[p.id] ?? p.name),
  line: p.line, collection: p.kind, image: p.line === 'feitos' ? undefined : p.image,
  gallery: p.gallery, personalized: p.line === 'feitos', founderApproved: true,
  rightsReview: false,
}));
// Do not infer a product photo from the source-image URL or Image Generated? checkbox.
// Only REMIX files verified in this repository can be shown as product images.
const newKeyrings: Array<[string, string, string, string, boolean?]> = [
  ['G-CHV-MUM-01','Chaveiro Múmia Articulada | Mini Personagem de Halloween','Múmia de tema Halloween, com proposta articulada para chaves ou mochila.','Halloween'],
  ['G-CHV-PAL-01','Chaveiro Mini Palhaço de Terror | Coleção Halloween','Mini palhaço temático de terror para uma coleção de Halloween.','Halloween',true],
  ['G-CHV-GAT-01','Miniatura Gatinho Esqueleto | Decoração Fofa de Halloween','Miniatura decorativa de gatinho com estética de esqueleto. Verificar a configuração efetiva como chaveiro.','Halloween'],
  ['G-CHV-FAN-01','Chaveiro Fantasminha Boo | Halloween Divertido','Fantasminha temático para chaves ou mochila.','Halloween'],
  ['G-CHV-CRA-01','Chaveiro Caveira Demoníaca | Acessório de Halloween Sombrio','Caveira temática em formato de chaveiro.','Halloween'],
  ['G-CHV-MUM-02','Chaveiro Mini Múmia | Halloween Divertido para Chaves','Mini múmia temática para chaves ou mochila.','Halloween'],
  ['G-CHV-FAN-02','Chaveiro Fantasminha Fofo | Charme de Halloween','Fantasminha temático para chaves ou mochila.','Halloween'],
  ['G-CHV-MAS-01','Chaveiro Máscara de Terror | Estilo Halloween','Mini máscara temática em formato de chaveiro.','Halloween',true],
  ['G-CHV-MED-01','Chaveiro Mini Médico da Peste | Estilo Gótico de Halloween','Personagem de inspiração histórica em chaveiro temático.','Halloween'],
  ['G-CHV-LOB-01','Chaveiro Mini Lobisomem | Criaturas do Halloween','Lobisomem temático em miniatura para chaves ou mochila.','Halloween'],
  ['G-CHV-CAV-01','Chaveiro Caveira com Capuz Azul | Estilo Urbano','Caveira com capuz azul em formato de chaveiro.','Halloween'],
  ['G-CHV-MON-01','Chaveiro Monstro Articulado | Mini Criatura de Halloween','Mini criatura articulada para uma coleção temática.','Halloween',true],
  ['G-CHV-ESQ-01','Chaveiro Mini Esqueleto | Acessório de Halloween','Mini esqueleto temático em chaveiro.','Halloween'],
  ['G-CHV-MAS-02','Chaveiro Figura Mascarada de Terror | Coleção Halloween','Figura mascarada temática; configuração da fixação a confirmar.','Halloween',true],
  ['G-CHV-ABO-01','Chaveiro Mini Abóbora de Halloween | Toque de Outono','Mini abóbora de Halloween em formato de chaveiro.','Halloween'],
  ['G-CHV-ESQ-02','Chaveiro Esqueletinho Fofo | Halloween Divertido','Mini figura de esqueleto; configuração de fixação a confirmar.','Halloween'],
  ['G-CHV-FAN-03','Chaveiro Fantasma Clássico | Um Toque de Halloween','Fantasma temático para chaves ou mochila.','Halloween'],
  ['G-CHV-MAO-01','Chaveiro Mão Misteriosa | Acessório de Halloween','Mini mão temática para chaves ou mochila.','Halloween',true],
  ['G-CHV-ALI-01','Miniatura Alienígena | Colecionável de Ficção Científica','Miniatura de ficção científica; a fonte não confirma uma versão chaveiro ou ferragem.','Divertidos',true],
];
const remixKeyringImages: Partial<Record<string, string>> = {
  "G-CHV-ABO-01": "/images/products/remix/G-CHV-ABO-01_REMIX.webp",
  "G-CHV-ALI-01": "/images/products/remix/G-CHV-ALI-01_REMIX.png",
  "G-CHV-CAV-01": "/images/products/remix/G-CHV-CAV-01_REMIX.png",
  "G-CHV-CRA-01": "/images/products/remix/G-CHV-CRA-01_REMIX.webp",
  "G-CHV-ESQ-01": "/images/products/remix/G-CHV-ESQ-01_REMIX.webp",
  "G-CHV-ESQ-02": "/images/products/remix/G-CHV-ESQ-02_REMIX.webp",
  "G-CHV-FAN-01": "/images/products/remix/G-CHV-FAN-01_REMIX.webp",
  "G-CHV-FAN-02": "/images/products/remix/G-CHV-FAN-02_REMIX.webp",
  "G-CHV-FAN-03": "/images/products/remix/G-CHV-FAN-03_REMIX.webp",
  "G-CHV-GAT-01": "/images/products/remix/G-CHV-GAT-01_REMIX.png",
  "G-CHV-LOB-01": "/images/products/remix/G-CHV-LOB-01_REMIX.webp",
  "G-CHV-MAO-01": "/images/products/remix/G-CHV-MAO-01_REMIX.png",
  "G-CHV-MAS-01": "/images/products/remix/G-CHV-MAS-01_REMIX.png",
  "G-CHV-MAS-02": "/images/products/remix/G-CHV-MAS-02_REMIX.png",
  "G-CHV-MED-01": "/images/products/remix/G-CHV-MED-01_REMIX.webp",
  "G-CHV-MON-01": "/images/products/remix/G-CHV-MON-01_REMIX.png",
  "G-CHV-MUM-01": "/images/products/remix/G-CHV-MUM-01_REMIX.png",
  "G-CHV-MUM-02": "/images/products/remix/G-CHV-MUM-02_REMIX.webp",
  "G-CHV-PAL-01": "/images/products/remix/G-CHV-PAL-01_REMIX.png"
};

export const commercialProducts: CommercialProduct[] = [
  ...existing,
  ...newKeyrings.map(([id,name,description,collection,rightsReview]) => ({
    id, slug:id.toLowerCase(), name, description, collection, line:'chaveiros' as const,
    image:remixKeyringImages[id],
    personalized:false, founderApproved:true as const, rightsReview:!!rightsReview,
  })),
];
export const commercialLines = lines;
export const getCommercialProduct = (slug: string) => commercialProducts.find(p => p.slug === slug);
export const searchableProducts = (line?: Line, query = '') => {
  const term = query.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();
  return commercialProducts.filter(p => (!line || p.line === line) && `${p.id} ${p.name} ${p.description} ${p.collection}`.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().includes(term));
};
