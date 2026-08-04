'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

/**
 * Theme control: Light · System · Dark.
 *
 * THREE STATES, NOT TWO. ThemeProvider sets defaultTheme="system" with
 * enableSystem, so the site follows the OS until told otherwise. A two-state
 * toggle would strand the first click — once you pick light or dark there is no
 * way back to following the OS, and the preference persists forever. The third
 * button is what makes the other two reversible.
 *
 * Showing all three also removes the guessing game a single flipping icon
 * creates: a lone moon means "you are in light mode, click for dark" to some
 * people and "you are in dark mode" to others. Here the current state is the
 * highlighted segment and the alternatives are visible next to it.
 *
 * SIZE. 32×36 per segment rather than the 44px used elsewhere. Three 44px
 * targets is 132px, which does not survive 375px alongside four nav links.
 * This clears WCAG 2.5.8 (24×24, AA) but not 2.5.5 (44×44, AAA) — acceptable
 * for a secondary control that is not on any task path.
 *
 * Styling is Tailwind classes, not inline styles driven by JS mouse handlers.
 * The previous version set element.style on mouseenter/mouseleave, which meant
 * hover state was unreachable from the keyboard and invisible to the cascade.
 */
const OPTIONS = [
  {
    value: 'light',
    label: 'Light',
    icon: (
      <>
        <circle cx="12" cy="12" r="4.2" />
        <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
      </>
    ),
  },
  {
    value: 'system',
    label: 'System',
    icon: (
      <>
        <rect x="2.5" y="4" width="19" height="12.5" rx="1.6" />
        <path d="M8.5 20.5h7M12 16.5v4" />
      </>
    ),
  },
  {
    value: 'dark',
    label: 'Dark',
    icon: <path d="M20.5 14.2A8.5 8.5 0 1 1 9.8 3.5a6.8 6.8 0 0 0 10.7 10.7z" />,
  },
]

function Icon({ children }: { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-[15px] w-[15px]"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  )
}

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // theme is undefined until the client reads localStorage. Rendering the real
  // control before then would flash the wrong segment as active.
  useEffect(() => setMounted(true), [])

  const currentIndex = Math.max(
    0,
    OPTIONS.findIndex((o) => o.value === theme)
  )
  const next = OPTIONS[(currentIndex + 1) % OPTIONS.length]

  return (
    <>
      {/*
        Below sm the three segments overflow — measured 12px at 375 and 67px at
        320. One button that cycles keeps all three states reachable in the
        width of one. Cycling is less discoverable than a segmented control,
        which is why it is the narrow-screen fallback and not the default.
        `hidden` is display:none, so only one of the two is in the a11y tree.
      */}
      <button
        type="button"
        onClick={() => setTheme(next.value)}
        title={mounted ? `Theme: ${OPTIONS[currentIndex].label}. Switch to ${next.label}.` : 'Theme'}
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-dim transition-colors hover:text-foreground sm:hidden"
      >
        <Icon>{OPTIONS[currentIndex].icon}</Icon>
        <span className="sr-only">
          {mounted ? `Theme: ${OPTIONS[currentIndex].label}. Switch to ${next.label}.` : 'Theme'}
        </span>
      </button>

    <div
      role="group"
      aria-label="Theme"
      className="hidden items-center gap-0.5 rounded-lg border border-border p-0.5 sm:flex"
    >
      {OPTIONS.map((opt) => {
        const active = mounted && theme === opt.value
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => setTheme(opt.value)}
            aria-pressed={active}
            title={opt.label}
            className={`flex h-8 w-8 items-center justify-center rounded-md transition-colors ${
              active
                ? 'bg-accent-light text-accent'
                : 'text-muted-dim hover:bg-surface-hover hover:text-foreground'
            }`}
          >
            <Icon>{opt.icon}</Icon>
            <span className="sr-only">{opt.label}</span>
          </button>
        )
      })}
    </div>
    </>
  )
}
