/**
 * Ivy's career timeline.
 *
 * This is a plain data file on purpose: edit it with any text editor, no React
 * knowledge needed. Add a row, change a date, reorder — the component picks it
 * up. `track` must be one of the keys in TRACK_COLORS (see Timeline.tsx).
 *
 * Dates are deliberately month-precise. The 2023 KSA entry was a 3-month
 * placement and the 2022 Gearbox entry a 4-month apprenticeship, both during
 * her degree; rendering them as bare years would imply full-time roles.
 */
export interface Milestone {
  period: string
  role: string
  org: string
  track: 'hardware' | 'firmware' | 'education'
  impact: string
  /** Public page that independently names Ivy or shows the shipped product. */
  verify?: { href: string; label: string }
  current?: boolean
}

export const milestones: Milestone[] = [
  {
    period: '2019 – 2024',
    role: 'BSc Control and Instrumentation Engineering',
    org: 'Jomo Kenyatta University of Agriculture and Technology',
    track: 'education',
    impact: 'Degree title matches the discipline: control and instrumentation.',
  },
  {
    period: 'Jan 2022 – Apr 2022',
    role: 'Embedded Systems Apprentice',
    org: 'Gearbox',
    track: 'firmware',
    impact: 'Prototyped microcontroller sensor and actuator test rigs in KiCad.',
  },
  {
    period: 'Jan 2023 – Mar 2023',
    role: 'Satellite Systems Engineer, EPS',
    org: 'Kenya Space Agency',
    track: 'hardware',
    impact: '6-layer power distribution board; fault-isolated branches on redundant paths.',
  },
  {
    period: 'Apr 2024 – Jan 2025',
    role: 'Embedded Systems Engineer, Embedded Hardware Design',
    org: 'Veno Autobotics',
    track: 'hardware',
    impact: 'Level sensing and energy metering hardware across RS485, Modbus and one-wire.',
    verify: { href: 'https://veno.co.ke/about', label: 'Named on the Veno team page' },
  },
  {
    period: 'Feb 2025 – present',
    role: 'Hardware Designer & Technical Operations Lead',
    org: 'Quepay Limited',
    track: 'firmware',
    impact: 'Firmware and 4-layer controller behind mobile-money payment terminals.',
    verify: { href: 'https://quepay.co.ke', label: 'The product I built' },
    current: true,
  },
]
