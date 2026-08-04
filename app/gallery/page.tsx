import type { Metadata } from 'next'
import PageShell from '@/components/PageShell'
import Gallery from '@/components/Gallery'
import VideoEmbeds from '@/components/VideoEmbeds'
import { galleryClusters } from '@/lib/photos'
import { videos } from '@/content/videos'

export const metadata: Metadata = {
  title: 'Gallery — Ivy Matobori',
  description:
    'Boards, bench work and field hardware: controller PCBs, operator interfaces, control panels and bring-up.',
}

export default function GalleryPage() {
  const groups = galleryClusters()

  return (
    <PageShell
      title="Gallery"
      intro="Photographs from the bench and from site. Most of the claims elsewhere on this site were made with the hardware in these pictures."
    >
      {groups.length === 0 ? (
        <p className="text-[14px] text-muted-dim">No photos published yet.</p>
      ) : (
        <Gallery groups={groups} />
      )}

      {videos.length > 0 && (
        <section className="mb-4" aria-labelledby="video-heading">
          <div className="mb-5 flex flex-col gap-1.5">
            <h2
              id="video-heading"
              className="font-mono text-[12px] font-medium uppercase tracking-[0.14em] text-foreground"
            >
              On video
            </h2>
            <p className="max-w-[38rem] text-[14px] leading-relaxed text-muted">
              Clips of the hardware in use and in build, posted by the companies I did the work
              for. They load from LinkedIn only when you press play.
            </p>
          </div>
          <VideoEmbeds videos={videos} />
        </section>
      )}
    </PageShell>
  )
}
