import { useCallback, useEffect, useState } from "react";
import {
  applyTheme,
  nextTheme,
  persistTheme,
  readStoredTheme,
  type Theme,
} from "../lib/theme";

/**
 * Keeps React state, `<html data-theme>` and localStorage in step.
 *
 * The initial value is read from storage rather than from the DOM attribute, so
 * the hook behaves identically in a test environment where the inline bootstrap
 * script in index.html has not run.
 *
 * It lives in its own module rather than beside `<ThemeToggle>` so that file
 * exports only a component and stays hot-reloadable.
 */
export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => readStoredTheme());

  // Re-applies whenever the value changes, and once on mount so the attribute
  // is correct even if the inline script was skipped or blocked.
  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const toggle = useCallback(() => {
    setTheme((current) => {
      const next = nextTheme(current);
      persistTheme(next);
      return next;
    });
  }, []);

  return { theme, toggle };
}
