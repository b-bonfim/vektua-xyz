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
    const mobileQuery = window.matchMedia(
      '(max-width: 879px), (max-height: 599px), (orientation: portrait) and (pointer: coarse)',
    );
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const revealTargets = Array.from(root.querySelectorAll<HTMLElement>('[data-padoca-reveal]'));
    let mobileActive = false;
    let mobileFrame = 0;
    let mobileObserver: IntersectionObserver | null = null;

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
        // Only eligible desktop visitors request the cinematic poster.
        video.poster = video.dataset.padocaPoster || '';
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
        video.removeAttribute('poster');
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


    // Mobile animation is made of already-visible illustrations; it never requests an MP4.
    const markVisible = (element: HTMLElement) => {
      element.dataset.padocaVisible = 'true';
      mobileObserver?.unobserve(element);
    };

    const updateMobile = () => {
      mobileFrame = 0;
      if (!mobileActive) return;
      const rect = scene.getBoundingClientRect();
      if (rect.top > window.innerHeight + 120 || rect.bottom < -120) return;
      const position = clamp(-rect.top / Math.max(1, rect.height - window.innerHeight));
      root.style.setProperty('--padoca-mobile-shift', `${(-position * 84).toFixed(1)}px`);
      root.style.setProperty('--padoca-mobile-angle', `${(-7 + position * 16).toFixed(1)}deg`);
      root.style.setProperty('--padoca-mobile-zoom', (1 + position * 0.22).toFixed(3));
      root.style.setProperty('--padoca-mobile-sun', `${(position * 105).toFixed(1)}px`);
      root.style.setProperty('--padoca-mobile-copy', `${(-position * 40).toFixed(1)}px`);
      const chapter = position < 0.34 ? '0' : position < 0.68 ? '1' : '2';
      if (root.dataset.padocaChapter !== chapter) root.dataset.padocaChapter = chapter;
    };

    const queueMobile = () => {
      if (mobileActive && !mobileFrame) mobileFrame = window.requestAnimationFrame(updateMobile);
    };

    const onMobileFocus = (event: FocusEvent) => {
      if (!(event.target instanceof Element)) return;
      const target = event.target.closest<HTMLElement>('[data-padoca-reveal]');
      if (target && root.contains(target)) markVisible(target);
    };

    const enableMobile = () => {
      if (mobileActive) return;
      mobileActive = true;
      if ('IntersectionObserver' in window) {
        // Avoid hiding anything that is currently visible or above restored scroll position.
        revealTargets.forEach((element) => {
          if (element.getBoundingClientRect().top <= window.innerHeight * 0.93) markVisible(element);
        });
        mobileObserver = new IntersectionObserver((entries) => {
          for (const entry of entries) if (entry.isIntersecting) markVisible(entry.target as HTMLElement);
        }, { rootMargin: '0px 0px -7% 0px', threshold: 0.04 });
        revealTargets.forEach((element) => {
          if (element.dataset.padocaVisible !== 'true') mobileObserver?.observe(element);
        });
        root.dataset.padocaMobileReveals = 'true';
      }
      root.dataset.padocaMobileMotion = 'true';
      window.addEventListener('scroll', queueMobile, { passive: true });
      window.addEventListener('resize', queueMobile);
      root.addEventListener('focusin', onMobileFocus);
      queueMobile();
    };

    const disableMobile = () => {
      if (!mobileActive) return;
      mobileActive = false;
      if (mobileFrame) window.cancelAnimationFrame(mobileFrame);
      mobileFrame = 0;
      mobileObserver?.disconnect();
      mobileObserver = null;
      delete root.dataset.padocaMobileMotion;
      delete root.dataset.padocaMobileReveals;
      delete root.dataset.padocaChapter;
      ['--padoca-mobile-shift', '--padoca-mobile-angle', '--padoca-mobile-zoom',
        '--padoca-mobile-sun', '--padoca-mobile-copy'].forEach((property) => {
        root.style.removeProperty(property);
      });
      window.removeEventListener('scroll', queueMobile);
      window.removeEventListener('resize', queueMobile);
      root.removeEventListener('focusin', onMobileFocus);
    };

    const checkMode = () => {
      const canScrub = !dataSaver && !queries.some((query) => query.matches);
      const canMobileAnimate = mobileQuery.matches && !dataSaver && !reducedMotion.matches;
      if (canMobileAnimate) enableMobile();
      else disableMobile();
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
    mobileQuery.addEventListener('change', checkMode);
    checkMode();

    return () => {
      disposed = true;
      disable();
      disableMobile();
      observer?.disconnect();
      window.removeEventListener('scroll', queue);
      window.removeEventListener('resize', checkMode);
      queries.forEach((query) => query.removeEventListener('change', checkMode));
      mobileQuery.removeEventListener('change', checkMode);
      video.removeEventListener('loadeddata', onLoadedData);
      video.removeEventListener('seeked', onSeeked);
      video.removeEventListener('error', onVideoError);
    };
  }, []);

  return null;
}
