import type { Metadata } from 'next';
import Storefront from '@/components/storefront';
import { products } from '@/lib/catalog';

type Params = { params: Promise<{ path: string[] }> };
const pages: Record<string, { title: string; description: string }> = {
  'objetos-colecionaveis': { title: 'Objetos & Colecionáveis', description: 'Explore objetos decorativos, organizadores e colecionáveis da Vektua XYZ. Catálogo demonstrativo; produtos e preços ainda em validação.' },
  'datas-colecoes': { title: 'Datas & Coleções', description: 'Conheça coleções de ocasião e decoração temática da Vektua XYZ. Composição, disponibilidade e prazos sujeitos a validação.' },
  'datas-colecoes/pequenos-encantos': { title: 'Pequenos Encantos | Coleção conceitual', description: 'Explore a coleção conceitual Pequenos Encantos da Vektua XYZ. Esta vitrine não está disponível para compra.' },
  'feitos-para-voce': { title: 'Feitos para Você | Miniaturas estilizadas', description: 'Conheça as propostas de miniaturas estilizadas de pets e pessoas da Vektua XYZ. Processo e condições ainda em estudo.' },
  'chaveiros': { title: 'Chaveiros | Temáticos e articulados', description: 'Explore a linha independente de chaveiros da Vektua XYZ. Venda digital e possibilidade futura de seleção para negócios locais, sem pontos confirmados.' },
  'busca': { title: 'Buscar objetos e chaveiros', description: 'Busque por objetos, coleções, miniaturas estilizadas e chaveiros no catálogo demonstrativo Vektua XYZ.' },
  'carrinho': { title: 'Carrinho demonstrativo', description: 'Simule a seleção de objetos no carrinho Vektua XYZ. Pedidos e pagamentos estão desabilitados.' },
  'sobre': { title: 'Sobre a Vektua XYZ', description: 'Conheça a proposta da Vektua XYZ: objetos com personalidade em quatro linhas, com curadoria e clareza.' },
  'como-funciona': { title: 'Como funciona', description: 'Entenda como são apresentadas as peças, coleções e propostas de personalização da Vektua XYZ. Site em demonstração.' },
  'ajuda': { title: 'Perguntas frequentes', description: 'Dúvidas sobre imagens conceituais, quatro linhas, chaveiros, personalização e condições ainda não disponíveis no protótipo Vektua XYZ.' },
  'contato': { title: 'Contato | Atendimento em preparação', description: 'Informações de contato e proposta para estabelecimentos da Vektua XYZ; canal de atendimento comercial ainda em preparação.' },
  'politicas/entrega': { title: 'Entrega | Condições em preparação', description: 'Consulte o estado da política de entregas da Vektua XYZ. O protótipo não confirma fretes ou prazos.' },
  'politicas/trocas-devolucoes': { title: 'Trocas e devoluções | Minuta', description: 'Política de trocas e devoluções em preparação para a Vektua XYZ. Não há vendas habilitadas.' },
  'politicas/privacidade': { title: 'Privacidade | Minuta', description: 'Informações de privacidade do protótipo Vektua XYZ, que não aceita uploads de fotos ou pedidos comerciais.' },
  'politicas/termos': { title: 'Termos de uso | Minuta', description: 'Termos demonstrativos para navegação no protótipo da Vektua XYZ, sem checkout ou vendas.' },
};
export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const route = (await params).path.join('/');
  const product = route.startsWith('produto/') ? products.find(item => item.slug === route.slice(8)) : undefined;
  const meta = product ? { title: `${product.name} | Estudo de produto`, description: `${product.name}. Visualização digital de um candidato da Vektua XYZ; ficha, direitos, preço e liberação comercial ainda pendentes.` } : pages[route];
  return {
    title: meta?.title ?? 'Página demonstrativa',
    description: meta?.description ?? 'Vektua XYZ: protótipo demonstrativo de objetos com personalidade, sem vendas habilitadas.',
    robots: { index: false, follow: false },
  };
}
export default function Page() { return <Storefront />; }
