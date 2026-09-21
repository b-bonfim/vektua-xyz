// Issue #8: laboratory measurements only. Never equate with deployed production or field INP.
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { mkdirSync, writeFileSync } from 'node:fs';
const require = createRequire(import.meta.url);
if (!process.env.PLAYWRIGHT_MODULE) throw new Error('PLAYWRIGHT_MODULE is required');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE);
const baseURL = process.env.BASE_URL ?? 'http://127.0.0.1:8787';
const out = process.env.QA_OUTPUT ?? 'qa-artifacts/perf';
const stage = process.env.PERF_STAGE ?? 'baseline';
const commit = process.env.SOURCE_SHA ?? process.env.GITHUB_SHA ?? null;
const paths = ['/', '/busca', '/produto/s-hal-dec-01']; // /catalogo is not the storefront catalog route.
const devices = [
  { name: 'mobile', viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2, cpu: 4, latency: 150, download: 1_600_000 / 8, upload: 750_000 / 8 },
  { name: 'desktop', viewport: { width: 1440, height: 900 }, isMobile: false, hasTouch: false, deviceScaleFactor: 1, cpu: 1, latency: 40, download: 10_000_000 / 8, upload: 3_000_000 / 8 },
];
mkdirSync(out, { recursive: true });
const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
const observations = [];
let failures = 0;
try {
  for (const device of devices) for (const path of paths) for (let repeat = 1; repeat <= 3; repeat++) {
    const context = await browser.newContext({ viewport: device.viewport, isMobile: device.isMobile, hasTouch: device.hasTouch, deviceScaleFactor: device.deviceScaleFactor, serviceWorkers: 'block' });
    const page = await context.newPage();
    const cdp = await context.newCDPSession(page);
    await cdp.send('Network.enable');
    await cdp.send('Network.setCacheDisabled', { cacheDisabled: true });
    await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: device.latency, downloadThroughput: device.download, uploadThroughput: device.upload });
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: device.cpu });
    const requests = new Map();
    const httpErrors = [];
    const consoleErrors = [];
    cdp.on('Network.responseReceived', ({ requestId, response, type }) => {
      requests.set(requestId, { url: response.url, mime: response.mimeType, type, status: response.status, cache: response.fromDiskCache || response.fromServiceWorker, cacheControl: response.headers['cache-control'] ?? response.headers['Cache-Control'] ?? null, encodedBytes: 0 });
      if (response.status >= 400) httpErrors.push({ url: response.url, status: response.status });
    });
    cdp.on('Network.loadingFinished', ({ requestId, encodedDataLength }) => { const request = requests.get(requestId); if (request) request.encodedBytes = encodedDataLength; });
    cdp.on('Network.loadingFailed', ({ requestId, errorText }) => { const request = requests.get(requestId); httpErrors.push({ url: request?.url ?? requestId, errorText }); });
    page.on('pageerror', error => consoleErrors.push(error.message));
    page.on('console', msg => { if (msg.type() === 'error') consoleErrors.push(msg.text()); });
    await page.addInitScript(() => {
      window.__perf = { lcp: null, cls: 0, fcp: null };
      new PerformanceObserver(list => { for (const e of list.getEntries()) window.__perf.lcp = { ms: e.startTime, url: e.url || e.element?.currentSrc || e.element?.src || null, element: e.element?.tagName ?? null, alt: e.element?.alt ?? null }; }).observe({ type: 'largest-contentful-paint', buffered: true });
      new PerformanceObserver(list => { for (const e of list.getEntries()) if (!e.hadRecentInput) window.__perf.cls += e.value; }).observe({ type: 'layout-shift', buffered: true });
      new PerformanceObserver(list => { for (const e of list.getEntries()) if (e.name === 'first-contentful-paint') window.__perf.fcp = e.startTime; }).observe({ type: 'paint', buffered: true });
    });
    try {
      const response = await page.goto(baseURL + path, { waitUntil: 'networkidle', timeout: 90000 });
      assert.equal(response?.status(), 200, `${path} HTTP status`);
      await page.waitForTimeout(900);
      const data = await page.evaluate(() => {
        const nav = performance.getEntriesByType('navigation')[0];
        const imageNodes = [...document.querySelectorAll('img')].map(img => ({ src: img.currentSrc || img.src, alt: img.alt, loading: img.loading, priority: img.fetchPriority, intrinsic: [img.naturalWidth, img.naturalHeight], css: [Math.round(img.getBoundingClientRect().width), Math.round(img.getBoundingClientRect().height)], complete: img.complete }));
        return { vitals: window.__perf, navigation: { ttfb: nav?.responseStart - nav?.requestStart, transferSize: nav?.transferSize }, images: imageNodes, title: document.title };
      });
      const network = [...requests.values()];
      const imageRequests = network.filter(r => r.mime.startsWith('image/') || r.type === 'Image');
      const record = { stage, commit, path, device: device.name, repeat, environment: 'GitHub Actions Ubuntu local production build (Wrangler --local), NOT publicly deployed', node: process.version, cpuThrottling: device.cpu, network: { latencyMs: device.latency, downloadBytesPerSec: device.download, uploadBytesPerSec: device.upload, cacheDisabled: true }, ...data, network: { latencyMs: device.latency, downloadBytesPerSec: device.download, uploadBytesPerSec: device.upload, cacheDisabled: true, totalEncodedBytes: network.reduce((n,r)=>n+r.encodedBytes,0), imageEncodedBytes: imageRequests.reduce((n,r)=>n+r.encodedBytes,0), requests: network.length, imageRequests: imageRequests.length, images: imageRequests }, httpErrors, consoleErrors };
      if (repeat === 1) await page.screenshot({ path: `${out}/${stage}-${device.name}-${path === '/' ? 'home' : path.slice(1).replaceAll('/', '-')}.png`, fullPage: true });
      observations.push(record);
      console.log(JSON.stringify({ stage, device: device.name, path, repeat, lcp: data.vitals.lcp, cls: data.vitals.cls, fcp: data.vitals.fcp, ttfb: data.navigation.ttfb, totalBytes: record.network.totalEncodedBytes, imageBytes: record.network.imageEncodedBytes, httpErrors: httpErrors.length, consoleErrors: consoleErrors.length }));
      if (httpErrors.length || consoleErrors.length) failures++;
    } catch (error) {
      failures++;
      observations.push({ stage, commit, path, device: device.name, repeat, error: String(error) });
      console.error(`FAIL ${stage} ${device.name} ${path} ${repeat}: ${error}`);
    } finally { await context.close(); }
  }
} finally {
  await browser.close();
  writeFileSync(`${out}/${stage}.json`, JSON.stringify({ stage, commit, baseURL, paths, devices, observations, failures, repetitions: 3, INP: 'NOT MEASURED: no real-user interactions' }, null, 2));
  console.log(JSON.stringify({ stage, samples: observations.length, failures, artifact: `${out}/${stage}.json` }));
}
if (failures) process.exitCode = 1;
