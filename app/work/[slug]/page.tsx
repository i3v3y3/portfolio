import Link from 'next/link'
import { MDXRemote } from 'next-mdx-remote/rsc'
import remarkGfm from 'remark-gfm'
import rehypeSlug from 'rehype-slug'
import rehypePrettyCode from 'rehype-pretty-code'
import { getAllProjectSlugs, getProjectBySlug } from '@/lib/projects'
import StackPill from '@/components/StackPill'
import Footer from '@/components/Footer'
import { formatDate } from '@/lib/utils'

export function generateStaticParams() {
  return getAllProjectSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const { meta } = getProjectBySlug(slug)
  return { title: `${meta.title} — Ivy Matobori`, description: meta.description }
}

/** Callout for a public source that corroborates a claim on the page. */
function Verify({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="my-6 inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-3.5 py-2.5 text-[14px] text-accent no-underline hover:border-accent"
    >
      <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
        <path d="M20 6 9 17l-5-5" />
      </svg>
      {label}
    </a>
  )
}

/** An open question for Ivy. Deliberately visible in dev, never in production. */
function Note({ children }: { children: React.ReactNode }) {
  if (process.env.NODE_ENV === 'production') return null
  return (
    <aside className="my-6 rounded-lg border border-dashed border-accent-muted bg-accent-light p-4 text-[14px] text-muted">
      <strong className="mb-1 block font-mono text-[11px] uppercase tracking-wider text-accent">
        Needs Ivy&apos;s confirmation
      </strong>
      {children}
    </aside>
  )
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const { meta, content } = getProjectBySlug(slug)

  return (
    <div className="mx-auto max-w-[46rem] px-5 pb-16 pt-10 sm:px-8 sm:pt-16">
      <Link href="/" className="mb-10 inline-block text-[14px] text-muted no-underline hover:text-accent">
        ← Back
      </Link>

      <article>
        <header className="mb-8 flex flex-col gap-3">
          <span className="font-mono text-[12px] uppercase tracking-wider text-muted-dim">
            {formatDate(meta.date)}
          </span>
          <h1 className="text-[clamp(1.75rem,1.4rem+1.6vw,2.4rem)]">{meta.title}</h1>
          {meta.result && <p className="text-[16px] text-accent">{meta.result}</p>}
          <div className="mt-1 flex flex-wrap gap-1.5">
            {meta.stack.map((s) => <StackPill key={s} label={s} />)}
          </div>
        </header>

        {!meta.cover && (
          <div className="mb-8 grid aspect-[16/10] place-items-center rounded-xl border border-dashed border-border bg-surface p-5 text-center">
            <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-dim">
              {meta.coverCaption ?? 'Photo pending'}
            </span>
          </div>
        )}

        <div className="prose-ivy flex flex-col gap-4 text-[16px] leading-relaxed text-muted">
          <MDXRemote
            source={content}
            components={{ Verify, Note }}
            options={{
              mdxOptions: {
                remarkPlugins: [remarkGfm],
                // N7: light theme to match the page. github-dark would put a
                // dark code block on a light teal page, and the teardown is
                // exactly where code and tables land.
                rehypePlugins: [rehypeSlug, [rehypePrettyCode, { theme: 'github-light' }]],
              },
            }}
          />
        </div>

        {meta.github && (
          <a
            href={meta.github}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-4 py-2.5 text-[15px] text-foreground no-underline hover:border-accent hover:text-accent"
          >
            View the repository
          </a>
        )}
      </article>

      <Footer />
    </div>
  )
}
