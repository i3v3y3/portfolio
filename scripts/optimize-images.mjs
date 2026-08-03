/**
 * Build-time image optimization.
 *
 *   public/**.{jpg,jpeg,png}  ──▶  sharp  ──▶  resize to max 1600px wide
 *                                              ──▶  .webp beside the original
 *
 * next.config.ts sets images.unoptimized because output:"export" has no server
 * to resize on request. Without this step a 4 MB phone photo of a PCB ships at
 * 4 MB, and the audience includes people on metered mobile connections.
 *
 * Skips anything already converted and newer than its source. No-ops cleanly
 * when there are no images yet, which is the current state.
 */
import { readdir, stat } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'

const PUBLIC_DIR = path.join(process.cwd(), 'public')
const MAX_WIDTH = 1600
const EXTS = new Set(['.jpg', '.jpeg', '.png'])

async function walk(dir) {
  const out = []
  let entries
  try {
    entries = await readdir(dir, { withFileTypes: true })
  } catch {
    return out
  }
  for (const e of entries) {
    const full = path.join(dir, e.name)
    if (e.isDirectory()) out.push(...(await walk(full)))
    else if (EXTS.has(path.extname(e.name).toLowerCase())) out.push(full)
  }
  return out
}

const files = await walk(PUBLIC_DIR)

if (files.length === 0) {
  console.log('[images] none found in public/ — nothing to optimize')
  process.exit(0)
}

let sharp
try {
  ;({ default: sharp } = await import('sharp'))
} catch {
  console.warn('[images] sharp not installed — skipping optimization')
  process.exit(0)
}

let converted = 0
for (const file of files) {
  const out = file.replace(/\.(jpe?g|png)$/i, '.webp')
  if (existsSync(out)) {
    const [a, b] = await Promise.all([stat(file), stat(out)])
    if (b.mtimeMs >= a.mtimeMs) continue
  }
  await sharp(file)
    .resize({ width: MAX_WIDTH, withoutEnlargement: true })
    .webp({ quality: 82 })
    .toFile(out)
  converted++
  console.log(`[images] ${path.relative(PUBLIC_DIR, out)}`)
}
console.log(`[images] ${converted} converted, ${files.length - converted} up to date`)
