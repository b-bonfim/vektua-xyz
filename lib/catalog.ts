import { skuDescription } from './sku-copy';

export type Line = 'objetos' | 'datas' | 'feitos' | 'chaveiros';
export type Product = {
  id: string; slug: string; name: string; line: Line; kind: string; price: number;
  image: string; imagePosition?: string; description: string; dimensions: string;
  includes: string; colors: string[]; demo: true; statusGate: 'EVIDENCE_PENDING';
};

// Opportunity Brief / Positioning / Brand Book v2.0 (20/09/2026): one brand, four lines.
// DEC-009 approves the composition of the original nine-item mockup, NOT commercial SKU release.
// No fixed SKU-count target. Chaveiros are a separate primary classification, even if thematic.
// Prices are interface fixtures: checkout, real stock, production and orders are NOT enabled.
// Marketing descriptions: shortlist-sku!Página1 B5:C13, with distinct risk disclosures in sku-copy.ts.
export const lines: {id:Line;name:string;path:string;verb:string;description:string;image:string}[] = [
  { id:'objetos', name:'Objetos & Colecionáveis', path:'/objetos-colecionaveis', verb:'Escolher', description:'Peças de catálogo para usar, exibir ou presentear — sem chaveiros nesta linha.', image:'/images/products/G-ORG-RC-01-main.svg' },
  { id:'datas', name:'Datas & Coleções', path:'/datas-colecoes', verb:'Celebrar', description:'Objetos e coleções para diferentes ocasiões, com composição e condições por produto.', image:'/images/products/S-HAL-DEC-01-main.svg' },
  { id:'feitos', name:'Feitos para Você', path:'/feitos-para-voce', verb:'Personalizar', description:'Miniaturas estilizadas com escopo e exemplos em validação.', image:'/images/pet.webp' },
  { id:'chaveiros', name:'Chaveiros', path:'/chaveiros', verb:'Descobrir', description:'Chaveiros diversos, articulados e temáticos. Proposta de curadoria para negócios locais, ainda sem pontos parceiros confirmados.', image:'/images/products/G-CHV-JJ-01-main.svg' },
];
const fixture = {demo:true as const,statusGate:'EVIDENCE_PENDING' as const};
const renderNotice = 'Visualização digital derivada da geometria do arquivo 3MF original; não é fotografia de peça fabricada. Direitos do modelo, fabricação, medidas, cor, segurança, preço e liberação comercial ainda sujeitos à validação.';
const hi3dNotice = 'Oferta em estudo via Hi3D. Imagem meramente ilustrativa, não fotografia de produto fabricado. Não envie fotos nem dados pessoais: recebimento e tratamento dependem de condições, privacidade e testes aprovados.';
export const products: Product[] = [
 { ...fixture, id:'G-ORG-RC-01', slug:'g-org-rc-01', name:'Organizador para controles remotos — de apoio, não de parede', line:'objetos', kind:'Organização', price:79, image:'/images/products/G-ORG-RC-01-main.svg', description:skuDescription('G-ORG-RC-01',renderNotice), dimensions:'Medidas finais pendentes de ficha técnica e protótipo.', includes:'1 organizador, proposta de unidade ainda não liberada. Controles não incluídos.', colors:['A validar'] },
 { ...fixture, id:'S-HAL-DEC-01', slug:'s-hal-dec-01', name:'Decoração de Halloween — abóbora porta-doces', line:'datas', kind:'Halloween', price:89, image:'/images/products/S-HAL-DEC-01-main.svg', description:skuDescription('S-HAL-DEC-01',renderNotice), dimensions:'A confirmar a partir do projeto e protótipo.', includes:'Conteúdo e quantidade de peças a confirmar. Doces e itens cenográficos não incluídos.', colors:['A validar'] },
 { ...fixture, id:'CAN-PET-001', slug:'can-pet-001', name:'Miniatura estilizada de pet — estudo de personalização', line:'feitos', kind:'Personalizados', price:249, image:'/images/pet.webp', description:skuDescription('CAN-PET-001',hi3dNotice), dimensions:'Dimensões a especificar e validar.', includes:'Escopo, revisão, referência, acabamento e unidade de venda a especificar.', colors:['A definir por oferta validada'] },
 { ...fixture, id:'G-VAS-ESC-01', slug:'g-vas-esc-01', name:'Cachepot escultórico — modelo de terceiro, conceito em análise', line:'objetos', kind:'Decoração', price:89, image:'/images/products/G-VAS-ESC-01-main.svg', description:skuDescription('G-VAS-ESC-01',renderNotice), dimensions:'A confirmar; geometria não equivale à prova de funcionalidade.', includes:'Composição e itens incluídos sujeitos a definição. Planta não incluída.', colors:['A validar'] },
 { ...fixture, id:'G-VAS-MIN-01', slug:'g-vas-min-01', name:'Kit de três mini-cachepots decorativos — função a validar', line:'objetos', kind:'Decoração', price:99, image:'/images/products/G-VAS-MIN-01-main.svg', description:skuDescription('G-VAS-MIN-01',renderNotice), dimensions:'A confirmar individualmente por componente.', includes:'Oferta pretendida: três mini-cachepots. Composição efetiva do arquivo e unidade final a validar; plantas não incluídas.', colors:['A validar'] },
 { ...fixture, id:'G-ORG-HS-01', slug:'g-org-hs-01', name:'Suporte para headset — sem fixação adesiva', line:'objetos', kind:'Organização', price:69, image:'/images/products/G-ORG-HS-01-main.svg', description:skuDescription('G-ORG-HS-01',renderNotice), dimensions:'A confirmar na ficha e em protótipo.', includes:'1 suporte proposto; headset não incluído.', colors:['A validar'] },
 { ...fixture, id:'G-CHV-JJ-01', slug:'g-chv-jj-01', name:'Chaveiro em formato de faixa de jiu-jítsu', line:'chaveiros', kind:'Chaveiros', price:29, image:'/images/products/G-CHV-JJ-01-main.svg', description:skuDescription('G-CHV-JJ-01',renderNotice), dimensions:'A confirmar para a variante selecionada.', includes:'1 chaveiro proposto; argola, cores e acessórios ainda não especificados.', colors:['A validar'] },
 { ...fixture, id:'S-NAT-PRE-01', slug:'s-nat-pre-01', name:'Presépio minimalista de Natal', line:'datas', kind:'Natal', price:89, image:'/images/products/S-NAT-PRE-01-main.svg', description:skuDescription('S-NAT-PRE-01',renderNotice), dimensions:'A confirmar na ficha e nos testes.', includes:'Composição a confirmar após identificação de componentes reais.', colors:['A validar'] },
 { ...fixture, id:'CAN-PESSOA-001', slug:'can-pessoa-001', name:'Miniatura caricata estilizada de pessoa — estudo Hi3D', line:'feitos', kind:'Personalizados', price:249, image:'/images/person.webp', description:skuDescription('CAN-PESSOA-001',hi3dNotice), dimensions:'Dimensões ainda não validadas.', includes:'Escopo de referência, revisão, prévia e aprovação a especificar.', colors:['A definir por oferta validada'] },
];
export const money=(value:number)=>new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL'}).format(value);
export const normalize=(value:string)=>value.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
export function filterProducts(items:Product[],query:string,category:string,sort:string){const terms=normalize(query).trim().split(/\s+/).filter(Boolean);return items.filter(p=>terms.every(term=>normalize(`${p.id} ${p.name} ${p.description} ${p.kind} ${lines.find(l=>l.id===p.line)?.name}`).includes(term))&&(category==='Todos'||p.kind===category)).sort((a,b)=>sort==='price-asc'?a.price-b.price:sort==='price-desc'?b.price-a.price:0);}
export const faq=[
 ['O que posso explorar neste site?','Você pode explorar as quatro linhas, filtrar peças, abrir fichas e experimentar o carrinho e personalização em modo demonstrativo. Os nove itens são a composição do protótipo DEC-009, não uma quota de lançamento nem SKUs liberados para venda; valores fictícios, sem pagamento.'],
 ['Onde encontro os chaveiros?','A linha Chaveiros tem vitrine digital própria. A presença em comércios locais é uma proposta sujeita a acordos e exposição comprovados. Não há pontos parceiros, estoque ou disponibilidade presencial confirmados neste protótipo.'],
 ['As imagens são fotografias de peças prontas?','Não. Visualizações de geometria 3MF não são fotos de peças fabricadas. Fotos reais, direitos e protótipos precisam de validação. Imagens das duas ofertas personalizadas são exemplos ilustrativos.'],
 ['A miniatura fica idêntica à fotografia?','Não há promessa de fotorrealismo. A proposta é estilizada e depende de escopo e testes antes da oferta.'],
 ['Posso escolher as cores?','Os seletores são demonstrativos. Cores e variantes reais dependem de especificação e validação técnica por SKU.'],
 ['Quando começa a produção?','O site não aceita pedidos nem realiza pagamentos. Fabricação e vendas dependem de direitos, testes, condições comerciais e decisão do Founder.'],
 ['Como funcionam entrega e devoluções?','As condições comerciais estão em preparação; não há frete, estoque nem prazo confirmado.'],
 ['Posso enviar uma foto do meu pet ou de outra pessoa?','Não envie referências pessoais neste protótipo. O recebimento depende de fluxo privado, termos e privacidade verificados.'],
];
