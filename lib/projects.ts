import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { z } from 'zod'

export interface ProjectMeta {
  title: string
  slug: string
  description: string
  stack: string[]
  date: string
  github: string | null
  demo: string | null
  featured: boolean
  cover: string | null
  /** Caption for the empty-cover slot, e.g. "Board photo — top and bottom". */
  coverCaption?: string
  result?: string
  /** Spec table rows, `[label, value]`. Rendered under the cover. */
  specs?: [string, string][]
  /** System diagram, rendered before the photographs. */
  architecture?: { caption?: string; nodes: ArchNode[] }
}

/**
 * A node in the architecture tree.
 *
 * This lives in frontmatter rather than as a component in the MDX body because
 * JSX expression props do not survive next-mdx-remote's RSC runtime — the
 * compiler emits them but they arrive undefined. It is also the better home:
 * a parts list and a block diagram are structured facts about the project,
 * the same kind of thing as `stack` and `date`, not prose.
 */
export interface ArchNode {
  label: string
  note?: string
  children?: ArchNode[]
}

// Recursive, so it needs the explicit annotation zod cannot infer on its own.
const ArchNodeSchema: z.ZodType<ArchNode> = z.lazy(() =>
  z.object({
    label: z.string(),
    note: z.string().optional(),
    children: z.array(ArchNodeSchema).optional(),
  })
)

const ProjectMetaSchema = z.object({
  title: z.string(),
  slug: z.string(),
  description: z.string(),
  stack: z.array(z.string()),
  date: z.string(),
  github: z.string().nullable().default(null),
  demo: z.string().nullable().default(null),
  featured: z.boolean(),
  cover: z.string().nullable().default(null),
  coverCaption: z.string().optional(),
  result: z.string().optional(),
  specs: z.array(z.tuple([z.string(), z.string()])).optional(),
  architecture: z
    .object({
      caption: z.string().optional(),
      nodes: z.array(ArchNodeSchema),
    })
    .optional(),
})

const projectsDir = path.join(process.cwd(), 'content', 'projects')

/**
 * Frontmatter validation, guarded.
 *
 *   content/projects/*.mdx
 *          │
 *          ├── parseProject()  ──▶ ok?  ──▶ ProjectMeta
 *          │                        │
 *          │                        └── no ─▶ warn(filename, issue) ─▶ null
 *          │
 *          ├── readProjects()      drops nulls   → cards, sitemap
 *          ├── getAllProjectSlugs() drops nulls  → generateStaticParams
 *          └── getProjectBySlug()   THROWS       → a routed page must render
 *
 * All three read paths share parseProject so they agree on which files are
 * valid. Guarding only readProjects would leave getAllProjectSlugs generating
 * a route for a file that then throws in getProjectBySlug — the build dies
 * anyway, just later and with a worse message.
 *
 * Slugs come from the filtered list, so a skipped file never gets a route.
 * The throw in getProjectBySlug is therefore unreachable via the router and
 * exists only for direct callers.
 */
function parseProject(filename: string): ProjectMeta | null {
  const raw = fs.readFileSync(path.join(projectsDir, filename), 'utf8')
  const { data } = matter(raw)
  const result = ProjectMetaSchema.safeParse(data)
  if (!result.success) {
    const issues = result.error.issues
      .map((i) => `${i.path.join('.') || '(root)'}: ${i.message}`)
      .join('; ')
    console.warn(
      `[projects] Skipping content/projects/${filename} — invalid frontmatter. ${issues}`
    )
    return null
  }
  return result.data
}

function mdxFilenames(): string[] {
  return fs.readdirSync(projectsDir).filter((f) => f.endsWith('.mdx'))
}

function readProjects(): ProjectMeta[] {
  return mdxFilenames()
    .map(parseProject)
    .filter((p): p is ProjectMeta => p !== null)
    .sort((a, b) => (a.date < b.date ? 1 : -1))
}

export function getAllProjects(): ProjectMeta[] {
  return readProjects().filter((p) => p.featured)
}

/** Every project that has a built page, featured or not — used by the sitemap. */
export function getEveryProject(): ProjectMeta[] {
  return readProjects()
}

export function getProjectBySlug(slug: string): { meta: ProjectMeta; content: string } {
  const filePath = path.join(projectsDir, `${slug}.mdx`)
  if (!fs.existsSync(filePath)) {
    throw new Error(`Project not found: ${slug}`)
  }
  const raw = fs.readFileSync(filePath, 'utf8')
  const { data, content } = matter(raw)
  const result = ProjectMetaSchema.safeParse(data)
  if (!result.success) {
    const issues = result.error.issues
      .map((i) => `${i.path.join('.') || '(root)'}: ${i.message}`)
      .join('; ')
    throw new Error(
      `Invalid frontmatter in content/projects/${slug}.mdx — ${issues}`
    )
  }
  return { meta: result.data, content }
}

/**
 * Slugs for generateStaticParams. Shares parseProject with readProjects so a
 * file that fails validation never gets a route generated for it.
 */
export function getAllProjectSlugs(): string[] {
  return mdxFilenames()
    .filter((f) => parseProject(f) !== null)
    .map((f) => f.replace(/\.mdx$/, ''))
}
