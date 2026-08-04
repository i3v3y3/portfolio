/**
 * Build poster images for the LinkedIn video facades.
 *
 *   <video>.mp4 ──▶ ffmpeg frame at 25% ──▶ resize 800px ──▶ public/images/video/<id>.webp
 *
 * Run when a video is added to content/videos.ts:
 *   node scripts/make-video-posters.mjs /path/to/downloaded/mp4s
 *
 * Output is committed; this does not run in CI.
 *
 * WHY A POSTER AT ALL. The facade exists so nothing loads from LinkedIn until
 * someone presses play, but the version without posters was a blank grey panel
 * with a play triangle — it gave a reader no reason to press it. A still from
 * the video itself restores what the embed would have shown while keeping the
 * privacy property.
 *
 * WHY 25% AND NOT THE FIRST FRAME. Two of these clips open on a Veno logo
 * animation and one fades in from black, so frame zero is either branding or a
 * black rectangle. A quarter of the way in is past the intro on all five.
 */
import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync } from 'node:fs'
import { readdir } from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'

const POSTER_WIDTH = 800
const SEEK_FRACTION = 0.25

const sourceDir = process.argv[2]
if (!sourceDir || !existsSync(sourceDir)) {
  console.error('usage: node scripts/make-video-posters.mjs <dir-of-mp4s>')
  process.exit(1)
}

let sharp
try {
  ;({ default: sharp } = await import('sharp'))
} catch {
  console.error('[posters] sharp is required — run npm install')
  process.exit(1)
}

const outDir = path.join(process.cwd(), 'public', 'images', 'video')
mkdirSync(outDir, { recursive: true })

function durationSeconds(file) {
  const out = execFileSync('ffprobe', [
    '-v', 'error',
    '-show_entries', 'format=duration',
    '-of', 'default=noprint_wrappers=1:nokey=1',
    file,
  ])
  return parseFloat(out.toString().trim())
}

// Files are named v_<urn>.mp4 by the fetch step; the urn is what content/videos.ts
// keys on, so the poster takes the same name and the component needs no mapping.
const files = (await readdir(sourceDir)).filter((f) => /^v_\d+\.mp4$/.test(f))

if (files.length === 0) {
  console.error(`[posters] no v_<urn>.mp4 files in ${sourceDir}`)
  process.exit(1)
}

for (const file of files) {
  const urn = file.replace(/^v_|\.mp4$/g, '')
  const source = path.join(sourceDir, file)
  const seek = (durationSeconds(source) * SEEK_FRACTION).toFixed(2)
  const frame = path.join(outDir, `${urn}.png`)

  execFileSync('ffmpeg', ['-y', '-ss', seek, '-i', source, '-frames:v', '1', frame], {
    stdio: 'pipe',
  })

  const info = await sharp(frame)
    .resize(POSTER_WIDTH, null, { withoutEnlargement: true })
    .webp({ quality: 78 })
    .toFile(path.join(outDir, `${urn}.webp`))

  execFileSync('rm', ['-f', frame])

  console.log(`[posters] ${urn}.webp  ${info.width}x${info.height}  ${Math.round(info.size / 1024)} KB  (t=${seek}s)`)
}
