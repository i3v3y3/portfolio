/**
 * Generate the PCB routing used as a background texture.
 *
 *   node scripts/make-trace-field.mjs > /tmp/preview.svg
 *
 * Output is pasted into components/TraceField.tsx. It is generated rather than
 * drawn by hand so the routing obeys rules instead of taste, and regenerating
 * with a different seed gives a different but equally plausible board.
 *
 * WHY THIS AND NOT A CIRCUIT-BOARD GRAPHIC
 *
 * The stock "tech background" — glowing lines, scattered rectangles, traces
 * meeting at arbitrary angles — looks nothing like a board. Real routing has
 * properties that are cheap to honour and are the whole difference between
 * texture and clip-art:
 *
 *   - Segments run at 0, 45 or 90 degrees. Never anything else.
 *   - Corners are mitred, not square. A right-angle corner on a real board is
 *     an acid trap in fabrication and an impedance discontinuity in signal.
 *   - Related signals route as a bundle: parallel, constant pitch, turning
 *     together. Buses are most of what a dense board looks like.
 *   - Power is fat, signal is thin.
 *   - Vias sit at the ends of things, not scattered decoratively.
 */

const WIDTH = 1600
const HEIGHT = 620
const PITCH = 9 // trace-to-trace spacing within a bundle
const MITRE = 10 // corner chamfer

// Deterministic, so the committed SVG matches this script's output. Any small
// PRNG does; this is the standard 32-bit xorshift.
let seed = 0x5eed1234
function random() {
  seed ^= seed << 13
  seed ^= seed >>> 17
  seed ^= seed << 5
  return ((seed >>> 0) % 100000) / 100000
}

const pick = (xs) => xs[Math.floor(random() * xs.length)]

/**
 * Route one trace from a start point, turning at 45 degrees with mitred
 * corners, until it leaves the canvas or runs out of segments.
 */
function route(x, y, dx, dy, segments) {
  const points = [[x, y]]

  for (let i = 0; i < segments; i++) {
    const run = 60 + Math.floor(random() * 220)
    x += dx * run
    y += dy * run
    points.push([x, y])

    if (x < -100 || x > WIDTH + 100 || y < -100 || y > HEIGHT + 100) {
      break
    }

    // Turn by 45 degrees, either way. Straight-on is not an option because two
    // collinear segments are one segment, and a board that never turns reads
    // as ruled lines rather than routing.
    const turn = random() < 0.5 ? 1 : -1
    const angle = Math.atan2(dy, dx) + (turn * Math.PI) / 4
    dx = Math.round(Math.cos(angle) * 1000) / 1000
    dy = Math.round(Math.sin(angle) * 1000) / 1000
  }

  return points
}

/** Path data with the corners chamfered rather than square. */
function mitred(points) {
  if (points.length < 2) {
    return ''
  }

  let d = `M ${points[0][0].toFixed(1)} ${points[0][1].toFixed(1)}`

  for (let i = 1; i < points.length - 1; i++) {
    const [px, py] = points[i - 1]
    const [cx, cy] = points[i]
    const [nx, ny] = points[i + 1]

    const inLen = Math.hypot(cx - px, cy - py) || 1
    const outLen = Math.hypot(nx - cx, ny - cy) || 1
    const back = Math.min(MITRE, inLen / 2)
    const fwd = Math.min(MITRE, outLen / 2)

    d += ` L ${(cx - ((cx - px) / inLen) * back).toFixed(1)} ${(cy - ((cy - py) / inLen) * back).toFixed(1)}`
    d += ` L ${(cx + ((nx - cx) / outLen) * fwd).toFixed(1)} ${(cy + ((ny - cy) / outLen) * fwd).toFixed(1)}`
  }

  const last = points[points.length - 1]
  d += ` L ${last[0].toFixed(1)} ${last[1].toFixed(1)}`
  return d
}

/** A bundle of parallel traces, offset perpendicular to the start direction. */
function bundle(x, y, dx, dy, count, segments) {
  const paths = []
  const px = -dy
  const py = dx

  for (let i = 0; i < count; i++) {
    const offset = (i - (count - 1) / 2) * PITCH
    paths.push(route(x + px * offset, y + py * offset, dx, dy, segments))
  }

  return paths
}

const D = 0.7071
const directions = [
  [1, 0],
  [D, D],
  [D, -D],
  [0, 1],
]

const signal = []
const power = []
const vias = []

// Buses. Most of what a dense board looks like.
for (let i = 0; i < 7; i++) {
  const [dx, dy] = pick(directions)
  const paths = bundle(
    random() * WIDTH,
    random() * HEIGHT,
    dx,
    dy,
    2 + Math.floor(random() * 4),
    2 + Math.floor(random() * 3)
  )
  paths.forEach((p) => {
    signal.push(mitred(p))
    // A via at the end of a run, where a trace would change layer.
    if (random() < 0.35) {
      vias.push(p[p.length - 1])
    }
  })
}

// Single signals filling the gaps between bundles.
for (let i = 0; i < 14; i++) {
  const [dx, dy] = pick(directions)
  const p = route(random() * WIDTH, random() * HEIGHT, dx, dy, 2 + Math.floor(random() * 3))
  signal.push(mitred(p))
  if (random() < 0.3) {
    vias.push(p[p.length - 1])
  }
}

// Power. Fewer, fatter, straighter — they carry current and want short paths.
for (let i = 0; i < 3; i++) {
  const [dx, dy] = pick(directions)
  power.push(mitred(route(random() * WIDTH, random() * HEIGHT, dx, dy, 2)))
}

const out = []
out.push(`<g class="trace-signal">`)
signal.forEach((d) => out.push(`<path d="${d}"/>`))
out.push(`</g>`)
out.push(`<g class="trace-power">`)
power.forEach((d) => out.push(`<path d="${d}"/>`))
out.push(`</g>`)
out.push(`<g class="trace-via">`)
vias
  .filter(([x, y]) => x > 0 && x < WIDTH && y > 0 && y < HEIGHT)
  .forEach(([x, y]) => out.push(`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="4"/>`))
out.push(`</g>`)

console.log(`<svg viewBox="0 0 ${WIDTH} ${HEIGHT}" xmlns="http://www.w3.org/2000/svg">`)
console.log(`<style>
.trace-signal path { fill: none; stroke: #b3541e; stroke-width: 2; }
.trace-power path  { fill: none; stroke: #b3541e; stroke-width: 5; }
.trace-via circle  { fill: none; stroke: #b3541e; stroke-width: 2.5; }
</style>`)
console.log(out.join('\n'))
console.log(`</svg>`)
