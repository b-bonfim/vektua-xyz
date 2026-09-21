import ResponsiveImage from '@/components/responsive-image';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowUpRight, LockKeyhole } from 'lucide-react';
import { BrandHeader, BrandFooter } from '@/components/brand-shell-v2';
import { money, products } from '@/lib/catalog';

const product = products.find(item => item.id === 'CAN-PESSOA-001');

export const metadata: Metadata = {
  title: 'Miniatura de pessoa | Estudo de produto',
  description: 'Proposta demonstrativa de miniatura estilizada de pessoa da Vektua XYZ, sem venda ou coleta de fotografias.',
  robots: { index: false, follow: false },
};

export default function PersonProductPage() {
  if (!product) return <><BrandHeader/><main id="conteudo" className="container page-space" tabIndex={-1}><h1>Proposta indisponível</h1><Link href="/feitos-para-voce">Ver opções de personalização</Link></main><BrandFooter/></>;
  return <>
    <BrandHeader/>
    <main className="container page-space" id="conteudo" tabIndex={-1}>
      <nav className="breadcrumbs" aria-label="Localização"><Link href="/">Início</Link><span aria-hidden="true">/</span><Link href="/feitos-para-voce">Feitos para Você</Link><span aria-hidden="true">/</span><span aria-current="page">{product.name}</span></nav>
      <div className="pdp-grid">
        <div><div className="pdp-image"><ResponsiveImage src={product.image} alt={`Exemplo conceitual de ${product.name}; não é fotografia de peça fabricada`} width={900} height={900}/><span className="concept-label">Imagem conceitual · foto real pendente</span></div><p className="small-note">Imagem apenas ilustrativa. Nenhuma amostra física está comprovada.</p></div>
        <div className="pdp-copy">
          <h1>{product.name}</h1><p className="pdp-description">{product.description}</p>
          <div className="pdp-price">{money(product.price)}<span>Preço fictício para demonstração</span></div>
          <p className="small-note">Dimensões: {product.dimensions}</p><p className="small-note">O que está incluído: {product.includes}</p>
          <Link className="button" href="/feitos-para-voce/pessoa">Explorar personalização de pessoa <ArrowUpRight size={18} aria-hidden="true"/></Link>
          <p className="purchase-note"><LockKeyhole size={16} aria-hidden="true"/>Compra desabilitada. Nenhuma foto, pagamento ou pedido será coletado.</p>
          <p className="small-note">Escopo, material, preço real, revisões e prazo dependem de especificação e validação. A proposta é estilizada, não fotorrealista.</p>
        </div>
      </div>
    </main>
    <BrandFooter/>
  </>;
}
