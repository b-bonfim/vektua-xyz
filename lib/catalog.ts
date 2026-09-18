export type Line = 'objetos' | 'datas' | 'feitos';
export type Product = {
  id: string; slug: string; name: string; line: Line; kind: string; price: number;
  image: string; imagePosition?: string; description: string; dimensions: string;
  includes: string; colors: string[]; demo: true; statusGate: 'EVIDENCE_PENDING';
};
export const lines = [
  { id: 'objetos' as const, name: 'Objetos & Colecionáveis', path: '/objetos-colecionaveis', verb: 'Para escolher', description: 'Peças interessantes para usar, exibir ou presentear.', image: '/images/objects.webp' },
  { id: 'datas' as const, name: 'Datas & Coleções', path: '/datas-colecoes', verb: 'Para celebrar', description: 'Pequenos objetos. Grandes motivos para celebrar.', image: '/images/collection.webp' },
  { id: 'feitos' as const, name: 'Feitos para Você', path: '/feitos-para-voce', verb: 'Para personalizar', description: 'Um pouco de quem você ama, em uma nova forma.', image: '/images/pet.webp' },
];
const fixture = { demo: true as const, statusGate: 'EVIDENCE_PENDING' as const };
// Synthetic UI data. Not the approved portfolio, prices, inventory or production promises.
export const products: Product[] = [
  { ...fixture, id:'DEMO-01', slug:'vaso-duna', name:'Vaso Duna', line:'objetos', kind:'Decoração', price:89, image:'/images/objects.webp', imagePosition:'66% center', description:'Ritmo, curvas e um novo ponto de interesse para aquele cantinho. Um vaso escultural com textura que convida a olhar de perto.', dimensions:'16 × 16 × 22 cm', includes:'1 vaso decorativo. Os demais objetos da composição não estão incluídos.', colors:['Verde-petróleo','Marfim','Terracota'] },
  { ...fixture, id:'DEMO-02', slug:'bandeja-curva', name:'Bandeja Curva', line:'objetos', kind:'Organização', price:49, image:'/images/objects.webp', imagePosition:'35% 80%', description:'Uma forma orgânica para reunir pequenos objetos e deixar a rotina um pouco mais interessante.', dimensions:'18 × 12 × 3 cm', includes:'1 bandeja decorativa. A composição da imagem é apenas uma referência visual.', colors:['Terracota','Marfim'] },
  { ...fixture, id:'DEMO-03', slug:'kit-pequenos-encantos', name:'Kit Pequenos Encantos', line:'datas', kind:'Halloween', price:119, image:'/images/collection.webp', description:'Uma pequena coleção de formas divertidas para dar outro clima ao seu espaço.', dimensions:'Peças entre 6 e 10 cm', includes:'2 abóboras decorativas e 1 fantasma. Base cenográfica não incluída.', colors:['Terracota + Marfim'] },
  { ...fixture, id:'DEMO-04', slug:'miniatura-pet', name:'Seu pet em miniatura', line:'feitos', kind:'Personalizados', price:249, image:'/images/pet.webp', description:'O jeito de sentar, as cores, a expressão. Uma interpretação estilizada de um companheiro que tem um lugar só dele na sua história.', dimensions:'Exemplo de tamanho: 10 cm', includes:'1 miniatura estilizada, com opções a validar. Não é uma reprodução fotorrealista.', colors:['Conforme referências'] },
  { ...fixture, id:'DEMO-05', slug:'vaso-arco', name:'Vaso Arco', line:'objetos', kind:'Decoração', price:69, image:'/images/objects.webp', imagePosition:'90% center', description:'Um arco delicado, uma presença simples. Um pequeno objeto para compor espaços com personalidade.', dimensions:'12 × 6 × 16 cm', includes:'1 vaso decorativo em arco. Outros objetos da cena não incluídos.', colors:['Marfim','Verde-petróleo'] },
  { ...fixture, id:'DEMO-06', slug:'duo-aboboras', name:'Duo de Abóboras', line:'datas', kind:'Halloween', price:79, image:'/images/collection.webp', imagePosition:'40% center', description:'Duas proporções, a mesma textura. Um conjunto para experimentar uma composição de ocasião.', dimensions:'Exemplo: 8 e 10 cm de altura', includes:'2 abóboras. O fantasma e a base da imagem não estão incluídos.', colors:['Terracota'] },
];
export const money = (value:number) => new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL'}).format(value);
export const normalize = (value:string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
export function filterProducts(items: Product[], query:string, category:string, sort:string) {
  const terms = normalize(query).trim().split(/\s+/).filter(Boolean);
  return items.filter(p => terms.every(term => normalize(`${p.name} ${p.description} ${p.kind} ${lines.find(l=>l.id===p.line)?.name}`).includes(term)) && (category==='Todos' || p.kind===category)).sort((a,b)=>sort==='price-asc'?a.price-b.price:sort==='price-desc'?b.price-a.price:0);
}
export const faq = [
  ['O que posso explorar neste site?', 'Você pode conhecer as três linhas, filtrar peças, abrir fichas e experimentar o carrinho e a personalização. Todos os produtos, valores e medidas são exemplos de demonstração; não há venda habilitada.'],
  ['A miniatura fica idêntica à fotografia?', 'A proposta é uma interpretação estilizada, não uma reprodução fotorrealista. Estilos, detalhes e possibilidades precisam ser definidos e validados antes de uma oferta comercial.'],
  ['Posso escolher as cores?', 'Algumas fichas demonstram seletores de cor. As opções são ilustrativas; cada produto real terá suas próprias combinações verificadas. A imagem conceitual não muda com a seleção.'],
  ['Quando começa a produção?', 'Nenhuma produção é iniciada pelo protótipo. Em uma operação futura, as condições de início, preço e prazo precisarão estar aprovadas e ser apresentadas antes da confirmação.'],
  ['Como funcionam entrega e devoluções?', 'As políticas estão em preparação. Ainda não existem condições comerciais aprovadas neste protótipo. Consulte as páginas de políticas para ver o que falta definir.'],
  ['Posso enviar uma foto do meu pet?', 'Neste protótipo, usamos somente uma referência de exemplo. O recebimento de fotos reais dependerá de um fluxo privado e de condições de uso e privacidade validadas.'],
];
