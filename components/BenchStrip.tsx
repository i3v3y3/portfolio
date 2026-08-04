import Link from 'next/link'
import type { Photo } from '@/lib/photos'
import { asset, srcSet } from '@/lib/asset'

/**
 * The "from the bench" strip: four tiles that swap image on hover.
 *
 * PURE CSS. Two images stacked, the second at opacity-0 until group-hover.
 * No state, no client component, no JS — which matters because this sits on a
 * static export and a hover effect is not worth shipping a bundle for.
 *
 * BOTH IMAGES LOAD EAGERLY. If the hover image were lazy the first hover would
 * show an empty box while it fetched, which reads as broken. Eight 400px webp
 * files is roughly 200 KB, and they are the only images above the fold besides
 * the cards.
 *
 * TOUCH. There is no hover on a phone, so the second image is never seen there.
 * That is fine — the primary has to stand on its own anyway — but it is why the
 * swap carries no information, only interest.
 *
 * REDUCED MOTION. The cross-fade is a transition, so it is disabled with
 * prefers-reduced-motion in globals.css. The swap still happens, instantly.
 */
export default function BenchStrip({ pairs }: { pairs: [Photo, Photo][] }) {
  return (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {pairs.map(([front, back]) => (
        <li key={front.src}>
          <Link
            href="/gallery/"
            aria-label={`${front.caption} — see all photos`}
            className="group relative block aspect-square overflow-hidden rounded-lg border border-border bg-surface"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={asset(front.src)}
              srcSet={srcSet(front.src, front.width)}
              sizes="(max-width: 640px) 50vw, 220px"
              alt={front.alt}
              decoding="async"
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 group-hover:opacity-0 ${
                front.focus === 'top' ? 'object-top' : ''
              }`}
            />
            {/* aria-hidden: the same tile, so announcing a second alt would just
                repeat the link for a screen reader with no hover to trigger. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={asset(back.src)}
              srcSet={srcSet(back.src, back.width)}
              sizes="(max-width: 640px) 50vw, 220px"
              alt=""
              aria-hidden="true"
              decoding="async"
              className={`absolute inset-0 h-full w-full scale-105 object-cover opacity-0 transition-all duration-500 group-hover:scale-100 group-hover:opacity-100 ${
                back.focus === 'top' ? 'object-top' : ''
              }`}
            />
          </Link>
        </li>
      ))}
    </ul>
  )
}
