/**
 * Ivy's experience, as rendered on /work/.
 *
 * A plain data file on purpose: edit it with any text editor, no React needed.
 *
 * WRITING THE BULLETS. Describe scope and what was built.
 *
 * SOURCING, and it is currently inconsistent. Quepay, Veno and Kenya Space
 * Agency carry only figures a public source backs — quepay.co.ke publishes the
 * 99% uptime commitment, the KES 10M+ processed and the six machine verticals.
 * Their drafted résumé figures (±1.8%, 43%, 58%, 12 sites) were deliberately
 * left off, on the reasoning that a résumé goes to one reader who can question
 * it in the room while a website goes to everyone and gets quoted back.
 *
 * Gearbox breaks that rule: its numbers (three demonstrators, 16 weeks, ten
 * criteria, four boards, six interfaces, 35%) are drafted, not sourced. Added
 * on request. Resolve this one way or the other once Ivy has confirmed the
 * numbers — either the rest get their figures back, or these come out.
 *
 * Dates are month-precise. Kenya Space Agency was a three-month placement
 * during her degree; a bare year would imply a full-time role.
 */
export interface Role {
  org: string
  /** Public page that independently names Ivy or shows the shipped product. */
  orgHref?: string
  title: string
  location: string
  period: string
  current?: boolean
  points: string[]
  /** Slug of the case study that goes deeper, if one exists. */
  project?: { slug: string; label: string }
}

export interface ExperienceGroup {
  heading: string
  roles: Role[]
}

export const experience: ExperienceGroup[] = [
  {
    heading: 'Engineering',
    roles: [
      {
        org: 'Quepay Limited',
        orgHref: 'https://quepay.co.ke',
        title: 'Hardware Designer & Technical Operations Lead',
        location: 'Nairobi · On-site',
        period: 'Feb 2025 – present',
        current: true,
        points: [
          'Designed the field-deployed controller hardware and its 4-layer board in Altium, consolidating six machine verticals — water and milk ATMs, vending, laundry — onto a single design instead of one board per product.',
          'Wrote the C++ and FreeRTOS firmware that meters dispensing by volume, applies the tariff, and streams every transaction back over LTE, against a 99% uptime commitment and KES 10M+ processed.',
          'Built the fault detection, alarm handling and safety interlocks that decide what a machine does unattended, including over-dispense cutoff and automatic payment reversal on an incomplete dispense.',
          'Develop calibration and verification procedures for the flow and temperature instrumentation, and troubleshoot instruments on site when they drift.',
          'Lead a four-person team across assembly, inspection and field deployment, and run root-cause analysis on whatever comes back.',
        ],
        project: { slug: 'quepay-controller', label: 'Smart ATM Controller' },
      },
      {
        org: 'Veno Autobotics',
        orgHref: 'https://veno.co.ke/about',
        title: 'Embedded Systems Engineer, Hardware Design',
        location: 'Nairobi · On-site',
        period: 'Apr 2024 – Jan 2025',
        points: [
          "Designed the sensing hardware behind Veno's Level Sensor and the VeNode energy meter, characterised on the bench against a reference standard.",
          'Implemented the data acquisition and telemetry path, streaming live channels over MQTT into a monitoring platform with remote diagnostics and threshold alarms.',
          'Brought sensing peripherals up under embedded Linux, and wrote bare-metal C and C++ firmware for the resource-constrained nodes.',
          'Produced the electrical schematics, wiring diagrams and control panel layouts installers worked from, specifying terminal blocks, DIN-rail distribution and protection.',
          'Took mixed-signal hardware from requirements through schematic capture, layout and prototype assembly to production release, working with mechanical and software engineers.',
        ],
        project: { slug: 'veno-instrumentation', label: 'Level Sensing & Energy Metering' },
      },
      {
        org: 'Kenya Space Agency',
        title: 'Satellite Systems Engineer, Electrical Power System',
        location: 'Nairobi · On-site',
        period: 'Jan 2023 – Mar 2023',
        points: [
          'Designed a 6-layer electrical power system board for a CubeSat, from schematic capture to fabrication release, with DC-DC conversion, filtering and overcurrent protection across four regulated rails on redundant paths.',
          'Engineered a fault-tolerant architecture that contains a single-point failure to one branch, selecting the overcurrent protection and isolation devices for each.',
          'Led the EPS microcontroller trade study, scoring candidate parts on power, peripherals, reliability and radiation tolerance.',
          'Produced the electrical interface, verification and test documentation the design was assessed against at two multidisciplinary design reviews.',
        ],
        project: { slug: 'satellite-eps', label: 'Satellite Power Distribution' },
      },
      {
        org: 'Gearbox',
        title: 'Embedded Systems Apprentice',
        location: 'Nairobi · On-site',
        period: 'Jan 2022 – Apr 2022',
        points: [
          'Built three working embedded demonstrators in 16 weeks — microcontroller, sensor and actuator systems taken from a brief to hardware, each validated against ten functional acceptance criteria before hand-off to the project team.',
          'Turned four boards from concept to tested hardware on a three-week cycle, doing schematic capture, two-layer layout and DFM review in KiCad, then carrying each through fabrication and bring-up.',
          'Brought six sensor interfaces online in bare-metal embedded C, and cut prototype idle draw 35% by reworking the supply rails and duty-cycling the sensors between reads.',
        ],
      },
    ],
  },
  {
    heading: 'Education',
    roles: [
      {
        org: 'Jomo Kenyatta University of Agriculture and Technology',
        title: 'BSc, Control and Instrumentation Engineering',
        location: 'Kenya',
        period: '2019 – 2024',
        points: [
          'Four-year programme in measurement, control systems and industrial instrumentation — the discipline the degree is named for.',
        ],
      },
    ],
  },
]
