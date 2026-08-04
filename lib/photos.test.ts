import { describe, it, expect } from 'vitest'
import fs from 'fs'
import path from 'path'
import { photos, clusters, galleryClusters, photosForProject } from './photos'
import { getEveryProject } from './projects'

/**
 * The manifest and the filesystem have to agree.
 *
 * Two ways this breaks silently: a photo is described but never imported (the
 * page renders a broken image), or an image is imported and the entry later
 * renamed (a 5 MB orphan ships forever). Both are caught here.
 *
 * The EXIF assertion is the important one. Five of the source photos carried
 * GPS coordinates of the workshop they were taken in; scripts/import-photos.mjs
 * strips metadata by routing everything through sharp, but nothing stops
 * someone dropping a raw phone photo into public/images/ by hand later.
 */
const pub = path.join(process.cwd(), 'public')

describe('photo manifest', () => {
  it.each(photos.map((p) => p.src))('%s exists on disk', (src) => {
    const file = path.join(pub, src.replace(/^\//, ''))
    expect(fs.existsSync(file), `${src} described in photos.json but missing from public/`).toBe(
      true
    )
    expect(fs.statSync(file).size).toBeGreaterThan(1000)
  })

  it('ships no image that nothing references', () => {
    const dir = path.join(pub, 'images')
    if (!fs.existsSync(dir)) return
    const onDisk: string[] = []
    const walk = (d: string) => {
      for (const e of fs.readdirSync(d, { withFileTypes: true })) {
        const full = path.join(d, e.name)
        if (e.isDirectory()) walk(full)
        else if (/\.(webp|jpe?g|png)$/i.test(e.name))
          onDisk.push('/' + path.relative(pub, full).split(path.sep).join('/'))
      }
    }
    walk(dir)
    const described = new Set(photos.map((p) => p.src))
    const orphans = onDisk.filter((f) => !described.has(f))
    expect(orphans, `not in content/photos.json: ${orphans.join(', ')}`).toEqual([])
  })

  it('carries no EXIF, so no GPS coordinates ship', async () => {
    const { default: sharp } = await import('sharp')
    const leaked: string[] = []
    for (const p of photos) {
      const meta = await sharp(path.join(pub, p.src.replace(/^\//, ''))).metadata()
      if (meta.exif || meta.gps) leaked.push(p.src)
    }
    expect(leaked, `metadata survived import in: ${leaked.join(', ')}`).toEqual([])
  })

  it('gives every photo a distinct src', () => {
    const seen = new Set<string>()
    const dupes = photos.filter((p) => (seen.has(p.src) ? true : (seen.add(p.src), false)))
    expect(dupes.map((d) => d.src)).toEqual([])
  })

  it('points every project reference at a project that exists', () => {
    const slugs = new Set(getEveryProject().map((p) => p.slug))
    const dangling = photos.filter((p) => p.project && !slugs.has(p.project))
    expect(dangling.map((d) => `${d.src} → ${d.project}`)).toEqual([])
  })

  it('puts every gallery photo in exactly one cluster group', () => {
    const grouped = galleryClusters().flatMap((g) => g.photos)
    const shown = photos.filter((p) => {
      const c = clusters.find((c) => c.id === p.cluster)
      return c?.gallery !== false
    })
    expect(grouped.length).toBe(shown.length)
  })

  it('keeps About photos out of the gallery', () => {
    const inGallery = galleryClusters().flatMap((g) => g.photos.map((p) => p.src))
    expect(inGallery).not.toContain('/images/about/on-site.webp')
  })
})

describe('project covers', () => {
  it('resolves every cover to a file that exists', () => {
    const missing = getEveryProject()
      .filter((p) => p.cover)
      .filter((p) => !fs.existsSync(path.join(pub, p.cover!.replace(/^\//, ''))))
    expect(missing.map((m) => `${m.slug}: ${m.cover}`)).toEqual([])
  })

  it('has photos to show for the projects that reference them', () => {
    expect(photosForProject('quepay-controller').length).toBeGreaterThan(0)
    expect(photosForProject('veno-instrumentation').length).toBeGreaterThan(0)
  })
})
