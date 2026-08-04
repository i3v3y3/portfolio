import type { Decision } from '@/lib/projects'

/**
 * The decisions behind a build, and what each one cost.
 *
 * Shaped after Michael Nygard's architecture decision record (2011): context,
 * the decision, and consequences — where consequences explicitly include the
 * negative ones. The cost field is required rather than optional for that
 * reason. A decision written up with only its upside is marketing; the trade is
 * the part that shows an engineer weighed something.
 *
 * These were previously buried mid-prose under headings like "Why 4 layers".
 * Promoted here because they are the only place on the site where a hiring
 * engineer sees reasoning rather than output, and they were the hardest thing
 * on the page to find.
 */
export default function Decisions({ decisions }: { decisions: Decision[] }) {
  return (
    <ol className="my-8 flex flex-col">
      {decisions.map((decision) => (
        <li key={decision.choice} className="border-t border-border py-6">
          <div className="flex flex-col gap-3">
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-dim">
              {decision.constraint}
            </p>
            <h3 className="text-[17px] font-semibold text-foreground">{decision.choice}</h3>
            <p className="max-w-[40rem] text-[15px] leading-relaxed text-muted">
              {decision.reasoning}
            </p>
            <p className="max-w-[40rem] border-l-2 border-accent-muted pl-3 text-[14px] leading-relaxed text-muted-dim">
              <span className="font-medium text-muted">What it cost: </span>
              {decision.cost}
            </p>
          </div>
        </li>
      ))}
    </ol>
  )
}
