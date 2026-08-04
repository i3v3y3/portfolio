import Link from 'next/link'
import { MDXRemote } from 'next-mdx-remote/rsc'
import remarkGfm from 'remark-gfm'
import rehypeSlug from 'rehype-slug'
import rehypePrettyCode from 'rehype-pretty-code'
import { getAllProjectSlugs, getProjectBySlug } from '@/lib/projects'
import StackPill from '@/components/StackPill'
import SpecTable from '@/components/SpecTable'
import Architecture from '@/components/Architecture'
import Footer from '@/components/Footer'
import { formatDate } from '@/lib/utils'
import { photosForProject } from '@/lib/photos'
import { asset, srcSet } from '@/lib/asset'

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
  // The cover already appears at the top; don't repeat it in the figure grid.
  const figures = photosForProject(slug).filter((p) => p.src !== meta.cover)

  return (
    <div className="mx-auto max-w-[46rem] px-5 pb-16 pt-10 sm:px-8 sm:pt-16">
      {/* FINDING-007: trunk test. Someone arriving here from a search result
          used to see a project title and no indication whose site this is
          until the footer. The name is now the back link. */}
      <Link
        href="/"
        className="mb-10 inline-flex min-h-[44px] items-center gap-2 text-[14px] text-muted no-underline hover:text-accent"
      >
        <span aria-hidden="true">←</span>
        <span className="font-medium text-foreground">Ivy Matobori</span>
        <span className="text-muted-dim">· Embedded Systems Engineer</span>
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

        {/* No empty placeholder here. A pending slot is a note to ourselves;
            a reader should see the writing, not a hole where a photo isn't. */}
        {meta.cover && (
          <div className="mb-8 overflow-hidden rounded-xl border border-border">
            {/* asset() because a raw <img> does not get basePath applied — on
                the Pages deploy this resolves to /portfolio/images/… and
                without it the cover 404s on every project page. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={asset(meta.cover)}
              alt={meta.title}
              className="aspect-[16/10] w-full object-cover"
            />
          </div>
        )}

        {/* Specs before the prose: a recruiter screening for a hardware role
            scans for parts and protocols before reading a sentence, and this
            was previously scattered across pills and three paragraphs. */}
        {meta.specs && <SpecTable rows={meta.specs} />}

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

        {/* Diagram after the prose but before the photographs: it explains
            what the pictures then show. */}
        {meta.architecture && (
          <section className="mt-10" aria-labelledby="arch-heading">
            <h2
              id="arch-heading"
              className="mb-1 font-mono text-[12px] font-medium uppercase tracking-[0.14em] text-foreground"
            >
              How it fits together
            </h2>
            <Architecture
              nodes={meta.architecture.nodes}
              caption={meta.architecture.caption}
            />
          </section>
        )}

        {figures.length > 0 && (
          <section className="mt-12" aria-labelledby="figures-heading">
            <h2
              id="figures-heading"
              className="mb-5 font-mono text-[12px] font-medium uppercase tracking-[0.14em] text-foreground"
            >
              From the bench
            </h2>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {figures.map((photo) => (
                <figure key={photo.src} className="flex flex-col gap-2">
                  <div className="overflow-hidden rounded-xl border border-border bg-surface">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={asset(photo.src)}
                      srcSet={srcSet(photo.src)}
                      sizes="(max-width: 640px) 100vw, 350px"
                      alt={photo.alt}
                      loading="lazy"
                      decoding="async"
                      className={`aspect-[4/3] w-full ${
                        photo.fit === 'contain' ? 'object-contain p-2' : 'object-cover'
                      } ${photo.focus === 'top' ? 'object-top' : ''}`}
                    />
                  </div>
                  <figcaption className="text-[13px] leading-snug text-muted">
                    {photo.caption}
                  </figcaption>
                </figure>
              ))}
            </div>
          </section>
        )}

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
