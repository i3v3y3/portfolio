import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

vi.mock('fs')

const VALID = `---
title: Good
slug: good
description: Fine.
stack: ["C"]
date: "2025-01"
featured: true
---
body`

const BROKEN = `---
title: Bad
slug: bad
description: Missing the featured field.
stack: ["C"]
date: "2025-02"
---
body`

/**
 * The guard exists because one bad frontmatter field used to kill the whole
 * build with no filename. It has to hold on ALL read paths — guarding only
 * readProjects leaves getAllProjectSlugs generating a route for a file that
 * then throws in getProjectBySlug, and the build dies anyway.
 */
describe('malformed frontmatter guard', () => {
  beforeEach(async () => {
    vi.resetModules()
    const fs = (await import('fs')).default
    vi.mocked(fs.readdirSync).mockReturnValue(['good.mdx', 'bad.mdx'] as never)
    vi.mocked(fs.readFileSync).mockImplementation((p) =>
      String(p).includes('bad') ? BROKEN : VALID
    )
    vi.mocked(fs.existsSync).mockReturnValue(true)
    vi.spyOn(console, 'warn').mockImplementation(() => {})
  })
  afterEach(() => vi.restoreAllMocks())

  it('drops the bad file from the project list instead of throwing', async () => {
    const { getEveryProject } = await import('./projects')
    const slugs = getEveryProject().map((p) => p.slug)
    expect(slugs).toEqual(['good'])
  })

  it('names the offending file and field in the warning', async () => {
    const { getEveryProject } = await import('./projects')
    getEveryProject()
    const msg = vi.mocked(console.warn).mock.calls.flat().join(' ')
    expect(msg).toContain('bad.mdx')
    expect(msg).toContain('featured')
  })

  it('generates no route for the bad file — the path the old guard missed', async () => {
    const { getAllProjectSlugs } = await import('./projects')
    expect(getAllProjectSlugs()).toEqual(['good'])
  })

  it('still throws with a useful message if a bad slug is requested directly', async () => {
    const { getProjectBySlug } = await import('./projects')
    expect(() => getProjectBySlug('bad')).toThrow(/bad\.mdx.*featured/s)
  })
})
