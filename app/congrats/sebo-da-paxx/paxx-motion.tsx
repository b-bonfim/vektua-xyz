'use client';

import { useEffect } from 'react';

const VIDEO = '/images/campaigns/sebo-da-paxx/paxx-scroll-web.mp4';
const clamp = (v: number) => Math.max(0, Math.min(1, v));
const VIDEO_SIZE = 1973258; // Actual encoded asset is validated at build time by deployment notes.

/** Blob-backed seek coalescing, adapted to the existing Vinext/Hostinger site.
 * Desktop cinematic enhancement only. Text and artwork never depend on JS or video.
 */
export default function PaxxMotion() {
  useEffect(() => {
    const root = document.getElementById('paxx-world');
    const scene = root?.querySelector<HTMLElement>('[data-paxx-scene]');
    const video = root?.querySelector<HTMLVideoElement>('[data-paxx-video]');
    const ring = root?.querySelector<HTMLElement>('[data-paxx-ring]');
    if (!root || !scene || !video) return;

    const desktop = window.matchMedia('(min-width: 900px) and (min-height: 620px) and (orientation: landscape)');
    const motion = window.matchMedia('(prefers-reduced-motion: no-preference)');
    const pointer = window.matchMedia('(pointer: fine)');
    const dataSaver = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData === true;
    let disposed = false;
    let eligible = false;
    let near = false;
    let fetching = false;
    let ready = false;
    let raf = 0;
    let last = 0;
    let shown = 0;
    let target = 0;
    let seekBusy = false;
    let pending: number | null = null;
    let controller: AbortController | null = null;
    let blobUrl: string | null = null;
    let watchdog: ReturnType<typeof setTimeout> | null = null;

    const progress = () => {
      const rect = scene.getBoundingClientRect();
      return clamp(-rect.top / Math.max(1, scene.offsetHeight - window.innerHeight));
    };
    const setChapter = (p: number) => {
      const chapter = p < 0.31 ? '0' : p < 0.66 ? '1' : '2';
      if (root.dataset.paxxChapter !== chapter) root.dataset.paxxChapter = chapter;
      root.style.setProperty('--paxx-progress', p.toFixed(4));
    };
    const requestSeek = (seconds: number) => {
      if (!ready || !Number.isFinite(video.duration) || video.duration <= 0) return;
      const safe = clamp(seconds / video.duration) * Math.max(0, video.duration - 0.043);
      if (seekBusy || video.seeking) { pending = safe; return; }
      if (Math.abs(video.currentTime - safe) < 0.03) return;
      seekBusy = true;
      try { video.currentTime = safe; } catch { seekBusy = false; }
    };
    const onSeeked = () => {
      seekBusy = false;
      if (pending !== null) {
        const next = pending;
        pending = null;
        requestSeek(next);
      }
    };
    const tick = (now: number) => {
      raf = 0;
      if (disposed || !eligible || !near) return;
      const elapsed = Math.min(100, now - (last || now));
      last = now;
      shown += (target - shown) * (1 - Math.pow(0.84, elapsed / 16.667));
      if (Math.abs(target - shown) < 0.0006) shown = target;
      setChapter(shown);
      if (ready) requestSeek(shown * video.duration);
      if (shown !== target) raf = requestAnimationFrame(tick);
      else last = 0;
    };
    const queue = () => {
      if (!eligible || !near) return;
      target = progress();
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const clearWatchdog = () => { if (watchdog) clearTimeout(watchdog); watchdog = null; };
    const loading = (value: boolean) => {
      root.dataset.paxxLoading = value ? 'true' : 'false';
    };
    const fail = () => {
      loading(false);
      root.dataset.paxxVideoReady = 'false';
      ready = false;
      seekBusy = false;
      pending = null;
    };
    const stop = () => {
      eligible = false;
      controller?.abort(); controller = null;
      clearWatchdog();
      if (raf) cancelAnimationFrame(raf);
      raf = 0; last = 0;
      if (blobUrl) {
        video.removeAttribute('src');
        video.load();
        URL.revokeObjectURL(blobUrl);
        blobUrl = null;
      }
      fetching = false;
      fail();
    };
    const onLoaded = () => {
      if (!eligible || disposed) return;
      ready = true;
      loading(false);
      root.dataset.paxxVideoReady = 'true';
      shown = target = progress();
      setChapter(shown);
      requestSeek(shown * video.duration);
      queue();
    };
    const load = async () => {
      if (!eligible || !near || fetching || disposed) return;
      fetching = true;
      controller = new AbortController();
      loading(true);
      root.dataset.paxxVideoReady = 'false';
      try {
        const response = await fetch(VIDEO, { signal: controller.signal, priority: 'low' } as RequestInit);
        if (!response.ok) throw new Error('video unavailable');
        const total = Number(response.headers.get('content-length')) || VIDEO_SIZE;
        let data: Blob;
        if (response.body) {
          const reader = response.body.getReader();
          const chunks: Uint8Array[] = [];
          let loaded = 0;
          let lastProgressWrite = 0;
          watchdog = setTimeout(() => controller?.abort(), 20000);
          while (true) {
            const next = await reader.read();
            if (next.done) break;
            clearWatchdog();
            watchdog = setTimeout(() => controller?.abort(), 20000);
            chunks.push(next.value);
            loaded += next.value.byteLength;
            const now = performance.now();
            if (now - lastProgressWrite > 90 || loaded >= total) {
              lastProgressWrite = now;
              ring?.style.setProperty('--paxx-load', String(clamp(loaded / total)));
            }
          }
          data = new Blob(chunks as BlobPart[], { type: 'video/mp4' });
        } else {
          data = await response.blob();
        }
        clearWatchdog();
        if (!eligible || disposed) return;
        blobUrl = URL.createObjectURL(data);
        video.src = blobUrl;
        video.load();
      } catch { if (!disposed) fail(); }
    };
    const check = () => {
      const allow = !dataSaver && desktop.matches && motion.matches && pointer.matches;
      if (!allow) {
        if (eligible) stop();
        root.dataset.paxxStatic = 'true';
        return;
      }
      delete root.dataset.paxxStatic;
      if (!eligible) {
        eligible = true;
        shown = target = progress();
        setChapter(shown);
      }
      queue();
      if (near) void load();
    };
    const observer = new IntersectionObserver(([entry]) => {
      near = entry.isIntersecting;
      if (near) { check(); queue(); }
      else { if (raf) cancelAnimationFrame(raf); raf = 0; last = 0; }
    }, { rootMargin: '70% 0px 70% 0px' });
    observer.observe(scene);
    video.addEventListener('seeked', onSeeked);
    video.addEventListener('loadeddata', onLoaded);
    video.addEventListener('error', fail);
    window.addEventListener('scroll', queue, { passive: true });
    window.addEventListener('resize', check);
    [desktop, motion, pointer].forEach((q) => q.addEventListener('change', check));
    // Static first paint always works. Feature detection is an enhancement only.
    check();
    return () => {
      disposed = true;
      stop();
      observer.disconnect();
      video.removeEventListener('seeked', onSeeked);
      video.removeEventListener('loadeddata', onLoaded);
      video.removeEventListener('error', fail);
      window.removeEventListener('scroll', queue);
      window.removeEventListener('resize', check);
      [desktop, motion, pointer].forEach((q) => q.removeEventListener('change', check));
    };
  }, []);
  return null;
}
