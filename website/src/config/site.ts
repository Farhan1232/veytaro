/**
 * Site-level configuration. Values here are used for SEO metadata, the footer
 * and the contact page; none of them cause a network request at runtime.
 *
 * The domain is a *configuration value only*. Nothing in this repository
 * registers, points at, or deploys to it — hosting is handled separately.
 */

export const SITE = {
  brand: "Veytaro",
  /** Canonical origin, used for <link rel="canonical">, sitemap and OG tags. */
  origin: "https://veytaro.app",
  title: "Veytaro — Dein Spielstand. Klar analysiert.",
  description:
    "Veytaro ist eine Desktop-Anwendung für Windows und macOS, die unterstützte Football-Manager-Spielstände lokal und schreibgeschützt ausliest.",
  locale: "de_DE",
  lang: "de",
} as const;

/**
 * The single support address.
 *
 * It is the only contact detail the project actually has, so it is also the
 * only one the site shows. No phone number, no postal address and no social
 * profiles are claimed anywhere, because none exist.
 */
export const SUPPORT_EMAIL = "Niclaskrieck@gmail.com";

/** `mailto:` with a subject line that is already useful in an inbox. */
export const SUPPORT_MAILTO = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(
  "Veytaro — Support",
)}`;

/**
 * Legal URLs.
 *
 * `terms` points at the page in this site. Imprint and privacy stay null: both
 * require a legal identity — name, address, jurisdiction — that has not been
 * provided, and inventing one would be worse than omitting the link. The footer
 * renders a link only for non-null entries, so nothing 404s.
 */
export const LINKS: Record<"imprint" | "privacy" | "terms", string | null> = {
  imprint: null,
  privacy: null,
  terms: "/bedingungen",
};
