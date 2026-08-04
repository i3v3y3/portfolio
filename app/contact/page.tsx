import type { Metadata } from 'next'
import PageShell from '@/components/PageShell'
import { asset } from '@/lib/asset'

export const metadata: Metadata = {
  title: 'Contact — Ivy Matobori',
  description:
    'Get in touch with Ivy Matobori — embedded systems and instrumentation engineer in Nairobi, Kenya.',
}

/**
 * Contact. Deliberately no form: this is a static export with no server, so a
 * form would need a third-party endpoint, and the CSP on the host blocks
 * external posts anyway. Direct channels are also what an engineer actually
 * wants — a recruiter can reply from their own client with the thread intact.
 */

const CHANNELS = [
  {
    label: 'Email',
    value: 'matoboriivy@gmail.com',
    href: 'mailto:matoboriivy@gmail.com',
    note: 'Best for anything with detail in it.',
  },
  {
    label: 'LinkedIn',
    value: 'ivy-matobori',
    href: 'https://www.linkedin.com/in/ivy-matobori-bba4071a4/',
    note: 'Roles and dates, and posts from while the work was happening.',
  },
  {
    label: 'GitHub',
    value: 'i3v3y3',
    href: 'https://github.com/i3v3y3',
    note: 'Schematics, layouts and firmware.',
  },
]

export default function ContactPage() {
  return (
    <PageShell
      title="Contact"
      intro="Open to instrumentation and control roles, on site in Nairobi or remote. The fastest route is email."
    >
      <ul className="mb-12 flex flex-col divide-y divide-border border-y border-border">
        {CHANNELS.map((c) => (
          <li key={c.label} className="flex flex-col gap-1 py-4 sm:flex-row sm:items-baseline sm:gap-6">
            <span className="w-24 shrink-0 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-dim">
              {c.label}
            </span>
            <span className="flex flex-col gap-0.5">
              <a
                href={c.href}
                {...(c.href.startsWith('http')
                  ? { target: '_blank', rel: 'noopener noreferrer' }
                  : {})}
                className="self-start text-[16px] text-accent no-underline hover:underline"
              >
                {c.value}
              </a>
              <span className="text-[14px] text-muted-dim">{c.note}</span>
            </span>
          </li>
        ))}
      </ul>

      <a
        href={asset('/Ivy_Matobori_Resume.pdf')}
        target="_blank"
        rel="noopener noreferrer"
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
          <path d="M14 3h7v7M10 14 21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
        </svg>
        View Resume
      </a>
    </PageShell>
  )
}
