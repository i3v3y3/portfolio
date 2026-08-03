export default function StackPill({ label }: { label: string }) {
  return (
    <span className="rounded bg-accent-light px-2 py-0.5 font-mono text-[11px] text-muted">
      {label}
    </span>
  )
}
