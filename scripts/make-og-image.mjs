/**
 * Build the social share card: public/og.jpg, 1200x630.
 *
 *   public/images/quepay/in-hand.webp ──▶ darken ──▶ + name/role/URL ──▶ og.jpg
 *
 * Run after the photo it is built from changes:
 *   node scripts/make-og-image.mjs
 *
 * Output is committed, so this does not run in CI.
 *
 * WHY A REAL PHOTO. A card is the only thing most people see of a portfolio —
 * it is what renders when a recruiter forwards the link to a hiring manager.
 * A gradient with a name on it says nothing; the finished unit in her hand says
 * "hardware" before anyone reads a word.
 *
 * Text is drawn as SVG rather than composited from a font file so that the
 * layout is described once and sharp handles rasterising. DejaVu is used
 * because it is present on this machine — the card is a static PNG, so the font
 * only has to exist at build time, not for the viewer.
 */
import { existsSync } from 'node:fs'
import path from 'node:path'
import process from 'node:process'

const W = 1200
const H = 630

const root = process.cwd()
const source = path.join(root, 'public', 'images', 'quepay', 'in-hand.webp')
const dest = path.join(root, 'public', 'og.jpg')

if (!existsSync(source)) {
  console.error(`[og] source photo missing: ${source}`)
  process.exit(1)
}

let sharp
try {
  ;({ default: sharp } = await import('sharp'))
} catch {
  console.error('[og] sharp is required — run npm install')
  process.exit(1)
}

// Scrim: dark on the left where the text sits, clearing toward the right so the
// photo still reads. Without it the type fails contrast over a light frame.
const overlay = Buffer.from(`
<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="scrim" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%"  stop-color="#0B1012" stop-opacity="0.94"/>
      <stop offset="55%" stop-color="#0B1012" stop-opacity="0.80"/>
      <stop offset="100%" stop-color="#0B1012" stop-opacity="0.35"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#scrim)"/>
  <rect x="72" y="150" width="54" height="4" fill="#4FB3A4"/>
  <text x="72" y="228" font-family="DejaVu Serif, Georgia, serif" font-size="62" font-weight="700" fill="#F2F5F4">Ivy Matobori</text>
  <text x="72" y="286" font-family="DejaVu Sans Mono, monospace" font-size="25" letter-spacing="2.4" fill="#4FB3A4">INSTRUMENTATION &amp; CONTROL ENGINEER</text>
  <text x="72" y="360" font-family="DejaVu Sans, sans-serif" font-size="29" fill="#C2CBC9">Hardware and firmware for machines that have</text>
  <text x="72" y="400" font-family="DejaVu Sans, sans-serif" font-size="29" fill="#C2CBC9">to work unattended.</text>
  <text x="72" y="520" font-family="DejaVu Sans Mono, monospace" font-size="22" letter-spacing="1.6" fill="#8A9A9D">Nairobi, Kenya</text>
</svg>`)

// 'top' rather than 'attention': the source is a portrait, so a 1200x630 crop
// keeps one horizontal band of it. Entropy detection chose the keypad; the
// screen showing a live balance sits higher and is the more telling half.
const info = await sharp(source)
  .resize(W, H, { fit: 'cover', position: 'top' })
  .composite([{ input: overlay, top: 0, left: 0 }])
  // JPEG, not PNG. The card is a photograph with a little text over it, and
  // lossless was costing 770 KB for something every unfurl has to fetch.
  .jpeg({ quality: 88, mozjpeg: true })
  .toFile(dest)

console.log(`[og] public/og.jpg  ${info.width}x${info.height}  ${Math.round(info.size / 1024)} KB`)
