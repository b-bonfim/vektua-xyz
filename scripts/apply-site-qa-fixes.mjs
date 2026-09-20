/**
 * Conservative codemod for the legacy storefront. Deliberately does not run
 * during install, lint or build: code changes must be committed and reviewed.
 * Usage: node scripts/apply-site-qa-fixes.mjs --check|--write
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';

function replaceOnce(source, oldText, newText, name) {
  const start = source.indexOf(oldText);
  if (start === -1 || source.indexOf(oldText, start + oldText.length) !== -1) {
    throw new Error(`${name}: expected exactly one source anchor`);
  }
  return source.slice(0, start) + newText + source.slice(start + oldText.length);
}

export function transformStorefront(input) {
  let source = input;
  if (source.includes('function Header(){')) {
    // Both Logo and the old Sheet header are private, not reused by pages.
    const logoStart = source.indexOf('function Logo(');
    const buttonStart = source.indexOf('function ButtonLink(', logoStart);
    const headerStart = source.indexOf('function Header(){');
    const productCardStart = source.indexOf('function ProductCard(', headerStart);
    if (logoStart < 0 || buttonStart < logoStart || headerStart < buttonStart || productCardStart < headerStart) {
      throw new Error('Legacy navigation region not found in the expected order');
    }
    source = source.slice(0, headerStart) + source.slice(productCardStart);
    source = source.slice(0, logoStart) + source.slice(buttonStart);
    source = replaceOnce(source,
      "import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger, SheetClose } from '@/components/ui/sheet';\n",
      '', 'remove Sheet dependency');
    source = replaceOnce(source,
      "import { useCart } from '@/components/cart-context';",
      "import { useCart } from '@/components/cart-context';\nimport { BrandHeader, BrandFooter } from '@/components/brand-shell-v2';",
      'import shared navigation');
    source = replaceOnce(source, 'ShoppingBag, Menu, X, Minus', 'ShoppingBag, X, Minus', 'unused Menu import');
    source = replaceOnce(source, 'return <><Header/><main id="conteudo"', 'return <><BrandHeader/><main id="conteudo"', 'shared header');
    source = replaceOnce(source, '</main><Footer/><Toaster', '</main><BrandFooter/><Toaster', 'shared footer');
  }

  const titleLines = source.split('\n').filter(line => line.includes('document.title='));
  if (titleLines.length > 1) throw new Error('Multiple client title writes found');
  if (titleLines.length === 1) {
    if (!titleLines[0].includes('useEffect(') || !titleLines[0].includes('},[path]);')) {
      throw new Error('Unexpected title effect; do not modify');
    }
    source = replaceOnce(source, `${titleLines[0]}\n`, '', 'remove metadata override');
  }

  const oldPersonRoute = "product.line==='feitos'?<ButtonLink href=\"/feitos-para-voce/pet\">";
  if (source.includes(oldPersonRoute)) {
    source = replaceOnce(source, oldPersonRoute,
      "product.line==='feitos'?<ButtonLink href={product.id==='CAN-PESSOA-001'?'/feitos-para-voce/pessoa':'/feitos-para-voce/pet'}>",
      'personalization route');
  }

  if (source.includes('function Header(){') || source.includes('function Footer(){') || source.includes('document.title=') || source.includes('setOpen(false),[path]')) {
    throw new Error('Legacy navigation/title behavior remains');
  }
  if (!source.includes('<BrandHeader/>') || !source.includes('<BrandFooter/>') || !source.includes("import { BrandHeader, BrandFooter }")) {
    throw new Error('Shared navigation is not fully connected');
  }
  return source;
}

const script = fileURLToPath(import.meta.url);
if (process.argv[1] && resolve(process.argv[1]) === script) {
  const mode = process.argv[2];
  if (!['--check', '--write'].includes(mode)) {
    console.error('Usage: node scripts/apply-site-qa-fixes.mjs --check|--write');
    process.exitCode = 2;
  } else {
    const file = resolve('components/storefront.tsx');
    const before = readFileSync(file, 'utf8');
    const after = transformStorefront(before);
    if (mode === '--check') {
      console.log(before === after ? 'PASS: storefront navigation and title refactor already applied' : 'PENDING: run --write and commit the resulting source');
      if (before !== after) process.exitCode = 1;
    } else if (before !== after) {
      writeFileSync(file, after);
      console.log('UPDATED: components/storefront.tsx; inspect diff, then lint/typecheck/build/browser QA');
    } else {
      console.log('UNCHANGED: fixes were already applied');
    }
  }
}
