// SB-028 — browser acceptance for cart + WhatsApp cutover.
// Run only against the same candidate commit with CATALOG_SOURCE=supabase.
// PLAYWRIGHT_MODULE must point to an isolated Playwright installation.
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { mkdirSync, writeFileSync } from 'node:fs';

const require = createRequire(import.meta.url);
if (!process.env.PLAYWRIGHT_MODULE) throw new Error('PLAYWRIGHT_MODULE não configurado');
if ((process.env.EXPECTED_CATALOG_SOURCE || '').toLowerCase() !== 'supabase') {
  throw new Error('EXPECTED_CATALOG_SOURCE=supabase é obrigatório para não gerar evidência no modo errado');
}

const { chromium } = require(process.env.PLAYWRIGHT_MODULE);
const baseURL = process.env.BASE_URL || 'http://127.0.0.1:3000';
const out = process.env.QA_OUTPUT || 'qa-artifacts/sb-028';
mkdirSync(out, { recursive: true });

const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
const results = [];
let failures = 0;

async function check(name, fn) {
  try {
    const detail = await fn();
    results.push({ name, status: 'PASS', ...(detail || {}) });
    console.log(`PASS ${name}`);
  } catch (error) {
    failures += 1;
    results.push({ name, status: 'FAIL', error: String(error) });
    console.error(`FAIL ${name}: ${error}`);
  }
}

const decodeWhatsApp = (href) => {
  const url = new URL(href);
  assert.equal(url.hostname, 'wa.me');
  assert.equal(url.pathname, '/5535984445677');
  return url.searchParams.get('text') || '';
};

try {
  const context = await browser.newContext({ viewport: { width: 1365, height: 900 } });
  const page = await context.newPage();
  const pageErrors = [];
  page.on('pageerror', error => pageErrors.push(error.message));

  await check('objeto + chaveiro: adicionar ao carrinho no modo Supabase', async () => {
    for (const scenario of [
      { slug: 'g-org-rc-01', sku: 'G-ORG-RC-01', option: 'Grafite', quantity: 2 },
      { slug: 'g-chv-blo-01', sku: 'G-CHV-BLO-01', option: 'Amarelo gamer', quantity: 3 },
    ]) {
      const response = await page.goto(`${baseURL}/produto/${scenario.slug}`, { waitUntil: 'networkidle', timeout: 60000 });
      assert.equal(response?.status(), 200, scenario.slug);
      await page.getByLabel(/Opção, cor ou personalização/i).fill(scenario.option);
      for (let n = 1; n < scenario.quantity; n += 1) {
        await page.getByRole('button', { name: /Aumentar quantidade/i }).click();
      }
      await page.getByRole('button', { name: /Adicionar ao carrinho/i }).click();
      await page.getByText(/Item adicionado/i).waitFor();
    }

    await page.goto(`${baseURL}/carrinho`, { waitUntil: 'networkidle', timeout: 60000 });
    await page.getByText('SKU: G-ORG-RC-01').waitFor();
    await page.getByText('SKU: G-CHV-BLO-01').waitFor();
    return { routes: ['/produto/g-org-rc-01', '/produto/g-chv-blo-01'] };
  });

  await check('persistência da sessão após reload', async () => {
    await page.reload({ waitUntil: 'networkidle', timeout: 60000 });
    assert.equal(await page.getByText('SKU: G-ORG-RC-01').count(), 1);
    assert.equal(await page.getByText('SKU: G-CHV-BLO-01').count(), 1);
    const stored = await page.evaluate(() => sessionStorage.getItem('vektua-cart-v2'));
    assert.ok(stored, 'vektua-cart-v2 ausente');
    const parsed = JSON.parse(stored);
    assert.equal(parsed.length, 2);
    return { storageKey: 'vektua-cart-v2', selections: parsed.length };
  });

  await check('mensagem WhatsApp contém SKU, opção e quantidade corretos', async () => {
    const href = await page.getByRole('link', { name: /Abrir WhatsApp com lista/i }).getAttribute('href');
    assert.ok(href, 'link WhatsApp ausente');
    const message = decodeWhatsApp(href);
    assert.match(message, /G-ORG-RC-01/);
    assert.match(message, /2 un\./);
    assert.match(message, /opção: Grafite/);
    assert.match(message, /G-CHV-BLO-01/);
    assert.match(message, /3 un\./);
    assert.match(message, /opção: Amarelo gamer/);
    assert.match(message, /não confirma compra, reserva ou pagamento/i);
    return { whatsappDraftVerified: true };
  });

  await check('alterar quantidade e remover item', async () => {
    await page.getByRole('button', { name: /Aumentar .*Organizador/i }).click();
    let href = await page.getByRole('link', { name: /Abrir WhatsApp com lista/i }).getAttribute('href');
    let message = decodeWhatsApp(href);
    assert.match(message, /G-ORG-RC-01\) — 3 un\./);

    await page.getByRole('button', { name: /Remover .*Bloco/i }).click();
    assert.equal(await page.getByText('SKU: G-CHV-BLO-01').count(), 0);
    href = await page.getByRole('link', { name: /Abrir WhatsApp com lista/i }).getAttribute('href');
    message = decodeWhatsApp(href);
    assert.doesNotMatch(message, /G-CHV-BLO-01/);
    return { updatedQuantity: 3, removedSku: 'G-CHV-BLO-01' };
  });

  await check('nenhum pagamento é iniciado ou coletado', async () => {
    assert.equal(await page.locator('input[type="card"], input[name*="card"], input[autocomplete="cc-number"]').count(), 0);
    assert.ok(await page.getByText(/Pagamento.*Não realizado aqui/i).count() >= 1 || await page.getByText(/Não há pagamento no site/i).count() >= 1);
    return { paymentCollection: false };
  });

  await check('carrinho legado inválido não quebra a aplicação', async () => {
    await page.evaluate(() => {
      sessionStorage.removeItem('vektua-cart-v2');
      sessionStorage.setItem('vektua-demo-cart-v1', '{json-inválido');
    });
    const response = await page.reload({ waitUntil: 'networkidle', timeout: 60000 });
    assert.equal(response?.status(), 200);
    assert.ok(await page.getByRole('heading', { name: /Seu carrinho/i }).count() >= 1);
    assert.deepEqual(pageErrors, [], 'pageerror após storage legado inválido');
    return { malformedLegacyStorageHandled: true };
  });

  await page.screenshot({ path: `${out}/sb-028-cart-final.png`, fullPage: true });
  await context.close();
} finally {
  await browser.close();
  const report = {
    card: 'SB-028',
    catalogSourceExpected: 'supabase',
    baseURL,
    commit: process.env.GITHUB_SHA || null,
    results,
    failures,
  };
  writeFileSync(`${out}/results.json`, JSON.stringify(report, null, 2));
  console.log(JSON.stringify({ failures, tests: results.length, results: `${out}/results.json` }));
}

if (failures) process.exitCode = 1;
