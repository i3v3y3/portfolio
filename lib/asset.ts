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
 * srcset for a photo in the manifest.
 *
 * The importer writes foo-400.webp and foo-800.webp next to foo.webp, so the
 * browser can take a 400px file for a 200px tile instead of the 1600px one.
 * That was most of a 2.4 MB home page.
 *
 * Pair it with a `sizes` attribute describing the slot — without one the
 * browser assumes 100vw and picks the largest file, which undoes the point.
 * Variants are only written when the source is wider, so a small render may
 * have none; the full-size entry at the end is always a valid fallback.
 */
export function srcSet(path: string): string {
  return [...VARIANTS.map((w) => `${asset(path.replace(/\.webp$/, `-${w}.webp`))} ${w}w`),
    `${asset(path)} 1600w`].join(', ')
}
