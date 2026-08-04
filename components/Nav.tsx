'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import ThemeToggle from '@/components/ThemeToggle'

const ITEMS = [
  { href: '/work/', label: 'Work' },
  { href: '/gallery/', label: 'Gallery' },
  { href: '/about/', label: 'About' },
  { href: '/contact/', label: 'Contact' },
]

/**
 * Top-level navigation.
 *
 * TYPE. Mono, uppercase, letter-spaced — the same treatment already used for
 * section eyebrows and stack pills. The reference portfolios both run plain
 * sans nav links; borrowing their shape but not their voice keeps this reading
 * as her site rather than a copy of theirs, and costs nothing because the
 * design system already had the idiom.
 *
 * ACTIVE STATE. Three cues: accent colour, an underline, and a heavier weight.
 * Colour alone fails WCAG 1.4.1 for anyone who cannot distinguish the accent
 * from the muted grey, so at least one non-colour cue has to survive at every
 * width. An earlier version used a leading dot, which cost ~12px per item and
 * therefore had to be hidden below `sm` — leaving phones with colour only.
 * The underline is a border on an inner span, so it costs no horizontal space
 * and works at 320px. No collision with hover, which changes colour only.
 *
 * Not animated. This is a static export: every nav click is a fresh document,
 * so there is no state to transition between and a slide would just be a flash.
 *
 * NO HAMBURGER. Four short words fit inline even at 320px, so hiding them
 * behind a tap would be worse than showing them. Fitting them does cost the
 * wordmark below `sm` — every page has an h1 and the footer carries her name,
 * so identity is not lost. Measured at 375px the full row overflowed by 70px.
 *
 * MATCHING. Every route here is a directory (trailingSlash: true), so a project
 * page at /work/quepay-controller/ must light up "Work". Hence startsWith
 * rather than equality — but "/" would then prefix-match everything, so home is
 * exact and lives on the name instead.
 */
export default function Nav() {
  const pathname = usePathname() ?? '/'
  // basePath is stripped from usePathname() in app router, so compare bare.
  const isActive = (href: string) => pathname === href || pathname.startsWith(href)

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-sm">
      <nav
        aria-label="Primary"
        className="mx-auto flex max-w-[58rem] items-center gap-4 px-5 py-3 sm:px-8"
      >
        <Link
          href="/"
          aria-current={pathname === '/' ? 'page' : undefined}
          // Bold sans sentence-case, against mono uppercase links. Set in the
        // same style as the links it sat beside, the name read as a fifth nav
        // item rather than the wordmark anchoring the row.
        className="mr-auto hidden text-[15px] font-semibold tracking-[-0.01em] text-foreground no-underline transition-colors hover:text-accent sm:inline"
        >
          Ivy Matobori
        </Link>

        <ul className="mr-auto flex items-center gap-0 sm:mr-0 sm:gap-2">
          {ITEMS.map((item) => {
            const active = isActive(item.href)
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={active ? 'page' : undefined}
                  className={`inline-flex min-h-[44px] items-center px-2 font-mono text-[11px] uppercase tracking-[0.08em] no-underline transition-colors sm:text-[12px] sm:tracking-[0.14em] ${
                    active ? 'font-medium text-accent' : 'text-muted hover:text-foreground'
                  }`}
                >
                  {/* Underline on an inner span so it hugs the text rather than
                      sitting at the floor of the 44px touch target. */}
                  <span
                    className={`border-b-2 pb-0.5 transition-colors ${
                      active ? 'border-accent' : 'border-transparent'
                    }`}
                  >
                    {item.label}
                  </span>
                </Link>
              </li>
            )
          })}
        </ul>

        {/* A rule rather than a literal "|" glyph: a pipe inherits the font's
            own height and baseline, so it sits low and short next to icons.
            Hidden below sm, where the row is tight enough that the gap alone
            separates them. */}
        <span
          aria-hidden="true"
          className="hidden h-5 w-px shrink-0 bg-border sm:block"
        />

        <ThemeToggle />
      </nav>
    </header>
  )
}
