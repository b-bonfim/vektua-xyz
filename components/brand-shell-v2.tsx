'use client';
import ResponsiveImage from '@/components/responsive-image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { Menu, Search, ShoppingBag, ArrowUpRight } from 'lucide-react';
import { lines } from '@/lib/catalog';
import { useCart } from '@/components/cart-context';

export function BrandLogo({ light = false }: { light?: boolean }) {
  return <Link href="/" className={`brand vx-logo ${light ? 'light' : ''}`} aria-label="Vektua XYZ — início"><ResponsiveImage src={light ? '/brand/vektua-wordmark-negative.svg' : '/brand/vektua-wordmark.svg'} alt="Vektua XYZ" width="192" height="48" /></Link>;
}
export function BrandHeader() {
  const path = usePathname() || '/';
  const { items } = useCart();
  const quantity = items.reduce((sum, item) => sum + item.quantity, 0);
  const menuRef = useRef<HTMLDetailsElement>(null);
  const closeMenu = () => { if (menuRef.current) menuRef.current.open = false; };
  const isActive = (href: string) => path === href || path.startsWith(`${href}/`);
  useEffect(() => { const escape = (event: KeyboardEvent) => { if(event.key === 'Escape' && menuRef.current?.open){ menuRef.current.open = false; menuRef.current.querySelector('summary')?.focus(); } }; document.addEventListener('keydown',escape); return()=>document.removeEventListener('keydown',escape); }, []);
  return <><a className="skip-link" href="#conteudo">Pular para o conteúdo</a><div className="demo-strip"><span>Vektua XYZ · Objetos com personalidade</span><span>Carrinho ativo · pedidos pelo WhatsApp · sem pagamento no site</span></div><header className="site-header"><div className="header-inner"><BrandLogo/><nav className="desktop-nav" aria-label="Navegação principal">{lines.map(line=><Link key={line.id} href={line.path} aria-current={path===line.path?'page':undefined} className={isActive(line.path)?'active':''}>{line.name}</Link>)}</nav><div className="header-actions"><Link href="/busca" aria-label="Buscar no catálogo" className="icon-button"><Search aria-hidden="true" size={21}/></Link><Link href="/ajuda" className="help-nav">Ajuda</Link><Link href="/carrinho" aria-label={`Abrir carrinho: ${quantity} unidades`} className="icon-button cart-icon"><ShoppingBag aria-hidden="true" size={21}/>{quantity>0&&<span className="cart-count">{quantity}</span>}</Link><details key={path} ref={menuRef} className="vx-mobile-nav"><summary aria-label="Abrir menu de navegação"><Menu aria-hidden="true" size={23}/></summary><nav aria-label="Navegação móvel">{lines.map(line=><Link key={line.id} href={line.path} onClick={closeMenu}>{line.name}<ArrowUpRight aria-hidden="true" size={15}/></Link>)}<Link href="/carrinho" onClick={closeMenu}>Carrinho<ArrowUpRight size={15}/></Link><Link href="/ajuda" onClick={closeMenu}>Ajuda<ArrowUpRight size={15}/></Link></nav></details></div></div></header></>;
}
export function BrandFooter(){return <footer className="site-footer"><div className="footer-main container"><div className="footer-brand"><BrandLogo light/><p>Objetos com personalidade.<br/>Do achado à peça só sua.</p></div><div><h3>Explore</h3>{lines.map(l=><Link key={l.id} href={l.path}>{l.name}</Link>)}</div><div><h3>Conheça</h3><Link href="/sobre">Sobre</Link><Link href="/como-funciona">Como funciona</Link><Link href="/ajuda">Perguntas frequentes</Link><Link href="/contato">Contato</Link></div><div><h3>Informações</h3><Link href="/politicas/entrega">Entrega</Link><Link href="/politicas/trocas-devolucoes">Trocas e devoluções</Link><Link href="/politicas/privacidade">Privacidade</Link><Link href="/politicas/termos">Termos de uso</Link></div></div><div className="footer-bottom container"><span>© 2026 Vektua XYZ</span><span>Pedidos via WhatsApp · pagamento fora do site após confirmação</span><span>Do achado à peça só sua.</span></div></footer>;}
