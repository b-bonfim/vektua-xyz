'use client';

import Image, { type ImageLoader, type ImageProps } from 'next/image';
import manifest from '@/lib/responsive-images.json';

// Static responsive files only. No Cloudflare/Next optimizer endpoint or paid binding.
// Original files are retained and are always the highest-resolution fallback.
type Entry = { sourceWidth: number; sourceSha256: string; variants: { src: string; width: number; sha256: string; bytes: number }[] };
const imageManifest = manifest as Record<string, Entry>;
type Props = Omit<ImageProps, 'src' | 'loader' | 'unoptimized'> & { src: string };

// The loader must be created on the client; server routes cannot serialize function props.
export default function ResponsiveImage({ src, alt, sizes, width, ...props }: Props) {
  const entry = imageManifest[src];
  const numericWidth = Number(width || 0);
  const responsiveSizes = sizes || (numericWidth >= 1200
    ? '(max-width: 768px) 100vw, 55vw'
    : numericWidth >= 800 ? '(max-width: 768px) 100vw, 50vw'
    : numericWidth >= 600 ? '(max-width: 640px) 90vw, (max-width: 1100px) 45vw, 25vw'
    : `${numericWidth || 320}px`);
  const loader: ImageLoader | undefined = entry ? ({ width: requested }) => {
    const sorted = entry.variants;
    return (sorted.find(candidate => candidate.width >= requested) || sorted[sorted.length - 1]).src;
  } : undefined;
  // SVG wordmarks and unmatched concept assets remain unoptimized: vinext
  // Cloudflare image optimization is not configured in this repository.
  return <Image {...props} alt={alt} src={src} width={width} sizes={responsiveSizes}
    loader={loader} unoptimized={!entry} />;
}
