/** SB-020: deterministic, read-only extraction of the live commercial TypeScript catalog. */
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, realpathSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const require = createRequire(import.meta.url);
const rootDefault = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const SOURCES = ['lib/catalog.ts', 'lib/commercial-catalog.ts', 'lib/sku-copy.ts', 'lib/sku-names.ts'];
const DATASET = 'data/catalog/static-catalog.seed.json';
const REPORT = 'data/catalog/static-catalog.validation.json';
const digest = value => createHash('sha256').update(value).digest('hex');
const json = value => `${JSON.stringify(value, null, 2)}\n`;

// Check exact case even on Windows; prohibit traversal and symlink escape.
function assetIssue(publicDir, url) {
  if (typeof url !== 'string' || !/^\/(?!\/)[^?#\\]*$/.test(url)) return 'INVALID_LOCAL_PATH';
  const segments = url.slice(1).split('/');
  if (segments.some(s => !s || s === '.' || s === '..' || /%2e|%2f|%5c/i.test(s))) return 'INVALID_LOCAL_PATH';
  let current = publicDir;
  for (const segment of segments) {
    if (!existsSync(current) || !statSync(current).isDirectory()) return 'MISSING_FILE';
    if (!readdirSync(current).includes(segment)) return 'MISSING_FILE';
    current = path.join(current, segment);
  }
  if (!statSync(current).isFile()) return 'MISSING_FILE';
  const base = realpathSync(publicDir);
  if (!realpathSync(current).startsWith(`${base}${path.sep}`)) return 'PATH_OUTSIDE_PUBLIC';
  return null;
}

/** Preserve text and media ordering. Never infer commercial approval or rights. */
export function extractSnapshot({ lines, products, publicDir, sourceDigest }) {
  if (!Array.isArray(lines) || !Array.isArray(products)) throw new Error('Fonte inválida: linhas/produtos não são arrays.');
  const issues = [], skuSeen = new Map(), slugSeen = new Map(), lineSeen = new Set();
  let mediaReferences = 0;
  const imageCheck = (url, owner, field) => {
    if (url == null) return;
    mediaReferences++;
    const reason = assetIssue(publicDir, url);
    if (reason) issues.push({ code: reason, owner, field, path: String(url) });
  };
  const extractedLines = lines.map((line, index) => {
    if (!line || typeof line.id !== 'string' || !line.id.trim()) issues.push({ code: 'INVALID_LINE_ID', index });
    if (lineSeen.has(line?.id)) issues.push({ code: 'DUPLICATE_LINE', line: line.id });
    lineSeen.add(line?.id);
    imageCheck(line?.image, `line:${line?.id}`, 'image');
    return { id: line?.id, name: line?.name, path: line?.path, verb: line?.verb, description: line?.description, image: line?.image };
  });
  const extractedProducts = products.map((product, index) => {
    if (!product || typeof product.id !== 'string' || !product.id.trim()) issues.push({ code: 'INVALID_SKU', index });
    if (!product || typeof product.slug !== 'string' || !product.slug.trim()) issues.push({ code: 'INVALID_SLUG', index });
    if (skuSeen.has(product?.id)) issues.push({ code: 'DUPLICATE_SKU', sku: product.id, firstIndex: skuSeen.get(product.id), index });
    else skuSeen.set(product?.id, index);
    if (slugSeen.has(product?.slug)) issues.push({ code: 'DUPLICATE_SLUG', slug: product.slug, firstIndex: slugSeen.get(product.slug), index });
    else slugSeen.set(product?.slug, index);
    if (!lineSeen.has(product?.line)) issues.push({ code: 'INVALID_PRODUCT_LINE', sku: product?.id, line: product?.line ?? null });
    if (!product || typeof product.name !== 'string' || typeof product.description !== 'string' || typeof product.collection !== 'string' || typeof product.personalized !== 'boolean') issues.push({ code: 'INVALID_PRODUCT_FIELDS', sku: product?.id ?? null });
    if (product?.gallery !== undefined && !Array.isArray(product.gallery)) issues.push({ code: 'INVALID_GALLERY', sku: product?.id });
    imageCheck(product?.image, product?.id, 'image');
    for (const [i, item] of (Array.isArray(product?.gallery) ? product.gallery : []).entries()) imageCheck(item, product?.id, `gallery[${i}]`);
    return {
      sku: product?.id, slug: product?.slug, line: product?.line, name: product?.name,
      description: product?.description, collection: product?.collection,
      personalized: product?.personalized,
      media: { primary: product?.image ?? null, gallery: Array.isArray(product?.gallery) ? [...product.gallery] : [] },
    };
  });
  // Deliberately retain primary-image repetition inside gallery, if present in source.
  const dataset = { schemaVersion: 1, source: 'lib/commercial-catalog.ts', sourceSha256: sourceDigest,
    lines: extractedLines, products: extractedProducts };
  const datasetText = json(dataset);
  const validation = {
    schemaVersion: 1, source: dataset.source, sourceSha256: sourceDigest,
    datasetSha256: digest(datasetText),
    counts: { lines: extractedLines.length, products: extractedProducts.length, mediaReferences },
    issues, valid: issues.length === 0,
    note: 'Verifica catálogo e caminhos locais, NÃO direitos, fotos físicas, licenças, aprovação comercial ou Storage remoto.',
  };
  return { datasetText, reportText: json(validation), validation };
}

function loadCommercialCatalog(root) {
  // Use the existing pinned TypeScript dev dependency; no tsx or additional dependency.
  const compiler = require(require.resolve('typescript', { paths: [root] }));
  const Module = require('node:module');
  const previous = Module._extensions['.ts'];
  try {
    Module._extensions['.ts'] = (module, filename) => {
      const compiled = compiler.transpileModule(readFileSync(filename, 'utf8'), {
        fileName: filename,
        compilerOptions: { module: compiler.ModuleKind.CommonJS, target: compiler.ScriptTarget.ES2022 },
      });
      module._compile(compiled.outputText, filename);
    };
    const { commercialLines, commercialProducts } = require(path.join(root, 'lib/commercial-catalog.ts'));
    return { lines: commercialLines, products: commercialProducts };
  } finally {
    if (previous === undefined) delete Module._extensions['.ts'];
    else Module._extensions['.ts'] = previous;
  }
}

export function run(root = rootDefault, mode = 'write') {
  if (!['write', 'check'].includes(mode)) throw new Error(`Modo desconhecido: ${mode}`);
  const sourceDigest = digest(SOURCES.map(p => `${p}\0${readFileSync(path.join(root, p), 'utf8')}\0`).join(''));
  const { lines, products } = loadCommercialCatalog(root);
  const output = extractSnapshot({ lines, products, publicDir: path.join(root, 'public'), sourceDigest });
  if (!output.validation.valid) {
    console.error(output.reportText);
    throw new Error(`SB-020: ${output.validation.issues.length} inconsistência(s); nenhum dataset gravado.`);
  }
  for (const [relativePath, content] of [[DATASET, output.datasetText], [REPORT, output.reportText]]) {
    const destination = path.join(root, relativePath);
    if (mode === 'check') {
      if (!existsSync(destination) || readFileSync(destination, 'utf8') !== content)
        throw new Error(`SB-020: artefato ausente ou desatualizado: ${relativePath}. Execute --write.`);
    } else {
      mkdirSync(path.dirname(destination), { recursive: true });
      writeFileSync(destination, content, 'utf8');
    }
  }
  console.log(`SB-020 ${mode}: PASS; linhas=${output.validation.counts.lines}, produtos=${output.validation.counts.products}, referências de mídia=${output.validation.counts.mediaReferences}, sha256=${output.validation.datasetSha256}`);
  return output;
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  try {
    const args = process.argv.slice(2);
    if (args.some(arg => !['--write', '--check'].includes(arg))) throw new Error('Uso: node scripts/catalog/extract-static-catalog.mjs [--write|--check]');
    run(rootDefault, args.includes('--check') ? 'check' : 'write');
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  }
}
