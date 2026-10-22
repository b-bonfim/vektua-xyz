'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import styles from './algodao-pesado.module.css';

// Assembled with SHA-256 verification before local/Hostinger builds.
const VIDEO_SRC = '/images/campaigns/algodao-pesado/audience-tribute-scrub.mp4';

// Match the corresponding static gates in algodao-pesado.module.css.
// Phones, portrait tablets, short coarse-pointer landscapes and reduced-motion
// users get the designed static poster without downloading the video.
const STATIC_GATES = [
  '(max-width: 850px)',
  '(orientation: portrait) and (max-width: 1100px)',
  '(orientation: portrait) and (pointer: coarse)',
  '(orientation: landscape) and (pointer: coarse) and (max-height: 560px)',
  '(prefers-reduced-motion: reduce)',
] as const;

const clamp = (value: number) => Math.max(0, Math.min(1, value));

/** The visual film is decorative; the page's headings remain HTML for accessibility. */
export default function RockStage({ children }: { children: ReactNode }) {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoReady, setVideoReady] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;
    if (!section || !video) return;

    const queries = STATIC_GATES.map((query) => window.matchMedia(query));
    let frame: number | null = null;
    let seekFrame: number | null = null;
    let lastTick = 0;
    let lastSeekAt = -Infinity;
    let current = 0;
    let target = 0;
    let videoActive = false;
    let readyToSeek = false;
    let visible = true;
    let seekBusy = false;
    let desiredSeek: number | null = null;
    let firstFrameVisible = false;
    let fetchStarted = false;
    let blobUrl: string | null = null;
    let abort: AbortController | null = null;
    let unmounted = false;

    // The approved scroll film is 24 fps. Seeking on every 60/120 Hz
    // animation frame floods H.264 decoders without adding visible frames.
    const SCRUB_FPS = 24;
    const SEEK_INTERVAL_MS = 40; // Cap seek pressure to ~25 requests/s.
    const SEEK_EPSILON = 0.5 / SCRUB_FPS;
    const SCROLL_RESPONSE_MS = 70;

    function progress() {
      const rect = section!.getBoundingClientRect();
      const range = Math.max(1, section!.offsetHeight - window.innerHeight);
      return clamp(-rect.top / range);
    }

    function frameTime(value: number) {
      const duration = video!.duration;
      if (!Number.isFinite(duration) || duration <= 0) return 0;
      const lastFrame = Math.max(0, duration - 1 / SCRUB_FPS);
      return Math.min(lastFrame, Math.round(clamp(value) * lastFrame * SCRUB_FPS) / SCRUB_FPS);
    }

    function revealIfSynchronized() {
      if (unmounted || !videoActive || firstFrameVisible || !readyToSeek) return;
      // The poster stays up until a decoded frame is reasonably close to
      // the current scroll position; never reveal a stale first frame.
      if (Math.abs(video!.currentTime - frameTime(target)) <= 2 / SCRUB_FPS) {
        firstFrameVisible = true;
        setVideoReady(true);
      }
    }

    function flushSeek(now: number) {
      seekFrame = null;
      if (!videoActive || !visible || !readyToSeek || seekBusy || desiredSeek === null) return;
      if (now - lastSeekAt < SEEK_INTERVAL_MS) {
        seekFrame = requestAnimationFrame(flushSeek);
        return;
      }
      const next = desiredSeek;
      desiredSeek = null;
      if (Math.abs(video!.currentTime - next) < SEEK_EPSILON) {
        revealIfSynchronized();
        return;
      }
      seekBusy = true;
      lastSeekAt = now;
      try { video!.currentTime = next; } catch { seekBusy = false; onError(); }
    }

    function queueSeek(value: number) {
      if (!readyToSeek || !videoActive) return;
      // Always keep only the newest frame. Intermediate seek targets become
      // obsolete while a previous keyframe is being decoded.
      desiredSeek = frameTime(value);
      if (!seekBusy && visible && seekFrame === null) seekFrame = requestAnimationFrame(flushSeek);
    }

    function paint(value: number) {
      const chapter = Math.min(3, Math.floor(clamp(value) * 4));
      if (section!.dataset.chapter !== String(chapter)) section!.dataset.chapter = String(chapter);
      // The original --ap-progress write invalidated styles on every frame.
      // The scroll hero does not render the old .mascot layer using it.
      if (videoActive) queueSeek(value);
    }

    function tick(now: number) {
      frame = null;
      if (!videoActive || !visible) { lastTick = 0; return; }
      const elapsed = Math.min(100, now - (lastTick || now));
      lastTick = now;
      current += (target - current) * (1 - Math.exp(-elapsed / SCROLL_RESPONSE_MS));
      if (Math.abs(target - current) < .0005) current = target;
      paint(current);
      if (current !== target) frame = requestAnimationFrame(tick);
      else lastTick = 0;
    }

    function onScroll() {
      if (!videoActive) return;
      target = progress();
      if (visible && frame === null) frame = requestAnimationFrame(tick);
    }

    function onSeeked() {
      seekBusy = false;
      revealIfSynchronized();
      if (desiredSeek !== null && visible && videoActive && seekFrame === null) {
        seekFrame = requestAnimationFrame(flushSeek);
      }
    }

    function onMetadata() {
      readyToSeek = true;
      queueSeek(progress());
    }

    function onFirstFrame() {
      revealIfSynchronized();
    }

    function onError() {
      seekBusy = false;
      desiredSeek = null;
      readyToSeek = false;
      if (seekFrame !== null) cancelAnimationFrame(seekFrame);
      seekFrame = null;
      if (!unmounted) setVideoReady(false);
      section!.dataset.apVideo = 'failed';
    }

    async function loadVideoOnce() {
      if (!videoActive || fetchStarted || blobUrl || unmounted) return;
      fetchStarted = true;
      const requestController = new AbortController();
      abort = requestController;
      section!.dataset.apVideo = 'loading';
      try {
        const response = await fetch(VIDEO_SRC, { signal: requestController.signal });
        if (!response.ok) throw new Error('Scroll video unavailable: HTTP ' + response.status);
        const media = await response.blob(); // Blob seeking works without HTTP Range support.
        if (media.type.includes('html') || media.size < 1000) throw new Error('Invalid video response');
        if (unmounted || !videoActive) { fetchStarted = false; return; }
        blobUrl = URL.createObjectURL(media);
        video!.src = blobUrl;
        video!.load();
      } catch {
        if (unmounted) return;
        if (requestController.signal.aborted) {
          fetchStarted = false;
          if (videoActive) void loadVideoOnce();
          return;
        }
        onError();
      }
    }

    function applyMode() {
      const next = !queries.some((query) => query.matches);
      if (!next && videoActive) {
        videoActive = false;
        if (frame !== null) cancelAnimationFrame(frame);
        if (seekFrame !== null) cancelAnimationFrame(seekFrame);
        frame = seekFrame = null;
        desiredSeek = null;
        lastTick = 0;
        lastSeekAt = -Infinity;
        firstFrameVisible = false;
        abort?.abort();
        section!.dataset.apMode = 'static';
        section!.dataset.chapter = '0';
        setVideoReady(false);
        return;
      }
      if (!next) {
        section!.dataset.apMode = 'static';
        return;
      }
      videoActive = true;
      section!.dataset.apMode = 'scroll';
      current = target = progress();
      paint(current);
      if (blobUrl && readyToSeek) {
        queueSeek(current);
        revealIfSynchronized();
      } else {
        void loadVideoOnce();
      }
      onScroll();
    }

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) {
        // Schedule scroll sampling before draining a stale offscreen seek.
        onScroll();
        if (desiredSeek !== null && !seekBusy && seekFrame === null) {
          seekFrame = requestAnimationFrame(flushSeek);
        }
      } else {
        if (frame !== null) cancelAnimationFrame(frame);
        if (seekFrame !== null) cancelAnimationFrame(seekFrame);
        frame = seekFrame = null;
        lastTick = 0;
      }
    }, { rootMargin: '45% 0px' });

    observer.observe(section);
    video.addEventListener('loadedmetadata', onMetadata);
    video.addEventListener('loadeddata', onFirstFrame);
    video.addEventListener('seeked', onSeeked);
    video.addEventListener('error', onError);
    queries.forEach((query) => query.addEventListener('change', applyMode));
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    applyMode();

    return () => {
      unmounted = true;
      observer.disconnect();
      queries.forEach((query) => query.removeEventListener('change', applyMode));
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      video.removeEventListener('loadedmetadata', onMetadata);
      video.removeEventListener('loadeddata', onFirstFrame);
      video.removeEventListener('seeked', onSeeked);
      video.removeEventListener('error', onError);
      abort?.abort();
      if (frame !== null) cancelAnimationFrame(frame);
      if (seekFrame !== null) cancelAnimationFrame(seekFrame);
      if (blobUrl) URL.revokeObjectURL(blobUrl);
    };
  }, []);

  return (
    <section ref={sectionRef} className={styles.hero} data-chapter="0" data-ap-mode="static" data-ap-video="idle"
      aria-label="Reverência da plateia aos amigos e apoiadores da Algodão Pesado">
      <div className={styles.stickyScene}>
        {children}
        <div className={styles.cinematicPoster} aria-hidden="true" />
        <video ref={videoRef} muted playsInline preload="none" tabIndex={-1} aria-hidden="true"
          className={styles.scrubVideo} data-ready={videoReady ? 'true' : 'false'} />
        <div className={styles.cinematicShade} aria-hidden="true" />
      </div>
    </section>
  );
}
