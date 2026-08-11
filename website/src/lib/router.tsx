/**
 * A tiny client router.
 *
 * The site has five static pages and no nested or dynamic routes, so a routing
 * library would add a dependency and a bundle for behaviour that fits in one
 * file: read `location.pathname`, re-render on `popstate`, and push history on
 * an internal link click.
 *
 * Cloudflare Pages serves this build statically, so a deep link like
 * /dokumentation is only reachable because `public/_redirects` rewrites unknown
 * paths to index.html. Both halves are required — see that file.
 *
 * The context and `useRouter` live in `routerContext.ts` so this module exports
 * only components and stays hot-reloadable.
 */

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type AnchorHTMLAttributes,
  type ReactNode,
} from "react";
import { RouterContext, useRouter } from "./routerContext";
import { normalisePath } from "./routes";

export function Router({ children }: { children: ReactNode }) {
  const [path, setPath] = useState(() =>
    normalisePath(typeof window === "undefined" ? "/" : window.location.pathname),
  );

  useEffect(() => {
    const onPop = () => setPath(normalisePath(window.location.pathname));
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const navigate = useCallback((to: string) => {
    const target = normalisePath(to);
    if (target === normalisePath(window.location.pathname)) return;

    window.history.pushState({}, "", target);
    setPath(target);
    // A pushState navigation does not scroll on its own, so the new page would
    // otherwise open halfway down where the previous one was left.
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, []);

  const value = useMemo(() => ({ path, navigate }), [path, navigate]);

  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>;
}

type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & { to: string };

/**
 * An internal link. Renders a real <a href> so it is crawlable and shows a
 * target in the status bar, opens in a new tab on middle-click or
 * modifier-click, and only intercepts the plain left-click that would otherwise
 * cause a full page load.
 */
export function Link({ to, onClick, children, ...rest }: LinkProps) {
  const { navigate } = useRouter();

  return (
    <a
      href={to}
      onClick={(event) => {
        onClick?.(event);
        if (event.defaultPrevented) return;
        // Let the browser handle anything that is not a plain left-click.
        if (
          event.button !== 0 ||
          event.metaKey ||
          event.ctrlKey ||
          event.shiftKey ||
          event.altKey
        ) {
          return;
        }
        event.preventDefault();
        navigate(to);
      }}
      {...rest}
    >
      {children}
    </a>
  );
}
