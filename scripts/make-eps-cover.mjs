/**
 * Build the cover for the satellite EPS case study: public/images/power/eps-architecture.png
 *
 * Run:  node scripts/make-eps-cover.mjs      (output is committed; not in CI)
 *
 * WHY A DIAGRAM AND NOT A PHOTOGRAPH.
 *
 * There is no photograph of this board. The placement ran Jan–Mar 2023 and
 * nothing in the archive dates to it. The two Blender renders in the power
 * cluster are a mains smart-switch — "BULB IN" on the silkscreen, a mains
 * varistor, a relay and a PCB trace antenna — so captioning either as a CubeSat
 * EPS would be mislabelling hardware on a portfolio, which is worse than an
 * empty slot.
 *
 * A diagram is honest: it depicts the architecture she describes designing
 * rather than implying a photograph of a board that is not shown. It also
 * happens to be the most legible thing about the project — the six-branch
 * fault-isolation split is the design decision the whole case study turns on.
 *
 * Colours are the site's own light-theme tokens so the card does not look
 * pasted in. Rendered at 16:10 to match the aspect the cover is displayed at.
 */
import path from 'node:path'
import process from 'node:process'

const W = 1200
const H = 750

const INK = '#14181a'
const MUTED = '#5d6f71'
const ACCENT = '#0f766e'
const LINE = '#d6dbd9'
const PANEL = '#ffffff'
const GROUND = '#f2f5f4'

let sharp
try {
  ;({ default: sharp } = await import('sharp'))
} catch {
  console.error('[eps] sharp is required — run npm install')
  process.exit(1)
}

const branchX = (i) => 168 + i * 156
const BRANCH_TOP = 470
const RAIL_Y = 372

const branches = Array.from({ length: 6 }, (_, i) => {
  const x = branchX(i)
  // Branch 3 is drawn faulted: that is the point of the picture. A short opens
  // its own device and the other five keep running.
  const faulted = i === 2
  const stroke = faulted ? '#b3541e' : LINE
  const label = faulted ? '#b3541e' : MUTED
  return `
    <line x1="${x + 44}" y1="${RAIL_Y + 46}" x2="${x + 44}" y2="${BRANCH_TOP}" stroke="${stroke}" stroke-width="2"/>
    <rect x="${x}" y="${BRANCH_TOP}" width="88" height="52" rx="7" fill="${PANEL}" stroke="${stroke}" stroke-width="${faulted ? 2.5 : 1.5}"/>
    <text x="${x + 44}" y="${BRANCH_TOP + 32}" font-family="DejaVu Sans Mono, monospace" font-size="19" fill="${label}" text-anchor="middle">${faulted ? 'OC↯' : 'OC'}</text>
    <line x1="${x + 44}" y1="${BRANCH_TOP + 52}" x2="${x + 44}" y2="${BRANCH_TOP + 96}" stroke="${faulted ? '#e4c9b8' : stroke}" stroke-width="2" ${faulted ? 'stroke-dasharray="5 5"' : ''}/>
    <rect x="${x + 6}" y="${BRANCH_TOP + 96}" width="76" height="44" rx="7" fill="${faulted ? GROUND : PANEL}" stroke="${faulted ? '#e4c9b8' : LINE}" stroke-width="1.5"/>
    <text x="${x + 44}" y="${BRANCH_TOP + 124}" font-family="DejaVu Sans Mono, monospace" font-size="15" fill="${faulted ? '#b3541e' : MUTED}" text-anchor="middle">L${i + 1}</text>`
}).join('')

const svg = `
<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${W}" height="${H}" fill="${GROUND}"/>

  <text x="64" y="88" font-family="DejaVu Sans Mono, monospace" font-size="20" letter-spacing="2.6" fill="${ACCENT}">ELECTRICAL POWER SYSTEM</text>
  <text x="64" y="140" font-family="DejaVu Serif, Georgia, serif" font-size="40" font-weight="700" fill="${INK}">Six branches, not one bus</text>

  <!-- source -->
  <rect x="64" y="200" width="220" height="66" rx="9" fill="${PANEL}" stroke="${LINE}" stroke-width="1.5"/>
  <text x="174" y="240" font-family="DejaVu Sans Mono, monospace" font-size="19" fill="${INK}" text-anchor="middle">SOLAR + BATTERY</text>
  <line x1="284" y1="233" x2="360" y2="233" stroke="${LINE}" stroke-width="2"/>

  <!-- conversion -->
  <rect x="360" y="200" width="250" height="66" rx="9" fill="${PANEL}" stroke="${LINE}" stroke-width="1.5"/>
  <text x="485" y="232" font-family="DejaVu Sans Mono, monospace" font-size="18" fill="${INK}" text-anchor="middle">4 × DC-DC RAILS</text>
  <text x="485" y="252" font-family="DejaVu Sans, sans-serif" font-size="15" fill="${MUTED}" text-anchor="middle">filtered, redundant paths</text>

  <!-- drop to the distribution rail -->
  <line x1="485" y1="266" x2="485" y2="${RAIL_Y}" stroke="${LINE}" stroke-width="2"/>
  <line x1="${branchX(0) + 44}" y1="${RAIL_Y}" x2="${branchX(5) + 44}" y2="${RAIL_Y}" stroke="${LINE}" stroke-width="2"/>
  <text x="${branchX(5) + 104}" y="${RAIL_Y + 6}" font-family="DejaVu Sans Mono, monospace" font-size="16" fill="${MUTED}">bus</text>

  ${Array.from({ length: 6 }, (_, i) => `<line x1="${branchX(i) + 44}" y1="${RAIL_Y}" x2="${branchX(i) + 44}" y2="${RAIL_Y + 46}" stroke="${LINE}" stroke-width="2"/>`).join('')}
  ${branches}

  <text x="64" y="${BRANCH_TOP + 196}" font-family="DejaVu Sans, sans-serif" font-size="19" fill="${MUTED}">A short on any branch opens its own overcurrent device.</text>
  <text x="64" y="${BRANCH_TOP + 226}" font-family="DejaVu Sans, sans-serif" font-size="19" fill="${MUTED}">The other five keep running.</text>

  <text x="${W - 64}" y="${H - 40}" font-family="DejaVu Sans Mono, monospace" font-size="16" fill="${MUTED}" text-anchor="end">6-layer · 4 rails · 5 W orbit-average</text>
</svg>`

const dest = path.join(process.cwd(), 'public', 'images', 'power', 'eps-architecture.png')
const info = await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile(dest)
console.log(`[eps] ${path.relative(process.cwd(), dest)}  ${info.width}x${info.height}  ${Math.round(info.size / 1024)} KB`)
