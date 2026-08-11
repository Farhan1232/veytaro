import { createContext, useContext } from "react";

/**
 * The router context and its hook, kept apart from the components in
 * `router.tsx`.
 *
 * The split is not cosmetic: React Fast Refresh can only hot-replace a module
 * that exports components alone, so mixing `useRouter` in with `<Router>` and
 * `<Link>` would force a full reload on every edit during development.
 */
export interface RouterValue {
  path: string;
  navigate: (to: string) => void;
}

export const RouterContext = createContext<RouterValue | null>(null);

export function useRouter(): RouterValue {
  const ctx = useContext(RouterContext);
  if (!ctx) throw new Error("useRouter must be used inside <Router>");
  return ctx;
}
