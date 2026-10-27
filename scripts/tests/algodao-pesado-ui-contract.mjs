/** Algodão Pesado static campaign contract. Read-only, no browser or deploy side effects.
 * Run: node scripts/tests/algodao-pesado-ui-contract.mjs
 */
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const root = 'app/congrats/algodao-pesado/';
const read = (file) => readFileSync(file, 'utf8');
const css = read(root + 'algodao-pesado.module.css');
const page = read(root + 'page.tsx');
const motion = read(root + 'campaign-motion.tsx');
const stage = read(root + 'rock-stage.tsx');
const video = read(root + 'thank-you-message.tsx');
const smoke = read('scripts/tests/hostinger-http-smoke.mjs');

assert.match(css, /fonts\.googleapis\.com\/css2\?family=Barlow\+Condensed/, 'Display font request missing');
assert.match(css, /family=Barlow:wght/, 'Body font request missing');
assert.match(css, /--ap-display-font:\s*'Barlow Condensed'/, 'Scoped display token missing');
assert.match(css, /--ap-body-font:\s*'Barlow'/, 'Scoped body token missing');
assert.doesNotMatch(css, /font-family:\s*Impact\b/, 'Legacy display font remains primary');
assert.match(css, /@media\s*\(max-width:520px\)/, 'Narrow mobile layout missing');
assert.match(css, /prefers-reduced-motion/, 'Reduced-motion alternative missing');

assert.match(page, /href="#recado"/, 'Original letter navigation missing');
assert.match(page, /href="#video-agradecimento"/, 'Direct video shortcut missing');
assert.match(page, /id="video-agradecimento"/, 'Video destination anchor missing');
assert.match(page, /algodaopesado\.oficial/, 'Partner Instagram missing');
assert.match(page, /algodao-pesado-rockwear-logo\.svg/, 'Partner logo missing');

assert.match(page, /<CampaignMotion\s*\/>/, 'Motion director not mounted');
assert.match(motion, /IntersectionObserver/, 'IntersectionObserver reveal support missing');
assert.match(motion, /prefers-reduced-motion: reduce/, 'Reduced-motion preference not respected');
assert.match(motion, /element\.getBoundingClientRect\(\)\.top/, 'Already-visible elements must not be hidden');
assert.match(motion, /root\.addEventListener\('focusin'/, 'Keyboard focus fallback missing');
assert.match(motion, /revealObserver\.disconnect\(\)/, 'Observer cleanup missing');
assert.match(motion, /delete element\.dataset\.apMotion/, 'Strict Mode cleanup missing');
assert.equal((page.match(/data-ap-spotlight=/g) || []).length, 3, 'Three animated section atmosphere cues expected');
for (const role of ['label', 'headline', 'copy', 'sign', 'stamp', 'rule', 'media', 'action', 'logo']) {
  assert.ok(page.includes('data-ap-reveal="' + role + '"'), 'Missing authored reveal target: ' + role);
  assert.ok(css.includes('data-ap-reveal="' + role + '"'), 'Missing CSS reveal treatment: ' + role);
}
assert.match(css, /@media \(prefers-reduced-motion: reduce\)/, 'Reduced motion media fallback missing');
assert.match(css, /\.motionMediaFrame/, 'Mascot video frame container missing');
assert.doesNotMatch(stage, /data-ap-reveal/, 'The scroll-scrub hero must not be reveal-animated');

assert.match(stage, /audience-tribute-scrub\.mp4/, 'Scroll-scrub film missing');
assert.match(stage, /STATIC_GATES/, 'Static mobile/reduced-motion gates missing');
assert.match(stage, /muted playsInline preload="none"/, 'Scrub must remain muted and deferred');
assert.match(stage, /const SCRUB_FPS = 24/, 'Scrub frame rate not declared');
assert.match(stage, /const SEEK_INTERVAL_MS = 40/, 'Scrub seek backpressure missing');
assert.match(stage, /video!\\.readyState < 2/, 'Poster should remain visible until first decoded frame');
assert.match(stage, /Math\.round\(clamp\(value\) \* lastFrame \* SCRUB_FPS\)/, 'Seek frame quantization missing');
assert.match(stage, /desiredSeek = frameTime\(value\)/, 'Latest-scroll seek queue missing');
assert.match(stage, /seekBusy = true/, 'Seek concurrency guard missing');
assert.match(stage, /if \(seekFrame !== null\) cancelAnimationFrame\(seekFrame\)/, 'Seek cleanup missing');
assert.doesNotMatch(stage, /section!\.style\.setProperty/, 'Redundant per-frame style invalidation');

assert.match(video, /VIDEO_AVAILABLE = true/, 'Mascot video player not enabled');
assert.match(video, /diego-mascot-thank-you\.mp4/, 'Mascot film missing');
assert.match(video, /diego-mascot-thank-you-poster\.webp/, 'Mascot poster missing');
assert.match(video, /preload="none"/, 'Mascot film must be click-to-play');
assert.doesNotMatch(video, /autoPlay/, 'Mascot must not autoplay with sound');
for (const asset of ['algodao-pesado-rockwear-logo.svg','diego-mascot-thank-you-poster.webp','diego-mascot-thank-you.mp4']) {
  assert.ok(smoke.includes(asset), 'Hostinger smoke missing asset: ' + asset);
}

const used = [page, stage, video].flatMap((source) =>
  [...source.matchAll(/styles\.([A-Za-z][A-Za-z0-9]*)/g)].map((match) => match[1]));
const undefinedClasses = [...new Set(used)].filter((cls) =>
  !new RegExp('\\.' + cls + '(?![A-Za-z0-9_-])').test(css));
assert.deepEqual(undefinedClasses, [], 'Missing CSS module selectors');
console.log('PASS Algodão Pesado UI source contract: typography, controls, assets, selectors');
