'use client';

import { useEffect } from 'react';

const clamp = (value: number) => Math.min(1, Math.max(0, value));

/**
 * Orion's scroll narrative: ink becomes a drawing, then a lasting artwork.
 * The DOM is fully readable without JS and whenever reduced motion is chosen.
 */
export function OrionScrollMotion() {
  useEffect(() => {
    const root = document.getElementById('orion-campaign');
    if (!root || !('IntersectionObserver' in window)) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (reduceMotion.matches) return;

    const targets = Array.from(root.querySelectorAll<HTMLElement>('[data-orion-reveal]'));
    const markVisible = (element: HTMLElement) => {
      element.dataset.orionVisible = 'true';
    };

    // Hydration must never conceal a section that has already reached the viewport.
    for (const element of targets) {
      const rect = element.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.94 && rect.bottom > 0) {
        markVisible(element);
      }
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const element = entry.target as HTMLElement;
          markVisible(element);
          observer.unobserve(element);
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.04 },
    );

    for (const element of targets) {
      if (!element.dataset.orionVisible) observer.observe(element);
    }

    const hero = root.querySelector<HTMLElement>('[data-orion-hero]');
    const stage = root.querySelector<HTMLElement>('[data-orion-stage]');
    const pinned = window.matchMedia('(min-width: 900px) and (min-height: 650px)');
    let frame = 0;

    const update = () => {
      frame = 0;
      const docHeight = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      root.style.setProperty('--orion-scroll-progress', clamp(window.scrollY / docHeight).toFixed(4));

      if (hero && window.innerWidth > 1040) {
        const rect = hero.getBoundingClientRect();
        if (rect.bottom > 0 && rect.top < window.innerHeight) {
          // Larger, bounded depth difference between the illustration and copy.
          const shift = Math.min(74, Math.max(0, -rect.top * 0.145));
          root.style.setProperty('--orion-hero-shift', `${shift.toFixed(1)}px`);
          root.style.setProperty('--orion-copy-shift', `${(shift * 0.37).toFixed(1)}px`);
        }
      } else {
        root.style.removeProperty('--orion-hero-shift');
        root.style.removeProperty('--orion-copy-shift');
      }

      if (stage && pinned.matches) {
        root.dataset.orionStage = 'pinned';
        const rect = stage.getBoundingClientRect();
        const header = root.querySelector<HTMLElement>('header');
        const top = header?.getBoundingClientRect().height ?? 104;
        const scrollLength = Math.max(1, rect.height - window.innerHeight);
        const progress = clamp((top - rect.top) / scrollLength);
        const step = progress < 1 / 3 ? 0 : progress < 2 / 3 ? 1 : 2;
        stage.dataset.orionStep = String(step);
        stage.style.setProperty('--orion-stage-progress', progress.toFixed(4));
      } else {
        root.removeAttribute('data-orion-stage');
        stage?.removeAttribute('data-orion-step');
        stage?.style.removeProperty('--orion-stage-progress');
      }
    };

    const queueUpdate = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    const revealFocused = (event: FocusEvent) => {
      if (!(event.target instanceof Element)) return;
      const target = event.target.closest<HTMLElement>('[data-orion-reveal]');
      if (target && root.contains(target)) {
        markVisible(target);
        observer.unobserve(target);
      }
    };

    root.addEventListener('focusin', revealFocused);
    window.addEventListener('scroll', queueUpdate, { passive: true });
    window.addEventListener('resize', queueUpdate);
    root.dataset.orionMotion = 'ready';
    update();

    return () => {
      observer.disconnect();
      root.removeEventListener('focusin', revealFocused);
      window.removeEventListener('scroll', queueUpdate);
      window.removeEventListener('resize', queueUpdate);
      if (frame) cancelAnimationFrame(frame);
      root.removeAttribute('data-orion-motion');
      root.removeAttribute('data-orion-stage');
      root.style.removeProperty('--orion-scroll-progress');
      root.style.removeProperty('--orion-hero-shift');
      root.style.removeProperty('--orion-copy-shift');
      stage?.removeAttribute('data-orion-step');
      stage?.style.removeProperty('--orion-stage-progress');
    };
  }, []);

  return null;
}
