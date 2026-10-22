'use client';

import { useEffect } from 'react';

/**
 * Motion director for this campaign only.
 * All content remains visible in server HTML and whenever JS, IO or
 * reduced-motion support is unavailable.
 */
export default function CampaignMotion() {
  useEffect(() => {
    const root = document.getElementById('algodao-pesado');
    if (!root || !('IntersectionObserver' in window)) return;

    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (preference.matches) return;

    const targets = Array.from(root.querySelectorAll<HTMLElement>('[data-ap-reveal]'));
    const sections = Array.from(root.querySelectorAll<HTMLElement>('[data-ap-spotlight]'));
    const reveal = (element: HTMLElement) => {
      element.dataset.apMotion = 'seen';
      revealObserver.unobserve(element);
    };
    const light = (element: HTMLElement) => {
      element.dataset.apLit = 'on';
      lightObserver.unobserve(element);
    };

    const revealObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) reveal(entry.target as HTMLElement);
        }
      },
      { threshold: 0.08, rootMargin: '0px 0px -8% 0px' }
    );

    const lightObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) light(entry.target as HTMLElement);
        }
      },
      { threshold: 0.08, rootMargin: '0px 0px -10% 0px' }
    );

    // Never hide an element already inside the opening viewport, nor one
    // above it (browser scroll restoration / anchor navigation).
    for (const element of targets) {
      if (element.getBoundingClientRect().top <= window.innerHeight * 0.84) {
        element.dataset.apMotion = 'seen';
      } else {
        element.dataset.apMotion = 'pending';
        revealObserver.observe(element);
      }
    }

    for (const element of sections) {
      if (element.getBoundingClientRect().top <= window.innerHeight * 0.9) {
        element.dataset.apLit = 'on';
      } else {
        lightObserver.observe(element);
      }
    }

    const onFocus = (event: FocusEvent) => {
      if (!(event.target instanceof Element)) return;
      const target = event.target.closest<HTMLElement>('[data-ap-reveal]');
      if (target?.dataset.apMotion === 'pending') reveal(target);
    };

    const onPreferenceChange = (event: MediaQueryListEvent) => {
      if (!event.matches) return;
      for (const target of targets) reveal(target);
      for (const section of sections) light(section);
    };

    root.addEventListener('focusin', onFocus);
    preference.addEventListener('change', onPreferenceChange);

    return () => {
      root.removeEventListener('focusin', onFocus);
      preference.removeEventListener('change', onPreferenceChange);
      revealObserver.disconnect();
      lightObserver.disconnect();
      // React Strict Mode can replay effects; remove transient pending
      // states instead of leaving invisible content during cleanup.
      for (const element of targets) delete element.dataset.apMotion;
      for (const section of sections) delete section.dataset.apLit;
    };
  }, []);

  return null;
}
