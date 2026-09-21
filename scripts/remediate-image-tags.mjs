// Guarded, repeatable issue #8 codemod. No ESLint disabling or SKU/data changes.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import assert from 'node:assert/strict';
const files = new Map([
  ['app/datas-colecoes/pequenos-encantos/page.tsx',2],
  ['app/produto/can-pessoa-001/page.tsx',1],
  ['app/sobre/page.tsx',2],
  ['components/brand-shell-v2.tsx',1],
  ['components/chaveiros-v2.tsx',2],
  ['components/home-v2.tsx',5],
  ['components/storefront.tsx',10],
]);
const write = process.argv.includes('--write');
const check = process.argv.includes('--check');
assert.ok(write !== check, 'Choose --write or --check');
const inventory = ['# Issue #8 — Inventory of the 23 original ESLint image warnings', '', 'Baseline source: main `69a9afaa6e66499af60091a4fb60d570b20b269b`; original image paths, ALT and labels are preserved.', '', '|File|Line|Column|Source attribute|ALT|Dimensions|Loading|Role|', '|---|---:|---:|---|---|---|---|---|'];
let total=0;
for (const [path, expected] of files) {
  const text=readFileSync(path,'utf8');
  const tags=[...text.matchAll(/<img\b[\s\S]*?\/>/g)];
  const alreadyApplied=tags.length===0&&text.includes("import ResponsiveImage from '@/components/responsive-image';")&&[...text.matchAll(/<ResponsiveImage\b/g)].length===expected;
  if(check){assert.ok(alreadyApplied,`${path}: expected ${expected} remediated images`);continue;}
  assert.equal(tags.length,expected,`${path}: unexpected number of img elements; review manually`);
  total+=tags.length;
  for(const tag of tags){
    const offset=tag.index;const before=text.slice(0,offset);const line=before.split('\n').length;const column=offset-before.lastIndexOf('\n');
    const attr=name=>tag[0].match(new RegExp(`\\b${name}=(\\{[^}]*\\}|"[^"]*")`))?.[1]||'n/a';
    const role=path.includes('brand-shell')?'vector logo':path.includes('home-v2')&&line===18?'LCP hero':path.includes('storefront')&&line===23?'legacy hero':path.includes('produto')?'gallery':path.includes('pequenos-encantos')?'collection':path.includes('sobre')?'institutional':path.includes('chaveiros')?'keyring':'catalog / below-fold';
    inventory.push(`|\`${path}\`|${line}|${column}|\`${attr('src').replaceAll('|','\\|')}\`|${attr('alt')!=='n/a'?'present':'MISSING'}|${attr('width')} × ${attr('height')}|${attr('loading')}|${role}|`);
    assert.notEqual(attr('alt'),'n/a',`${path}:${line} missing ALT`);
    assert.notEqual(attr('width'),'n/a',`${path}:${line} missing width`);
    assert.notEqual(attr('height'),'n/a',`${path}:${line} missing height`);
  }
  let replacement=text.replace(/<img(?=[\s/>])/g,'<ResponsiveImage');
  const importLine="import ResponsiveImage from '@/components/responsive-image';\n";
  if(replacement.startsWith("'use client';")) replacement=replacement.replace("'use client';","'use client';\n"+importLine.trimEnd());
  else replacement=importLine+replacement;
  assert.equal([...replacement.matchAll(/<ResponsiveImage\b/g)].length,expected);
  writeFileSync(path,replacement);
}
if(write){assert.equal(total,23);mkdirSync('docs',{recursive:true});writeFileSync('docs/ISSUE_8_IMAGE_INVENTORY.md',inventory.join('\n')+'\n');}
console.log(`${write?'UPDATED':'PASS'} issue #8: ${write?total:23} image elements, seven sources, no ESLint suppression`);
