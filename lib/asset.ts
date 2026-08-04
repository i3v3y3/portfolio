/**
 * Prefix a public/ asset path with the deployment base path.
 *
 * GitHub Pages serves a project site from a subpath — i3v3y3.github.io/portfolio
 * — so `/Ivy_Matobori_Resume.pdf` resolves to i3v3y3.github.io/Ivy_Matobori_Resume.pdf
 * and 404s. `next/link` and `next/image` apply basePath on their own; a raw
 * <a href> or <img src> does not, so those need this.
 *
 * On a custom domain the site sits at the root, NEXT_PUBLIC_BASE_PATH is empty,
 * and this is a no-op. One env var flips the whole site between the two.
 */
const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? ''

export function asset(path: string): string {
  if (!path.startsWith('/')) throw new Error(`asset() needs a root-relative path, got: ${path}`)
  return `${BASE}${path}`
}
