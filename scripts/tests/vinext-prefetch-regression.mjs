// Validate the real production bundle: errors MUST NOT be ignored or converted to warnings.
// This is a local production-build test; it does not exercise deployed traffic.
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
assert.ok(process.env.PLAYWRIGHT_MODULE, 'PLAYWRIGHT_MODULE required');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE);
const base = process.env.BASE_URL || 'http://127.0.0.1:8788';
const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
let cases = 0;
try {
  for (const route of ['/', '/busca', '/produto/g-org-rc-01']) {
    const context = await browser.newContext({ viewport: { width: 1280, height: 800 }, serviceWorkers: 'block' });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', e => errors.push(`pageerror: ${e.message}`));
    page.on('console', m => { if (m.type() === 'error') errors.push(`console: ${m.text()}`); });
    const response = await page.goto(new URL(route, base).href, { waitUntil: 'networkidle', timeout: 90_000 });
    assert.equal(response?.status(), 200, `${route} status`);
    await page.waitForTimeout(800);
    assert.ok(await page.locator('h1').count(), `${route} heading missing`);
    assert.deepEqual(errors, [], `${route}: uncaught errors, including Vinext RSC prefetch`);
    console.log(`PASS ${route}: zero browser errors after prefetch, status 200`);
    cases++;
    if (route === '/') {
      const search = page.locator('header a[href="/busca"]').first();
      assert.equal(await search.count(), 1, 'header search link');
      await search.click();
      await page.waitForURL(/\/busca(?:\?.*)?$/, { timeout: 40_000 });
      await page.waitForLoadState('networkidle');
      assert.ok(await page.locator('h1').count(), 'search route heading after client navigation');
      assert.deepEqual(errors, [], 'Client-side navigation should not produce prefetch errors');
      console.log('PASS home -> search: linked client navigation, zero browser errors');
      cases++;
    }
    await context.close();
  }
} finally { await browser.close(); }
assert.equal(cases, 4);
console.log(`VINEXT_PREFETCH_REGRESSION_PASS cases=${cases}`);
