import type { MetadataRoute } from 'next'

export const dynamic = 'force-static'

const ORIGIN = 'https://i3v3y3.github.io'
const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? ''

/**
 * robots.txt. Everything is public and meant to be found, so the only real
 * content here is the sitemap pointer — that is how a crawler discovers the
 * routes that nothing links to from outside.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/' }],
    sitemap: `${ORIGIN}${BASE}/sitemap.xml`,
  }
}
