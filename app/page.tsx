import Hero from '@/components/Hero'
import Timeline from '@/components/Timeline'
import ProjectCard from '@/components/ProjectCard'
import SectionHeading from '@/components/SectionHeading'
import Footer from '@/components/Footer'
import { getAllProjects } from '@/lib/projects'
import { milestones } from '@/content/timeline'

/**
 * Home page. Section order is deliberate and driven by the 15-second scan:
 *
 *   Hero        who + what + CV        ← the whole screener pass lives here
 *   Toolkit     keywords               ← moved ABOVE work so ATS-style
 *                                        skimming hits it inside the window
 *   Work        four case studies
 *   Timeline    experience, dated
 *   Verify      how to check any of it
 *   About       the longer read
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
    note: 'Schematics, layouts and firmware, including the Atmega328P board.',
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/ivy-matobori-bba4071a4/',
    note: 'Roles and dates, and posts from while the work was happening.',
  },
]

export default function Home() {
  const projects = getAllProjects()

  return (
    <div className="mx-auto max-w-[58rem] px-5 pb-16 pt-10 sm:px-8 sm:pt-16">
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
          {projects.length === 0 ? (
            <p className="text-[14px] text-muted-dim">No projects published yet.</p>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((meta) => (
                <ProjectCard key={meta.slug} meta={meta} />
              ))}
            </div>
          )}
        </section>

        <Timeline milestones={milestones} />

        <section className="mb-20" aria-labelledby="verify-heading">
          <SectionHeading id="verify-heading">How to verify this</SectionHeading>
          <p className="mb-5 max-w-[40rem] text-[15px] text-muted">
            Most of what is on this page can be checked without asking me. Where a claim has
            a public source, here it is.
          </p>
          <ul className="flex flex-col gap-3">
            {VERIFY.map((v) => (
              <li key={v.href} className="flex flex-col gap-0.5">
                <a
                  href={v.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="self-start text-[15px] text-accent hover:underline"
                >
                  {v.label}
                </a>
                <span className="text-[14px] text-muted-dim">{v.note}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-20" aria-labelledby="about-heading">
          <SectionHeading id="about-heading">About</SectionHeading>
          <div className="flex max-w-[40rem] flex-col gap-4 text-[15px] leading-relaxed text-muted">
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
        </section>
      </main>

      <Footer />
    </div>
  )
}
