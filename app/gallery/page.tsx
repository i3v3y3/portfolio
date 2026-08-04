import type { Metadata } from 'next'
import PageShell from '@/components/PageShell'
import Gallery from '@/components/Gallery'
import { galleryClusters } from '@/lib/photos'

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
    </PageShell>
  )
}
