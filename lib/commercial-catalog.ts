import { products as legacyProducts, lines, type Line } from './catalog';
import { optimizedSkuCopy } from './sku-copy';

// Administrative approvals and product review records are maintained outside the customer catalog.
export type CommercialProduct = {
  id: string; slug: string; name: string; description: string; line: Line; collection: string;
  image?: string; gallery?: string[]; personalized: boolean;
};
const stripHeading = (text: string) => text.includes(' | ') ? text.slice(text.indexOf(' | ') + 3) : text;
const existing: CommercialProduct[] = legacyProducts.map(p => ({
  id: p.id, slug: p.slug, name: p.name,
  description: stripHeading(optimizedSkuCopy[p.id] ?? p.name),
  line: p.line, collection: p.kind, image: p.line === 'feitos' ? undefined : p.image,
  gallery: p.gallery, personalized: p.line === 'feitos',
}));

// Only REMIX files checked into this repository are eligible for these image paths.
// Tuple fields: SKU, title, description, collection, file extension.
const newKeyrings: Array<[string,string,string,string,'png'|'webp']> = [
 ['G-CHV-MUM-01','Chaveiro Múmia Articulada | Mini Personagem de Halloween','Múmia temática de Halloween, com proposta articulada para chaves ou mochila.','Halloween','png'],
 ['G-CHV-PAL-01','Chaveiro Mini Palhaço de Terror | Coleção Halloween','Mini palhaço temático de terror para uma coleção de Halloween.','Halloween','png'],
 ['G-CHV-GAT-01','Miniatura Gatinho Esqueleto | Decoração Fofa de Halloween','Miniatura decorativa de gatinho com estética de esqueleto.','Halloween','png'],
 ['G-CHV-FAN-01','Chaveiro Fantasminha Boo | Halloween Divertido','Fantasminha temático para chaves ou mochila.','Halloween','webp'],
 ['G-CHV-CRA-01','Chaveiro Caveira Demoníaca | Acessório de Halloween Sombrio','Caveira temática em formato de chaveiro.','Halloween','webp'],
 ['G-CHV-MUM-02','Chaveiro Mini Múmia | Halloween Divertido para Chaves','Mini múmia temática para chaves ou mochila.','Halloween','webp'],
 ['G-CHV-FAN-02','Chaveiro Fantasminha Fofo | Charme de Halloween','Fantasminha temático para chaves ou mochila.','Halloween','webp'],
 ['G-CHV-MAS-01','Chaveiro Máscara de Terror | Estilo Halloween','Mini máscara temática em formato de chaveiro.','Halloween','png'],
 ['G-CHV-MED-01','Chaveiro Mini Médico da Peste | Estilo Gótico de Halloween','Personagem de inspiração histórica em chaveiro temático.','Halloween','webp'],
 ['G-CHV-LOB-01','Chaveiro Mini Lobisomem | Criaturas do Halloween','Lobisomem temático em miniatura para chaves ou mochila.','Halloween','webp'],
 ['G-CHV-CAV-01','Chaveiro Caveira com Capuz Azul | Estilo Urbano','Caveira com capuz azul em formato de chaveiro.','Halloween','png'],
 ['G-CHV-MON-01','Chaveiro Monstro Articulado | Mini Criatura de Halloween','Mini criatura articulada para uma coleção temática.','Halloween','png'],
 ['G-CHV-ESQ-01','Chaveiro Mini Esqueleto | Acessório de Halloween','Mini esqueleto temático em chaveiro.','Halloween','webp'],
 ['G-CHV-MAS-02','Chaveiro Figura Mascarada de Terror | Coleção Halloween','Figura mascarada temática; configuração de fixação a confirmar.','Halloween','png'],
 ['G-CHV-ABO-01','Chaveiro Mini Abóbora de Halloween | Toque de Outono','Mini abóbora de Halloween em formato de chaveiro.','Halloween','webp'],
 ['G-CHV-ESQ-02','Chaveiro Esqueletinho Fofo | Halloween Divertido','Mini figura de esqueleto; configuração de fixação a confirmar.','Halloween','webp'],
 ['G-CHV-FAN-03','Chaveiro Fantasma Clássico | Um Toque de Halloween','Fantasma temático para chaves ou mochila.','Halloween','webp'],
 ['G-CHV-MAO-01','Chaveiro Mão Misteriosa | Acessório de Halloween','Mini mão temática para chaves ou mochila.','Halloween','png'],
 ['G-CHV-ALI-01','Miniatura Alienígena | Colecionável de Ficção Científica','Miniatura de ficção científica com visual alienígena.','Divertidos','png'],
 ['G-CHV-BLO-01','Chaveiro Bloco de Interrogação | Estilo Gamer Retrô','Chaveiro em formato de bloco com ponto de interrogação e estética gamer retrô.','Games','png'],
 ['G-CHV-POL-01','Mini Polvinho Articulado | Colecionável Divertido','Miniatura articulada de polvinho; versão como chaveiro a confirmar no atendimento.','Divertidos','png'],
];

export const commercialProducts: CommercialProduct[] = [
 ...existing,
 ...newKeyrings.map(([id,name,description,collection,extension]) => ({
  id, slug:id.toLowerCase(), name, description, collection, line:'chaveiros' as const,
  image:`/images/products/remix/${id}_REMIX.${extension}`,
  personalized:false,
 })),
];
export const commercialLines = lines;
export const getCommercialProduct = (slug: string) => commercialProducts.find(p => p.slug === slug);
export const searchableProducts = (line?: Line, query = '') => {
 const term = query.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();
 return commercialProducts.filter(p => (!line || p.line === line) && `${p.id} ${p.name} ${p.description} ${p.collection}`.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().includes(term));
};
