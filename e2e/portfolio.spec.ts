import { test, expect } from '@playwright/test'

/**
 * E2E covers the flows that actually break and that unit tests cannot reach.
 * Deliberately NOT testing that components render their own props — that is
 * asserting React works, and it would cost jsdom + testing-library to say so.
 */

test.describe('the 15-second screener scan', () => {
  test('name, role and CV are all reachable without scrolling past the hero', async ({ page }) => {
    await page.goto('/')
    const h1 = page.getByRole('heading', { level: 1 })
    await expect(h1).toContainText('Ivy')
    await expect(h1).toContainText('embedded systems engineer')
    await expect(page.getByRole('link', { name: /download cv/i })).toBeVisible()
  })

  test('experience is dated so nobody has to do arithmetic', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByText('Feb 2025 – present')).toBeVisible()
    await expect(page.getByText('Jan 2023 – Mar 2023')).toBeVisible()
  })

  test('toolkit keywords appear before the project cards', async ({ page }) => {
    await page.goto('/')
    const toolkit = await page.getByText('Toolkit').boundingBox()
    const work = await page.getByText('Selected work').boundingBox()
    expect(toolkit!.y).toBeLessThan(work!.y)
  })
})

test.describe('CV download', () => {
  test('the PDF resolves — the one action a recruiter takes', async ({ page, request }) => {
    await page.goto('/')
    const href = await page.getByRole('link', { name: /download cv/i }).getAttribute('href')
    expect(href).toBeTruthy()
    const res = await request.get(href!)
    expect(res.status(), 'CV link is a 404').toBe(200)
    expect(res.headers()['content-type']).toContain('pdf')
  })
})

test.describe('verification links', () => {
  test('each one points somewhere absolute and external', async ({ page }) => {
    await page.goto('/')
    const section = page.locator('section', { hasText: 'How to verify this' })
    const links = section.getByRole('link')
    await expect(links).not.toHaveCount(0)
    for (const link of await links.all()) {
      const href = await link.getAttribute('href')
      expect(href).toMatch(/^https:\/\//)
      await expect(link).toHaveAttribute('rel', /noopener/)
    }
  })
})

test.describe('case studies', () => {
  for (const slug of ['quepay-controller', 'veno-instrumentation', 'satellite-eps', 'atmega328p']) {
    test(`/work/${slug} renders with a heading and body`, async ({ page }) => {
      await page.goto(`/work/${slug}/`)
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
      await expect(page.locator('article')).toBeVisible()
      await expect(page.getByRole('link', { name: '← Back' })).toBeVisible()
    })
  }

  test('every card on the home page routes to a page that exists', async ({ page }) => {
    await page.goto('/')
    const hrefs = await page.locator('a[href^="/work/"]').evaluateAll((els) =>
      els.map((e) => (e as HTMLAnchorElement).getAttribute('href')!)
    )
    expect(hrefs.length).toBeGreaterThan(0)
    for (const href of hrefs) {
      const res = await page.goto(href)
      expect(res!.status(), `${href} did not resolve`).toBeLessThan(400)
    }
  })
})

test.describe('accessibility and layout', () => {
  test('no horizontal scroll at 375px', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 800 })
    await page.goto('/')
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth
    )
    expect(overflow, 'page scrolls sideways on mobile').toBe(false)
  })

  test('skip link is the first thing keyboard focus reaches', async ({ page }) => {
    await page.goto('/')
    await page.keyboard.press('Tab')
    await expect(page.getByRole('link', { name: /skip to content/i })).toBeFocused()
  })
})
