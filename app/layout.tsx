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

/**
 * Where the site actually lives.
 *
 * This was hardcoded to a domain that does not resolve, which meant every
 * og:url pointed somewhere dead — so a recruiter forwarding the link to a
 * hiring manager got an unfurl for a nonexistent site. It now derives from the
 * same env var that drives basePath, so the two cannot disagree: unset locally,
 * "/portfolio" on Pages, empty on a custom domain.
 *
 * To move to ivymatobori.com later: set SITE_ORIGIN below and drop
 * NEXT_PUBLIC_BASE_PATH from the workflow. Nothing else changes.
 */
const SITE_ORIGIN = 'https://i3v3y3.github.io'
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? ''
const SITE_URL = `${SITE_ORIGIN}${BASE_PATH}/`

// Her résumé, her hero and every role she is applying for say Instrumentation
// & Control. The title is what Google prints and what the tab reads, so it
// should not be the one place that says something else.
const TITLE = 'Ivy Matobori — Instrumentation & Control Engineer'
const BLURB =
  'Instrumentation and control engineer in Nairobi. Hardware and firmware for machines that run unattended in the field: payment controllers, level sensing, satellite power distribution.'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: BLURB,
  authors: [{ name: 'Ivy Matobori' }],
  alternates: { canonical: SITE_URL },
  openGraph: {
    title: TITLE,
    description: 'Hardware and firmware for machines that have to work unattended.',
    url: SITE_URL,
    siteName: 'Ivy Matobori',
    locale: 'en_KE',
    type: 'website',
    images: [
      {
        // Absolute, not `${BASE_PATH}/og.jpg`. metadataBase already carries the
        // base path and Next concatenates rather than URL-resolves, so the
        // relative form produced /portfolio/portfolio/og.jpg.
        url: `${SITE_URL}og.jpg`,
        width: 1200,
        height: 630,
        alt: 'Ivy Matobori, Instrumentation & Control Engineer, Nairobi — a payment controller on the bench',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: 'Hardware and firmware for machines that have to work unattended.',
    images: [`${SITE_URL}og.jpg`],
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
