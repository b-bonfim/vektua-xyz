import assert from 'node:assert/strict';
import test from 'node:test';
import { transformStorefront } from '../apply-site-qa-fixes.mjs';

const titleEffect = '  useEffect(()=>{document.title=`Hello`;},[path]);';
const fixture = `'use client';
import { ArrowRight, ShoppingBag, Menu, X, Minus } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { useCart } from '@/components/cart-context';
function Logo() { return null; }
function ButtonLink() { return null; }
function Concept() { return null; }
function Breadcrumbs() { return null; }
function Header(){
  useEffect(()=>setOpen(false),[path]);
  return <Sheet/>;
}
function Footer(){return <footer/>;}
function ProductCard() {return null;}
function ProductDetail() {return product.line==='feitos'?<ButtonLink href="/feitos-para-voce/pet">Personalizar</ButtonLink>:null;}
function Storefront(){
${titleEffect}
  useEffect(()=>{ registerTool(); },[]);
  return <><Header/><main id="conteudo">Body</main><Footer/><Toaster/></>;
}`;

test('removes legacy navigation and title effect, preserves independent effects and fixes person CTA', () => {
  const result = transformStorefront(fixture);
  assert.match(result, /import \{ BrandHeader, BrandFooter \}/);
  assert.match(result, /<BrandHeader\/>/);
  assert.match(result, /<BrandFooter\/>/);
  assert.doesNotMatch(result, /function Header\(\)|function Footer\(\)|document\.title|setOpen\(false\)/);
  assert.match(result, /registerTool\(\)/);
  assert.match(result, /CAN-PESSOA-001/);
  assert.equal(transformStorefront(result), result, 'transformation must be idempotent');
});
test('unexpected metadata mutation fails rather than removing arbitrary code', () => {
  assert.throws(() => transformStorefront(fixture.replace('document.title=`Hello`;},[path]);', 'document.title=`Hello`;},[other]);')), /Unexpected title effect/);
});
