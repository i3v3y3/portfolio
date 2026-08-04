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
 * ACTIVE STATE. A leading accent dot, echoing the status dot in the hero. An
 * underline would collide with link hover-underline, and a pill would be the
 * fourth rounded-rect shape on a page that already has cards, tags and buttons.
 * aria-current carries it for screen readers; the dot is decorative.
 *
 * NO HAMBURGER. Four short words fit inline even at 320px, so hiding them
 * behind a tap would be worse than showing them. Making them fit does cost two
 * things below `sm`: the wordmark is hidden (every page has an h1 and the
 * footer carries her name, so identity is not lost) and the active dots go,
 * leaving colour plus aria-current to mark the current page. Measured at 375px
 * the full row overflowed by 70px — that is where these two came from.
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
          className="mr-auto hidden font-mono text-[12px] uppercase tracking-[0.14em] text-foreground no-underline transition-colors hover:text-accent sm:inline"
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
                  className={`inline-flex min-h-[44px] items-center gap-1.5 px-2 font-mono text-[11px] uppercase tracking-[0.08em] no-underline transition-colors sm:px-2 sm:text-[12px] sm:tracking-[0.14em] ${
                    active ? 'text-accent' : 'text-muted hover:text-foreground'
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className={`hidden h-1.5 w-1.5 shrink-0 rounded-full transition-colors sm:block ${
                      active ? 'bg-accent' : 'bg-transparent'
                    }`}
                  />
                  {item.label}
                </Link>
              </li>
            )
          })}
        </ul>

        <ThemeToggle />
      </nav>
    </header>
  )
}
