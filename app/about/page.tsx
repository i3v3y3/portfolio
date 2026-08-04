import type { Metadata } from 'next'
import PageShell from '@/components/PageShell'
import SectionHeading from '@/components/SectionHeading'
import Timeline from '@/components/Timeline'
import { milestones } from '@/content/timeline'
import { photoBySrc } from '@/lib/photos'
import { asset } from '@/lib/asset'

export const metadata: Metadata = {
  title: 'About — Ivy Matobori',
  description:
    'Control and instrumentation engineer in Nairobi. Background, experience timeline, and how to verify any claim on this site.',
}

/**
 * About. The second-visit page: the longer read, the dated timeline, and the
 * sources. "How to verify this" lives here rather than on the home page because
 * it answers a question a reader only forms after they have read the claims.
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
              That has meant writing calibration procedures and then going out to site when a
              sensor drifts. It has meant building the fault detection and interlocks that
              decide what a machine does when something goes wrong at two in the morning with
              nobody watching.
            </p>
            <p>
              I think of embedded systems as an art that takes in electronic design, mechanical
              design and software design all at once. Right now I am learning embedded Linux.
              Away from the bench I read fairly indiscriminately, and I take recommendations.
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

      <Timeline milestones={milestones} />

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
