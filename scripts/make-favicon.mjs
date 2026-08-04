/**
 * Build the favicon set from Ivy's portrait.
 *
 *   public/images/about/on-site.webp ──▶ square crop on the face ──▶
 *       apple-touch-icon.png  180  (iOS home screen, Safari pinned tabs)
 *       icon-192.png          192  (Android home screen)
 *       icon-512.png          512  (splash, install prompts)
 *       favicon-32.png         32  (browser tab, most desktop cases)
 *       favicon-16.png         16  (tab at small zoom, bookmarks bar)
 *
 * Run after the portrait changes:
 *   node scripts/make-favicon.mjs
 *
 * Output is committed, so this does not run in CI.
 *
 * ABOUT THE SMALL SIZES. A face does not survive 16px — it becomes a smudge.
 * The crop is therefore deliberately tight, head filling nearly the whole
 * frame, so what reads at 16px is a silhouette with contrast rather than a
 * person in a scene. Slight sharpening at each size recovers some of the edge
 * definition that downscaling costs.
 */
import { existsSync } from 'node:fs'
import path from 'node:path'
import process from 'node:process'

const root = process.cwd()
const source = path.join(root, 'public', 'images', 'about', 'on-site.webp')

if (!existsSync(source)) {
  console.error(`[favicon] source portrait missing: ${source}`)
  process.exit(1)
}

let sharp
try {
  ;({ default: sharp } = await import('sharp'))
} catch {
  console.error('[favicon] sharp is required — run npm install')
  process.exit(1)
}

// Hand-measured against the 1200x1600 portrait: her head runs y 300-580,
// x 620-830, so centre is about (728, 447). The square is only slightly wider
// than the head — a looser crop put half a QuePay banner in the frame, which
// at 32px is just noise competing with the face.
const CROP = { left: 553, top: 272, width: 350, height: 350 }

const SIZES = [
  { file: 'apple-touch-icon.png', size: 180 },
  { file: 'icon-192.png', size: 192 },
  { file: 'icon-512.png', size: 512 },
  { file: 'favicon-32.png', size: 32 },
  { file: 'favicon-16.png', size: 16 },
]

const face = sharp(source).extract(CROP)

for (const { file, size } of SIZES) {
  const info = await face
    .clone()
    .resize(size, size, { fit: 'cover' })
    // Downscaling this far softens edges to mush; a light unsharp pass keeps
    // the glasses and jaw line readable at 32px.
    .sharpen({ sigma: size <= 32 ? 1.2 : 0.6 })
    .png({ compressionLevel: 9 })
    .toFile(path.join(root, 'public', file))
  console.log(`[favicon] ${file.padEnd(22)} ${info.width}x${info.height}  ${Math.round(info.size / 1024)} KB`)
}
