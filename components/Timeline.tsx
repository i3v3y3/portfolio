import type { Milestone } from '@/content/timeline'

/**
 * Career timeline.
 *
 *   content/timeline.ts ──▶ <Timeline milestones={…} />
 *                                   │
 *                            ┌──────┴──────┐
 *                            │  per row    │
 *                            │  ├─ dot     │ ← inline style, see note
 *                            │  ├─ period  │
 *                            │  ├─ role    │
 *                            │  └─ verify? │ ← only rows with a public source
 *                            └─────────────┘
 *
 * INLINE STYLE EXCEPTION (deliberate, one line).
 * Everything else in this repo uses Tailwind theme tokens. The track dot does
 * not, because its colour is chosen from data at render time and Tailwind v4's
 * extractor only sees class strings present literally in source. A static
 * `track → className` map would satisfy the rule but reintroduce exactly the
 * hardcoding this component was rewritten to remove — Ivy could not add a track
 * without editing TSX. One line of inline style is the smaller cost.
 * Do not "fix" this without reading that trade-off first.
 */

const TRACK_COLORS: Record<Milestone['track'], string> = {
  hardware: 'var(--accent)',
  firmware: 'var(--accent-dim)',
  education: 'var(--muted-dim)',
}

const TRACK_LABELS: Record<Milestone['track'], string> = {
  hardware: 'Hardware',
  firmware: 'Firmware',
  education: 'Education',
}

export default function Timeline({ milestones }: { milestones: Milestone[] }) {
  if (milestones.length === 0) return null

  return (
    <section className="mb-20" aria-labelledby="timeline-heading">
      <div className="flex items-center gap-3 mb-8">
        <h2
          id="timeline-heading"
          className="font-mono text-[12px] uppercase tracking-[0.14em] font-medium text-foreground"
        >
          Experience
        </h2>
        <div className="flex-1 h-px bg-border" />
      </div>

      <ol className="flex flex-col">
        {milestones.map((m) => (
          <li
            key={`${m.org}-${m.period}`}
            className="grid grid-cols-1 sm:grid-cols-[11rem_minmax(0,1fr)] gap-1 sm:gap-5 py-4 border-t border-border last:border-b"
          >
            <div className="flex items-start gap-2.5 pt-0.5">
              <span
                aria-hidden="true"
                className="mt-1.5 w-2 h-2 rounded-full shrink-0"
                /* deliberate inline style — see the note at the top of this file */
                style={{ backgroundColor: TRACK_COLORS[m.track] }}
              />
              <span className="font-mono text-[13px] text-muted-dim tabular-nums">
                {m.period}
              </span>
            </div>

            <div className="flex flex-col gap-0.5">
              <span className="font-medium text-[15px] text-foreground">
                {m.role}
                {m.current && (
                  <span className="ml-2 font-mono text-[11px] uppercase tracking-wider text-accent">
                    current
                  </span>
                )}
              </span>
              <span className="text-[14px] text-muted">{m.org}</span>
              <span className="text-[14px] text-muted-dim">{m.impact}</span>
              <span className="sr-only">{TRACK_LABELS[m.track]} track</span>
              {m.verify && (
                <a
                  href={m.verify.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-0.5 inline-flex min-h-[44px] items-center gap-1.5 self-start font-mono text-[12px] text-accent hover:underline"
                >
                  <svg
                    className="w-3.5 h-3.5 shrink-0"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    aria-hidden="true"
                  >
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                  {m.verify.label}
                </a>
              )}
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}
