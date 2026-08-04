import Link from 'next/link'
import Hero from '@/components/Hero'
import ProjectCard from '@/components/ProjectCard'
import SectionHeading from '@/components/SectionHeading'
import Footer from '@/components/Footer'
import { getAllProjects } from '@/lib/projects'
import { galleryClusters } from '@/lib/photos'
import { asset } from '@/lib/asset'

/**
 * Home.
 *
 *   Hero            who + thesis + CV
 *   What I work on  four capability areas
 *   Selected work   three cards, then through to /work/
 *   From the bench  four photos, then through to /gallery/
 *   Get in touch    the three channels
 *
 * Shape follows the reference portfolio the client chose. Two deliberate
 * departures: it has a "recent writing" list and Ivy does not write, so the
 * equivalent slot carries photographs — for a hardware engineer the evidence is
 * visual anyway. And the numbering below is real rather than decorative.
 */

/**
 * Ordered because the order is true: you cannot design the board until you know
 * what you are measuring, cannot write firmware until the board exists, and
 * cannot claim any of it until it has been brought up on a bench. Numbering a
 * set that had no sequence would just be decoration.
 */
const WORK_AREAS = [
  {
    n: '01',
    heading: 'Instrumentation & measurement',
    body: 'Flow, temperature, level and energy metering: sensor selection, signal conditioning, and the calibration procedures that keep a reading true six months after commissioning. Troubleshooting instruments in the field when they drift.',
  },
  {
    n: '02',
    heading: 'Hardware design',
    body: 'Schematic capture through 2–6 layer layout in Altium and KiCad, component selection, DFM and PCBA. Power architecture, regulation and protection — including a satellite EPS with fault-isolated distribution branches.',
  },
  {
    n: '03',
    heading: 'Firmware & interfaces',
    body: 'Embedded C and C++ on FreeRTOS and ESP-IDF, bare-metal peripheral drivers, low-power design. Talking to the rest of the plant over I²C, SPI, UART, CAN, RS485 and Modbus, and to the outside world over LoRa, BLE, NFC and LTE.',
  },
  {
    n: '04',
    heading: 'Bring-up, test & the field',
    body: 'Board bring-up and rail validation with a scope and a meter, fault detection and safety interlocks in firmware, control panel build and field wiring, then root-cause analysis on whatever comes back.',
  },
]

const CONTACT = [
  { label: 'Email', href: 'mailto:matoboriivy@gmail.com', value: 'matoboriivy@gmail.com' },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/ivy-matobori-bba4071a4/',
    value: 'ivy-matobori',
  },
  { label: 'GitHub', href: 'https://github.com/i3v3y3', value: 'i3v3y3' },
]

export default function Home() {
  const featured = getAllProjects().slice(0, 3)
  // One per cluster rather than the first four overall — otherwise the strip is
  // four near-identical QuePay boards. Screen captures are excluded because they
  // letterbox badly in a square tile.
  const bench = galleryClusters()
    .map((g) => g.photos.find((p) => p.fit !== 'contain'))
    .filter((p): p is NonNullable<typeof p> => p !== undefined)
    .slice(0, 4)

  return (
    <div className="mx-auto max-w-[58rem] px-5 pb-16 pt-10 sm:px-8 sm:pt-14">
      <Hero />

      <main id="main">
        <section className="mb-20" aria-labelledby="areas-heading">
          <SectionHeading id="areas-heading">What I work on</SectionHeading>
          <ol className="flex flex-col">
            {WORK_AREAS.map((area) => (
              <li
                key={area.n}
                className="grid grid-cols-1 gap-2 border-t border-border py-6 sm:grid-cols-[3.5rem_minmax(0,1fr)] sm:gap-6"
              >
                <span
                  aria-hidden="true"
                  className="font-mono text-[13px] tabular-nums text-accent"
                >
                  {area.n}
                </span>
                <div className="flex flex-col gap-2">
                  <h3 className="text-[17px] font-semibold text-foreground">{area.heading}</h3>
                  <p className="max-w-[40rem] text-[15px] leading-relaxed text-muted">
                    {area.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="mb-20" aria-labelledby="work-heading">
          <div className="mb-8 flex items-baseline justify-between gap-4">
            <h2
              id="work-heading"
              className="font-mono text-[12px] font-medium uppercase tracking-[0.14em] text-foreground"
            >
              Selected work
            </h2>
            <Link
              href="/work/"
              className="shrink-0 font-mono text-[12px] uppercase tracking-[0.14em] text-accent no-underline hover:underline"
            >
              All work
            </Link>
          </div>

          {featured.length === 0 ? (
            <p className="text-[14px] text-muted-dim">No projects published yet.</p>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((meta) => (
                <ProjectCard key={meta.slug} meta={meta} />
              ))}
            </div>
          )}
        </section>

        {bench.length > 0 && (
          <section className="mb-20" aria-labelledby="bench-heading">
            <div className="mb-8 flex items-baseline justify-between gap-4">
              <h2
                id="bench-heading"
                className="font-mono text-[12px] font-medium uppercase tracking-[0.14em] text-foreground"
              >
                From the bench
              </h2>
              <Link
                href="/gallery/"
                className="shrink-0 font-mono text-[12px] uppercase tracking-[0.14em] text-accent no-underline hover:underline"
              >
                All photos
              </Link>
            </div>

            {/* Both classes spelled out so Tailwind emits them — it scans source
                text, so a template-built class name would not survive. */}
            <ul
              className={`grid grid-cols-2 gap-3 ${
                bench.length >= 4 ? 'sm:grid-cols-4' : 'sm:grid-cols-3'
              }`}
            >
              {bench.map((photo) => (
                <li key={photo.src}>
                  <Link
                    href="/gallery/"
                    className="group block overflow-hidden rounded-lg border border-border bg-surface"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={asset(photo.src)}
                      alt={photo.alt}
                      loading="lazy"
                      decoding="async"
                      className="aspect-square w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="mb-4" aria-labelledby="contact-heading">
          <SectionHeading id="contact-heading">Get in touch</SectionHeading>
          <p className="mb-5 max-w-[36rem] text-[15px] leading-relaxed text-muted">
            Open to instrumentation and control roles, on site in Nairobi or remote. Happy to
            talk through any of the work above in more detail than the write-ups allow.
          </p>
          <ul className="flex flex-wrap gap-2.5">
            {CONTACT.map((c) => (
              <li key={c.label}>
                <a
                  href={c.href}
                  {...(c.href.startsWith('http')
                    ? { target: '_blank', rel: 'noopener noreferrer' }
                    : {})}
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-lg border border-border bg-surface px-4 py-2 text-[15px] no-underline transition-colors hover:border-accent"
                >
                  <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-dim">
                    {c.label}
                  </span>
                  <span className="text-foreground">{c.value}</span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      </main>

      <Footer />
    </div>
  )
}
