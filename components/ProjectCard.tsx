import Link from 'next/link'
import Image from 'next/image'
import type { ProjectMeta } from '@/lib/projects'
import { formatDate } from '@/lib/utils'
import { asset } from '@/lib/asset'

/**
 * Project card.
 *
 * EMPTY-COVER BEHAVIOUR (E8b). The source repo fell back to a 2-letter
 * monogram tile when `cover` was null. Every project here currently has a null
 * cover — employer IP means most board photos cannot be published — so that
 * fallback would have rendered four initial tiles and called it a design.
 * Instead the empty state is an explicit dashed slot naming what belongs
 * there, matching the HTML mockup. It reads as pending, not as a decision.
 */
export default function ProjectCard({ meta }: { meta: ProjectMeta }) {
  return (
    <Link
      href={`/work/${meta.slug}/`}
      className="group flex flex-col rounded-xl overflow-hidden border border-border bg-surface transition-colors duration-150 hover:border-border-hover"
    >
      {meta.cover ? (
        <div className="relative w-full h-[160px] overflow-hidden">
          {/* asset() even though this is next/image: with images.unoptimized
              the loader passes src straight through and basePath is NOT
              applied, so on the Pages deploy this 404s. Caught live, not in
              dev, because basePath is empty locally. */}
          <Image
            src={asset(meta.cover)}
            alt={`${meta.title} — hardware`}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 1024px) 100vw, 33vw"
          />
        </div>
      ) : (
        <div className="w-full h-[160px] grid place-items-center border-b border-dashed border-border bg-surface-hover px-4 text-center">
          <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-dim">
            {meta.coverCaption ?? 'Board photo pending'}
          </span>
        </div>
      )}

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2 flex items-start justify-between gap-3">
          <span className="font-mono text-[12px] uppercase tracking-wider text-muted-dim">
            {formatDate(meta.date)}
          </span>
          <span
            aria-hidden="true"
            className="text-sm text-muted-dim transition-colors duration-150 group-hover:text-accent"
          >
            →
          </span>
        </div>

        <h3 className="mb-1.5 text-[17px] font-semibold text-foreground">
          {meta.title}
        </h3>

        {meta.result && (
          <p className="mb-2 text-[14px] text-accent">{meta.result}</p>
        )}

        <p className="mb-4 line-clamp-3 text-[14px] leading-relaxed text-muted">
          {meta.description}
        </p>

        <div className="mt-auto flex flex-wrap gap-1.5">
          {meta.stack.slice(0, 4).map((s) => (
            <span
              key={s}
              className="rounded bg-accent-light px-2 py-0.5 font-mono text-[11px] text-muted"
            >
              {s}
            </span>
          ))}
        </div>
      </div>
    </Link>
  )
}
