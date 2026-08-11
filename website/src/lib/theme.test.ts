import { beforeEach, describe, expect, it } from "vitest";
import {
  DEFAULT_THEME,
  THEME_STORAGE_KEY,
  applyTheme,
  nextTheme,
  persistTheme,
  readStoredTheme,
} from "./theme";

describe("theme defaults", () => {
  beforeEach(() => localStorage.clear());

  it("is dark", () => {
    expect(DEFAULT_THEME).toBe("dark");
  });

  it("falls back to dark on a first visit", () => {
    expect(readStoredTheme()).toBe("dark");
  });

  it("ignores the OS preference, so a first visit is always dark", () => {
    // A light-preferring system must still get the dark default.
    const store = { getItem: () => null };
    expect(readStoredTheme(store)).toBe("dark");
  });

  it("falls back to dark when the stored value is not a theme", () => {
    localStorage.setItem(THEME_STORAGE_KEY, "solarized");
    expect(readStoredTheme()).toBe("dark");
  });

  it("survives storage that throws (private browsing)", () => {
    const hostile = {
      getItem() {
        throw new Error("blocked");
      },
    };
    expect(readStoredTheme(hostile)).toBe("dark");
  });
});

describe("persistence", () => {
  beforeEach(() => localStorage.clear());

  it("round-trips a stored choice", () => {
    persistTheme("light");
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe("light");
    expect(readStoredTheme()).toBe("light");
  });

  it("uses the same storage key the inline bootstrap script reads", () => {
    // index.html hard-codes this string before the bundle loads; if it drifts,
    // returning visitors get a theme flash.
    expect(THEME_STORAGE_KEY).toBe("veytaro-theme");
  });

  it("does not throw when storage rejects the write", () => {
    const hostile = {
      setItem() {
        throw new Error("quota");
      },
    };
    expect(() => persistTheme("light", hostile)).not.toThrow();
  });
});

describe("applyTheme", () => {
  it("sets data-theme on the document element", () => {
    applyTheme("light");
    expect(document.documentElement.getAttribute("data-theme")).toBe("light");

    applyTheme("dark");
    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
  });

  it("updates the theme-color meta so mobile chrome matches the page", () => {
    const meta = document.createElement("meta");
    meta.setAttribute("name", "theme-color");
    document.head.appendChild(meta);

    applyTheme("light");
    expect(meta.getAttribute("content")).toBe("#f5f7fa");

    applyTheme("dark");
    expect(meta.getAttribute("content")).toBe("#07111f");

    document.head.removeChild(meta);
  });
});

describe("nextTheme", () => {
  it("flips between the two themes", () => {
    expect(nextTheme("dark")).toBe("light");
    expect(nextTheme("light")).toBe("dark");
  });
});
