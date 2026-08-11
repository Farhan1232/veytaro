# Asset origins and licences

Every file the website serves is listed below with where it came from. Nothing
is hotlinked: the site makes no request to a third-party host at runtime, and a
browser loading any page contacts only the origin the page was served from.

## Rights that are deliberately not used

The site shows **no** Football Manager promotional artwork, club crests,
competition logos, player likenesses, Sports Interactive artwork or SEGA
artwork. The name "Football Manager" appears only descriptively, in body copy
explaining what the application reads, alongside a trademark attribution in the
footer.

The photographs used are Creative Commons Zero. Each was chosen because it
shows **no club crest, sponsor board, kit, competition mark or identifiable
person** — only a pitch, a stadium seen from directly overhead, and turf.

## Imagery

| File | Origin | Licence / rights |
| --- | --- | --- |
| `public/veytaro-mark.png` | Project's own brand mark. Pre-existing in this repository. | Owned by the project |
| `public/veytaro-mark-128.webp`, `public/veytaro-mark-128.png` | Resized from `veytaro-mark.png` (512×356 → 128×89) with ImageMagick, for the header and footer. Same artwork, no recolouring or redrawing. | Owned by the project |
| `public/favicon.ico`, `favicon-16.png`, `favicon-32.png`, `apple-touch-icon.png`, `icon-192.png`, `icon-512.png` | Derived from the project's brand mark. Pre-existing. | Owned by the project |
| `public/og-image.png` | Project's own social preview. Pre-existing. | Owned by the project |

The site palette is sampled from this mark: its green is pure hue-120 at full
saturation, and the whole colour system in `src/styles/tokens.css` is built
around a usable form of that green over a dark charcoal ground.

### Photography

All three are **CC0 / public domain**, sourced through Openverse from RawPixel,
downloaded once, cropped and re-encoded as WebP, and served from this origin.
CC0 imposes no attribution requirement; the sources are recorded here anyway so
the provenance of every pixel on the site is checkable.

| Files | Subject | Source |
| --- | --- | --- |
| `public/img/pitch-night-{760,1100,1600}.webp` | Floodlit pitch at night below a mountain. Used as the home page hero. | [rawpixel.com/image/3290789](https://www.rawpixel.com/image/3290789/free-photo-image-football-arena-best-soccer-pictures) — CC0 |
| `public/img/stadium-aerial-{900,1400}.webp` | Stadium pitch photographed from directly overhead. | [rawpixel.com/image/3282534](https://www.rawpixel.com/image/3282534/free-photo-image-soccer-football-stadium) — CC0 |
| `public/img/turf-{700,1200}.webp` | Close-up grass texture. Used behind the closing call to action. | [rawpixel.com/image/5911993](https://www.rawpixel.com/image/5911993/image-background-wallpaper-texture) — CC0 |

Photographs were reviewed individually before use. Candidates that showed club
branding (an Old Trafford interior with `MANUTD.COM` hoardings) or crowds and
sponsor boards were rejected for exactly that reason.

### Icons

`src/components/Icons.tsx` wraps **Lucide** (`lucide-react`, ISC licence), a
maintained open-source icon set. The ISC licence permits commercial use and
redistribution; the licence text ships in `node_modules/lucide-react/LICENSE`.

The Windows and Apple marks are the two exceptions: Lucide deliberately ships no
brand logos, so those remain simplified geometric glyphs drawn for this project.
They identify which operating system a download is for — nominative use, which
is what an OS mark on a download page is for.

## Fonts

All three are self-hosted through `@fontsource` and served from this origin.
Only the `latin` subset is included, and only the weights the stylesheet
actually uses.

| Family | Package | Weights shipped | Licence |
| --- | --- | --- | --- |
| Outfit | `@fontsource/outfit` | 400, 500, 600 | SIL Open Font License 1.1 |
| Sora | `@fontsource/sora` | 600, 700 | SIL Open Font License 1.1 |
| JetBrains Mono | `@fontsource/jetbrains-mono` | 400 | SIL Open Font License 1.1 |

The OFL permits bundling and serving these fonts with a website, including
commercially, provided they are not sold on their own. The full licence text for
each ships inside its package under `node_modules/@fontsource/<name>/LICENSE`.

## Installers

`public/downloads/Veytaro_0.1.0_Windows_x64_Setup.exe` and
`public/downloads/Veytaro_0.1.0_macOS_Universal.dmg` are build outputs of the
application in this repository. They are served verbatim; the website neither
regenerates nor rewrites them, and their SHA-256 digests are published on the
download page and in `src/config/releases.ts`.

Neither installer is code-signed or notarised, and the site says so plainly
rather than implying otherwise.

## Third-party runtime code

None that phone home. React, Vite and Lucide are bundled at build time; the deployed site is static
HTML, CSS, JavaScript, fonts and images. There is no analytics script, no
advertising, no tag manager, no embedded video or map, and no cookie is set.
