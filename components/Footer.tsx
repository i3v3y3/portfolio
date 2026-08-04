import Link from 'next/link'
import { asset } from '@/lib/asset'

const NAV = [
  { label: 'Work', href: '/work/' },
  { label: 'Gallery', href: '/gallery/' },
  { label: 'About', href: '/about/' },
  { label: 'Contact', href: '/contact/' },
]

const SOCIAL = [
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/ivy-matobori-bba4071a4/',
    path: 'M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.86-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zm1.78 13.02H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z',
  },
  {
    label: 'GitHub',
    href: 'https://github.com/i3v3y3',
    path: 'M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.21 11.39.6.11.79-.26.79-.58v-2.23c-3.34.73-4.03-1.41-4.03-1.41-.55-1.39-1.34-1.76-1.34-1.76-1.09-.74.08-.73.08-.73 1.21.09 1.84 1.24 1.84 1.24 1.07 1.83 2.81 1.3 3.49 1 .11-.78.42-1.31.76-1.61-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.13-.3-.54-1.52.11-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6.01 0c2.29-1.55 3.3-1.23 3.3-1.23.65 1.66.24 2.88.12 3.18.77.84 1.23 1.91 1.23 3.22 0 4.61-2.8 5.62-5.48 5.92.43.37.82 1.1.82 2.22v3.29c0 .32.19.7.8.58A12 12 0 0 0 24 12c0-6.63-5.37-12-12-12z',
  },
]

/**
 * Footer: copyright left, navigation centre, icons right, on one line.
 *
 * Sans and sentence case rather than the mono uppercase used in the header —
 * the footer should recede, and mono uppercase at this position competes with
 * the nav instead of sitting under it.
 *
 * The link list carries the resume alongside the four routes. A footer nav is
 * allowed to hold more than the header does, and the resume is the destination
 * reaching from the bottom of any page.
 *
 * Below `sm` the three zones stack and centre; at 320px they will not sit on
 * one line without shrinking the type past readable.
 */
export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="mt-20 border-t border-border pt-6 text-[13px] text-muted-dim">
      <div className="flex flex-col items-center gap-5 sm:flex-row sm:justify-between sm:gap-6">
        <p className="order-3 shrink-0 sm:order-1">© {year} Ivy Matobori</p>

        <nav aria-label="Footer" className="order-1 sm:order-2">
          <ul className="flex flex-wrap justify-center gap-x-5 gap-y-2">
            {NAV.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="text-muted no-underline transition-colors hover:text-accent"
                >
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              {/* asset() — a raw <a> gets no basePath, and the resume 404s without it. */}
              <a
                href={asset('/Ivy_Matobori_Resume.pdf')}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted no-underline transition-colors hover:text-accent"
              >
                Resume
              </a>
            </li>
          </ul>
        </nav>

        <ul className="order-2 flex shrink-0 items-center gap-4 sm:order-3">
          {SOCIAL.map((s) => (
            <li key={s.label}>
              <a
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="block text-muted-dim transition-colors hover:text-accent"
              >
                <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="currentColor" aria-hidden="true">
                  <path d={s.path} />
                </svg>
              </a>
            </li>
          ))}
          <li>
            <a
              href="mailto:matoboriivy@gmail.com"
              aria-label="Email"
              className="block text-muted-dim transition-colors hover:text-accent"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-[18px] w-[18px]"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                aria-hidden="true"
              >
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="m2 7 10 6 10-6" />
              </svg>
            </a>
          </li>
        </ul>
      </div>
    </footer>
  )
}
