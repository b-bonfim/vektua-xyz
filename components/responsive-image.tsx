'use client';

import type { ComponentPropsWithoutRef } from 'react';
import manifest from '@/lib/responsive-images.json';

// Issue #8 browser evidence: vinext 1.0.0-beta.5 next/image ignored custom
// srcSet and forced loading="lazy" even on the high-priority hero and PDP.
// Serve deterministic local WebP variants via the browser's native srcSet;
// no on-demand image endpoint, Cloudflare paid binding, or third-party CDN.
type Variant = { src: string; width: number; sha256: string; bytes: number };
type Entry = { sourceWidth: number; sourceSha256: string; variants: Variant[] };
const imageManifest = manifest as Record<string, Entry>;
type Props = Omit<ComponentPropsWithoutRef<'img'>, 'src' | 'alt'> & { src: string; alt: string };

export default function ResponsiveImage({ src, alt, sizes, width, loading, fetchPriority, decoding, ...props }: Props) {
  const entry = imageManifest[src];
  const numericWidth = Number(width || 0);
  const responsiveSizes = sizes || (numericWidth >= 1200
    ? '(max-width: 768px) 100vw, 55vw'
    : numericWidth >= 800 ? '(max-width: 768px) 100vw, 50vw'
    : numericWidth >= 600 ? '(max-width: 640px) 90vw, (max-width: 1100px) 45vw, 25vw'
    : `${numericWidth || 320}px`);
  const hasVariants = Boolean(entry && entry.variants.length > 1);
  const srcSet = hasVariants ? entry.variants.map(variant => `${variant.src} ${variant.width}w`).join(', ') : undefined;
  // Existing explicit lazy requests stay lazy; LCP/above-fold images without
  // loading="lazy" remain eager, including fetchPriority="high" hero.
  const effectiveLoading = loading || 'eager';
  return (
    // eslint-disable-next-line @next/next/no-img-element -- Vinext beta drops next/image srcSet and lazifies LCP; this scoped wrapper implements measured native responsive variants, not a blanket lint suppression.
    <img {...props} src={src} srcSet={srcSet} sizes={hasVariants ? responsiveSizes : undefined}
      alt={alt} width={width} loading={effectiveLoading} fetchPriority={fetchPriority}
      decoding={decoding || 'async'} />
  );
}
