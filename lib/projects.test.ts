import { describe, it, expect, vi, beforeEach } from 'vitest'
import path from 'path'

vi.mock('fs')
vi.mock('path', async () => {
  const actual = await vi.importActual<typeof path>('path')
  return { ...actual, default: actual }
})

const MOCK_VALID_MDX = `---
title: Level Sensor
slug: level-sensor
description: Multi-protocol level sensing hardware.
stack:
  - Embedded C
  - RS485
date: "2024-03"
github: https://github.com/i3v3y3/level-sensor
demo: null
featured: true
---
## Content here
`

const MOCK_OTHER_MDX = `---
title: Other Project
slug: other
description: Another project.
stack:
  - TypeScript
date: "2023-06"
github: https://github.com/i3v3y3/other
demo: https://other.example.com
featured: false
---
## Other content
`

describe('lib/projects', () => {
  beforeEach(async () => {
    const fs = await import('fs')
    vi.mocked(fs.readdirSync).mockReturnValue(['level-sensor.mdx', 'other.mdx'] as any)
    vi.mocked(fs.readFileSync).mockImplementation((filePath: any) => {
      if (String(filePath).includes('level-sensor')) return MOCK_VALID_MDX
      if (String(filePath).includes('other')) return MOCK_OTHER_MDX
      throw new Error(`ENOENT: ${filePath}`)
    })
    vi.mocked(fs.existsSync).mockImplementation((filePath: any) => {
      return String(filePath).includes('level-sensor') || String(filePath).includes('other')
    })
  })

  describe('getAllProjects', () => {
    it('returns only featured projects', async () => {
      const { getAllProjects } = await import('./projects')
      const projects = getAllProjects()
      expect(projects).toHaveLength(1)
      expect(projects[0].slug).toBe('level-sensor')
    })

    it('sorts by date descending', async () => {
      const fs = await import('fs')
      const OLDER_MDX = MOCK_VALID_MDX.replace('2024-03', '2023-01')
      vi.mocked(fs.readFileSync).mockImplementation((filePath: any) => {
        if (String(filePath).includes('level-sensor')) return OLDER_MDX
        return MOCK_OTHER_MDX
      })
      const NEWER_MDX = `---
title: Newer
slug: newer
description: Newer project.
stack: [Go]
date: "2025-01"
github: https://github.com/JeffMboya/newer
demo: null
featured: true
---
content`
      vi.mocked(fs.readdirSync).mockReturnValue(['level-sensor.mdx', 'newer.mdx'] as any)
      vi.mocked(fs.readFileSync).mockImplementation((filePath: any) => {
        if (String(filePath).includes('newer')) return NEWER_MDX
        return OLDER_MDX
      })
      const { getAllProjects } = await import('./projects')
      const projects = getAllProjects()
      expect(projects[0].date).toBe('2025-01')
      expect(projects[1].date).toBe('2023-01')
    })
  })

  describe('getProjectBySlug', () => {
    it('returns meta and content for a valid slug', async () => {
      const { getProjectBySlug } = await import('./projects')
      const { meta, content } = getProjectBySlug('level-sensor')
      expect(meta.title).toBe('Level Sensor')
      expect(meta.stack).toContain('Embedded C')
      expect(meta.demo).toBeNull()
      expect(content).toContain('Content here')
    })

    it('throws for an unknown slug', async () => {
      const { getProjectBySlug } = await import('./projects')
      expect(() => getProjectBySlug('nonexistent')).toThrow('Project not found: nonexistent')
    })
  })

  describe('getAllProjectSlugs', () => {
    it('returns slugs derived from filenames', async () => {
      const { getAllProjectSlugs } = await import('./projects')
      const slugs = getAllProjectSlugs()
      expect(slugs).toContain('level-sensor')
      expect(slugs).toContain('other')
      expect(slugs).not.toContain('level-sensor.mdx')
    })
  })
})
