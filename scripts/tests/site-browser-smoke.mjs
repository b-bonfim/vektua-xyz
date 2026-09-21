// Executado exclusivamente contra um servidor local da revisão do próprio commit.
// PLAYWRIGHT_MODULE aponta para uma instalação isolada do Playwright no runner.
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { writeFileSync, mkdirSync } from 'node:fs';

const require = createRequire(import.meta.url);
if (!process.env.PLAYWRIGHT_MODULE) throw new Error('PLAYWRIGHT_MODULE não configurado');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE);
const baseURL = process.env.BASE_URL || 'http://127.0.0.1:5173';
const out = process.env.QA_OUTPUT || 'qa-artifacts';
mkdirSync(out, { recursive: true });
const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
const observations = [];
let failures = 0;

async function check(name, fn) {
  try { const result = await fn(); observations.push({ name, status: 'PASS', ...(result || {}) }); console.log(`PASS ${name}`); }
  catch (error) { failures++; observations.push({ name, status: 'FAIL', error: String(error) }); console.error(`FAIL ${name}: ${error}`); }
}

try {
  await check('desktop: home, shell único, navegação e baseline de carregamento', async () => {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
    const page = await context.newPage();
    await page.addInitScript(() => {
      window.__qaVitals = { lcp: null, cls: 0 };
      new PerformanceObserver(list => { for (const entry of list.getEntries()) window.__qaVitals.lcp = entry.startTime; }).observe({ type: 'largest-contentful-paint', buffered: true });
      new PerformanceObserver(list => { for (const entry of list.getEntries()) if (!entry.hadRecentInput) window.__qaVitals.cls += entry.value; }).observe({ type: 'layout-shift', buffered: true });
    });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    const response = await page.goto(baseURL, { waitUntil: 'networkidle', timeout: 60000 });
    assert.equal(response?.status(), 200);
    assert.equal(await page.locator('header.site-header').count(), 1);
    assert.equal(await page.locator('footer.site-footer').count(), 1);
    assert.match(await page.title(), /Vektua XYZ/);
    assert.ok(await page.getByRole('heading', { level: 1 }).count() > 0);
    await page.screenshot({ path: `${out}/desktop-home.png`, fullPage: true });
    assert.deepEqual(errors, [], 'erros de execução no navegador');
    const metric = await page.evaluate(() => ({
      navigation: performance.getEntriesByType('navigation').map(n => ({ durationMs: n.duration, transferSize: n.transferSize, decodedBodySize: n.decodedBodySize })),
      resources: performance.getEntriesByType('resource').map(r => ({ name: r.name, durationMs: r.duration, transferSize: r.transferSize, decodedBodySize: r.decodedBodySize })),
      vitals: window.__qaVitals,
    }));
    await context.close();
    return { title: await page.title().catch(() => 'closed'), metric, note: 'Laboratório GitHub runner; não corresponde a campo/usuários reais.' };
  });

  await check('desktop: coleção, ficha pessoa, personalização e metadados', async () => {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    for (const [path, phrase] of [
      ['/datas-colecoes/pequenos-encantos', 'Pequenos Encantos'],
      ['/produto/can-pessoa-001', 'Vektua XYZ'],
      ['/feitos-para-voce/pessoa', 'Feitos para Você'],
      ['/politicas/privacidade', 'Privacidade'],
    ]) {
      const response = await page.goto(`${baseURL}${path}`, { waitUntil: 'domcontentloaded', timeout: 60000 });
      assert.equal(response?.status(), 200, path);
      assert.match(await page.title(), new RegExp(phrase, 'i'), path);
      assert.equal(await page.locator('header.site-header').count(), 1, path);
    }
    await page.goto(`${baseURL}/produto/can-pessoa-001`);
    const personCTA = page.getByRole('link', { name: /personaliz|simul|pessoa/i }).filter({ hasText: /personaliz|simul|pessoa/i });
    assert.ok(await personCTA.count() >= 1, 'CTA da pessoa ausente');
    await page.close();
  });

  await check('mobile: menu acessível, navegação sem duplicação', async () => {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
    const response = await page.goto(baseURL, { waitUntil: 'domcontentloaded', timeout: 60000 });
    assert.equal(response?.status(), 200);
    const summary = page.locator('.vx-mobile-nav summary');
    assert.equal(await summary.count(), 1);
    await summary.click();
    assert.equal(await page.locator('.vx-mobile-nav').getAttribute('open'), '');
    await page.keyboard.press('Escape');
    assert.equal(await page.locator('.vx-mobile-nav').getAttribute('open'), null);
    await page.screenshot({ path: `${out}/mobile-home.png`, fullPage: true });
    await page.close();
  });
} finally {
  await browser.close();
  writeFileSync(`${out}/results.json`, JSON.stringify({ baseURL, commit: process.env.GITHUB_SHA || null, observations, failures }, null, 2));
  console.log(JSON.stringify({ failures, tests: observations.length, results: `${out}/results.json` }));
}
if (failures) process.exitCode = 1;
