'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import styles from '../congrats.module.css';

const VIDEO_SRC = '/images/campaigns/blind-rats/blind-rats-message.mp4';

const GATES = [
  '(max-width: 720px)',
  '(orientation: portrait) and (max-width: 1024px)',
  '(orientation: portrait) and (pointer: coarse)',
  '(orientation: landscape) and (pointer: coarse) and (max-height: 560px)',
  '(prefers-reduced-motion: reduce)',
] as const;

const bands = [
  { start: 0, end: 0.21, kicker: 'Blind Rats', lineA: 'Você apoiou', lineB: 'uma cena.' },
  { start: 0.23, end: 0.46, kicker: 'Peça pequena', lineA: 'Um gesto', lineB: 'grande.' },
  { start: 0.49, end: 0.72, kicker: 'Cena local', lineA: 'Som local.', lineB: 'História local.' },
  { start: 0.75, end: 1, kicker: 'Blind Rats × Vektua XYZ', lineA: 'Valeu por fazer', lineB: 'parte dela.' },
] as const;

const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));

const smoothstep = (value: number, edge0: number, edge1: number) => {
  if (edge0 === edge1) return value < edge0 ? 0 : 1;
  const t = clamp((value - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
};

export default function BlindRatsScrollHero({ instagram }: { instagram: string }) {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const bandRefs = useRef<Array<HTMLDivElement | null>>([]);
  const railFillRef = useRef<HTMLSpanElement>(null);
  const [scrubEnabled, setScrubEnabled] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;
    if (!section || !video) return;

    let scrubOn = false;
    let heroOnScreen = false;
    let target = 0;
    let shown = 0;
    let rafId: number | null = null;
    let lastTick = 0;
    let seekBusy = false;
    let pendingTime: number | null = null;
    let objectUrl: string | null = null;
    let loadStarted = false;
    let controller: AbortController | null = null;
    let disposed = false;

    const heroProgress = () => {
      const rect = section.getBoundingClientRect();
      const distance = Math.max(1, section.offsetHeight - window.innerHeight);
      return clamp(-rect.top / distance);
    };

    const requestSeek = (time: number) => {
      if (!Number.isFinite(video.duration) || video.duration <= 0) return;
      const next = clamp(time, 0, Math.max(0, video.duration - 0.01));
      if (seekBusy) {
        pendingTime = next;
        return;
      }

      if (Math.abs(video.currentTime - next) < 0.01) return;

      seekBusy = true;
      try {
        video.currentTime = next;
      } catch {
        seekBusy = false;
      }
    };

    const updateBands = (progress: number) => {
      bands.forEach((band, index) => {
        const element = bandRefs.current[index];
        if (!element) return;

        const width = band.end - band.start;
        const fade = Math.min(0.02, width / 3);
        const enter = index === 0 ? 1 : smoothstep(progress, band.start, band.start + fade);
        const exit = index === bands.length - 1 ? 1 : 1 - smoothstep(progress, band.end - fade, band.end);
        const opacity = clamp(enter * exit);
        const ramp = Math.min(0.04, width * 0.35);
        const build = index === 0 ? 1 : clamp((progress - band.start) / Math.max(0.001, ramp));
        const direction = index % 2 === 0 ? -1 : 1;
        const x = direction * (1 - build) * 74;
        const y = (1 - build) * 34;
        const scale = 0.92 + build * 0.08;

        const nextOpacity = opacity.toFixed(3);
        const nextX = `${x.toFixed(1)}px`;
        const nextY = `${y.toFixed(1)}px`;
        const nextScale = scale.toFixed(3);

        if (element.dataset.op !== nextOpacity) {
          element.dataset.op = nextOpacity;
          element.style.opacity = nextOpacity;
        }
        if (element.dataset.x !== nextX) {
          element.dataset.x = nextX;
          element.style.setProperty('--band-x', nextX);
        }
        if (element.dataset.y !== nextY) {
          element.dataset.y = nextY;
          element.style.setProperty('--band-y', nextY);
        }
        if (element.dataset.scale !== nextScale) {
          element.dataset.scale = nextScale;
          element.style.setProperty('--band-scale', nextScale);
        }
      });

      if (railFillRef.current) {
        railFillRef.current.style.transform = `scaleY(${progress.toFixed(4)})`;
      }
    };

    const tick = (now: number) => {
      if (!scrubOn || !heroOnScreen) {
        rafId = null;
        lastTick = 0;
        return;
      }

      const delta = Math.min(100, now - (lastTick || now));
      lastTick = now;
      const smoothing = 0.16;
      shown += (target - shown) * (1 - Math.pow(1 - smoothing, delta / 16.667));

      if (Math.abs(target - shown) < 0.0005) {
        shown = target;
      }

      updateBands(shown);
      if (video.readyState >= 1 && Number.isFinite(video.duration)) {
        requestSeek(shown * video.duration);
      }

      if (shown === target) {
        rafId = null;
        lastTick = 0;
      } else {
        rafId = requestAnimationFrame(tick);
      }
    };

    const onScroll = () => {
      target = heroProgress();
      if (rafId === null && scrubOn && heroOnScreen) {
        rafId = requestAnimationFrame(tick);
      }
    };

    const loadHeroOnce = async () => {
      if (loadStarted || !scrubOn) return;
      loadStarted = true;
      controller = new AbortController();
      setVideoFailed(false);

      try {
        const response = await fetch(VIDEO_SRC, { signal: controller.signal });
        if (!response.ok) throw new Error('video fetch failed');
        const blob = await response.blob();
        if (disposed || !scrubOn) {
          loadStarted = false;
          return;
        }

        objectUrl = URL.createObjectURL(blob);
        video.src = objectUrl;
        video.load();
      } catch (error) {
        if (controller?.signal.aborted) {
          loadStarted = false;
          return;
        }
        setVideoFailed(true);
      }
    };

    const enableScrub = () => {
      if (scrubOn) return;
      scrubOn = true;
      setScrubEnabled(true);
      const progress = heroProgress();
      updateBands(progress);
      if (video.readyState >= 1 && Number.isFinite(video.duration) && video.duration > 0) {
        setVideoReady(true);
        requestSeek(progress * video.duration);
      } else {
        void loadHeroOnce();
      }
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    };

    const disableScrub = () => {
      if (!scrubOn) {
        if (!disposed) setScrubEnabled(false);
        return;
      }

      scrubOn = false;
      if (!disposed) setScrubEnabled(false);
      window.removeEventListener('scroll', onScroll);
      controller?.abort();
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
      lastTick = 0;
    };

    const mediaQueries = GATES.map((query) => window.matchMedia(query));
    const applyHeroMode = () => {
      if (mediaQueries.some((query) => query.matches)) disableScrub();
      else enableScrub();
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        heroOnScreen = entry.isIntersecting;
        if (heroOnScreen) onScroll();
        else if (rafId !== null) {
          cancelAnimationFrame(rafId);
          rafId = null;
          lastTick = 0;
        }
      },
      { rootMargin: '80% 0px' },
    );

    const onLoadedMetadata = () => {
      if (!scrubOn) return;
      setVideoReady(true);
      requestSeek(heroProgress() * video.duration);
    };

    const onSeeked = () => {
      seekBusy = false;
      if (pendingTime !== null) {
        const next = pendingTime;
        pendingTime = null;
        requestSeek(next);
      }
    };

    const onVideoError = () => {
      seekBusy = false;
      pendingTime = null;
      setVideoFailed(true);
      setVideoReady(false);
    };

    observer.observe(section);
    video.addEventListener('loadedmetadata', onLoadedMetadata);
    video.addEventListener('seeked', onSeeked);
    video.addEventListener('error', onVideoError);
    mediaQueries.forEach((query) => query.addEventListener('change', applyHeroMode));
    applyHeroMode();

    return () => {
      disposed = true;
      disableScrub();
      observer.disconnect();
      mediaQueries.forEach((query) => query.removeEventListener('change', applyHeroMode));
      video.removeEventListener('loadedmetadata', onLoadedMetadata);
      video.removeEventListener('seeked', onSeeked);
      video.removeEventListener('error', onVideoError);
      controller?.abort();
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`${styles.cinematicHero} ${scrubEnabled ? styles.cinematicScrubOn : ''}`}
      aria-labelledby="blind-rats-title"
    >
      <h1 id="blind-rats-title" className={styles.srOnly}>
        Você apoiou uma cena. Valeu por fazer parte dela.
      </h1>

      <div className={styles.cinematicStage}>
        <div
          className={`${styles.cinematicFilm} ${videoReady ? styles.cinematicReady : ''} ${
            videoFailed ? styles.cinematicFailed : ''
          }`}
          aria-hidden="true"
        >
          <div className={styles.cinematicPoster} />
          <video
            ref={videoRef}
            className={styles.cinematicVideo}
            preload="none"
            muted
            playsInline
            tabIndex={-1}
            aria-hidden="true"
          />
          <div className={styles.cinematicScrim} />
          <div className={styles.cinematicGrain} />
          {!videoReady && !videoFailed && (
            <div className={styles.cinematicLoader} aria-hidden="true">
              <span />
            </div>
          )}
        </div>

        <div className={styles.cinematicBands} aria-hidden="true">
          {bands.map((band, index) => (
            <div
              key={band.kicker}
              ref={(node) => {
                bandRefs.current[index] = node;
              }}
              className={`${styles.cinematicBand} ${styles[`cinematicBand${index + 1}`]}`}
            >
              <span className={styles.cinematicBandScrim} />
              <div className={styles.cinematicBandCopy}>
                <span className={styles.cinematicKicker}>{band.kicker}</span>
                <strong>{band.lineA}</strong>
                <strong>{band.lineB}</strong>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.cinematicRail} aria-hidden="true">
          <span className={styles.cinematicRailTrack}>
            <span ref={railFillRef} className={styles.cinematicRailFill} />
          </span>
          <span>01</span>
          <span>02</span>
          <span>03</span>
          <span>04</span>
        </div>

        <div className={styles.cinematicCue} aria-hidden="true">
          <ArrowDown size={18} />
          <span>role para atravessar a cena</span>
        </div>

        <div className={styles.cinematicStatic}>
          <div className={styles.cinematicStaticPoster} aria-hidden="true" />
          <div className={styles.cinematicStaticScrim} aria-hidden="true" />
          <div className={`container ${styles.cinematicStaticInner}`}>
            <span className={styles.cinematicKicker}>Blind Rats</span>
            <div className={styles.cinematicStaticTitle}>
              Você apoiou uma cena.
              <span>Valeu por fazer parte dela.</span>
            </div>
            <p>
              Este chaveiro da Blind Rats é uma peça pequena com um gesto grande: apoiar uma banda local
              independente. Obrigado por levar esse som com você.
            </p>
            <a
              className={styles.cinematicStaticCta}
              href={instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Seguir @blindratsband no Instagram; abre em uma nova guia"
            >
              Seguir @blindratsband
              <ArrowUpRight size={18} aria-hidden="true" />
            </a>
          </div>
        </div>

        <span className={styles.srOnly} aria-live="polite">
          {videoFailed ? 'A experiência em vídeo não carregou. A versão estática continua disponível.' : ''}
        </span>
      </div>
    </section>
  );
}
