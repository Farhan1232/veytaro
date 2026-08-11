/**
 * The site's routes.
 *
 * Paths are German because they are user-visible. Keeping them in one table
 * means the header, the footer, the router and the sitemap all agree, and a
 * typo shows up as a TypeScript error rather than a dead link.
 */

export type RouteId = "home" | "about" | "docs" | "terms" | "contact";

export interface RouteDef {
  id: RouteId;
  path: string;
  /** Short label used in navigation. */
  nav: string;
  /** <title> for the route, without the brand suffix. */
  title: string;
  description: string;
}

export const ROUTES: readonly RouteDef[] = [
  {
    id: "home",
    path: "/",
    nav: "Start",
    title: "Veytaro — Spielstände klar analysiert",
    description:
      "Veytaro ist eine Desktop-Anwendung für Windows und macOS, die unterstützte Football-Manager-Spielstände lokal und schreibgeschützt ausliest.",
  },
  {
    id: "about",
    path: "/ueber-veytaro",
    nav: "Über Veytaro",
    title: "Über Veytaro",
    description:
      "Was Veytaro ist, für wen die Anwendung gedacht ist und wie das lokale, schreibgeschützte Auslesen von Spielständen funktioniert.",
  },
  {
    id: "docs",
    path: "/dokumentation",
    nav: "Dokumentation",
    title: "Dokumentation und Installation",
    description:
      "Schritt-für-Schritt-Anleitung zur Installation von Veytaro unter Windows und macOS, inklusive Prüfsummenkontrolle und Fehlerbehebung.",
  },
  {
    id: "terms",
    path: "/bedingungen",
    nav: "Bedingungen",
    title: "Nutzungsbedingungen",
    description: "Die Nutzungsbedingungen für die Desktop-Anwendung Veytaro.",
  },
  {
    id: "contact",
    path: "/kontakt",
    nav: "Kontakt",
    title: "Kontakt und Support",
    description:
      "So erreichst du den Veytaro-Support per E-Mail und welche Angaben eine Anfrage schneller lösbar machen.",
  },
] as const;

export function routeByPath(pathname: string): RouteDef | null {
  const normalised = normalisePath(pathname);
  return ROUTES.find((r) => r.path === normalised) ?? null;
}

export function routeById(id: RouteId): RouteDef {
  const route = ROUTES.find((r) => r.id === id);
  if (!route) throw new Error(`Unknown route id "${id}"`);
  return route;
}

/**
 * Trailing slashes are stripped so "/kontakt/" and "/kontakt" are the same
 * route. The root stays "/".
 */
export function normalisePath(pathname: string): string {
  if (!pathname) return "/";
  const trimmed = pathname.replace(/\/+$/, "");
  return trimmed === "" ? "/" : trimmed;
}
