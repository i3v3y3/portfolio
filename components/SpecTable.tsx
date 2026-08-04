/**
 * Technical specification table for a case study.
 *
 * A recruiter screening for a hardware role scans for parts and protocols
 * before they read a word of prose. That information was scattered across the
 * stack pills, the intro and three paragraphs of body copy; this puts it in one
 * block they can check in four seconds.
 *
 * Rows are declared per project in the MDX rather than derived from the stack
 * array, because "Interfaces: I²C, SPI, UART" is a different statement from a
 * tag saying "I2C" — the table is claiming what the system uses, not what she
 * has touched.
 *
 * Wrapped in overflow-x so a long value never widens the page on a phone.
 */
export default function SpecTable({ rows }: { rows?: [string, string][] }) {
  if (!Array.isArray(rows) || rows.length === 0) {
    console.warn('[SpecTable] no rows — check the MDX prop')
    return null
  }
  return (
    <div className="my-8 overflow-x-auto">
      <table className="w-full border-collapse text-left text-[14px]">
        <caption className="sr-only">Technical specifications</caption>
        <tbody>
          {rows.map(([label, value]) => (
            <tr key={label} className="border-b border-border last:border-b-0">
              <th
                scope="row"
                className="whitespace-nowrap py-2.5 pr-6 align-top font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-muted-dim"
              >
                {label}
              </th>
              <td className="py-2.5 align-top text-muted">{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
