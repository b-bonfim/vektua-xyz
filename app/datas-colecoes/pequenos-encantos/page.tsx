import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { BrandHeader, BrandFooter } from '@/components/brand-shell-v2';
import { money, products } from '@/lib/catalog';

// Explicit membership. Do not turn every item in Datas & Coleções into Halloween.
const halloweenSkuIds = new Set(['S-HAL-DEC-01']);
const collectionProducts = products.filter(product => halloweenSkuIds.has(product.id));

export const metadata: Metadata = {
  title: 'Pequenos Encantos | Coleção conceitual',
  description: 'Vitrine conceitual de Halloween da Vektua XYZ. Não disponível para compra; conteúdo e composição sujeitos a validação.',
  robots: { index: false, follow: false },
};

export default function PequenosEncantosPage() {
  return <>
    <BrandHeader />
    <main id="conteudo" className="container page-space" tabIndex={-1}>
      <nav className="breadcrumbs" aria-label="Localização"><Link href="/">Início</Link><span aria-hidden="true">/</span><Link href="/datas-colecoes">Datas & Coleções</Link><span aria-hidden="true">/</span><span aria-current="page">Pequenos Encantos</span></nav>
      <div className="catalog-intro seasonal-intro">
        <div><h1>Pequenos Encantos</h1><p>Uma interpretação leve e divertida do Halloween. Coleção conceitual, sem janela de venda definida.</p><span className="small-note">{collectionProducts.length} peça em estudo · nenhum SKU liberado para venda.</span></div>
        <img src="/images/products/remix/S-HAL-DEC-01_REMIX.webp" alt="Ambientação REMIX editada do SKU S-HAL-DEC-01; composição da oferta ainda não verificada" width={420} height={300}/>
      </div>
      <section aria-label="Peças desta coleção" className="product-grid catalog-grid">
        {collectionProducts.map(product => <article className="product-card" key={product.id}>
          <Link href={`/produto/${product.slug}`} className="product-picture" aria-label={`Conhecer ${product.name}`}>
            <img src={product.image} alt={`Ambientação REMIX editada de ${product.name}; peça física não verificada`} width={640} height={640} loading="lazy"/>
            <span className="concept-label">Imagem REMIX · ambientação editada</span>
          </Link>
          <div className="product-info"><span className="product-category">Halloween · conceito</span><Link href={`/produto/${product.slug}`} className="product-name">{product.name}</Link><div className="price-row"><span>{money(product.price)}</span><span>Valor ilustrativo</span></div></div>
        </article>)}
      </section>
      <p className="small-note">Não há kits adicionais, estoque, prazo ou disponibilidade confirmados. Esta coleção não inclui o presépio de Natal.</p>
      <Link className="text-link" href="/datas-colecoes">Ver todas as datas e coleções <ArrowUpRight size={18} aria-hidden="true"/></Link>
    </main>
    <BrandFooter />
  </>;
}
