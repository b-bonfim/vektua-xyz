'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import styles from './algodao-pesado.module.css';

// Activate after the Founder delivers the Google Flow file and its web encode is committed.
// Never fetch an asset that has not been uploaded to the repository.
const VIDEO_ENABLED = false;
const VIDEO_SRC = '/images/campaigns/algodao-pesado/backstage-scrub.mp4';
const DESKTOP_GATES = [
  '(max-width: 850px)',
  '(orientation: portrait) and (max-width: 1100px)',
  '(orientation: portrait) and (pointer: coarse)',
  '(orientation: landscape) and (pointer: coarse) and (max-height: 560px)',
  '(prefers-reduced-motion: reduce)',
] as const;

const clamp = (n: number) => Math.max(0, Math.min(1, n));

/** Decorative, reversible scroll progression. Fully readable without media or JavaScript. */
export default function RockStage({ children }: { children: ReactNode }) {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoReady, setVideoReady] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;
    if (!section || !video) return;
    const queries = DESKTOP_GATES.map((query) => window.matchMedia(query));
    let raf = 0;
    let visible = true;
    let enabled = false;
    let displayed = 0;
    let target = 0;
    let seekBusy = false;
    let mediaReady = false;
    let pending: number | null = null;
    let lastChapter = -1;
    let disposed = false;
    let started = false;
    let objectUrl: string | null = null;
    let controller: AbortController | null = null;

    const progress = () => {
      const rect = section.getBoundingClientRect();
      return clamp(-rect.top / Math.max(1, section.offsetHeight - window.innerHeight));
    };

    const seek = (time: number) => {
      if (!Number.isFinite(video.duration) || video.duration <= 0) return;
      const next = Math.max(0, Math.min(time, video.duration - 0.01));
      if (seekBusy) { pending = next; return; }
      if (Math.abs(video.currentTime - next) < 0.012) return;
      seekBusy = true;
      try { video.currentTime = next; } catch { seekBusy = false; }
    };

    const paint = (p: number) => {
      const chapter = p < .25 ? 0 : p < .5 ? 1 : p < .75 ? 2 : 3;
      if (chapter !== lastChapter) {
        lastChapter = chapter;
        section.dataset.chapter = String(chapter);
      }
      section.style.setProperty('--ap-progress', p.toFixed(4));
      if (mediaReady && enabled) seek(p * video.duration);
    };

    const tick = () => {
      raf = 0;
      if (!enabled || !visible) return;
      displayed += (target - displayed) * .19;
      if (Math.abs(target - displayed) < .001) displayed = target;
      paint(displayed);
      if (displayed !== target) raf = requestAnimationFrame(tick);
    };

    const onScroll = () => {
      target = progress();
      if (!raf && enabled && visible) raf = requestAnimationFrame(tick);
    };

    const onSeeked = () => {
      seekBusy = false;
      if (pending !== null) { const time = pending; pending = null; seek(time); }
    };

    const onLoaded = () => {
      if (disposed) return;
      mediaReady = true;
      setVideoReady(true);
      seek(progress() * video.duration);
    };

    const onError = () => {
      mediaReady = false;
      if (!disposed) { setVideoReady(false); setVideoFailed(true); }
    };

    const loadMedia = async () => {
      if (!VIDEO_ENABLED || started || !enabled) return;
      started = true;
      controller = new AbortController();
      try {
        const response = await fetch(VIDEO_SRC, { signal: controller.signal });
        if (!response.ok) throw new Error('Asset unavailable');
        const blob = await response.blob();
        if (disposed || !enabled) return;
        objectUrl = URL.createObjectURL(blob);
        video.src = objectUrl;
        video.load();
      } catch {
        if (!controller?.signal.aborted && !disposed) onError();
      }
    };

    const applyMode = () => {
      enabled = !queries.some(q => q.matches);
      section.dataset.apMode = enabled ? 'scroll' : 'static';
      if (enabled) {
        displayed = progress();
        target = displayed;
        paint(displayed);
        void loadMedia();
      } else {
        if (raf) cancelAnimationFrame(raf);
        raf = 0;
        section.dataset.chapter = '0';
        section.style.setProperty('--ap-progress', '0');
      }
    };

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) onScroll();
      else if (raf) { cancelAnimationFrame(raf); raf = 0; }
    }, { rootMargin: '30% 0px' });

    observer.observe(section);
    video.addEventListener('seeked', onSeeked);
    video.addEventListener('loadedmetadata', onLoaded);
    video.addEventListener('error', onError);
    queries.forEach(q => q.addEventListener('change', applyMode));
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    applyMode();
    return () => {
      disposed = true;
      observer.disconnect();
      queries.forEach(q => q.removeEventListener('change', applyMode));
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      video.removeEventListener('seeked', onSeeked);
      video.removeEventListener('loadedmetadata', onLoaded);
      video.removeEventListener('error', onError);
      if (raf) cancelAnimationFrame(raf);
      controller?.abort();
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, []);

  return <section ref={sectionRef} className={styles.hero} data-chapter="0" data-ap-mode="static" aria-label="Experiência cinematográfica da Algodão Pesado">
    <div className={styles.stickyScene}>
      {children}
      <video ref={videoRef} muted playsInline preload="none" tabIndex={-1} aria-hidden="true"
        className={styles.scrubVideo} data-ready={videoReady && !videoFailed ? 'true' : 'false'} />
    </div>
  </section>;
}
