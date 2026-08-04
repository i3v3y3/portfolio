import type { Metadata } from 'next'
import { IBM_Plex_Sans, IBM_Plex_Serif, IBM_Plex_Mono } from 'next/font/google'
import './globals.css'
import ThemeProvider from '@/components/ThemeProvider'
import Nav from '@/components/Nav'

/**
 * Type system: IBM Plex, one family in three voices.
 *
 *   Serif  → display (h1, section headings)
 *   Sans   → body
 *   Mono   → labels, dates, stack pills, anything tabular
 *
 * Plex was commissioned by IBM for engineering and technical documentation,
 * which is the right heritage for a hardware portfolio, and the three cuts are
 * designed to sit together. Deliberately not Inter/Roboto/Open Sans/Poppins —
 * those read as template defaults.
 *
 * next/font downloads at build time and self-hosts the result, so there is no
 * third-party request at runtime and no external origin in the CSP. The build
 * itself does need network access.
 */
const plexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-plex-sans',
  display: 'swap',
})
const plexSerif = IBM_Plex_Serif({
  subsets: ['latin'],
  weight: ['500', '600'],
  variable: '--font-plex-serif',
  display: 'swap',
})
const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-plex-mono',
  display: 'swap',
})

const SITE_URL = 'https://ivymatobori.com' // TODO: confirm domain before deploy

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'Ivy Matobori — Embedded Systems Engineer',
  description:
    'Embedded systems engineer in Nairobi. Hardware and firmware for machines that run unattended in the field: payment controllers, level sensors, satellite power distribution.',
  authors: [{ name: 'Ivy Matobori' }],
  openGraph: {
    title: 'Ivy Matobori — Embedded Systems Engineer',
    description:
      'Hardware and firmware for machines that run unattended in the field.',
    url: SITE_URL,
    siteName: 'Ivy Matobori',
    locale: 'en_KE',
    type: 'website',
    // NOTE: no og image yet. Shipping without one is correct — the source repo
    // had Jeff's og.png, and an unreplaced card would show the wrong person in
    // every LinkedIn unfurl.
  },
  robots: { index: true, follow: true },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${plexSans.variable} ${plexSerif.variable} ${plexMono.variable}`}
    >
      <body>
        <ThemeProvider>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-accent focus:px-4 focus:py-2 focus:text-accent-text"
          >
            Skip to content
          </a>
          <Nav />
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
