import { asset } from '@/lib/asset'

const LINKS = [
  {
    href: 'mailto:matoboriivy@gmail.com',
    label: 'Email',
    stroke: true,
    icon: (
      <>
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="m2 7 10 6 10-6" />
      </>
    ),
  },
  {
    href: 'https://www.linkedin.com/in/ivy-matobori-bba4071a4/',
    label: 'LinkedIn',
    stroke: false,
    icon: (
      <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.86-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zm1.78 13.02H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" />
    ),
  },
  {
    href: 'https://github.com/i3v3y3',
    label: 'GitHub',
    stroke: false,
    icon: (
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.21 11.39.6.11.79-.26.79-.58v-2.23c-3.34.73-4.03-1.41-4.03-1.41-.55-1.39-1.34-1.76-1.34-1.76-1.09-.74.08-.73.08-.73 1.21.09 1.84 1.24 1.84 1.24 1.07 1.83 2.81 1.3 3.49 1 .11-.78.42-1.31.76-1.61-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.13-.3-.54-1.52.11-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6.01 0c2.29-1.55 3.3-1.23 3.3-1.23.65 1.66.24 2.88.12 3.18.77.84 1.23 1.91 1.23 3.22 0 4.61-2.8 5.62-5.48 5.92.43.37.82 1.1.82 2.22v3.29c0 .32.19.7.8.58A12 12 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
    ),
  },
]

/**
 * Hero. Carries the whole 15-second screener scan:
 *   name → what she does → how long → CV in hand.
 * The CV download is the one action a recruiter actually takes, so it is a
 * primary control here rather than a footer link.
 *
 * PORTRAIT: null until Ivy supplied photographs, because an empty 400px
 * placeholder was the second thing the eye landed on and read as an unfinished
 * page — worse than no portrait at all. Now filled. Set back to null rather
 * than substituting a stock image if it ever needs to come out.
 */
const PORTRAIT: string | null = '/images/about/on-site.webp'
export default function Hero() {
  return (
    <header
      className={
        PORTRAIT
          ? 'mb-16 grid grid-cols-1 items-start gap-8 md:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] md:gap-12'
          : 'mb-16 flex flex-col gap-5'
      }
    >
      <div className="flex flex-col gap-5">
        <h1 className="text-[clamp(2rem,1.2rem+3.6vw,3.15rem)] tracking-[-0.015em]">
          Hi, I&apos;m Ivy — an <span className="text-accent">embedded systems engineer</span>{' '}
          in Nairobi.
        </h1>

        <p className="max-w-[34rem] text-[clamp(1.02rem,0.97rem+0.3vw,1.15rem)] text-muted">
          I design the hardware and write the firmware for machines that have to work
          unattended, in the field, on someone else&apos;s worst day. Payment controllers on
          water ATMs, level sensors on tanks, power distribution for a satellite.
        </p>

        <div className="flex flex-wrap items-center gap-2.5">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 font-mono text-[12px] text-muted">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
            Open to instrumentation &amp; control roles
          </span>
          <span className="inline-flex items-center rounded-full border border-border bg-surface px-3 py-1 font-mono text-[12px] text-muted">
            Hardware &amp; firmware since 2022
          </span>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <a
            href={asset('/Ivy_Matobori_Resume.pdf')}
            // Without this the button lies: GitHub Pages serves application/pdf
            // with no Content-Disposition, so the browser renders it inline in a
            // new tab instead of saving it. The attribute value is the filename
            // the recruiter ends up with, so it carries her full name rather
            // than whatever the URL basename happens to be.
            download="Ivy_Matobori_Resume.pdf"
            className="inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-accent px-4 py-2 text-[15px] font-medium text-accent-text no-underline transition-opacity hover:opacity-90"
          >
            <svg
              className="h-4 w-4 shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path d="M12 3v12m0 0 4-4m-4 4-4-4M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
            </svg>
            Download CV
          </a>

          {LINKS.map((l) => (
            <a
              key={l.label}
              href={l.href}
              {...(l.href.startsWith('http')
                ? { target: '_blank', rel: 'noopener noreferrer' }
                : {})}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-lg border border-border bg-surface px-4 py-2 text-[15px] text-foreground no-underline transition-colors hover:border-accent hover:text-accent"
            >
              <svg
                className="h-4 w-4 shrink-0"
                viewBox="0 0 24 24"
                {...(l.stroke
                  ? { fill: 'none', stroke: 'currentColor', strokeWidth: 1.8 }
                  : { fill: 'currentColor' })}
                aria-hidden="true"
              >
                {l.icon}
              </svg>
              {l.label}
            </a>
          ))}
        </div>
      </div>

      {PORTRAIT && (
        <div className="w-full max-w-[22rem] overflow-hidden rounded-xl border border-border">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={asset(PORTRAIT)}
            alt="Ivy Matobori on site in a high-visibility vest"
            width={1200}
            height={1600}
            className="aspect-[3/2] w-full object-cover object-top md:aspect-[4/5]"
          />
        </div>
      )}
    </header>
  )
}
