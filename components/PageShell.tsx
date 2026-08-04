import Footer from '@/components/Footer'
import OnThisPage, { type Section } from '@/components/OnThisPage'

/**
 * Page container. Five routes now share one measure, one gutter and one footer;
 * before the split these values were inline in the single page and would have
 * drifted the moment they were copied four times.
 *
 * `id="main"` lives here so the skip link in the layout lands somewhere on every
 * route, not just the home page.
 */
export default function PageShell({
  title,
  intro,
  sections,
  children,
}: {
  /** Rendered as the page h1. Omit on the home page, where Hero supplies it. */
  title?: string
  intro?: React.ReactNode
  /** In-page contents. Only pass on routes long enough to need one. */
  sections?: Section[]
  children: React.ReactNode
}) {
  return (
    <div className="relative mx-auto max-w-[58rem] px-5 pb-16 pt-10 sm:px-8 sm:pt-14">
      {sections && sections.length > 0 && <OnThisPage sections={sections} />}
      <main id="main">
        {title && (
          <header className="mb-10 flex flex-col gap-3">
            <h1 className="text-[clamp(1.75rem,1.4rem+1.6vw,2.4rem)]">{title}</h1>
            {intro && (
              <div className="max-w-[38rem] text-[15px] leading-relaxed text-muted">
                {intro}
              </div>
            )}
          </header>
        )}
        {children}
      </main>
      <Footer />
    </div>
  )
}
