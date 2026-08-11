import { cleanup } from "@testing-library/react";
import { afterEach, beforeEach } from "vitest";

/**
 * Shared test setup.
 *
 * Each test starts from a clean document and empty storage, so a theme written
 * by one test cannot leak into the next and make an assertion pass for the
 * wrong reason.
 */

beforeEach(() => {
  localStorage.clear();
  document.documentElement.removeAttribute("data-theme");
});

afterEach(() => {
  cleanup();
});

// jsdom implements none of these, and components use all of them: the header
// listens for scroll, the router scrolls to the top on navigation, and the
// documentation sidebar observes headings to highlight the active section.
if (!window.scrollTo) {
  window.scrollTo = () => {};
}

/**
 * A no-op IntersectionObserver.
 *
 * The sidebar treats a missing observer as "no highlight", so nothing under
 * test depends on it firing — this only stops jsdom throwing on `new`.
 *
 * The guard reads off a loosely typed alias because TypeScript knows the real
 * `Window` always has the property and would narrow the check to `never`.
 */
const globalWindow = window as unknown as Record<string, unknown>;

if (typeof globalWindow.IntersectionObserver === "undefined") {
  class NoopIntersectionObserver implements IntersectionObserver {
    readonly root = null;
    readonly rootMargin = "";
    readonly thresholds: readonly number[] = [];
    disconnect() {}
    observe() {}
    unobserve() {}
    takeRecords(): IntersectionObserverEntry[] {
      return [];
    }
  }
  globalWindow.IntersectionObserver = NoopIntersectionObserver;
}
