/**
 * Section heading.
 *
 * Renders a real <h2> so the page has a heading outline: h1 (name) → h2
 * (section) → h3 (project card). Previously a <span>, which meant screen
 * reader users navigating by heading skipped straight from the hero to the
 * project titles and never learned the page had sections at all.
 *
 * Visually unchanged: the small uppercase label with a rule is the design.
 */
export default function SectionHeading({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <div className="mb-8 flex items-center gap-3">
      <h2
        id={id}
        className="font-mono text-[12px] font-medium uppercase tracking-[0.14em] text-foreground"
      >
        {children}
      </h2>
      <div className="h-px flex-1 bg-border" />
    </div>
  )
}
