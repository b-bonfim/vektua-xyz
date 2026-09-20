import type { MetadataRoute } from 'next';

// The repository still hosts a non-commercial prototype; enable crawling only after
// the Founder approves the public launch and the canonical domain is confirmed.
export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: '*', disallow: '/' } };
}
