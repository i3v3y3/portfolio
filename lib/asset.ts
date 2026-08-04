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
