'use client';

import { useEffect } from 'react';
import styles from './paxx.module.css';

type RevealKind = 'rise' | 'slide' | 'card' | 'frame' | 'spark' | 'pop';

const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value));

/**
 * Progressive enhancement: content is visible by default in server-rendered HTML.
 * Only motion-eligible clients opt into reveal animations. Reduced motion and
 * Save-Data keep the normal, fully readable page.
 */
export default function PaxxReveals() {
  useEffect(() => {
    const root = document.getElementById('paxx-world');
    if (!root) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const dataSaver =
      (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData === true;

    const specs: { selector: string; kind: RevealKind; step?: number }[] = [
      { selector: `.${styles.letterMarker}`, kind: 'rise' },
      { selector: `.${styles.letterCard}`, kind: 'card' },
      { selector: `.${styles.letterCard} h2`, kind: 'rise' },
      { selector: `.${styles.letterCard} p`, kind: 'rise', step: 90 },
      { selector: `.${styles.paintingCopy} .${styles.sectionEyebrow}`, kind: 'slide' },
      { selector: `.${styles.paintingCopy} h2`, kind: 'slide' },
      { selector: `.${styles.paintingCopy} > p:not(.${styles.sectionEyebrow})`, kind: 'slide', step: 100 },
      { selector: `.${styles.paintingNote}`, kind: 'slide' },
      { selector: `.${styles.artFrame}`, kind: 'frame' },
      { selector: `.${styles.wishSpark}`, kind: 'spark' },
      { selector: `.${styles.wishInner} .${styles.sectionEyebrow}`, kind: 'rise' },
      { selector: `.${styles.wishInner} h2`, kind: 'rise' },
      { selector: `.${styles.wishInner} > p:not(.${styles.sectionEyebrow})`, kind: 'rise' },
      { selector: `.${styles.wishAction}`, kind: 'pop' },
      { selector: `.${styles.followAccent}`, kind: 'spark' },
      { selector: `.${styles.followInner} .${styles.sectionEyebrow}`, kind: 'rise' },
      { selector: `.${styles.followInner} h2`, kind: 'rise' },
      { selector: `.${styles.followInner} > p:not(.${styles.sectionEyebrow})`, kind: 'rise' },
      { selector: `.${styles.primaryCta}`, kind: 'pop' },
      { selector: `.${styles.handle}`, kind: 'rise' },
    ];

    const targets: HTMLElement[] = [];
    const seen = new Set<HTMLElement>();
    for (const spec of specs) {
      root.querySelectorAll<HTMLElement>(spec.selector).forEach((element, index) => {
        if (seen.has(element)) return;
        seen.add(element);
        element.dataset.paxxReveal = spec.kind;
        if (spec.step) {
          element.style.setProperty('--paxx-reveal-delay', `${Math.min(index * spec.step, 360)}ms`);
        }
        targets.push(element);
      });
    }

    const artFrame = root.querySelector<HTMLElement>(`.${styles.artFrame}`);
    let enabled = false;
    let observer: IntersectionObserver | null = null;
    let raf = 0;

    const show = (element: HTMLElement) => {
      element.dataset.paxxVisible = 'true';
      observer?.unobserve(element);
    };

    const updateDepth = () => {
      raf = 0;
      if (!enabled || !artFrame) return;
      const bounds = artFrame.getBoundingClientRect();
      if (bounds.bottom < -120 || bounds.top > window.innerHeight + 120) return;
      const position = (bounds.top + bounds.height / 2 - window.innerHeight / 2) / window.innerHeight;
      root.style.setProperty('--paxx-frame-drift', `${(-clamp(position, -1, 1) * 24).toFixed(1)}px`);
    };

    const queueDepth = () => {
      if (enabled && !raf) raf = window.requestAnimationFrame(updateDepth);
    };

    const onFocus = (event: FocusEvent) => {
      if (!(event.target instanceof Element)) return;
      let node: Element | null = event.target;
      while (node && node !== root) {
        if (node instanceof HTMLElement && node.dataset.paxxReveal) show(node);
        node = node.parentElement;
      }
    };

    const enable = () => {
      if (enabled) return;
      enabled = true;
      // Preserve restored scroll positions and immediately-visible content.
      targets.forEach((element) => {
        const bounds = element.getBoundingClientRect();
        if (bounds.bottom <= 0 || (bounds.top < window.innerHeight * 0.94 && bounds.bottom > 0)) {
          show(element);
        }
      });
      root.dataset.paxxMotion = 'true';
      if ('IntersectionObserver' in window) {
        observer = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) show(entry.target as HTMLElement);
          });
        }, { rootMargin: '0px 0px -8% 0px', threshold: 0.07 });
        targets.forEach((element) => {
          if (!element.dataset.paxxVisible) observer?.observe(element);
        });
      } else {
        targets.forEach(show);
      }
      window.addEventListener('scroll', queueDepth, { passive: true });
      window.addEventListener('resize', queueDepth);
      root.addEventListener('focusin', onFocus);
      queueDepth();
    };

    const disable = () => {
      if (!enabled) return;
      enabled = false;
      observer?.disconnect();
      observer = null;
      if (raf) window.cancelAnimationFrame(raf);
      raf = 0;
      window.removeEventListener('scroll', queueDepth);
      window.removeEventListener('resize', queueDepth);
      root.removeEventListener('focusin', onFocus);
      delete root.dataset.paxxMotion;
      root.style.removeProperty('--paxx-frame-drift');
    };

    const check = () => {
      if (reduced.matches || dataSaver) disable();
      else enable();
    };

    reduced.addEventListener('change', check);
    check();

    return () => {
      disable();
      reduced.removeEventListener('change', check);
      targets.forEach((element) => {
        delete element.dataset.paxxReveal;
        delete element.dataset.paxxVisible;
        element.style.removeProperty('--paxx-reveal-delay');
      });
    };
  }, []);

  return null;
}
