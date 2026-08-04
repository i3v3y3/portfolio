/**
 * System architecture diagram.
 *
 * Rendered as a real list, not ASCII art in a <pre>. A screen reader reads
 * "Controller, 5 items: Quectel modem, NFC reader…" out of this; the same
 * picture drawn with box characters is an unnavigable blob of punctuation, and
 * it breaks the moment a proportional font gets near it.
 *
 * The visual tree comes from borders on the list items — the vertical rule is
 * a ::before on each child and the last one is trimmed to an elbow, which is
 * how the connector lines up without any of it being content.
 *
 * Deliberately no diagramming library. Three levels of nesting is not worth a
 * dependency, and an SVG blob would not be editable by anyone but me.
 */
export interface Node {
  label: string
  /** What the thing is, in three or four words. */
  note?: string
  children?: Node[]
}

function Branch({ nodes, depth = 0 }: { nodes: Node[]; depth?: number }) {
  return (
    <ul className={depth === 0 ? 'flex flex-col gap-1' : 'mt-1 flex flex-col gap-1 pl-5'}>
      {nodes.map((n) => (
        <li
          key={n.label}
          className={
            depth === 0
              ? ''
              : // Elbow: a vertical rule down the left, stopped halfway on the
                // last child so the line ends at its connector rather than
                // running past into empty space.
                'relative before:absolute before:-left-3 before:top-0 before:h-full before:w-px before:bg-border ' +
                'after:absolute after:-left-3 after:top-[0.85rem] after:h-px after:w-3 after:bg-border ' +
                'last:before:h-[0.85rem]'
          }
        >
          <div className="flex flex-wrap items-baseline gap-x-2">
            <span
              className={`font-mono text-[13px] ${
                depth === 0 ? 'font-medium text-foreground' : 'text-foreground'
              }`}
            >
              {n.label}
            </span>
            {n.note && <span className="text-[13px] text-muted-dim">{n.note}</span>}
          </div>
          {n.children && n.children.length > 0 && (
            <Branch nodes={n.children} depth={depth + 1} />
          )}
        </li>
      ))}
    </ul>
  )
}

export default function Architecture({ nodes, caption }: { nodes?: Node[]; caption?: string }) {
  if (!Array.isArray(nodes) || nodes.length === 0) {
    console.warn('[Architecture] no nodes — check the MDX prop')
    return null
  }
  return (
    <figure className="my-8 flex flex-col gap-3 rounded-xl border border-border bg-surface p-5">
      <Branch nodes={nodes} />
      {caption && (
        <figcaption className="border-t border-border pt-3 text-[13px] leading-relaxed text-muted">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}
