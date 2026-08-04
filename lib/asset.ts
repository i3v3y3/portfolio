/**
 * Prefix a public/ asset path with the deployment base path.
 *
 * GitHub Pages serves a project site from a subpath — i3v3y3.github.io/portfolio
 * — so `/Ivy_Matobori_Resume.pdf` resolves to i3v3y3.github.io/Ivy_Matobori_Resume.pdf
 * and 404s.
 *
 * `next/link` applies basePath on its own. Everything else here does NOT:
 * a raw <a href>, a raw <img src>, and — the one that catches people —
 * `next/image` when `images.unoptimized` is set, because the default loader
 * then passes src through untouched. All of those need this.
 *
 * None of it reproduces locally, where NEXT_PUBLIC_BASE_PATH is empty and every
 * path works either way. It only breaks on the deploy.
 *
 * On a custom domain the site sits at the root, NEXT_PUBLIC_BASE_PATH is empty,
 * and this is a no-op. One env var flips the whole site between the two.
 */
const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? ''

export function asset(path: string): string {
  if (!path.startsWith('/')) throw new Error(`asset() needs a root-relative path, got: ${path}`)
  return `${BASE}${path}`
}

/** Widths scripts/import-photos.mjs emits beside each full-size image. */
const VARIANTS = [400, 800]

/**
 * srcset for an image, given its real pixel width.
 *
 * The width matters. An earlier version advertised 400w and 800w for every
 * image and labelled the original 1600w — but the importer skips a variant
 * when the source is already narrower, so an 800px photo got a srcset pointing
 * at a -800 file that was never written. A 404 inside srcset does not fall back
 * to src; the browser renders nothing. Pass the width from the manifest and
 * only real files are offered.
 *
 * Returns undefined when there is nothing useful to offer — a generated PNG, or
 * an image already smaller than the narrowest variant — and the caller should
 * then omit the attribute rather than emit an empty one.
 */
export function srcSet(path: string, width?: number): string | undefined {
  if (!path.endsWith('.webp') || !width) return undefined
  const available = VARIANTS.filter((w) => w < width)
  if (available.length === 0) return undefined
  return [
    ...available.map((w) => `${asset(path.replace(/\.webp$/, `-${w}.webp`))} ${w}w`),
    `${asset(path)} ${width}w`,
  ].join(', ')
}
