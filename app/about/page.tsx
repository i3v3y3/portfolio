import type { Metadata } from 'next'
import PageShell from '@/components/PageShell'
import SectionHeading from '@/components/SectionHeading'
import { photoBySrc } from '@/lib/photos'
import { asset } from '@/lib/asset'

export const metadata: Metadata = {
  title: 'About — Ivy Matobori',
  description:
    'Control and instrumentation engineer in Nairobi: board design, firmware, calibration and production. Background, and how to verify any claim on this site.',
}

/**
 * About: the longer read and the sources.
 *
 * SOURCING OF THE PROSE. The opening and the "art" sentence are Ivy's own
 * words, from her LinkedIn. The middle three paragraphs describe work the rest
 * of this site documents — the boards in the gallery, the batches and reflow,
 * the contract-manufacturing visit, the three case studies — rather than
 * biography nobody can check. An earlier draft had her going out to site "at
 * two in the morning with nobody watching" and reading "fairly
 * indiscriminately"; both were invented, and both are gone.
 *
 * The dated timeline moved to /work/, which now carries roles with dates and
 * bullets — the same chronology in two places is duplication. "How to verify
 * this" stays here because it answers a question a reader only forms after
 * they have read the claims, not before.
 */

const VERIFY = [
  {
    label: 'Veno Autobotics team page',
    href: 'https://veno.co.ke/about',
    note: 'Lists me by name and role.',
  },
  {
    label: 'QuePay',
    href: 'https://quepay.co.ke',
    note: 'The payment platform the controller I built runs on.',
  },
  {
    label: 'GitHub',
    href: 'https://github.com/i3v3y3',
    note: 'Schematics, layouts and firmware.',
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/ivy-matobori-bba4071a4/',
    note: 'Roles and dates, and posts from while the work was happening.',
  },
]

export default function AboutPage() {
  const portrait = photoBySrc('/images/about/on-site.webp')
  const bench = photoBySrc('/images/about/workbench.webp')

  return (
    <PageShell title="About">
      <section className="mb-20">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
          <div className="flex flex-col gap-4 text-[15px] leading-relaxed text-muted">
            <p>
              I studied Control and Instrumentation Engineering at Jomo Kenyatta University of
              Agriculture and Technology, and I have spent the years since on the part of the
              job where the measurement has to be right — flow, temperature, level, current —
              because everything downstream is only as good as the number you started with.
            </p>
            <p>
              That starts at the schematic. I design the boards, two to six layers in Altium
              and KiCad, mixed-signal, with the power architecture and protection that keeps a
              reading clean sitting next to a cellular modem. I write the firmware that runs on
              them in C and C++, on FreeRTOS and bare metal, and I take them through bring-up,
              calibration and the test procedures that decide whether a unit ships.
            </p>
            <p>
              I stay with them after that. Batches through reflow, first-article inspection,
              the fault detection and interlocks that decide what a machine does unattended,
              and the schematics and panel layouts an installer works from. I have followed a
              design onto a contract manufacturing floor and out to site when the readings
              stopped making sense.
            </p>
            <p>
              The range is the part I care about. A payment controller on a water ATM, a level
              sensor on a tank, and a power distribution board for a satellite are the same
              problem in different clothes: measure something accurately, decide what to do
              about it, and keep working when nobody is watching.
            </p>
            <p>
              I think of embedded systems as an art that takes in electronic design, mechanical
              design and software design all at once. Right now I am extending that on the
              software side, with embedded Linux.
            </p>
          </div>

          {portrait && (
            <figure className="flex flex-col gap-2">
              <div className="overflow-hidden rounded-xl border border-border">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={asset(portrait.src)}
                  alt={portrait.alt}
                  width={1200}
                  height={1600}
                  className="aspect-[4/5] w-full object-cover"
                />
              </div>
              <figcaption className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-dim">
                {portrait.caption}
              </figcaption>
            </figure>
          )}
        </div>
      </section>

      {bench && (
        <section className="mb-20">
          <figure className="flex flex-col gap-2">
            <div className="overflow-hidden rounded-xl border border-border">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={asset(bench.src)}
                alt={bench.alt}
                width={1200}
                height={1600}
                className="aspect-[16/9] w-full object-cover"
              />
            </div>
            <figcaption className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-dim">
              {bench.caption}
            </figcaption>
          </figure>
        </section>
      )}

      <section className="mb-20" aria-labelledby="verify-heading">
        <SectionHeading id="verify-heading">How to verify this</SectionHeading>
        <p className="mb-5 max-w-[34rem] text-[15px] text-muted">
          Most of what is on this site can be checked without asking me. Where a claim has a
          public source, here it is.
        </p>
        <ul className="flex flex-col gap-3">
          {VERIFY.map((v) => (
            <li key={v.href} className="flex flex-col">
              <a
                href={v.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[44px] items-center self-start text-[15px] text-accent hover:underline"
              >
                {v.label}
              </a>
              <span className="text-[14px] text-muted-dim">{v.note}</span>
            </li>
          ))}
        </ul>
      </section>
    </PageShell>
  )
}
