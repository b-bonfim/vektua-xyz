'use client';

import { useEffect } from 'react';

/**
 * Scoped progressive enhancement for the Orion Tattoo thank-you page.
 * All content is visible without JS, with reduced motion or when
 * IntersectionObserver is unavailable. No new animation dependency.
 */
export function OrionScrollMotion() {
  useEffect(() => {
    const root = document.getElementById('orion-campaign');
    if (!root || !('IntersectionObserver' in window)) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (reducedMotion.matches) return;

    const targets = Array.from(
      root.querySelectorAll<HTMLElement>('[data-orion-reveal]'),
    );

    // Keep any content already onscreen visible before enabling offscreen reveals.
    for (const target of targets) {
      const rect = target.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.9 && rect.bottom > 0) {
        target.dataset.orionVisible = 'true';
      }
    }

    root.dataset.orionMotion = 'ready';

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const target = entry.target as HTMLElement;
          target.dataset.orionVisible = 'true';
          observer.unobserve(target);
        }
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.05 },
    );

    for (const target of targets) {
      if (!target.dataset.orionVisible) observer.observe(target);
    }

    // Keyboard users can move focus into a section before scroll observers fire.
    const onFocus = (event: FocusEvent) => {
      if (!(event.target instanceof Element)) return;
      const target = event.target.closest<HTMLElement>('[data-orion-reveal]');
      if (!target || !root.contains(target)) return;
      target.dataset.orionVisible = 'true';
      observer.unobserve(target);
    };

    const hero = root.querySelector<HTMLElement>('[data-orion-hero]');
    let frame = 0;
    const updateScroll = () => {
      frame = 0;
      const travel = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const progress = Math.min(1, Math.max(0, window.scrollY / travel));
      root.style.setProperty('--orion-scroll-progress', progress.toFixed(4));

      // A restrained ink-and-hair depth cue, limited to desktop and the Hero.
      if (window.innerWidth > 1040 && hero) {
        const rect = hero.getBoundingClientRect();
        if (rect.bottom > 0 && rect.top < window.innerHeight) {
          const shift = Math.min(18, Math.max(0, -rect.top * 0.035));
          root.style.setProperty('--orion-hero-shift', `${shift.toFixed(1)}px`);
        }
      } else {
        root.style.removeProperty('--orion-hero-shift');
      }
    };

    const queueUpdate = () => {
      if (frame === 0) frame = window.requestAnimationFrame(updateScroll);
    };

    root.addEventListener('focusin', onFocus);
    window.addEventListener('scroll', queueUpdate, { passive: true });
    window.addEventListener('resize', queueUpdate);
    queueUpdate();

    return () => {
      observer.disconnect();
      root.removeEventListener('focusin', onFocus);
      window.removeEventListener('scroll', queueUpdate);
      window.removeEventListener('resize', queueUpdate);
      if (frame) window.cancelAnimationFrame(frame);
      root.removeAttribute('data-orion-motion');
      root.style.removeProperty('--orion-scroll-progress');
      root.style.removeProperty('--orion-hero-shift');
    };
  }, []);

  return null;
}
