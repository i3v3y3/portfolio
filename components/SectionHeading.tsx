export default function SectionHeading({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <div className="mb-8 flex items-center gap-3">
      <span id={id} className="text-[13px] font-medium uppercase tracking-widest text-foreground">
        {children}
      </span>
      <div className="h-px flex-1 bg-border" />
    </div>
  )
}
