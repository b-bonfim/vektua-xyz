#!/usr/bin/env node
// Run from the repository root after extracting the supplied ZIP:
// node scripts/apply-commercial-remix.mjs /path/to/vektua-remix-update [repository-root]
// This importer never invokes GitHub Actions, git, deploy or payment services.
import { readFileSync, existsSync, mkdirSync, copyFileSync, writeFileSync, renameSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { resolve, join, dirname } from 'node:path';
const check = (condition, message) => { if (!condition) throw new Error(message); };
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const root = resolve(process.argv[2] || './vektua-remix-update');
const repo = resolve(process.argv[3] || process.cwd());
const manifestFile = join(root, 'manifest.json');
const catalogFile = join(repo, 'lib/commercial-catalog.ts');
const anchor = 'export const commercialProducts: CommercialProduct[] = [';
const rowAnchor = "    id, slug:id.toLowerCase(), name, description, collection, line:'chaveiros' as const,";
try {
  check(existsSync(manifestFile) && existsSync(catalogFile) && existsSync(join(repo,'package.json')), 'Pacote descompactado ou repositório ausente.');
  const manifest = JSON.parse(readFileSync(manifestFile, 'utf8'));
  const images = manifest.images.filter(item => item.output_path);
  check(manifest.repo === 'b-bonfim/vektua-xyz' && manifest.images.length === 20 && images.length === 10, 'Inventário de imagens inesperado.');
  check(manifest.missing_remix.join(',') === 'G-CHV-MUM-01', 'Ausência REMIX inesperada.');
  const old = readFileSync(catalogFile,'utf8');
  check(old.split(anchor).length === 2 && old.split(rowAnchor).length === 2, 'Catálogo mudou: aplicar após revisão, sem sobrescrever.');
  check(!old.includes('const remixKeyringImages:'), 'REMIX já incorporado ao catálogo; não duplicar.');
  const mapping = {};
  for (const item of images) {
    const expected = `public/images/products/remix/${item.sku}_REMIX.webp`;
    check(item.output_path === expected && old.includes(`['${item.sku}'`), `Nome ou SKU inesperado: ${item.sku}`);
    const from = join(root,'assets',item.output_path);
    const to = join(repo,item.output_path);
    check(existsSync(from), `Imagem ausente: ${item.sku}`);
    const data = readFileSync(from);
    check(hash(data) === item.output_sha256 && data.length === item.output_bytes, `Integridade divergente: ${item.sku}`);
    if (existsSync(to)) check(hash(readFileSync(to)) === item.output_sha256, `Imagem existente divergente: ${item.sku}`);
    mapping[item.sku] = '/' + item.output_path.replace(/^public\//,'');
  }
  const declaration = `const remixKeyringImages: Partial<Record<string, string>> = ${JSON.stringify(mapping,null,2)};\n\n`;
  const updated = old.replace(anchor,declaration+anchor).replace(rowAnchor,rowAnchor+'\n    image:remixKeyringImages[id],');
  check(updated!==old && updated.includes('image:remixKeyringImages[id]'), 'Alteração não gerada.');
  for (const item of images) {
    const to = join(repo,item.output_path);
    mkdirSync(dirname(to),{recursive:true});
    if (!existsSync(to)) copyFileSync(join(root,'assets',item.output_path),to);
    check(hash(readFileSync(to))===item.output_sha256,`Cópia falhou: ${item.sku}`);
  }
  const temp = catalogFile + '.remix-tmp';
  writeFileSync(temp,updated,'utf8');
  renameSync(temp,catalogFile);
  console.log('REMIX_OK: 10 imagens verificadas e associadas por SKU ao catálogo comercial.');
  console.log('PENDENTE: lint, typecheck, build, testes navegador e commit/deploy; sem GitHub Actions.');
} catch(error) {
  console.error('REMIX_NAO_APLICADO:',error.message);
  process.exitCode=1;
}
