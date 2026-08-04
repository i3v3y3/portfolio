'use client'

import { useEffect, useState } from 'react'

export interface Section {
  id: string
  label: string
}

/**
 * In-page contents rail, for the two routes long enough to need one: the
 * gallery at 7.6 screens and a case study at 7.3. The other four are between
 * 0.9 and 3.6 screens, where a rail is furniture rather than navigation.
 *
 * WHERE IT SITS. In the right margin beside the content, not in a column that
 * pushes the content left. Only two of six routes have a rail, and a layout
 * that recentres the article depending on the page would make the text jump
 * horizontally as someone moves between them. The content column stays exactly
 * where it is on every route.
 *
 * That constrains the breakpoint arithmetically rather than by taste: the
 * article is 58rem, so at viewport W each margin is (W - 928)/2. A 12rem rail
 * plus a 2rem gap needs 224px, which needs W >= 1380. 1400 is the round number
 * above that, hence the arbitrary media query instead of a Tailwind breakpoint
 * — xl (1280) is genuinely too narrow and 2xl (1536) would hide the rail from
 * every 1440px laptop.
 *
 * Below that it is not rendered at all. A collapsed accordion of section names
 * on a phone is a second navigation competing with the first, and the sections
 * are already only a thumb-flick apart.
 */
export default function OnThisPage({ sections }: { sections: Section[] }) {
  const [active, setActive] = useState<string>(sections[0]?.id ?? '')

  useEffect(() => {
    const headings = sections
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => el !== null)

    if (headings.length === 0) {
      return
    }

    /*
     * Computed from scroll position rather than driven by IntersectionObserver.
     *
     * The observer version only fires when a heading crosses the band, so a
     * jump — an anchor link, browser back to a hash, a restored scroll position
     * — skips over headings without them ever intersecting, and the rail keeps
     * highlighting whatever it last saw. Reading the positions directly gives
     * the right answer wherever the reader arrives from.
     *
     * The current section is the last heading that has passed the line 100px
     * down the viewport, which is a little below the sticky header. Cheap
     * enough for seven elements that the rAF throttle is the only guard needed.
     */
    let frame = 0

    const update = () => {
      frame = 0
      const line = 100
      let current = headings[0].id

      for (const heading of headings) {
        if (heading.getBoundingClientRect().top > line) {
          break
        }
        current = heading.id
      }

      setActive(current)
    }

    const onScroll = () => {
      if (frame === 0) {
        frame = requestAnimationFrame(update)
      }
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame !== 0) {
        cancelAnimationFrame(frame)
      }
    }
  }, [sections])

  return (
    <aside
      aria-label="On this page"
      className="pointer-events-none absolute left-full top-0 hidden h-full pl-8 [@media(min-width:1400px)]:block"
    >
      <nav className="pointer-events-auto sticky top-24 w-48">
        <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-dim">
          On this page
        </p>
        <ul className="flex flex-col gap-1 border-l border-border">
          {sections.map((section) => {
            const isActive = section.id === active
            return (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  aria-current={isActive ? 'true' : undefined}
                  className={`-ml-px block border-l py-1 pl-3 text-[13px] leading-snug no-underline transition-colors ${
                    isActive
                      ? 'border-accent font-medium text-accent'
                      : 'border-transparent text-muted-dim hover:text-foreground'
                  }`}
                >
                  {section.label}
                </a>
              </li>
            )
          })}
        </ul>
      </nav>
    </aside>
  )
}
