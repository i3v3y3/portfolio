import type { Metadata } from 'next'
import Link from 'next/link'
import PageShell from '@/components/PageShell'
import { experience } from '@/content/experience'
import { getEveryProject } from '@/lib/projects'

export const metadata: Metadata = {
  title: 'Work — Ivy Matobori',
  description:
    'Instrumentation and control engineering: payment controllers, field sensing hardware, satellite power distribution. Roles, dates and what was built.',
}

/**
 * Work: the annotated experience page.
 *
 * Roles with bullets rather than a wall of project cards. A card tells a reader
 * a project exists; an entry tells them what she was responsible for, which is
 * the question a hiring engineer actually has. Each role links through to its
 * case study for the depth.
 *
 * This page carries the dates now, so the timeline came off /about/ — the same
 * chronology in two places is duplication, not reinforcement.
 */
export default function WorkPage() {
  // Only link to case studies that actually built a page.
  const slugs = new Set(getEveryProject().map((p) => p.slug))

  return (
    <PageShell
      title="Work"
      intro={
        <>
          <p className="mb-3 text-foreground">
            Instrumentation, hardware, firmware — and the field.
          </p>
          <p>
            I design the boards, write the firmware that runs on them, and go out to site when
            the readings stop making sense. Roles and dates below; the case studies go deeper
            on individual builds.
          </p>
        </>
      }
    >
      {experience.map((group) => (
        <section key={group.heading} className="mb-14" aria-labelledby={`grp-${group.heading}`}>
          <h2
            id={`grp-${group.heading}`}
            className="mb-6 font-mono text-[12px] font-medium uppercase tracking-[0.14em] text-foreground"
          >
            {group.heading}
          </h2>

          <div className="flex flex-col">
            {group.roles.map((role) => (
              <article
                key={`${role.org}-${role.period}`}
                className="grid grid-cols-1 gap-3 border-t border-border py-7 sm:grid-cols-[minmax(0,15rem)_minmax(0,1fr)] sm:gap-8"
              >
                <header className="flex flex-col gap-1">
                  <h3 className="text-[16px] font-semibold text-foreground">
                    {role.orgHref ? (
                      <a
                        href={role.orgHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-foreground no-underline hover:text-accent"
                      >
                        {role.org}
                        <span aria-hidden="true" className="ml-1 text-[11px] text-muted-dim">
                          ↗
                        </span>
                      </a>
                    ) : (
                      role.org
                    )}
                  </h3>
                  <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted">
                    {role.title}
                  </p>
                  <p className="font-mono text-[11px] tabular-nums text-muted-dim">
                    {role.period}
                    {role.current && (
                      <span className="ml-2 inline-flex items-center gap-1.5 text-accent">
                        <span
                          aria-hidden="true"
                          className="inline-block h-1.5 w-1.5 rounded-full bg-accent"
                        />
                        current
                      </span>
                    )}
                  </p>
                  <p className="text-[13px] text-muted-dim">{role.location}</p>
                </header>

                <div className="flex flex-col gap-3">
                  <ul className="flex list-disc flex-col gap-2 pl-4 text-[15px] leading-relaxed text-muted marker:text-muted-dim">
                    {role.points.map((p) => (
                      <li key={p}>{p}</li>
                    ))}
                  </ul>

                  {role.project && slugs.has(role.project.slug) && (
                    <Link
                      href={`/work/${role.project.slug}/`}
                      className="inline-flex min-h-[44px] items-center gap-2 self-start text-[14px] text-accent no-underline hover:underline"
                    >
                      {role.project.label}
                      <span aria-hidden="true">→</span>
                    </Link>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>
      ))}

      <p className="border-t border-border pt-6 text-[14px] text-muted">
        For photographs of the hardware and the bench, see the{' '}
        <Link href="/gallery/" className="text-accent no-underline hover:underline">
          gallery
        </Link>
        . For how any of this can be checked independently, see{' '}
        <Link href="/about/" className="text-accent no-underline hover:underline">
          about
        </Link>
        .
      </p>
    </PageShell>
  )
}
