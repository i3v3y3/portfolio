import type { MetadataRoute } from 'next'

export const dynamic = 'force-static'

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? ''

/**
 * Web manifest — what an installed shortcut looks like on a phone home screen.
 *
 * Small thing, but a recruiter who saves the link on a phone gets her name and
 * face instead of a screenshot of the page with a generic globe on it.
 *
 * `display: browser` on purpose. This is a document, not an app; standalone
 * would strip the address bar and make the back gesture behave oddly for no
 * benefit.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Ivy Matobori — Instrumentation & Control Engineer',
    short_name: 'Ivy Matobori',
    description:
      'Instrumentation and control engineer in Nairobi. Hardware and firmware for machines that run unattended in the field.',
    start_url: `${BASE}/`,
    scope: `${BASE}/`,
    display: 'browser',
    background_color: '#f7f8f8',
    theme_color: '#0f766e',
    icons: [
      { src: `${BASE}/icon-192.png`, sizes: '192x192', type: 'image/png' },
      { src: `${BASE}/icon-512.png`, sizes: '512x512', type: 'image/png' },
      { src: `${BASE}/apple-touch-icon.png`, sizes: '180x180', type: 'image/png' },
    ],
  }
}
