# Veytaro download website

The public download page for the Veytaro desktop application. Static Vite +
React + TypeScript — it builds to plain files and needs no backend, database,
API, login or analytics at runtime.

It is deliberately separate from the desktop application's frontend (`../src`)
and has its own `package.json` and `node_modules`.

## Run it

```bash
npm install
npm run dev          # http://localhost:5180
```

## Check and build

```bash
npm run typecheck    # tsc --noEmit
npm run lint         # eslint
npm test             # vitest — OS detection
npm run build        # -> dist/
npm run preview      # serve dist/ locally
```

`dist/` is the deployable directory. Point the host's 404 handler at
`/404.html`.

## Where the content lives

Everything a visitor reads is in **one file**: `src/content/de.ts`.

Components contain no prose. To add English later, write `src/content/en.ts`
against the `SiteContent` interface in `src/content/types.ts` — TypeScript will
name every string you have not translated — then switch the export in
`src/content/index.ts`. There is intentionally **no language switcher in the UI**
until a second translation actually exists.

| File | Holds |
| --- | --- |
| `src/content/de.ts` | All German copy |
| `src/content/types.ts` | The shape a translation must satisfy |
| `src/config/releases.ts` | Version, filenames, sizes, checksums, availability |
| `src/config/site.ts` | Canonical URL, footer links, optional hero screenshot |
| `src/styles/tokens.css` | Design tokens mirrored from the desktop app |

## Downloads

`src/config/releases.ts` is the single source of truth. A platform whose
`status` is `"pending"` renders a **disabled** button with an honest German
label; only `"available"` produces a real link.

There is no `#` href anywhere, and `public/downloads/` contains no placeholder
files. Do not hand-edit `releases.ts` to make a button live — run, from the
repository root:

```bash
node scripts/sync-release-to-website.mjs <artifact> [<artifact> ...]
```

which copies the real file in and writes its measured size and SHA-256. Full
flow in [`../RELEASE.md`](../RELEASE.md).

## Design

Colours, radii, fonts and shadows are copied from the desktop app
(`../src/styles/tokens.css` and `themes.css`) so the page and the product look
like one system. The app defaults to its dark theme and the brand mark is built
for a dark surface, so the site commits to dark only.

The brand accent is `#39ff67` — the same `--brand-accent` the app uses, and the
same green as the logo.

Fonts (Outfit, Sora, JetBrains Mono) are **self-hosted** via `@fontsource`
rather than loaded from Google Fonts: the site targets a German audience and
makes no third-party requests on page load. Only the `latin` subset is imported,
which covers every character the German copy uses.

## OS detection

`src/lib/osDetection.ts` picks which download to recommend, in order:

1. `navigator.userAgentData` (modern Chromium)
2. `navigator.platform` — including the iPadOS 13+ `MacIntel` masquerade, which
   is separated from a real Mac by `maxTouchPoints`
3. `navigator.userAgent` — mobile markers checked first, because an Android UA
   also contains "linux" and an iPad UA can contain "macintosh"
4. `"unknown"`

Rules it must keep: both platforms always stay visible, nothing downloads
without a click, and a missing or hostile `navigator` yields `"unknown"` instead
of throwing. Mobile and unknown visitors see Windows and macOS weighted equally.

Covered by 17 tests in `src/lib/osDetection.test.ts` (Windows, macOS, mobile,
unknown, and the failure modes).

## Accessibility

Verified in a headless browser at 375 / 768 / 1024 / 1440 px:

- no horizontal scrolling at any width
- one `<h1>`, then `<h2>` per section and `<h3>` per card — no level skipped
- every interactive element reachable by keyboard, with a visible 2px accent
  focus ring
- all images carry `alt` (decorative marks use `alt=""` + `aria-hidden`)
- text contrast against its real background ranges from **6.05:1** to
  **18.4:1** — WCAG AA needs 4.5:1
- the FAQ uses native `<details>`/`<summary>`, so it works without JavaScript

### Motion

The entrance animation is strictly additive: `.reveal` has no styles of its own
and the animation is applied only inside
`@supports (animation-timeline: view())` **and**
`@media (prefers-reduced-motion: no-preference)`. A browser without scroll-driven
timeline support, or a visitor who prefers reduced motion, sees the full page
immediately rather than sections stuck at `opacity: 0`.

## Hero screenshot

`HERO_SCREENSHOT` in `src/config/site.ts` is `null`, so the hero shows the brand
mark. No screenshot is shipped because every screen the application can
currently show either requires signing in or renders demo figures, and neither
belongs on a download page.

To add a real one: capture it, drop it in `public/`, and set the path — the hero
switches over automatically. Do not capture a screen containing a real save file
or personal data.

## Deployment

Not configured here, by design. `npm run build` produces `dist/`; domain, DNS,
TLS and hosting are handled separately.
