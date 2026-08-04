'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import type { Cluster, Photo } from '@/lib/photos'
import { asset } from '@/lib/asset'

/**
 * Photo gallery with a lightbox.
 *
 * One flat list drives both the grid and the lightbox, so arrow-key paging
 * crosses cluster boundaries the way a reader expects rather than dead-ending
 * at the last photo of a section.
 *
 * ACCESSIBILITY. The lightbox is a modal dialog: focus moves in on open and
 * returns to the triggering thumbnail on close, Tab is trapped inside it, and
 * Escape closes. Without the focus return, closing the lightbox dumps a
 * keyboard user back at the top of the document, which on a 24-image page means
 * tabbing all the way back to where they were.
 *
 * Images are plain <img> rather than next/image: output is a static export with
 * images.unoptimized, so next/image adds a wrapper and no optimisation. The
 * trade is that basePath is not applied automatically — hence asset().
 */
export default function Gallery({
  groups,
}: {
  groups: { cluster: Cluster; photos: Photo[] }[]
}) {
  const flat = groups.flatMap((g) => g.photos)
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const dialogRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const triggerRefs = useRef<(HTMLButtonElement | null)[]>([])

  /**
   * Focus returns to the thumbnail of whatever was on screen, not the one
   * originally clicked — after arrowing through five images, landing back on
   * the first is disorienting.
   *
   * The focus call is deliberately outside the state updater: updaters must be
   * pure and React may invoke them twice in development, which would fire this
   * twice. rAF waits for the dialog to unmount so focus is not stolen back.
   */
  const close = useCallback(() => {
    const i = openIndex
    setOpenIndex(null)
    if (i !== null) requestAnimationFrame(() => triggerRefs.current[i]?.focus())
  }, [openIndex])

  const step = useCallback(
    (delta: number) => setOpenIndex((i) => (i === null ? i : (i + delta + flat.length) % flat.length)),
    [flat.length]
  )

  useEffect(() => {
    if (openIndex === null) return

    closeRef.current?.focus()

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        close()
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        step(1)
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        step(-1)
      } else if (e.key === 'Tab') {
        // Trap. Only ever three controls in here, so query them fresh rather
        // than caching — the set changes as prev/next mount.
        const focusable = dialogRef.current?.querySelectorAll<HTMLElement>('button')
        if (!focusable || focusable.length === 0) return
        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }

    document.addEventListener('keydown', onKey)
    // Stop the page scrolling behind the overlay.
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [openIndex, close, step])

  const current = openIndex === null ? null : flat[openIndex]

  return (
    <>
      {groups.map(({ cluster, photos }) => (
        <section key={cluster.id} className="mb-16" aria-labelledby={`cluster-${cluster.id}`}>
          <div className="mb-5 flex flex-col gap-1.5">
            <h2
              id={`cluster-${cluster.id}`}
              className="font-mono text-[12px] font-medium uppercase tracking-[0.14em] text-foreground"
            >
              {cluster.label}
            </h2>
            <p className="max-w-[38rem] text-[14px] leading-relaxed text-muted">{cluster.blurb}</p>
          </div>

          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {photos.map((photo) => {
              const index = flat.indexOf(photo)
              return (
                <li key={photo.src}>
                  <button
                    ref={(el) => {
                      triggerRefs.current[index] = el
                    }}
                    type="button"
                    onClick={() => setOpenIndex(index)}
                    className="group flex w-full flex-col overflow-hidden rounded-xl border border-border bg-surface text-left transition-colors hover:border-border-hover"
                  >
                    <span className="block aspect-[4/3] w-full overflow-hidden bg-surface-hover">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={asset(photo.src)}
                        alt={photo.alt}
                        loading="lazy"
                        decoding="async"
                        className={`h-full w-full transition-transform duration-300 ${
                          photo.fit === 'contain'
                            ? 'object-contain p-2'
                            : 'object-cover group-hover:scale-105'
                        } ${photo.focus === 'top' ? 'object-top' : ''}`}
                      />
                    </span>
                    <span className="block px-4 py-3 text-[13px] leading-snug text-muted">
                      {photo.caption}
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
        </section>
      ))}

      {current && (
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label={current.caption}
          onClick={(e) => {
            if (e.target === e.currentTarget) close()
          }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-black/85 p-4 sm:p-8"
        >
          <img
            src={asset(current.src)}
            alt={current.alt}
            className="max-h-[70vh] max-w-full rounded-lg object-contain"
          />

          <p className="max-w-[40rem] text-center text-[14px] leading-relaxed text-white/85">
            {current.caption}
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => step(-1)}
              className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg border border-white/25 px-4 font-mono text-[12px] uppercase tracking-[0.14em] text-white/90 hover:border-white/60"
            >
              Prev
            </button>
            <span className="font-mono text-[12px] tabular-nums text-white/60">
              {(openIndex ?? 0) + 1} / {flat.length}
            </span>
            <button
              type="button"
              onClick={() => step(1)}
              className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg border border-white/25 px-4 font-mono text-[12px] uppercase tracking-[0.14em] text-white/90 hover:border-white/60"
            >
              Next
            </button>
          </div>

          <button
            ref={closeRef}
            type="button"
            onClick={close}
            aria-label="Close"
            className="absolute right-4 top-4 inline-flex h-11 w-11 items-center justify-center rounded-lg border border-white/25 text-white/90 hover:border-white/60"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
    </>
  )
}
