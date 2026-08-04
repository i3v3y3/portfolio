import { test, expect } from '@playwright/test'

/**
 * E2E covers the flows that actually break and that unit tests cannot reach.
 * Deliberately NOT testing that components render their own props — that is
 * asserting React works, and it would cost jsdom + testing-library to say so.
 */

test.describe('the 15-second screener scan', () => {
  test('name, role and CV are all reachable without scrolling past the hero', async ({ page }) => {
    // The h1 became a thesis rather than an introduction when the home page was
    // restructured, so name and role now live in the eyebrow above it. Assert on
    // the hero as a whole rather than the h1 — what matters is that a screener
    // gets all three without scrolling, not which element carries them.
    await page.setViewportSize({ width: 375, height: 800 })
    await page.goto('/')
    const hero = page.locator('header').filter({ hasText: 'Nairobi' }).first()
    await expect(hero).toContainText('Ivy Matobori')
    await expect(hero).toContainText('Instrumentation & Control Engineer')
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    await expect(page.getByRole('link', { name: /view cv/i })).toBeVisible()
  })

  test('experience is dated so nobody has to do arithmetic', async ({ page }) => {
    // Dates live on /work/ now — the timeline came off /about/ when the work
    // page grew roles with periods on them.
    await page.goto('/work/')
    await expect(page.getByText('Feb 2025 – present')).toBeVisible()
    await expect(page.getByText('Jan 2023 – Mar 2023')).toBeVisible()
  })

  test('capability keywords appear before the project cards', async ({ page }) => {
    await page.goto('/')
    const areas = await page.getByRole('heading', { name: 'What I work on' }).boundingBox()
    const work = await page.getByRole('heading', { name: 'Selected work' }).boundingBox()
    expect(areas!.y).toBeLessThan(work!.y)
  })
})

test.describe('CV download', () => {
  test('the PDF resolves — the one action a recruiter takes', async ({ page, request }) => {
    await page.goto('/')
    const href = await page.getByRole('link', { name: /view cv/i }).getAttribute('href')
    expect(href).toBeTruthy()
    const res = await request.get(href!)
    expect(res.status(), 'CV link is a 404').toBe(200)
    expect(res.headers()['content-type']).toContain('pdf')
  })
})

test.describe('verification links', () => {
  test('each one points somewhere absolute and external', async ({ page }) => {
    await page.goto('/about/')
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
  for (const slug of ['quepay-controller', 'veno-instrumentation', 'satellite-eps']) {
    test(`/work/${slug} renders with a heading and body`, async ({ page }) => {
      await page.goto(`/work/${slug}/`)
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
      await expect(page.locator('article')).toBeVisible()
      // FINDING-007: the in-article back link doubles as site identity, for
      // someone landing here from a search result. Scoped to the article
      // because the nav now also has an a[href="/"] — which is hidden below
      // `sm`, so it cannot be what satisfies this.
      const home = page.locator('article, body').locator('a[href="/"]').filter({ hasText: 'Ivy Matobori' })
      await expect(home.last()).toContainText('Embedded Systems Engineer')
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

test.describe('navigation', () => {
  const ROUTES = ['/work/', '/gallery/', '/about/', '/contact/']

  test('every nav item resolves and marks itself current', async ({ page }) => {
    for (const route of ROUTES) {
      await page.goto(route)
      const link = page.getByRole('navigation', { name: 'Primary' }).getByRole('link', {
        name: new RegExp(route.replace(/\//g, ''), 'i'),
      })
      await expect(link, `${route} nav item missing`).toHaveAttribute('aria-current', 'page')
    }
  })

  test('exactly one nav item is current at a time', async ({ page }) => {
    await page.goto('/gallery/')
    const current = page.getByRole('navigation', { name: 'Primary' }).locator('[aria-current="page"]')
    await expect(current).toHaveCount(1)
  })

  test('a project page keeps Work lit', async ({ page }) => {
    await page.goto('/work/quepay-controller/')
    const work = page.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name: /^work$/i })
    await expect(work).toHaveAttribute('aria-current', 'page')
  })
})

test.describe('gallery', () => {
  test('thumbnails load rather than 404', async ({ page }) => {
    await page.goto('/gallery/')
    const broken = await page.locator('img').evaluateAll((imgs) =>
      imgs.filter((i) => !(i as HTMLImageElement).complete || (i as HTMLImageElement).naturalWidth === 0)
        .map((i) => (i as HTMLImageElement).src)
    )
    expect(broken, `broken images: ${broken.join(', ')}`).toEqual([])
  })

  test('lightbox opens and returns focus to the thumbnail on close', async ({ page }) => {
    await page.goto('/gallery/')
    const first = page.getByRole('button').filter({ hasText: 'Five units assembled' })
    await first.click()

    await expect(page.getByRole('dialog')).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(page.getByRole('dialog')).toBeHidden()
    // Not the top of the document — on a 24-image page that means tabbing all
    // the way back to where they were.
    await expect(first).toBeFocused()
  })

  test('arrow keys page through and focus follows the image on close', async ({ page }) => {
    await page.goto('/gallery/')
    await page.getByRole('button').filter({ hasText: 'Five units assembled' }).click()

    const dialog = page.getByRole('dialog')
    await expect(dialog).toContainText('1 / ')
    await page.keyboard.press('ArrowRight')
    await expect(dialog).toContainText('2 / ')
    await page.keyboard.press('ArrowLeft')
    await expect(dialog).toContainText('1 / ')

    // Paging then closing returns to the image you were actually looking at.
    await page.keyboard.press('ArrowRight')
    await page.keyboard.press('Escape')
    await expect(
      page.getByRole('button').filter({ hasText: 'First power-on' })
    ).toBeFocused()
  })
})

test.describe('accessibility and layout', () => {
  for (const route of ['/', '/work/', '/gallery/', '/about/', '/contact/']) {
    test(`no horizontal scroll at 375px on ${route}`, async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 800 })
      await page.goto(route)
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth
      )
      expect(overflow, `${route} scrolls sideways by ${overflow}px on mobile`).toBeLessThanOrEqual(0)
    })
  }

  test('skip link is the first thing keyboard focus reaches', async ({ page }) => {
    await page.goto('/')
    await page.keyboard.press('Tab')
    await expect(page.getByRole('link', { name: /skip to content/i })).toBeFocused()
  })
})
