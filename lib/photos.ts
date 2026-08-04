import { z } from 'zod'
import data from '@/content/photos.json'

/**
 * Work photos.
 *
 *   content/photos.json
 *          │
 *          ├── scripts/import-photos.mjs  reads `source` ─▶ writes `src`
 *          └── this module                reads the rest  ─▶ gallery, covers
 *
 * One manifest, two consumers, so an image cannot be imported without being
 * described or described without being imported. The test in lib/photos.test.ts
 * asserts every `src` resolves to a real file in public/.
 *
 * Unlike lib/projects.ts this validates eagerly and throws. Projects are
 * authored one MDX file at a time and a bad one should be skipped rather than
 * kill the build; this is a single hand-maintained file, so a schema error is a
 * typo I want to see immediately, not a photo that silently vanishes.
 */

const ClusterSchema = z.object({
  id: z.string(),
  label: z.string(),
  blurb: z.string(),
  /** false keeps the cluster out of the gallery grid. Defaults to shown. */
  gallery: z.boolean().default(true),
})

const PhotoSchema = z.object({
  src: z.string().startsWith('/images/'),
  /** Filename inside the work-pictures archive. Import-time only. */
  source: z.string(),
  cluster: z.string(),
  /** Slug of the project this evidences, when it evidences one. */
  project: z.string().optional(),
  alt: z.string().min(1),
  caption: z.string().min(1),
  /**
   * How the image sits in a fixed-aspect tile. Photographs crop happily, so
   * "cover" is the default. Screen captures and renders do not: cropping a UI
   * screenshot cuts the clock off one edge and the buttons off the other,
   * which is exactly the detail that makes it evidence.
   */
  fit: z.enum(['cover', 'contain']).default('cover'),
  /**
   * Which part of the frame to keep when cropping. A tall portrait in a 4:3
   * tile loses roughly the top and bottom third to a centre crop, which on a
   * photo of people means everyone is beheaded. "top" keeps the faces.
   */
  focus: z.enum(['center', 'top']).default('center'),
  /**
   * Produced by a script rather than imported from a photograph. The importer
   * skips these, and they have no srcset variants because they are already
   * small vector-derived PNGs.
   */
  generated: z.boolean().default(false),
  /** Real pixel width, written by the importer. Drives srcset. */
  width: z.number().optional(),
})

export type Cluster = z.infer<typeof ClusterSchema>
export type Photo = z.infer<typeof PhotoSchema>

const parsed = z
  .object({
    clusters: z.array(ClusterSchema),
    photos: z.array(PhotoSchema),
  })
  .safeParse(data)

if (!parsed.success) {
  const issues = parsed.error.issues
    .map((i) => `${i.path.join('.') || '(root)'}: ${i.message}`)
    .join('; ')
  throw new Error(`Invalid content/photos.json — ${issues}`)
}

export const clusters: Cluster[] = parsed.data.clusters
export const photos: Photo[] = parsed.data.photos

const clusterIds = new Set(clusters.map((c) => c.id))
const orphan = photos.find((p) => !clusterIds.has(p.cluster))
if (orphan) {
  throw new Error(
    `content/photos.json: "${orphan.src}" is in cluster "${orphan.cluster}", which is not declared`
  )
}

/** Clusters that appear in the gallery, each with its photos, in manifest order. */
export function galleryClusters(): { cluster: Cluster; photos: Photo[] }[] {
  return clusters
    .filter((c) => c.gallery)
    .map((cluster) => ({
      cluster,
      photos: photos.filter((p) => p.cluster === cluster.id),
    }))
    .filter((g) => g.photos.length > 0)
}

/** Photos evidencing one project, for inline figures on its case study. */
export function photosForProject(slug: string): Photo[] {
  return photos.filter((p) => p.project === slug)
}

/** Look one up by src. Used where a page wants a specific known image. */
export function photoBySrc(src: string): Photo | undefined {
  return photos.find((p) => p.src === src)
}

/**
 * Pairs for the home page bench strip: four tiles, each with a hover partner.
 *
 * Stratified by cluster rather than picked from one flat pool. A flat random
 * draw kept returning four dark boards on the same desk — different files that
 * read as one image repeated, which is the exact problem the hand-picked list
 * was solving. One cluster per tile guarantees four different subjects while
 * still being random within each.
 *
 * Selection happens at build time. This is a static export, so the set is fixed
 * for a given deploy — random across rebuilds, stable for every visitor, and no
 * hydration mismatch because nothing re-rolls on the client.
 *
 * Anything already used as a project card cover is excluded, as are screen
 * captures and generated diagrams: they letterbox badly in
 * a square tile, and a UI screenshot cross-fading into a photo looks like a
 * rendering bug rather than an effect.
 */
export function benchPairs(exclude: string[] = [], count = 4): [Photo, Photo][] {
  const pick = <T,>(xs: T[]): T => xs[Math.floor(Math.random() * xs.length)]

  // `exclude` is the project card covers. Without it the strip can draw an
  // image that is already on screen 200px above it, which reads as a bug
  // rather than a coincidence.
  const skip = new Set(exclude)
  const usable = photos.filter(
    (p) =>
      p.fit !== 'contain' && !p.generated && p.cluster !== 'about' && !skip.has(p.src)
  )

  // Clusters holding at least a pair, most photographs first, so a thin cluster
  // never edges out a rich one when there are more clusters than tiles.
  const byCluster = clusters
    .map((c) => usable.filter((p) => p.cluster === c.id))
    .filter((group) => group.length >= 2)
    .sort((a, b) => b.length - a.length)
    .slice(0, count)

  return byCluster.map((group) => {
    const front = pick(group)
    const back = pick(group.filter((p) => p.src !== front.src))
    return [front, back] as [Photo, Photo]
  })
}
