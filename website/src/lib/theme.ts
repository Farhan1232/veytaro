/**
 * Theme handling — dark by default, remembered per browser.
 *
 * The first paint is handled by a small inline script in index.html, which sets
 * `data-theme` on <html> before any CSS is applied. This module owns everything
 * after that: reading the stored value, toggling it, and keeping <html> and
 * localStorage in step.
 *
 * Deliberately no dependency and no context provider — a single attribute on
 * the document element is all the CSS needs, so a hook that mirrors it is
 * enough.
 */

export type Theme = "dark" | "light";

/** Shared with the inline script in index.html — keep the two in sync. */
export const THEME_STORAGE_KEY = "veytaro-theme";

/** Dark is the product's own default, and the brand mark is built for it. */
export const DEFAULT_THEME: Theme = "dark";

function isTheme(value: unknown): value is Theme {
  return value === "dark" || value === "light";
}

/**
 * The theme that should be active right now.
 *
 * Order: an explicit stored choice wins; otherwise the default. The OS
 * preference is deliberately *not* consulted — the brief asks for dark on a
 * first visit regardless of system settings.
 */
export function readStoredTheme(storage?: Pick<Storage, "getItem">): Theme {
  const store = storage ?? safeStorage();
  if (!store) return DEFAULT_THEME;

  try {
    const stored = store.getItem(THEME_STORAGE_KEY);
    return isTheme(stored) ? stored : DEFAULT_THEME;
  } catch {
    // Private mode or blocked storage — fall back rather than throw.
    return DEFAULT_THEME;
  }
}

/** Writes the choice, ignoring storage failures (private browsing). */
export function persistTheme(theme: Theme, storage?: Pick<Storage, "setItem">): void {
  const store = storage ?? safeStorage();
  if (!store) return;
  try {
    store.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    /* the choice simply will not survive a reload */
  }
}

/**
 * Applies the theme to the document.
 *
 * Also updates <meta name="theme-color">, so mobile browser chrome matches the
 * page instead of staying dark on a light background.
 */
export function applyTheme(theme: Theme, doc: Document = document): void {
  doc.documentElement.setAttribute("data-theme", theme);

  const meta = doc.querySelector('meta[name="theme-color"]');
  if (meta) {
    meta.setAttribute("content", theme === "light" ? "#f5f7fa" : "#07111f");
  }
}

export function nextTheme(current: Theme): Theme {
  return current === "dark" ? "light" : "dark";
}

function safeStorage(): Storage | null {
  try {
    return typeof localStorage === "undefined" ? null : localStorage;
  } catch {
    return null;
  }
}
