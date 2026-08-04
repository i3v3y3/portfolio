'use client'

import { useState } from 'react'
import type { VideoEmbed } from '@/content/videos'

/**
 * LinkedIn video embeds, loaded on click rather than on page load.
 *
 * WHY A FACADE. A LinkedIn iframe is not a video tag — it pulls in their player
 * bundle and sets third-party cookies the moment the page renders. Three of
 * them on one route means three trackers firing before anyone presses play, on
 * a personal portfolio that otherwise makes no third-party requests at all.
 * Clicking is consent; until then nothing leaves the page.
 *
 * It is also the honest failure mode. Brave shields, Firefox strict mode and
 * uBlock all block linkedin.com frames, and a blocked iframe renders as a blank
 * rectangle with no explanation. Here the card stays, the caption stays, and
 * the "watch on LinkedIn" link underneath always works — so a blocked viewer
 * still knows what they are missing and can get to it.
 *
 * Once loaded the iframe is left mounted: unmounting on a second click would
 * stop playback mid-video, which nobody expects from a card they clicked once.
 */
export default function VideoEmbeds({ videos }: { videos: VideoEmbed[] }) {
  const [loaded, setLoaded] = useState<Set<string>>(new Set())

  // A lone video in a two-column grid renders at half width for no reason.
  // Both class strings are spelled out because Tailwind scans source text.
  const cols = videos.length > 1 ? 'sm:grid-cols-2' : 'sm:grid-cols-1'

  return (
    <ul className={`grid grid-cols-1 gap-6 ${cols}`}>
      {videos.map((v) => {
        const isLoaded = loaded.has(v.id)
        const src = `https://www.linkedin.com/embed/feed/update/urn:li:ugcPost:${v.urn}?compact=1`
        const postHref = `https://www.linkedin.com/feed/update/urn:li:ugcPost:${v.urn}/`

        return (
          <li key={v.id} className="flex flex-col gap-2.5">
            {/* One aspect for every card. Mixed ratios made the grid ragged —
                a CSS grid row is as tall as its tallest item, so a portrait
                card left a landscape neighbour with dead space beneath it.
                LinkedIn's compact embed letterboxes portrait video itself,
                against a blurred fill, so nothing is cropped by standardising. */}
            <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-border bg-surface">
              {isLoaded ? (
                <iframe
                  src={src}
                  title={v.title}
                  allowFullScreen
                  loading="lazy"
                  className="absolute inset-0 h-full w-full"
                  // The embed is a third-party document; give it nothing it
                  // does not need to play a video.
                  referrerPolicy="no-referrer-when-downgrade"
                />
              ) : (
                <button
                  type="button"
                  onClick={() => setLoaded((s) => new Set(s).add(v.id))}
                  // Explicit label rather than letting the name fall out of the
                  // child text. Two spans would have concatenated into a
                  // stuttering name, and "Play" as a loose match also catches
                  // every gallery caption containing "display".
                  aria-label={`Play: ${v.title}. Loads an embedded player from LinkedIn.`}
                  className="group absolute inset-0 flex flex-col items-center justify-center gap-3 bg-surface-hover transition-colors hover:bg-accent-light"
                >
                  <span className="flex h-14 w-14 items-center justify-center rounded-full border border-border bg-background text-accent transition-transform group-hover:scale-105">
                    <svg viewBox="0 0 24 24" className="ml-0.5 h-6 w-6" fill="currentColor" aria-hidden="true">
                      <path d="M8 5.5v13l11-6.5z" />
                    </svg>
                  </span>
                  <span
                    aria-hidden="true"
                    className="px-6 text-center font-mono text-[11px] uppercase tracking-[0.14em] text-muted-dim"
                  >
                    Play · loads from LinkedIn
                  </span>
                </button>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <h3 className="text-[15px] font-semibold text-foreground">{v.title}</h3>
              <p className="text-[14px] leading-relaxed text-muted">{v.blurb}</p>
              <p className="text-[13px] text-muted-dim">
                Posted by{' '}
                <a
                  href={v.postedBy.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted underline decoration-border underline-offset-2 hover:text-accent"
                >
                  {v.postedBy.name}
                </a>
                {' · '}
                <a
                  href={postHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted underline decoration-border underline-offset-2 hover:text-accent"
                >
                  watch on LinkedIn
                </a>
              </p>
            </div>
          </li>
        )
      })}
    </ul>
  )
}
