'use client';

import { useEffect } from 'react';

const VIDEO_SRC = '/images/campaigns/a-padoca/a-padoca-scroll-web.mp4';
const clamp = (value: number) => Math.max(0, Math.min(1, value));

/**
 * The page is completely readable without this component.
 * A video is downloaded only for landscape desktop, motion-enabled visitors.
 * This follows the same Blob-based, coalesced-seek approach used by Blind Rats
 * so the Hostinger server does not need to support HTTP Range for scrub seeks.
 */
export default function PadocaMotion() {
  useEffect(() => {
    const root = document.getElementById('padoca-world');
    const scene = root?.querySelector<HTMLElement>('[data-padoca-scene]');
    const video = root?.querySelector<HTMLVideoElement>('[data-padoca-video]');
    if (!root || !scene || !video) return;

    const queries = [
      window.matchMedia('(max-width: 879px)'),
      window.matchMedia('(max-height: 599px)'),
      window.matchMedia('(orientation: portrait) and (pointer: coarse)'),
      window.matchMedia('(prefers-reduced-motion: reduce)'),
    ];
    const dataSaver =
      (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData === true;

    let enabled = false;
    let nearScene = false;
    let ready = false;
    let disposed = false;
    let loadStarted = false;
    let frame = 0;
    let previous = 0;
    let shown = 0;
    let target = 0;
    let seekBusy = false;
    let pendingTime: number | null = null;
    let requestController: AbortController | null = null;
    let objectUrl: string | null = null;

    const progress = () => {
      const rect = scene.getBoundingClientRect();
      return clamp(-rect.top / Math.max(1, scene.offsetHeight - window.innerHeight));
    };

    const requestSeek = (time: number) => {
      if (!ready || !Number.isFinite(video.duration) || video.duration <= 0) return;
      const safe = clamp(time / video.duration) * (video.duration - 0.042);
      if (seekBusy) {
        pendingTime = safe;
        return;
      }
      if (Math.abs(video.currentTime - safe) <= 0.035) return;
      seekBusy = true;
      try {
        video.currentTime = safe;
      } catch {
        seekBusy = false;
      }
    };

    const update = (now: number) => {
      frame = 0;
      if (disposed || !enabled) return;

      const elapsed = Math.min(100, now - (previous || now));
      previous = now;
      const easing = 1 - Math.pow(0.84, elapsed / 16.667);
      shown += (target - shown) * easing;
      if (Math.abs(shown - target) < 0.0007) shown = target;

      root.style.setProperty('--padoca-rise', (-shown * 78).toFixed(1) + 'px');
      root.style.setProperty('--padoca-rotate', (-shown * 4).toFixed(2) + 'deg');
      root.style.setProperty('--padoca-scale', (1 + shown * 0.16).toFixed(3));

      const chapter = shown < 0.33 ? '0' : shown < 0.68 ? '1' : '2';
      if (root.dataset.padocaChapter !== chapter) root.dataset.padocaChapter = chapter;
      if (ready && nearScene) requestSeek(shown * video.duration);

      if (shown !== target) frame = window.requestAnimationFrame(update);
      else previous = 0;
    };

    const queue = () => {
      if (!enabled) return;
      target = progress();
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    const onSeeked = () => {
      seekBusy = false;
      if (pendingTime !== null) {
        const next = pendingTime;
        pendingTime = null;
        requestSeek(next);
      }
    };

    const resetToStatic = () => {
      ready = false;
      delete root.dataset.padocaVideoReady;
    };

    const onVideoError = () => {
      resetToStatic();
      seekBusy = false;
      pendingTime = null;
    };

    const onLoadedData = () => {
      if (!enabled || disposed) return;
      ready = true;
      root.dataset.padocaVideoReady = 'true';
      queue();
    };

    const loadVideo = async () => {
      if (!enabled || !nearScene || loadStarted || disposed) return;
      loadStarted = true;
      requestController = new AbortController();

      try {
        const response = await fetch(VIDEO_SRC, { signal: requestController.signal });
        if (!response.ok) throw new Error('A Padoca cinematic video unavailable');
        const blob = await response.blob();
        if (!enabled || disposed) return;
        objectUrl = URL.createObjectURL(blob);
        video.src = objectUrl;
        video.load();
      } catch {
        // No failed-video message is needed: the illustrated hero remains intact.
        resetToStatic();
      }
    };

    const disable = () => {
      enabled = false;
      if (frame) window.cancelAnimationFrame(frame);
      frame = 0;
      previous = 0;
      requestController?.abort();
      if (objectUrl) {
        video.removeAttribute('src');
        video.load();
        URL.revokeObjectURL(objectUrl);
        objectUrl = null;
      }
      loadStarted = false;
      seekBusy = false;
      pendingTime = null;
      root.dataset.padocaChapter = '0';
      root.style.removeProperty('--padoca-rise');
      root.style.removeProperty('--padoca-rotate');
      root.style.removeProperty('--padoca-scale');
      resetToStatic();
    };

    const checkMode = () => {
      const canScrub = !dataSaver && !queries.some((query) => query.matches);
      if (!canScrub) {
        if (enabled) disable();
        return;
      }
      if (!enabled) {
        enabled = true;
        shown = target = progress();
        queue();
      }
      if (nearScene) void loadVideo();
    };

    const observer = 'IntersectionObserver' in window
      ? new IntersectionObserver(
        ([entry]) => {
          nearScene = entry.isIntersecting;
          if (nearScene) {
            void loadVideo();
            queue();
          }
        },
        { rootMargin: '100% 0px 100% 0px' },
      )
      : null;

    observer?.observe(scene);
    if (!observer) nearScene = true;
    video.addEventListener('loadeddata', onLoadedData);
    video.addEventListener('seeked', onSeeked);
    video.addEventListener('error', onVideoError);
    window.addEventListener('scroll', queue, { passive: true });
    window.addEventListener('resize', checkMode);
    queries.forEach((query) => query.addEventListener('change', checkMode));
    checkMode();

    return () => {
      disposed = true;
      disable();
      observer?.disconnect();
      window.removeEventListener('scroll', queue);
      window.removeEventListener('resize', checkMode);
      queries.forEach((query) => query.removeEventListener('change', checkMode));
      video.removeEventListener('loadeddata', onLoadedData);
      video.removeEventListener('seeked', onSeeked);
      video.removeEventListener('error', onVideoError);
    };
  }, []);

  return null;
}
