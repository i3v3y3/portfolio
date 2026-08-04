# ivymatobori.com

Personal portfolio. Embedded systems and instrumentation engineering, Nairobi.

Static Next.js site — builds to plain HTML, deploys anywhere.

## Running it

```bash
npm install
npm run dev      # http://localhost:3000
npm test         # unit tests
npm run test:e2e # browser tests
npm run build    # static export into out/
```

## Editing content

No React needed for any of these:

| What | Where |
| --- | --- |
| Experience timeline | `content/timeline.ts` |
| Project write-ups | `content/projects/*.mdx` |
| Toolkit, verify links, about | `app/page.tsx` |
| Colours and type | `app/globals.css` |

Project files need this frontmatter:

```yaml
---
title: Level Sensor
slug: level-sensor          # must match the filename
description: One or two sentences.
stack: ["Embedded C", "RS485"]
date: "2025-04"             # sorts newest first
github: null                # or a repo URL
demo: null
featured: true              # false hides it from the home page
cover: null                 # or /boards/whatever.jpg
coverCaption: "Board photo — top and bottom"
result: "Optional one-line outcome"
---
```

If a project file has a mistake in its frontmatter, the build names the file and
keeps going rather than failing. Check the build output.

## Adding photos

Drop images in `public/`, then set `cover:` on the matching project. The build
resizes anything over 1600px wide and writes a `.webp` alongside it, so a photo
straight off a phone is fine.

For a portrait, put the file in `public/` and set `PORTRAIT` at the top of
`components/Hero.tsx`. Until that is set the hero is single-column by design —
an empty placeholder looks worse than no photo.

## Notes

- **No third-party requests at runtime.** Fonts are self-hosted at build time.
- **Type:** IBM Plex — Serif for headings, Sans for body, Mono for labels.
- **Themes:** light by default, dark follows the OS, toggle overrides both.
- Custom base CSS must go inside `@layer base` or it will silently override
  every Tailwind utility.

## Before publishing

See `FOR-IVY.md`. It lists the claims on this site that still need checking.
