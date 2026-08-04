import type { MetadataRoute } from 'next'
import { getEveryProject } from '@/lib/projects'

/**
 * Sitemap.
 *
 * layout.tsx has always declared `robots: { index: true, follow: true }`, but
 * that is only a permission — Next emits sitemap.xml only if this file exists,
 * and without it both /sitemap.xml and /robots.txt were 404. A recruiter's
 * first move after reading a CV is to search the name, so being crawlable is
 * not optional here.
 *
 * `dynamic = 'force-static'` because output:"export" has no server to generate
 * this per request.
 */
export const dynamic = 'force-static'

const ORIGIN = 'https://i3v3y3.github.io'
const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? ''
const url = (p: string) => `${ORIGIN}${BASE}${p}`

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  const routes = [
    { path: '/', priority: 1.0 },
    { path: '/work/', priority: 0.9 },
    { path: '/gallery/', priority: 0.7 },
    { path: '/about/', priority: 0.7 },
    { path: '/contact/', priority: 0.6 },
  ].map((r) => ({
    url: url(r.path),
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: r.priority,
  }))

  const projects = getEveryProject().map((p) => ({
    url: url(`/work/${p.slug}/`),
    lastModified: now,
    changeFrequency: 'yearly' as const,
    priority: 0.8,
  }))

  return [...routes, ...projects]
}
