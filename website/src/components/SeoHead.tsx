import { useEffect } from "react";
import { SITE } from "../config/site";
import { content } from "../content";
import type { RouteDef } from "../lib/routes";

/**
 * Keeps <title>, the description, the canonical URL and the Open Graph tags in
 * step with the current client route.
 *
 * index.html already ships correct tags for the home page, so a crawler that
 * does not run JavaScript still sees valid metadata; this component only
 * rewrites them once the user navigates. Tags are updated in place rather than
 * inserted, so nothing is duplicated when the route changes twice.
 */
export function SeoHead({ route }: { route: RouteDef | null }) {
  useEffect(() => {
    const title = route
      ? route.id === "home"
        ? route.title
        : `${route.title} — ${content.meta.titleSuffix}`
      : `${content.notFound.title} — ${content.meta.titleSuffix}`;

    const description = route ? route.description : content.notFound.body;
    const path = route ? route.path : "/";
    const url = `${SITE.origin}${path === "/" ? "/" : path}`;

    document.title = title;
    setMeta("name", "description", description);
    setMeta("property", "og:title", title);
    setMeta("property", "og:description", description);
    setMeta("property", "og:url", url);
    setMeta("name", "twitter:title", title);
    setMeta("name", "twitter:description", description);

    // A page that does not exist must not be indexed under its own URL.
    setMeta("name", "robots", route ? "index, follow" : "noindex, follow");

    const canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (canonical) canonical.href = url;
  }, [route]);

  return null;
}

function setMeta(attr: "name" | "property", key: string, value: string): void {
  let tag = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute(attr, key);
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", value);
}
