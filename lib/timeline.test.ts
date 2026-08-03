import { describe, it, expect } from 'vitest'
import { milestones } from '../content/timeline'

describe('content/timeline', () => {
  it('is non-empty and ordered oldest first', () => {
    expect(milestones.length).toBeGreaterThan(0)
    const years = milestones.map((m) => parseInt(m.period.match(/\d{4}/)![0], 10))
    expect([...years].sort((a, b) => a - b)).toEqual(years)
  })

  it('uses only tracks the component can colour', () => {
    const known = new Set(['hardware', 'firmware', 'education'])
    for (const m of milestones) expect(known.has(m.track)).toBe(true)
  })

  it('has at most one current role', () => {
    expect(milestones.filter((m) => m.current).length).toBeLessThanOrEqual(1)
  })

  it('gives every verify link an absolute https URL', () => {
    for (const m of milestones) {
      if (m.verify) expect(m.verify.href).toMatch(/^https:\/\//)
    }
  })
})
