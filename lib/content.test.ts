import { describe, it, expect } from 'vitest'
import { getAllProjects, getEveryProject } from './projects'

/**
 * Assertions about the real content in content/projects/, as opposed to
 * lib/projects.test.ts which mocks fs to exercise the parsing logic. These
 * would pass trivially against a mock, so they need the actual files.
 */
describe('spec tables and architecture diagrams', () => {
  it('gives every featured project a spec table', () => {
    // This is the block a recruiter screening for a hardware role reads first.
    const without = getAllProjects().filter((p) => !p.specs?.length)
    expect(without.map((p) => p.slug)).toEqual([])
  })

  it('labels every spec row and gives it a value', () => {
    for (const p of getEveryProject()) {
      for (const [label, value] of p.specs ?? []) {
        expect(label.trim(), `${p.slug} has an unlabelled spec row`).not.toBe('')
        expect(value.trim(), `${p.slug} spec "${label}" has no value`).not.toBe('')
      }
    }
  })

  it('keeps architecture trees shallow enough to read', () => {
    // Four levels is where the indentation starts wrapping on a phone.
    const depth = (n: { children?: unknown[] }): number =>
      1 + Math.max(0, ...((n.children ?? []) as { children?: unknown[] }[]).map(depth))
    for (const p of getEveryProject()) {
      for (const node of p.architecture?.nodes ?? []) {
        expect(depth(node), `${p.slug} architecture nests too deep`).toBeLessThanOrEqual(4)
      }
    }
  })

  it('names every architecture node', () => {
    const walk = (n: { label: string; children?: unknown[] }, slug: string) => {
      expect(n.label.trim(), `${slug} has an unlabelled architecture node`).not.toBe('')
      for (const c of (n.children ?? []) as typeof n[]) walk(c, slug)
    }
    for (const p of getEveryProject()) {
      for (const node of p.architecture?.nodes ?? []) walk(node, p.slug)
    }
  })
})

describe('design decisions', () => {
  it('records what every decision cost', () => {
    // Nygard's ADR format makes consequences a required section, and the
    // negative ones are the point: a decision written up with only its upside
    // is a sales pitch. The schema requires the field; this checks nobody
    // satisfied it with a space.
    const empty: string[] = []
    for (const project of getEveryProject()) {
      for (const decision of project.decisions ?? []) {
        if (decision.cost.trim().length < 20) {
          empty.push(`${project.slug}: "${decision.choice}"`)
        }
      }
    }
    expect(empty, `decisions with no real cost stated: ${empty.join(', ')}`).toEqual([])
  })

  it('gives every featured project at least one decision', () => {
    const without = getAllProjects().filter((p) => !p.decisions?.length)
    expect(without.map((p) => p.slug)).toEqual([])
  })

  it('does not leave the reasoning duplicated in the prose', () => {
    // These lived under "## Why 4 layers" style headings before they were
    // promoted. If one comes back, the page says the same thing twice.
    const fs = require('fs')
    const path = require('path')
    const dupes: string[] = []
    for (const project of getEveryProject()) {
      const body = fs.readFileSync(
        path.join(process.cwd(), 'content', 'projects', `${project.slug}.mdx`),
        'utf8'
      )
      if (/^## Why /m.test(body.split('---').slice(2).join('---'))) {
        dupes.push(project.slug)
      }
    }
    expect(dupes, `reasoning is both a decision and a prose heading in: ${dupes.join(', ')}`).toEqual([])
  })
})
