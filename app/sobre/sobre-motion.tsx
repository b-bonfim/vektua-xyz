'use client';

import { useEffect } from 'react';

/**
 * Motion direction: "the idea takes form".
 * The Site 10K film owns the opening; the story below gets one-time authored
 * reveals and bounded scroll-linked depth. Without JS, all copy remains visible.
 */
type MotionKind = 'signal' | 'manifesto' | 'copy' | 'axis' | 'line' | 'story' | 'ending';

const sequences: ReadonlyArray<{ selector: string; kind: MotionKind; stagger?: number }> = [
  { selector: '.about-belief .about-tag', kind: 'signal' },
  { selector: '.about-belief h2', kind: 'manifesto' },
  { selector: '.about-belief-copy p', kind: 'copy', stagger: 105 },
  { selector: '.about-axes-copy .about-tag', kind: 'signal' },
  { selector: '.about-axes-copy h2', kind: 'axis' },
  { selector: '.about-axes-copy p', kind: 'copy', stagger: 125 },
  { selector: '.about-lines .about-tag', kind: 'signal' },
  { selector: '.about-lines h2', kind: 'manifesto' },
  { selector: '.about-line', kind: 'line', stagger: 95 },
  { selector: '.about-stories .about-tag', kind: 'signal' },
  { selector: '.about-stories h2', kind: 'manifesto' },
  { selector: '.about-stories-intro > p', kind: 'copy' },
  { selector: '.about-story', kind: 'story', stagger: 115 },
  { selector: '.about-closing-marker', kind: 'signal' },
  { selector: '.about-closing h2', kind: 'ending' },
  { selector: '.about-closing > p', kind: 'copy' },
  { selector: '.about-closing-link', kind: 'ending' },
];

const clamp = (value: number) => Math.max(0, Math.min(1, value));

export default function SobreMotion() {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>('.about-page');
    if (!root || !('IntersectionObserver' in window)) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const targets: HTMLElement[] = [];
    for (const sequence of sequences) {
      root.querySelectorAll<HTMLElement>(sequence.selector).forEach((element, index) => {
        element.classList.add('about-motion-target');
        element.dataset.aboutMotionKind = sequence.kind;
        element.style.setProperty('--about-motion-delay', String(Math.min(index * (sequence.stagger || 0), 420)) + 'ms');
        targets.push(element);
      });
    }

    const orbit = root.querySelector<HTMLElement>('.about-orbit');
    const stories = Array.from(root.querySelectorAll<HTMLElement>('.about-story'));
    const closing = root.querySelector<HTMLElement>('.about-closing');
    let active = false;
    let raf = 0;
    let observer: IntersectionObserver | null = null;

    const inProgress = (element: HTMLElement) => {
      const rect = element.getBoundingClientRect();
      if (rect.bottom < -120 || rect.top > window.innerHeight + 120) return null;
      return clamp((window.innerHeight - rect.top) / (window.innerHeight + rect.height));
    };

    const paint = () => {
      raf = 0;
      if (!active) return;
      const mobile = window.innerWidth < 768;

      // XYZ: spatial geometry responds to the viewer's movement.
      if (orbit) {
        const p = inProgress(orbit);
        if (p !== null) {
          const angle = (p - 0.5) * (mobile ? 19 : 35);
          orbit.style.setProperty('--about-orbit-angle', angle.toFixed(2) + 'deg');
          orbit.style.setProperty('--about-orbit-rise', ((0.5 - p) * (mobile ? 16 : 44)).toFixed(2) + 'px');
        }
      }

      // Project artwork moves at a different depth from its captions.
      stories.forEach((story) => {
        const p = inProgress(story);
        if (p === null) return;
        const travel = (p - 0.5) * (mobile ? 16 : 39);
        story.style.setProperty('--about-photo-travel', travel.toFixed(1) + 'px');
      });

      if (closing) {
        const p = inProgress(closing);
        if (p !== null) closing.style.setProperty('--about-close-drift', ((p - 0.5) * 18).toFixed(1) + 'px');
      }
    };

    const schedule = () => {
      if (active && !raf) raf = window.requestAnimationFrame(paint);
    };

    const disable = () => {
      active = false;
      observer?.disconnect();
      observer = null;
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      if (raf) window.cancelAnimationFrame(raf);
      raf = 0;
      root.removeAttribute('data-about-motion');
      orbit?.style.removeProperty('--about-orbit-angle');
      orbit?.style.removeProperty('--about-orbit-rise');
      closing?.style.removeProperty('--about-close-drift');
      stories.forEach((story) => story.style.removeProperty('--about-photo-travel'));
    };

    const enable = () => {
      if (active || reduceMotion.matches) return;
      active = true;
      observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          (entry.target as HTMLElement).classList.add('is-revealed');
          observer?.unobserve(entry.target);
        });
      }, { threshold: 0.07, rootMargin: '0px 0px -7% 0px' });

      targets.forEach((element) => {
        const rect = element.getBoundingClientRect();
        // Restored-scroll navigation and keyboard navigation reveal immediately.
        if (rect.top <= window.innerHeight * 0.92 && rect.bottom > 0) {
          element.classList.add('is-revealed');
        } else if (!element.classList.contains('is-revealed')) {
          observer?.observe(element);
        }
      });

      root.setAttribute('data-about-motion', 'on');
      window.addEventListener('scroll', schedule, { passive: true });
      window.addEventListener('resize', schedule);
      schedule();
    };

    const onPreferenceChange = () => {
      if (reduceMotion.matches) disable();
      else enable();
    };
    reduceMotion.addEventListener('change', onPreferenceChange);
    enable();

    return () => {
      reduceMotion.removeEventListener('change', onPreferenceChange);
      disable();
      targets.forEach((el) => {
        el.classList.remove('about-motion-target', 'is-revealed');
        delete el.dataset.aboutMotionKind;
        el.style.removeProperty('--about-motion-delay');
      });
    };
  }, []);

  return null;
}
