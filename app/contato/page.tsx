import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowUpRight, LockKeyhole } from 'lucide-react';
import { BrandHeader, BrandFooter } from '@/components/brand-shell-v2';

export const metadata: Metadata = {
  title: 'Proposta para estabelecimentos | Atendimento em preparação',
  description: 'Conheça a proposta ainda não comercial da Vektua XYZ para exposição de chaveiros em negócios locais. Canal de atendimento indisponível neste protótipo.',
  robots: { index: false, follow: false },
};

export default function ContactInfoPage() {
  return <>
    <BrandHeader/>
    <main id="conteudo" className="container page-space narrow-page" tabIndex={-1}>
      <nav className="breadcrumbs" aria-label="Localização"><Link href="/">Início</Link><span aria-hidden="true">/</span><span aria-current="page">Informações e atendimento</span></nav>
      <h1>Uma proposta para estabelecimentos.</h1>
      <p className="lead">Estamos estudando uma curadoria de chaveiros para pontos comerciais locais. Esta é uma proposta em validação, não um programa de parceria ativo.</p>
      <h2>O que a proposta precisaria definir</h2>
      <ul className="editorial-list"><li>Seleção de modelos adequada ao contexto e ao público do estabelecimento.</li><li>Condições comerciais e responsabilidades acordadas previamente.</li><li>Disponibilidade real, exposição, reposição e eventual devolução.</li><li>Direitos, qualidade e autorização de venda de cada SKU envolvido.</li></ul>
      <p className="small-note"><LockKeyhole aria-hidden="true" size={16}/> Nenhum parceiro, ponto de venda, margem ou estoque está confirmado. Não há formulário, e-mail comercial ou recebimento de mensagens neste protótipo.</p>
      <h2>Atendimento em preparação</h2><p>O canal de contato será divulgado somente após a operação estar preparada para receber solicitações. Até lá, esta página é exclusivamente informativa.</p>
      <Link className="text-link" href="/chaveiros">Conhecer a linha de chaveiros <ArrowUpRight aria-hidden="true" size={18}/></Link>
      <p><Link className="text-link" href="/ajuda">Consultar perguntas frequentes <ArrowUpRight aria-hidden="true" size={18}/></Link></p>
    </main>
    <BrandFooter/>
  </>;
}
