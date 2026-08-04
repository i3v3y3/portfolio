import type { Metadata } from 'next'
import PageShell from '@/components/PageShell'
import ProjectCard from '@/components/ProjectCard'
import { getEveryProject } from '@/lib/projects'

export const metadata: Metadata = {
  title: 'Work — Ivy Matobori',
  description:
    'Hardware and firmware case studies: payment controllers, field instrumentation, power distribution.',
}

/**
 * All work. Uses getEveryProject() rather than getAllProjects() — the home page
 * shows the featured three, this shows everything that has a page, so an
 * unfeatured project is still reachable rather than orphaned behind a URL only
 * the sitemap knows about.
 */
export default function WorkPage() {
  const projects = getEveryProject()

  return (
    <PageShell
      title="Work"
      intro="Case studies from four years of hardware. Each one covers what the problem was, what I built, and what it measured afterwards."
    >
      {projects.length === 0 ? (
        <p className="text-[14px] text-muted-dim">No projects published yet.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((meta) => (
            <ProjectCard key={meta.slug} meta={meta} />
          ))}
        </div>
      )}
    </PageShell>
  )
}
