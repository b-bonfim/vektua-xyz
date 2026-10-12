'use client';

import { useEffect } from 'react';

/** A light scroll-directed scene. All content is visible without JavaScript. */
export default function PadocaMotion() {
  useEffect(() => {
    const root = document.getElementById('padoca-world');
    const scene = root?.querySelector<HTMLElement>('[data-padoca-scene]');
    if (!root || !scene || !('requestAnimationFrame' in window)) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const desktop = window.matchMedia('(min-width: 880px) and (min-height: 600px)');
    if (reduced.matches) return;

    let frame = 0;
    const clamp = (value: number) => Math.max(0, Math.min(1, value));

    const update = () => {
      frame = 0;
      if (!desktop.matches) {
        root.dataset.padocaChapter = '0';
        root.style.removeProperty('--padoca-rise');
        root.style.removeProperty('--padoca-rotate');
        root.style.removeProperty('--padoca-scale');
        return;
      }
      const rect = scene.getBoundingClientRect();
      const range = Math.max(1, rect.height - window.innerHeight);
      const progress = clamp(-rect.top / range);
      root.style.setProperty('--padoca-rise', (-progress * 78).toFixed(1) + 'px');
      root.style.setProperty('--padoca-rotate', (progress * -4).toFixed(2) + 'deg');
      root.style.setProperty('--padoca-scale', (1 + progress * 0.16).toFixed(3));
      const chapter = progress < 0.33 ? '0' : progress < 0.68 ? '1' : '2';
      if (root.dataset.padocaChapter !== chapter) root.dataset.padocaChapter = chapter;
    };

    const queue = () => { if (!frame) frame = window.requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', queue, { passive: true });
    window.addEventListener('resize', queue);
    desktop.addEventListener('change', queue);

    const sections = root.querySelectorAll<HTMLElement>('[data-padoca-reveal]');
    let observer: IntersectionObserver | undefined;
    if ('IntersectionObserver' in window) {
      observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).dataset.padocaVisible = 'true';
            observer?.unobserve(entry.target);
          }
        });
      }, { rootMargin: '0px 0px -10% 0px' });
      sections.forEach((element) => observer?.observe(element));
    }

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', queue);
      window.removeEventListener('resize', queue);
      desktop.removeEventListener('change', queue);
      observer?.disconnect();
    };
  }, []);
  return null;
}
