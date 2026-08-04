/**
 * One-time import of work photos from the source archive into public/images/.
 *
 *   <archive>/IMG_0069.HEIC ──▶ sharp ──▶ resize 1600px ──▶ .webp ──▶ public/images/quepay/…
 *                                  │
 *                                  └── metadata dropped
 *
 * Reads content/photos.json: `source` is the filename in the archive, `src` is
 * where it lands under public/. Nothing is imported that is not described there.
 *
 * WHY THIS EXISTS RATHER THAN JUST COPYING FILES
 *
 * Five of the originals carry GPSInfo EXIF — IMG_0069 and IMG_0115..0118 —
 * which would publish the coordinates of the workshop they were taken in.
 * sharp drops all metadata unless you explicitly call .withMetadata(), so
 * routing every image through sharp is what makes the output safe. Do not
 * "optimise" this into a copy step.
 *
 * The originals are not in this repo (they are ~238 MB). To re-run:
 *
 *   node scripts/import-photos.mjs /path/to/extracted/Work\ Pictures
 *
 * Output is committed, so this does not run in CI.
 */
import { mkdir, readdir, writeFile, rm } from 'node:fs/promises'
import { existsSync, readFileSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import { tmpdir } from 'node:os'
import path from 'node:path'
import process from 'node:process'

// Longest edge, not width. Capping width alone leaves a portrait phone photo
// 1600x2133 — taller than any viewport that will show it, and ~40% more pixels
// than it needs. The audience includes people on metered mobile data.
const MAX_EDGE = 1600
const QUALITY = 80
// Extra widths emitted beside each image for srcset. The gallery shows these in
// ~400px tiles and the home strip in ~200px squares; shipping 1600px into a
// 200px box was most of a 2.4 MB home page.
const SRCSET_WIDTHS = [400, 800]

const srcDir = process.argv[2]
if (!srcDir) {
  console.error('usage: node scripts/import-photos.mjs <path-to-extracted-archive>')
  process.exit(1)
}
if (!existsSync(srcDir)) {
  console.error(`[photos] source directory not found: ${srcDir}`)
  process.exit(1)
}

const root = process.cwd()
const manifest = JSON.parse(
  readFileSync(path.join(root, 'content', 'photos.json'), 'utf8')
)

let sharp
try {
  ;({ default: sharp } = await import('sharp'))
} catch {
  console.error('[photos] sharp is required — run npm install')
  process.exit(1)
}

// The archive nests everything one level down and the folder name has a
// trailing space, so resolve names case-insensitively against a flat listing
// rather than trusting the path.
async function indexFiles(dir) {
  const map = new Map()
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      for (const [k, v] of await indexFiles(full)) if (!map.has(k)) map.set(k, v)
    } else {
      map.set(entry.name.toLowerCase(), full)
    }
  }
  return map
}

const available = await indexFiles(srcDir)

/**
 * sharp reports HEIC support but cannot decode it — libvips here is built
 * without the HEVC plugin, so .toFile() dies with "Support for this compression
 * format has not been built in". libheif's CLI can decode, so HEIC goes through
 * it first at q100 (the webp encode is the only lossy step that matters).
 *
 * The intermediate JPEG would carry the original EXIF forward, which is exactly
 * what we are trying to remove, but it is deleted immediately and sharp still
 * drops metadata on the way out. Verified after the fact by the metadata check
 * at the bottom of this script.
 */
const scratch = path.join(tmpdir(), 'ivy-photo-import')
await mkdir(scratch, { recursive: true })

function decodeToTemp(origin) {
  const out = path.join(scratch, `${path.basename(origin, path.extname(origin))}.jpg`)
  execFileSync('heif-convert', ['-q', '100', origin, out], { stdio: 'pipe' })
  return out
}

let written = 0
const missing = []
const report = []

for (const photo of manifest.photos) {
  const origin = available.get(photo.source.toLowerCase())
  if (!origin) {
    missing.push(photo.source)
    continue
  }

  const dest = path.join(root, 'public', photo.src.replace(/^\//, ''))
  await mkdir(path.dirname(dest), { recursive: true })

  const isHeic = /\.heic$/i.test(origin)
  const input = isHeic ? decodeToTemp(origin) : origin

  // No .withMetadata() — that is the EXIF strip. See the header note.
  const info = await sharp(input)
    .rotate() // honour EXIF orientation before we discard it
    .resize(MAX_EDGE, MAX_EDGE, { fit: 'inside', withoutEnlargement: true })
    .webp({ quality: QUALITY })
    .toFile(dest)

  // Narrow variants alongside it: foo.webp -> foo-400.webp, foo-800.webp.
  for (const w of SRCSET_WIDTHS) {
    if (info.width <= w) continue
    await sharp(input)
      .rotate()
      .resize(w, null, { withoutEnlargement: true })
      .webp({ quality: QUALITY })
      .toFile(dest.replace(/\.webp$/, `-${w}.webp`))
  }

  if (isHeic) await rm(input, { force: true })

  written++
  report.push({
    src: photo.src,
    kb: Math.round(info.size / 1024),
    dims: `${info.width}x${info.height}`,
  })
  console.log(`[photos] ${photo.src}  ${info.width}x${info.height}  ${Math.round(info.size / 1024)} KB`)
}

// Prove the strip worked rather than trusting it.
let leaked = 0
for (const { src } of report) {
  const meta = await sharp(path.join(root, 'public', src.replace(/^\//, ''))).metadata()
  if (meta.exif || meta.gps) {
    console.error(`[photos] METADATA SURVIVED in ${src}`)
    leaked++
  }
}

const totalKb = report.reduce((a, r) => a + r.kb, 0)
console.log(
  `\n[photos] ${written} imported, ${Math.round(totalKb / 1024)} MB total, ${leaked} with surviving metadata`
)

if (missing.length) {
  console.error(`\n[photos] ${missing.length} listed in the manifest but not in the archive:`)
  for (const m of missing) console.error(`  - ${m}`)
}
if (leaked > 0 || missing.length) process.exit(1)

await writeFile(
  path.join(root, 'public', 'images', '.import-report.json'),
  JSON.stringify({ importedAt: new Date().toISOString(), count: written, files: report }, null, 2)
)
