/**
 * Site-level configuration. Values here are used for SEO metadata and the
 * footer; none of them cause a network request at runtime.
 *
 * The domain is a *configuration value only*. Nothing in this repository
 * registers, points at, or deploys to it — hosting is handled separately.
 */

export const SITE = {
  brand: "Veytaro",
  /** Canonical origin, used for <link rel="canonical">, sitemap and OG tags. */
  origin: "https://veytaro.app",
  title: "Veytaro — Football Manager Assistant für Windows und macOS",
  description:
    "Veytaro liest Football-Manager-Spielstände und erkennt Verein, Wettbewerb und Saison. Offizieller Download für Windows und macOS.",
  locale: "de_DE",
  lang: "de",
} as const;

/**
 * Legal / contact URLs are intentionally empty.
 *
 * The footer renders a link only for entries that are non-null, so the site
 * never ships a placeholder or a link that 404s. Fill these in once the real
 * pages exist.
 */
export const LINKS: Record<"imprint" | "privacy" | "support", string | null> = {
  imprint: null,
  privacy: null,
  support: null,
};

/**
 * Optional product screenshot for the hero.
 *
 * Deliberately null: every screen the application can currently show either
 * requires signing in or renders demo figures, and neither belongs on a
 * download page. Drop a real capture into `public/` and set the path here —
 * the hero switches from the brand mark to the screenshot automatically.
 */
export const HERO_SCREENSHOT: { src: string; width: number; height: number } | null =
  null;
