/** Read-only HTTP smoke for the actual Hostinger standalone server (or public release).
 * No GitHub Actions, order submission, payment, WhatsApp sending or state mutation.
 * Usage: BASE_URL=http://127.0.0.1:3000 node scripts/tests/hostinger-http-smoke.mjs
 */
import assert from 'node:assert/strict';
import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';

const rawBase = process.env.BASE_URL;
assert.ok(rawBase, 'BASE_URL required: set the URL of the running release explicitly.');
const base = new URL(rawBase);
assert.ok(['http:', 'https:'].includes(base.protocol), 'BASE_URL must be HTTP(S).');
assert.equal(base.username + base.password, '', 'Never put credentials in BASE_URL.');
assert.ok(!base.search && !base.hash, 'BASE_URL must not contain a query or fragment.');
assert.equal(base.pathname, '/', 'BASE_URL must be the site origin, not a nested path.');
const root = resolve(process.env.RELEASE_ROOT || process.cwd());
const source = readFileSync(resolve(root, 'lib/commercial-catalog.ts'), 'utf8');
const imageBlock = source.split('const remixKeyringImages:')[1]?.split('export const commercialProducts:')[0];
assert.ok(imageBlock, 'REMIX image manifest not found; update smoke before release.');
const matches = [...imageBlock.matchAll(/["'](G-CHV-[A-Z0-9-]+)["']\s*:\s*["'](\/images\/products\/remix\/[^"']+_REMIX\.(?:png|webp))["']/gi)];
assert.ok(matches.length, 'No SKU REMIX images found; release manifest may be malformed.');
assert.equal(new Set(matches.map(match => match[1])).size, matches.length, 'Duplicate image SKU.');
const paths = [
  '/', '/busca', '/objetos-colecionaveis', '/datas-colecoes',
  '/feitos-para-voce', '/chaveiros', '/produto/g-chv-blo-01',
  '/produto/g-org-rc-01', '/carrinho', '/congrats/blind-rats',
  '/congrats/orion-tattoo', '/congrats/a-padoca', '/congrats/algodao-pesado', '/congrats/agodao-pesado', '/politicas/privacidade', '/politicas/entrega',
  '/politicas/trocas-devolucoes', '/politicas/termos',
];
const campaignImages = [
  '/images/campaigns/blind-rats/blind-rats-badge.svg',
  '/images/campaigns/orion-tattoo/orion-tattoo-hero-desktop.avif',
  '/images/campaigns/orion-tattoo/orion-tattoo-hero-mobile.avif',
  '/images/campaigns/orion-tattoo/orion-tattoo-icon.svg',
  '/images/campaigns/orion-tattoo/orion-tattoo-round-header.webp',
  '/images/campaigns/a-padoca/a-padoca-scroll-poster.webp',
  '/images/campaigns/a-padoca/a-padoca-logo-official.svg',
  '/images/campaigns/a-padoca/baguette.webp',
  '/images/campaigns/a-padoca/croissant.webp',
  '/images/campaigns/a-padoca/strawberry-pie.webp',
  '/images/campaigns/a-padoca/cookie.webp',
  '/images/campaigns/algodao-pesado/audience-tribute-poster.jpg',
  '/images/campaigns/algodao-pesado/algodao-pesado-rockwear-logo.svg',
  '/images/campaigns/algodao-pesado/diego-mascot-thank-you-poster.webp',
];
const campaignVideos = [
  '/images/campaigns/a-padoca/a-padoca-scroll-web.mp4',
  '/images/campaigns/algodao-pesado/audience-tribute-scrub.mp4',
  '/images/campaigns/algodao-pesado/diego-mascot-thank-you.mp4',
];
const output = { startedAt: new Date().toISOString(), baseURL: base.href, sha: process.env.RELEASE_SHA || null, checks: [], failures: 0 };
async function check(label, path, isImage) {
  try {
    const url = new URL(path.slice(1), base);
    const response = await fetch(url, { redirect: 'follow', signal: AbortSignal.timeout(30000) });
    assert.equal(response.status, 200, `${url}: expected HTTP 200, got ${response.status}`);
    if (isImage) {
      const type = response.headers.get('content-type') || '';
      const lower = path.toLowerCase();
      const expected = lower.endsWith('.png') ? 'image/png' : lower.endsWith('.jpg') || lower.endsWith('.jpeg') ? 'image/jpeg' : lower.endsWith('.svg') ? 'image/svg+xml' : lower.endsWith('.avif') ? 'image/avif' : 'image/webp';
      assert.ok(type.toLowerCase().startsWith(expected), `${path}: MIME ${type}; expected ${expected}`);
      const reader = response.body?.getReader();
      assert.ok(reader, `${path}: image has no response body`);
      const bytes = [];
      let count = 0;
      while (count < 64) {
        const { done, value } = await reader.read();
        if (done) break;
        bytes.push(value); count += value.length;
      }
      await reader.cancel();
      const start = Buffer.concat(bytes).subarray(0, 64);
      const valid = expected === 'image/png'
        ? start.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
        : expected === 'image/jpeg'
          ? start[0] === 0xff && start[1] === 0xd8 && start[2] === 0xff
        : expected === 'image/svg+xml'
          ? /^(?:<\?xml[^>]*\?>\s*)?<svg\b/i.test(start.toString('utf8').trimStart())
          : expected === 'image/avif'
            ? start.toString('ascii', 4, 12) === 'ftypavif'
            : start.toString('ascii', 0, 4) === 'RIFF' && start.toString('ascii', 8, 12) === 'WEBP';
      assert.ok(valid, `${path}: invalid image signature`);
    } else if (path.endsWith('.mp4')) {
      const type = response.headers.get('content-type') || '';
      assert.ok(type.toLowerCase().startsWith('video/mp4'), `${path}: expected video/mp4, got ${type}`);
      const reader = response.body?.getReader();
      assert.ok(reader, `${path}: video has no response body`);
      let start = Buffer.alloc(0);
      while (start.length < 16) {
        const { done, value } = await reader.read();
        if (done) break;
        start = Buffer.concat([start, value]);
      }
      await reader.cancel();
      assert.equal(start.subarray(4, 8).toString('ascii'), 'ftyp', `${path}: missing MP4 ftyp signature`);
    } else {
      const type = response.headers.get('content-type') || '';
      assert.match(type, /text\/html/i, `${path}: expected HTML, got ${type}`);
      const html = await response.text();
      assert.match(html, /Vektua XYZ/i, `${path}: missing site identity`);
      assert.ok(!html.includes('RSC prefetch setup error'), `${path}: known Vinext error in HTML`);
      if (path === '/congrats/agodao-pesado') {
        assert.equal(new URL(response.url).pathname, '/congrats/algodao-pesado', 'Algodão Pesado legacy slug must redirect to canonical route');
      }
      if (path === '/congrats/algodao-pesado') {
        assert.ok(html.includes('data-ap-video=') || html.includes('data-ap-video="idle"'), 'Algodão Pesado scroll stage is missing');
        assert.match(html, /HOJE O PALCO/i, 'Algodão Pesado audience tribute narrative missing');
        assert.ok(html.includes('thank-you') || html.includes('UM RECADO'), 'Algodão Pesado second video section missing');
        assert.ok(html.includes('video-agradecimento'), 'Algodão Pesado direct video navigation anchor missing');
        assert.ok(html.includes('diego-mascot-thank-you-poster.webp'), 'Algodão Pesado mascot video poster missing');
        assert.ok(html.includes('algodaopesado.oficial'), 'Algodão Pesado official profile missing');
      }
      if (path === '/congrats/a-padoca') {
        assert.match(html, /Esse pedacinho/i, 'Padoca: greeting missing');
        assert.ok(html.includes('a-padoca-logo-official.svg'), 'Padoca: official logo missing');
        assert.ok(!html.includes('<small>PADARIA</small>'), 'Padoca: generic tagline still visible');
        assert.ok(html.includes('data-padoca-video'), 'Padoca: decorative video layer missing');
        assert.ok(html.includes('data-padoca-poster='), 'Padoca: deferred poster hint missing');
        assert.ok(!/\sposter="\/images\/campaigns\/a-padoca\/a-padoca-scroll-poster\.webp"/.test(html),
          'Padoca: MP4 poster must not eagerly load on small screens');
        assert.ok((html.match(/data-padoca-reveal=/g) || []).length >= 10,
          'Padoca: mobile lazy-reveal landmarks are missing');
        assert.ok((html.match(/fetchPriority="low"/g) || []).length >= 3 ||
          (html.match(/fetchpriority="low"/g) || []).length >= 3,
          'Padoca: mobile gallery images should have low fetch priority');
        assert.ok(html.includes('instagram.com/apadocasrs/'), 'Padoca: Instagram CTA missing');
      }
      if (path === '/congrats/orion-tattoo') {
        assert.match(html, /Oiee!/i, 'Orion: Laura greeting missing');
        assert.match(html, /Eu sou a Laura/i, 'Orion: first-person greeting missing');
        assert.ok(!/Prazer, eu sou a/i.test(html), 'Orion: redundant Laura section is still rendered');
        assert.ok(!/Esse é o meu cantinho/i.test(html), 'Orion: removed Laura section label is still rendered');
        assert.match(html, /Obrigada de cora(?:ção|&#xE7;&#xE3;o|&#231;&#227;o)/i, 'Orion: personal thanks missing');
        assert.ok(!/artista\s+independente/i.test(html), 'Orion: old independent-artist copy still displayed');
        assert.ok(!/lucide-sparkles/i.test(html), 'Orion: unwanted sparkle icons found');
        assert.ok(html.includes('orion-tattoo-round-header.webp'), 'Orion: header logo is missing');
        assert.match(html, /id="orion-campaign"/, 'Orion: motion scope is missing');
        assert.match(html, /data-orion-reveal="ink"/, 'Orion: artwork reveal marker is missing');
        assert.match(html, /data-orion-reveal="sequence"/, 'Orion: storytelling sequence marker is missing');
        assert.match(html, /data-orion-reveal="closing"/, 'Orion: closing reveal marker is missing');
        assert.match(html, /data-orion-stage="true"/, 'Orion: sticky chapter stage is missing');
        assert.ok((html.match(/data-orion-reveal="chapter"/g) || []).length >= 3, 'Orion: expected at least three chapter panels');
        assert.match(html, /data-orion-reveal="hero-art"/, 'Orion: animated hero art is missing');
        assert.ok(html.includes('instagram.com/oriontattoo.404/'), 'Orion: official Instagram profile link missing');
        assert.match(html, /@oriontattoo\.404/i, 'Orion: Instagram handle missing');
        assert.match(html, /Me acompanha no Instagram/i, 'Orion: first-person Instagram CTA missing');
        assert.ok((html.match(/instagram\.com\/oriontattoo\.404\//g) || []).length >= 3, 'Orion: expected Instagram CTAs in header, closing and footer');
      }
    }
    output.checks.push({ label, path, status: 'PASS' });
    console.log(`PASS ${label} ${path}`);
  } catch (error) {
    output.failures++;
    output.checks.push({ label, path, status: 'FAIL', error: String(error) });
    console.error(`FAIL ${label} ${path}: ${error}`);
  }
}
for (const path of paths) await check('route', path, false);
for (const [, sku, path] of matches) await check(`remix:${sku}`, path, true);
for (const path of campaignImages) await check('campaign-art', path, true);
for (const path of campaignVideos) await check('campaign-video', path, false);
output.finishedAt = new Date().toISOString();
if (process.env.QA_OUTPUT) {
  const file = resolve(process.env.QA_OUTPUT);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, JSON.stringify(output, null, 2) + '\n');
}
const assetCount = matches.length + campaignImages.length + campaignVideos.length;
console.log(`HOSTINGER_HTTP_SMOKE ${output.failures ? 'FAIL' : 'PASS'} routes=${paths.length} assets=${assetCount} failures=${output.failures}`);
console.log('HTTP/MIME/signature checks do not replace Playwright, visual review, payment/WhatsApp acceptance or deploy evidence.');
if (output.failures) process.exitCode = 1;
