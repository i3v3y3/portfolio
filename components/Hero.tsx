import Link from 'next/link'
import { asset, srcSet } from '@/lib/asset'
import { photoBySrc } from '@/lib/photos'

/**
 * Hero.
 *
 * Structure follows the reference portfolio the client picked: role and
 * location as an eyebrow, one sentence of thesis, a short first-person
 * paragraph, two calls to action, portrait alongside. The voice and the type
 * are hers — this is the same skeleton, not the same page.
 *
 * The two CTAs are deliberately unequal. "See my work" is where a curious
 * reader goes; the resume is what a recruiter actually came for, so it stays the
 * filled button even though the reference puts two outlines side by side.
 */
const PORTRAIT = '/images/about/on-site.webp'

export default function Hero() {
  return (
    <header className="mb-20 grid grid-cols-1 items-start gap-10 md:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)] md:gap-12">
      <div className="flex flex-col gap-5">
        {/* The name appears here only below `sm`. The h1 is a thesis rather
            than an introduction, so on a phone — where the nav wordmark is
            hidden — this would otherwise be the one place her surname never
            appears above the fold. From `sm` up the bold wordmark sits directly
            above this line and saying it twice in 60px is just repetition. */}
        <p className="font-mono text-[12px] uppercase tracking-[0.14em] text-muted-dim">
          <span className="text-foreground sm:hidden">Ivy Matobori · </span>
          Instrumentation &amp; Control Engineer · Nairobi, Kenya
        </p>

        <h1 className="text-[clamp(1.9rem,1.2rem+3.1vw,2.9rem)] tracking-[-0.015em]">
          I build the hardware and firmware for machines that have to{' '}
          <span className="text-accent">work unattended</span>.
        </h1>

        <p className="max-w-[36rem] text-[16px] leading-relaxed text-muted">
          Hey, I&apos;m Ivy. I studied Control and Instrumentation Engineering at JKUAT, and
          I have spent the years since on the part of the job where the measurement has to be
          right — flow, temperature, level, current — because everything downstream is only as
          good as the number you started with. Payment controllers on water ATMs, level sensors
          on tanks, power distribution for a satellite.
        </p>

        <div className="mt-1 flex flex-wrap gap-2.5">
          <Link
            href="/work/"
            className="inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-accent px-4 py-2 text-[15px] font-medium text-accent-text no-underline transition-opacity hover:opacity-90"
          >
            See my work
            <span aria-hidden="true">→</span>
          </Link>
          {/* Opens in a tab rather than saving straight to disk, so a reader can
              read it first and use the viewer's own download button if they want
              a copy. No `download` attribute — that would force the save and
              skip the preview entirely. Labelled "View" to match what it does. */}
          <a
            href={asset('/Ivy_Matobori_Resume.pdf')}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[44px] items-center gap-2 rounded-lg border border-border bg-surface px-4 py-2 text-[15px] text-foreground no-underline transition-colors hover:border-accent hover:text-accent"
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
        </div>

      </div>

      <div className="w-full overflow-hidden rounded-xl border border-border">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={asset(PORTRAIT)}
          srcSet={srcSet(PORTRAIT, photoBySrc(PORTRAIT)?.width)}
          sizes="(max-width: 768px) 100vw, 340px"
          alt="Ivy Matobori on site in a high-visibility vest"
          width={1200}
          height={1600}
          className="aspect-[3/2] w-full object-cover object-top md:aspect-[4/5]"
        />
      </div>
    </header>
  )
}
