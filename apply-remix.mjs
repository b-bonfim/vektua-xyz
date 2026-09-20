/**
 * VEKTUA XYZ — integração estritamente de imagens REMIX por SKU.
 * Executar na raiz do checkout de b-bonfim/vektua-xyz, após extrair este ZIP.
 * Fail-closed: valida todos os caminhos/âncoras antes de escrever qualquer arquivo.
 * Não habilita vendas nem declara fotos físicas comprovadas.
 */
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
if (!fs.existsSync(path.join(root, 'package.json')) || !fs.existsSync(path.join(root, 'lib/catalog.ts'))) {
  throw new Error('Execute na raiz do repositório Vektua XYZ, após extrair o pacote.');
}
const refs = {
  'G-ORG-RC-01': ['G-ORG-RC-01_REMIX.webp'],
  'S-HAL-DEC-01': ['S-HAL-DEC-01_REMIX.webp','S-HAL-DEC-01_REMIX_02.webp','S-HAL-DEC-01_REMIX_03.webp','S-HAL-DEC-01_REMIX_04.webp'],
  'G-VAS-ESC-01': ['G-VAS-ESC-01_REMIX.webp'],
  'G-VAS-MIN-01': ['G-VAS-MIN-01_REMIX.webp'],
  'G-ORG-HS-01': ['G-ORG-HS-01_REMIX.webp','G-ORG-HS-01_REMIX_02.webp','G-ORG-HS-01_REMIX_03.webp'],
  'G-CHV-JJ-01': ['G-CHV-JJ-01_REMIX.webp','G-CHV-JJ-01_REMIX_02.webp','G-CHV-JJ-01_REMIX_03.webp'],
  'S-NAT-PRE-01': ['S-NAT-PRE-01_REMIX.webp','S-NAT-PRE-01_REMIX_02.webp','S-NAT-PRE-01_REMIX_03.webp'],
};
const webPath = name => `/images/products/remix/${name}`;
for (const names of Object.values(refs)) for (const name of names) {
  if (!name.includes('REMIX') || !fs.existsSync(path.join(root,'public',webPath(name)))) {
    throw new Error(`Imagem REMIX ausente: ${name}`);
  }
}
const files = ['lib/catalog.ts','components/storefront.tsx','components/home-v2.tsx','components/chaveiros-v2.tsx','app/sobre/page.tsx','app/globals.css'];
const original = new Map(files.map(p=>[p,fs.readFileSync(path.join(root,p),'utf8')]));
const changes = new Map(original);
function change(file, needle, replacement, expected=1) {
  const before=changes.get(file);
  const count=before.split(needle).length-1;
  if (count!==expected) throw new Error(`Versão divergente em ${file}: esperadas ${expected} ocorrências de ${JSON.stringify(needle.slice(0,90))}, encontradas ${count}. NADA foi escrito.`);
  changes.set(file,before.split(needle).join(replacement));
}
const catalog='lib/catalog.ts';
change(catalog, 'image: string; imagePosition?: string; description: string;', 'image: string; gallery?: string[]; imagePosition?: string; description: string;');
// Primeiro atualizar imagens do cadastro; os nomes, descrições, preços e gates são preservados.
for (const [sku,names] of Object.entries(refs)) {
  const old=`image:'/images/products/${sku}-main.svg', description:skuDescription('${sku}'`;
  const src=names.map(n=>`'${webPath(n)}'`).join(',');
  const replacement=`image:'${webPath(names[0])}', gallery:[${src}], description:skuDescription('${sku}'`;
  change(catalog,old,replacement);
}
for (const sku of ['G-ORG-RC-01','S-HAL-DEC-01','G-CHV-JJ-01']) {
  change(catalog,`image:'/images/products/${sku}-main.svg'`,`image:'${webPath(refs[sku][0])}'`);
}
change(catalog,
  "const renderNotice = 'Visualização digital derivada da geometria do arquivo 3MF original; não é fotografia de peça fabricada. Direitos do modelo, fabricação, medidas, cor, segurança, preço e liberação comercial ainda sujeitos à validação.';",
  "const renderNotice = 'Imagem REMIX fornecida na pasta deste SKU no Google Drive: ambientação visual editada, não comprovante de fotografia de uma peça fabricada. O objeto mostrado deve ser conferido com o protótipo físico. Direitos do modelo, fabricação, medidas, cor, segurança, preço e liberação comercial continuam sujeitos à validação.';"
);
change(catalog,
  "'Não. Visualizações de geometria 3MF não são fotos de peças fabricadas. Fotos reais, direitos e protótipos precisam de validação. Imagens das duas ofertas personalizadas são exemplos ilustrativos.'",
  "'Os sete SKUs de catálogo usam imagens REMIX de suas respectivas pastas no Drive. São composições visuais editadas, sem comprovação de fotografia da peça fabricada. As duas ofertas personalizadas mantêm ilustrações conceituais. Amostras físicas, direitos e protótipos dependem de validação.'"
);

const storefront='components/storefront.tsx';
change(storefront, 'alt={`Representação conceitual de ${product.name}; não é foto de produto físico`}', 'alt={`Imagem ${product.gallery ? "REMIX ambientada, edição visual de" : "conceitual de"} ${product.name}; fotografia da peça fabricada não verificada`}');
change(storefront, 'width="640" height="640"/><Concept/>', 'width="640" height="640"/><Concept>{product.gallery ? "Imagem REMIX · ambientação editada" : "Imagem conceitual · IA"}</Concept>');
change(storefront, "const [view,setView]=useState('composicao')", 'const [view,setView]=useState(0)');
change(storefront, '<div className={`pdp-image ${view===\'detalhe\'?\'detail-zoom\':\'\'}`}><img src={product.image}', '<div className={`pdp-image ${!product.gallery && view===1 ? "detail-zoom" : ""}`}><img src={product.gallery?.[view] ?? product.image}');
change(storefront, 'alt={`Conceito visual: ${product.name}`}', 'alt={`${product.gallery ? "Imagem REMIX ambientada" : "Conceito visual"}: ${product.name}; amostra física não verificada`}');
change(storefront, '<Concept>Imagem conceitual · foto real pendente</Concept>', '<Concept>{product.gallery ? "Imagem REMIX · ambientação editada; peça física não verificada" : "Imagem conceitual · foto real pendente"}</Concept>');
change(storefront, 'style={{objectPosition:product.imagePosition}}/><Concept>', 'style={{objectPosition:product.imagePosition,objectFit:product.gallery ? "contain" : undefined}}/><Concept>');
change(storefront,
  "{['composicao','detalhe'].map(v=><button key={v} className={view===v?'selected':''} aria-pressed={view===v} onClick={()=>setView(v)}>{v==='composicao'?'Composição':'Aproximar conceito'}</button>)}",
  "{(product.gallery ?? ['composicao','detalhe']).map((src,index)=><button key={src} className={view===index?'selected':''} aria-pressed={view===index} onClick={()=>setView(index)}>{product.gallery ? `Imagem ${index+1}` : index===0 ? 'Composição' : 'Aproximar conceito'}</button>)}"
);
change(storefront, '<p className="small-note">Cena ilustrativa. Consulte abaixo o conteúdo previsto para este exemplo.</p>', '<p className="small-note">{product.gallery ? "Imagens REMIX ambientadas e editadas. Adereços de cenário não integram a oferta; conferir composição e amostra física antes de vender." : "Cena ilustrativa. Consulte abaixo o conteúdo previsto para este exemplo."}</p>');
change(storefront,'src="/images/objects.webp"','src="'+webPath(refs['G-VAS-ESC-01'][0])+'"',2);
change(storefront, 'alt="Composição conceitual de objetos decorativos" width="800" height="900"/><Concept/>', 'alt="Ambientação REMIX editada do SKU G-VAS-ESC-01; peça física não verificada" width="800" height="900"/><Concept>Imagem REMIX · ambientação editada</Concept>');
change(storefront, 'alt={`Conceito visual: ${p.name}`}', 'alt={`${p.gallery ? "Imagem REMIX ambientada" : "Conceito visual"}: ${p.name}`}');
change(storefront,'src="/images/collection.webp"','src="'+webPath(refs['S-HAL-DEC-01'][0])+'"');
change(storefront, 'alt="Composição conceitual de vasos esculturais em verde e marfim, com uma bandeja terracota"', 'alt="Ambientação REMIX editada do SKU G-VAS-ESC-01; peça física não verificada"');
change(storefront, '<Concept>Conceito visual · foto real pendente</Concept>', '<Concept>Imagem REMIX · ambientação editada</Concept>');
change(storefront, 'alt={`Imagem conceitual da linha ${l.name}`} width="600" height="420" loading="lazy"/><Concept/>', 'alt={`Imagem ${l.id === "feitos" ? "conceitual" : "REMIX ambientada"} da linha ${l.name}; peça física não verificada`} width="600" height="420" loading="lazy"/><Concept>{l.id === "feitos" ? "Imagem conceitual · IA" : "Imagem REMIX · ambientação editada"}</Concept>');
change(storefront, 'alt="Coleção conceitual de abóboras e fantasma"', 'alt="Imagem REMIX ambientada do SKU S-HAL-DEC-01; itens inclusos ainda pendentes de validação"');
change(storefront, 'Protótipo de navegação · imagens conceituais · compra desabilitada', 'Protótipo de navegação · imagens REMIX editadas e conceitos · compra desabilitada');

const home='components/home-v2.tsx';
change(home, 'alt={`Visualização digital de ${product.name}; não é fotografia da peça impressa`}', 'alt={`Imagem ${product.gallery ? "REMIX ambientada, edição visual de" : "conceitual de"} ${product.name}; peça física não verificada`}');
change(home, 'width="640" height="640" loading="lazy"/><Preview/>', 'width="640" height="640" loading="lazy"/><Preview>{product.gallery ? "Imagem REMIX · ambientação editada" : "Visualização digital · não é foto de produto físico"}</Preview>');
change(home,'src="/images/objects.webp"','src="'+webPath(refs['G-VAS-ESC-01'][0])+'"');
change(home,'alt="Composição conceitual de objetos decorativos; não é fotografia de produtos fabricados"','alt="Ambientação REMIX editada do SKU G-VAS-ESC-01; peça física não verificada"');
change(home,'<Preview>Imagem conceitual · foto real pendente</Preview>','<Preview>Imagem REMIX · ambientação editada</Preview>');
change(home,'alt={`Visualização conceitual de ${line.name}; peça física não fotografada`}', 'alt={`Imagem ${line.id === "feitos" ? "conceitual" : "REMIX ambientada"} da linha ${line.name}; peça física não verificada`}');
change(home, 'width="600" height="420" loading="lazy" alt={`Imagem ${line.id === "feitos" ? "conceitual" : "REMIX ambientada"} da linha ${line.name}; peça física não verificada`}/><Preview/>', 'width="600" height="420" loading="lazy" alt={`Imagem ${line.id === "feitos" ? "conceitual" : "REMIX ambientada"} da linha ${line.name}; peça física não verificada`}/><Preview>{line.id === "feitos" ? "Imagem conceitual" : "Imagem REMIX · ambientação editada"}</Preview>');
change(home,'src="/images/products/G-CHV-JJ-01-main.svg"','src="'+webPath(refs['G-CHV-JJ-01'][0])+'"');
change(home,'alt="Representação digital do chaveiro de faixa de jiu-jítsu a partir de arquivo 3MF, sem fotografia física"','alt="Ambientação REMIX editada do SKU G-CHV-JJ-01; peça física não verificada"');
change(home,'<Preview>Geometria 3MF · fabricação pendente</Preview>','<Preview>Imagem REMIX · ambientação editada</Preview>');

const keyrings='components/chaveiros-v2.tsx';
change(keyrings,'src="/images/products/G-CHV-JJ-01-main.svg"','src="'+webPath(refs['G-CHV-JJ-01'][0])+'"');
change(keyrings,'alt="Visualização digital de chaveiro de faixa de jiu-jítsu com origem em arquivo 3MF; não é foto de peça fabricada"','alt="Imagem REMIX ambientada e editada do chaveiro G-CHV-JJ-01; fotografia da peça fabricada não verificada"');
change(keyrings,'<span className="concept-label">Visualização 3MF · foto real pendente</span>','<span className="concept-label">Imagem REMIX · ambientação editada</span>');
change(keyrings,'alt={`Geometria digital de ${product.name}; não é fotografia do produto físico`}', 'alt={`Imagem REMIX ambientada e editada de ${product.name}; peça física não verificada`}');
change(keyrings,'<span className="concept-label">Visualização digital · foto pendente</span>','<span className="concept-label">Imagem REMIX · ambientação editada</span>');

const about='app/sobre/page.tsx';
change(about, 'src="/images/objects.webp"', 'src="'+webPath(refs['G-VAS-ESC-01'][0])+'"');
change(about, 'alt="Composição visual conceitual de objetos decorativos, não fotografia dos produtos fabricados"', 'alt="Ambientação REMIX editada do SKU G-VAS-ESC-01; peça física não verificada"');
change(about, '<span className="concept-label">Conceito visual · foto real pendente</span>', '<span className="concept-label">Imagem REMIX · ambientação editada</span>');
change(about, 'alt={`Representação digital conceitual da linha ${line.name}`}', 'alt={`Imagem ${line.id === "feitos" ? "conceitual" : "REMIX ambientada"} da linha ${line.name}; peça física não verificada`}');
change(about, '<span className="concept-label">Visualização digital</span>', '<span className="concept-label">{line.id === "feitos" ? "Imagem conceitual" : "Imagem REMIX · ambientação editada"}</span>');
change('app/globals.css', '.gallery-controls{display:flex;gap:10px;', '.gallery-controls{display:flex;flex-wrap:wrap;gap:10px;');

// Falhar antes de qualquer escrita caso ainda existam imagens SVG de SKU nas superfícies alvo.
for (const [file,text] of changes) {
  if (/\/images\/products\/[A-Z0-9-]+-main\.svg/.test(text)) throw new Error(`Referência SVG de SKU ainda presente em ${file}; nada foi escrito.`);
}
// O catálogo mantém ambas as ofertas personalizadas sem inserir imagens não autorizadas.
if (!changes.get(catalog).includes("id:'CAN-PET-001'") || !changes.get(catalog).includes("id:'CAN-PESSOA-001'")) {
  throw new Error('Oferta personalizada não localizada; atualização interrompida.');
}
for (const [file,text] of changes) fs.writeFileSync(path.join(root,file),text,'utf8');
console.log(`OK: ${Object.keys(refs).length} SKUs, ${Object.values(refs).flat().length} imagens REMIX e ${changes.size} arquivos de código atualizados.`);
console.log('Comercialização segue desabilitada; revisão e build local ainda necessários.');
