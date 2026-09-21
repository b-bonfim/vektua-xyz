'use client';
import ResponsiveImage from '@/components/responsive-image';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight, Search, X } from 'lucide-react';
import { useState } from 'react';
import { BrandHeader, BrandFooter } from '@/components/brand-shell-v2';
import { products, money, normalize } from '@/lib/catalog';
import { keyringCandidateSummary } from '@/lib/keyring-candidates';

export default function ChaveirosV2() {
  const [query, setQuery] = useState('');
  // Somente os itens da vitrine demonstrativa preexistente: a shortlist nova
  // é registro de candidatos, não autorização para anunciar ou vender SKUs.
  const keyrings = products.filter(p => p.line === 'chaveiros' && normalize(`${p.name} ${p.kind} ${p.description}`).includes(normalize(query.trim())));
  return <>
    <BrandHeader />
    <main id="conteudo" tabIndex={-1}>
      <div className="container page-space">
        <nav className="breadcrumbs" aria-label="Localização"><Link href="/">Início</Link><span><ArrowRight size={13} aria-hidden="true"/><span aria-current="page">Chaveiros</span></span></nav>
        <div className="vx-keyrings-intro">
          <div>
            <h1>Chaveiros que combinam com o seu universo.</h1>
            <p>Uma linha independente de acessórios diversos, articulados e temáticos. Explore os modelos em estudo e descubra a proposta de curadoria por contexto — online e, futuramente, em estabelecimentos locais.</p>
            <p className="small-note">Protótipo sem compras. Nenhum ponto físico, estoque, preço ou prazo confirmado.</p>
          </div>
          <div className="vx-keyrings-hero">
            <ResponsiveImage src="/images/products/remix/G-CHV-JJ-01_REMIX.webp" alt="Imagem REMIX ambientada e editada do chaveiro G-CHV-JJ-01; fotografia da peça fabricada não verificada" width="660" height="500"/>
            <span className="concept-label">Imagem REMIX · ambientação editada</span>
          </div>
        </div>
        <section aria-labelledby="vx-keyring-catalog">
          <div className="section-heading heading-link">
            <div><h2 id="vx-keyring-catalog">Explore os chaveiros em estudo</h2><p>O catálogo não tem quantidade fixa de SKUs. Cada inclusão depende de validação individual.</p></div>
            <Link className="text-link" href="/busca">Todas as quatro linhas<ArrowUpRight size={17} aria-hidden="true"/></Link>
          </div>
          <form className="search-form" role="search" onSubmit={event => event.preventDefault()}>
            <Search size={21} aria-hidden="true"/>
            <input type="search" value={query} onChange={event => setQuery(event.target.value)} aria-label="Buscar chaveiros" placeholder="Buscar nesta linha"/>
            {query && <button type="button" className="icon-button" aria-label="Limpar busca" onClick={() => setQuery('')}><X size={18}/></button>}
          </form>
          <p className="result-count" aria-live="polite">{keyrings.length} {keyrings.length === 1 ? 'modelo demonstrativo encontrado' : 'modelos demonstrativos encontrados'}</p>
          {keyrings.length ? <div className="product-grid vx-products">
            {keyrings.map(product => <article key={product.id} className="product-card">
              <Link className="product-picture" href={`/produto/${product.slug}`} aria-label={`Conhecer ${product.name}`}>
                <ResponsiveImage src={product.image} alt={`Imagem REMIX ambientada e editada de ${product.name}; peça física não verificada`} width="640" height="640" loading="lazy"/>
                <span className="concept-label">Imagem REMIX · ambientação editada</span><span className="product-open"><ArrowUpRight size={19} aria-hidden="true"/></span>
              </Link>
              <div className="product-info"><span className="product-category">Chaveiros</span><Link className="product-name" href={`/produto/${product.slug}`}>{product.name}</Link><div className="price-row"><span>{money(product.price)}</span><span>Valor ilustrativo</span></div></div>
            </article>)}
          </div> : <div className="empty-state"><Search size={32} aria-hidden="true"/><h3>Nenhum modelo com esse termo.</h3><p>Limpe a busca para explorar os chaveiros em estudo.</p><button className="button" type="button" onClick={() => setQuery('')}>Limpar busca<ArrowRight size={16}/></button></div>}
        </section>
        <section className="vx-partner-panel" aria-labelledby="vx-candidates-heading">
          <h2 id="vx-candidates-heading">Novos chaveiros em curadoria.</h2>
          <p>Recebemos {keyringCandidateSummary.total} novos SKUs na atualização de 21/09/2026. Eles estão registrados para avaliação, mas ainda não integram esta vitrine: {keyringCandidateSummary.evidencePending} aguardam documentação e testes, e {keyringCandidateSummary.onHold} têm bloqueios específicos de licença, direitos ou classificação.</p>
          <p className="small-note">Nenhum dos novos modelos está anunciado, precificado ou liberado para venda. As imagens informadas na planilha não substituem amostra física, direitos e autorização comercial.</p>
        </section>
        <section className="vx-partner-panel" aria-labelledby="vx-local-partner">
          <h2 id="vx-local-partner">Uma proposta para negócios locais.</h2>
          <p>Selecionar chaveiros que façam sentido para o público e o contexto de cada estabelecimento é uma oportunidade ainda em validação. A presença em loja dependerá de acordo, condições comerciais, estoque, exposição e reposição efetivamente confirmados.</p>
          <p className="small-note">Nenhum parceiro, margem, exclusividade ou ponto de venda é anunciado aqui.</p>
          <Link href="/contato" className="text-link">Informações sobre a proposta<ArrowUpRight size={17} aria-hidden="true"/></Link>
        </section>
      </div>
    </main>
    <BrandFooter />
  </>;
}
