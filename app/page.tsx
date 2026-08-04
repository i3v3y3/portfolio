import Link from 'next/link'
import Hero from '@/components/Hero'
import ProjectCard from '@/components/ProjectCard'
import SectionHeading from '@/components/SectionHeading'
import Footer from '@/components/Footer'
import { getAllProjects } from '@/lib/projects'

/**
 * Home. Everything a screener needs in one screen and one scroll:
 *
 *   Hero      who + what + CV      ← the whole first pass lives here
 *   Toolkit   keywords             ← above the fold-ish, for ATS-style skimming
 *   Work      three featured cards ← the rest moved to /work/
 *
 * Timeline, "how to verify" and the longer bio moved to /about/ when the nav
 * went in. They are the second-visit content; keeping them here pushed the
 * project cards below a screen and a half of prose.
 */

const TOOLKIT = [
  {
    heading: 'Instrumentation & control',
    items: [
      'Flow, temperature, level, energy metering',
      'Calibration procedures, sensor troubleshooting',
      'Data acquisition and process logging',
      'Fault detection, alarms, safety interlocks',
    ],
  },
  {
    heading: 'Hardware',
    items: [
      'Altium Designer, KiCad, Fusion 360',
      'Schematic capture, 2–6 layer layout',
      'Component selection, DFM, PCBA',
      'Power architecture, regulation, protection',
      'Board bring-up and signal integrity',
    ],
  },
  {
    heading: 'Firmware & interfaces',
    items: [
      'Embedded C/C++, FreeRTOS, ESP-IDF, ESP32',
      'Bare-metal drivers, low-power design',
      'I²C, SPI, UART, CAN, RS485, Modbus, one-wire',
      'LoRa, BLE, NFC, WiFi, LTE',
      'Oscilloscope, logic analyzer, Git',
    ],
  },
]

export default function Home() {
  const featured = getAllProjects().slice(0, 3)

  return (
    <div className="mx-auto max-w-[58rem] px-5 pb-16 pt-10 sm:px-8 sm:pt-14">
      <Hero />

      <main id="main">
        <section className="mb-20" aria-labelledby="toolkit-heading">
          <SectionHeading id="toolkit-heading">Toolkit</SectionHeading>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {TOOLKIT.map((group) => (
              <div key={group.heading} className="flex flex-col gap-2">
                <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-dim">
                  {group.heading}
                </span>
                <ul className="flex flex-col gap-1 text-[14px] leading-relaxed text-muted">
                  {group.items.map((i) => (
                    <li key={i}>{i}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-20" aria-labelledby="work-heading">
          <SectionHeading id="work-heading">Selected work</SectionHeading>
          {featured.length === 0 ? (
            <p className="text-[14px] text-muted-dim">No projects published yet.</p>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {featured.map((meta) => (
                  <ProjectCard key={meta.slug} meta={meta} />
                ))}
              </div>
              <Link
                href="/work/"
                className="mt-6 inline-flex min-h-[44px] items-center gap-2 text-[15px] text-accent no-underline hover:underline"
              >
                All work
                <span aria-hidden="true">→</span>
              </Link>
            </>
          )}
        </section>
      </main>

      <Footer />
    </div>
  )
}
