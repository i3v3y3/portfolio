import { asset } from '@/lib/asset'

const LINKS = [
  { label: 'Email', href: 'mailto:matoboriivy@gmail.com', external: false },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/ivy-matobori-bba4071a4/',
    external: true,
  },
  { label: 'GitHub', href: 'https://github.com/i3v3y3', external: true },
  // asset() because this is a raw <a> — basePath is not applied for us, and
  // without it the CV 404s on the Pages deploy. Opens in a tab like the other
  // CV links, so a reader previews rather than having a file dropped on them.
  { label: 'CV', href: asset('/Ivy_Matobori_Resume.pdf'), external: true },
]

/**
 * Footer.
 *
 * The bottom of a page is where someone who has finished reading decides
 * whether to act, so the links are the point — this used to be one line of
 * dead text at exactly that moment.
 *
 * Deliberately absent: a tagline (the hero already states positioning in full,
 * and repeating it on a five-page site is repetition rather than
 * reinforcement), "all rights reserved" (legally vestigial since Berne
 * superseded Buenos Aires), and a built-with-X credit (this is a hardware
 * portfolio — advertising the web stack argues she makes websites).
 *
 * The date is build time, not render time. Static export means this is frozen
 * when CI runs, which is exactly what "last updated" should mean; it also means
 * it cannot quietly go stale the way a hardcoded string would.
 */
const UPDATED = new Date().toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })

export default function Footer() {
  return (
    <footer className="mt-20 flex flex-col gap-3 border-t border-border pt-6">
      <ul className="flex flex-wrap gap-x-5 gap-y-1">
        {LINKS.map((l) => (
          <li key={l.label}>
            <a
              href={l.href}
              {...(l.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              className="font-mono text-[12px] uppercase tracking-[0.14em] text-muted no-underline transition-colors hover:text-accent"
            >
              {l.label}
            </a>
          </li>
        ))}
      </ul>
      <p className="text-[13px] text-muted-dim">
        Ivy Matobori · Nairobi, Kenya · Updated {UPDATED}
      </p>
    </footer>
  )
}
