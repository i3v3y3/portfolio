import { test, expect } from '@playwright/test'

/**
 * E2E covers the flows that actually break and that unit tests cannot reach.
 * Deliberately NOT testing that components render their own props — that is
 * asserting React works, and it would cost jsdom + testing-library to say so.
 */

test.describe('the 15-second screener scan', () => {
  test('name, role and resume are all reachable without scrolling past the hero', async ({ page }) => {
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
    await expect(page.getByRole('link', { name: /view resume/i })).toBeVisible()
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
    // Wait for both before measuring — boundingBox() on a not-yet-laid-out
    // element returns null, which made this flake under parallel runs.
    const areasHeading = page.getByRole('heading', { name: 'What I work on' })
    const workHeading = page.getByRole('heading', { name: 'Selected work' })
    await expect(areasHeading).toBeVisible()
    await expect(workHeading).toBeVisible()

    const areas = await areasHeading.boundingBox()
    const work = await workHeading.boundingBox()
    expect(areas).not.toBeNull()
    expect(work).not.toBeNull()
    expect(areas!.y).toBeLessThan(work!.y)
  })
})

test.describe('resume download', () => {
  test('the PDF resolves — the one action a recruiter takes', async ({ page, request }) => {
    await page.goto('/')
    const href = await page.getByRole('link', { name: /view resume/i }).getAttribute('href')
    expect(href).toBeTruthy()
    const res = await request.get(href!)
    expect(res.status(), 'resume link is a 404').toBe(200)
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

test.describe('video embeds', () => {
  test('nothing reaches LinkedIn until play is pressed', async ({ page }) => {
    const thirdParty: string[] = []
    page.on('request', (r) => {
      const host = new URL(r.url()).hostname
      if (!host.includes('localhost') && !host.includes('127.0.0.1')) thirdParty.push(host)
    })

    await page.goto('/gallery/')
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    await page.waitForLoadState('networkidle')

    expect(
      [...new Set(thirdParty)],
      'the page called out before anyone opted in'
    ).toEqual([])
    await expect(page.locator('iframe')).toHaveCount(0)
  })

  test('every clip is reachable even when the embed is blocked', async ({ page }) => {
    await page.goto('/gallery/')
    // Ad blockers and Brave shields kill linkedin.com frames outright, so the
    // fallback link is the only thing some visitors will ever get.
    const links = page.getByRole('link', { name: 'watch on LinkedIn' })
    await expect(links).not.toHaveCount(0)
    for (const link of await links.all()) {
      expect(await link.getAttribute('href')).toMatch(/^https:\/\/www\.linkedin\.com\/feed\//)
    }
  })

  test('pressing play mounts the player', async ({ page }) => {
    await page.goto('/gallery/')
    // ^Play: — a loose /play/i also matches gallery captions containing
    // "display", which is how this first went green against the wrong element.
    const play = page.getByRole('button', { name: /^Play:/ }).first()
    // Retry the click: this is a static export, so the button is in the HTML
    // before React hydrates and an early click lands on a dead element.
    await expect(async () => {
      await play.click()
      await expect(page.locator('iframe[src*="linkedin.com/embed"]').first()).toBeAttached({
        timeout: 1500,
      })
    }).toPass({ timeout: 15000 })
  })

  test('each clip says who posted it', async ({ page }) => {
    await page.goto('/gallery/')
    // These are company posts, not Ivy's. Attribution is not decoration here.
    const section = page.locator('section', { hasText: 'On video' })
    await expect(section.getByText(/Posted by/).first()).toBeVisible()
  })
})

test.describe('theme', () => {
  test('all three modes apply, and System stays reachable', async ({ page }) => {
    await page.goto('/')
    const group = page.getByRole('group', { name: 'Theme' })

    await group.getByRole('button', { name: 'Dark' }).click()
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')

    await group.getByRole('button', { name: 'Light' }).click()
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')

    // The point of the third button: without it, picking a theme once means
    // never following the OS again.
    await group.getByRole('button', { name: 'System' }).click()
    await expect(group.getByRole('button', { name: 'System' })).toHaveAttribute(
      'aria-pressed',
      'true'
    )
  })

  test('the choice survives navigation', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('group', { name: 'Theme' }).getByRole('button', { name: 'Dark' }).click()
    await page.goto('/work/')
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
  })

  test('narrow screens still reach every mode from one button', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 800 })
    await page.goto('/')
    // The segmented group is display:none here, so only the cycling button is
    // in the tree — three clicks must return to where it started.
    await expect(page.getByRole('group', { name: 'Theme' })).toBeHidden()
    const cycle = page.locator('header button[title^="Theme"]')
    await expect(cycle).toBeVisible()

    const seen = new Set<string>()
    for (let i = 0; i < 3; i++) {
      await cycle.click()
      seen.add((await page.locator('html').getAttribute('data-theme')) ?? '')
    }
    expect(seen.size, 'cycling should reach more than one theme').toBeGreaterThan(1)
  })
})

test.describe('gallery', () => {
  test('thumbnails load rather than 404', async ({ page }) => {
    await page.goto('/gallery/')
    // Every thumbnail is loading="lazy", so anything below the fold reports
    // complete=false until it scrolls into view — which reads identically to a
    // 404. Walk the page first, then judge.
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 600) {
        window.scrollTo(0, y)
        await new Promise((r) => setTimeout(r, 100))
      }
      window.scrollTo(0, 0)
    })
    await page.waitForLoadState('networkidle')

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
