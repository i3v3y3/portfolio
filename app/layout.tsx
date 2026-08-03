import type { Metadata } from 'next'
import './globals.css'
import ThemeProvider from '@/components/ThemeProvider'

// No next/font here on purpose: the design uses system serif + sans, so there
// is no Google fetch at build time and offline builds work. Font stacks live
// in globals.css under @theme.

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
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-accent focus:px-4 focus:py-2 focus:text-accent-text"
          >
            Skip to content
          </a>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
