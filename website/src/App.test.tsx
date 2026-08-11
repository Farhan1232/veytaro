import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { App } from "./App";
import { SUPPORT_EMAIL } from "./config/site";
import { content } from "./content";
import { ROUTES, routeById } from "./lib/routes";

/** The router reads location.pathname, so each test starts by setting it. */
function renderAt(path: string) {
  window.history.pushState({}, "", path);
  return render(<App />);
}

beforeEach(() => {
  window.history.pushState({}, "", "/");
});

describe("routing", () => {
  it("renders every declared route with exactly one <h1>", async () => {
    for (const route of ROUTES) {
      const { unmount } = renderAt(route.path);
      await screen.findByRole("heading", { level: 1 });
      expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
      unmount();
    }
  });

  it("renders the home page at /", () => {
    renderAt("/");
    expect(
      screen.getByRole("heading", { level: 1, name: /Dein Spielstand/ }),
    ).toBeTruthy();
  });

  it("renders the about page", async () => {
    renderAt(routeById("about").path);
    expect(
      await screen.findByRole("heading", { level: 1, name: routeById("about").title }),
    ).toBeTruthy();
  });

  it("renders the documentation page", async () => {
    renderAt(routeById("docs").path);
    expect(
      await screen.findByRole("heading", { level: 1, name: routeById("docs").title }),
    ).toBeTruthy();
  });

  it("renders the terms page", async () => {
    renderAt(routeById("terms").path);
    expect(
      await screen.findByRole("heading", { level: 1, name: routeById("terms").title }),
    ).toBeTruthy();
  });

  it("renders the contact page", async () => {
    renderAt(routeById("contact").path);
    expect(
      await screen.findByRole("heading", { level: 1, name: routeById("contact").title }),
    ).toBeTruthy();
  });

  it("renders the 404 page for an unknown path", async () => {
    renderAt("/diese-seite-gibt-es-nicht");
    expect(
      await screen.findByRole("heading", { level: 1, name: content.notFound.heading }),
    ).toBeTruthy();
  });

  it("treats a trailing slash as the same page", async () => {
    renderAt("/kontakt/");
    expect(
      await screen.findByRole("heading", { level: 1, name: routeById("contact").title }),
    ).toBeTruthy();
  });

  it("sets the document title per route", async () => {
    renderAt(routeById("contact").path);
    await screen.findByRole("heading", { level: 1 });
    expect(document.title).toBe(
      `${routeById("contact").title} — ${content.meta.titleSuffix}`,
    );
  });
});

describe("contact details", () => {
  it("shows the support address on the contact page", async () => {
    renderAt(routeById("contact").path);
    // Once in the body, once in the footer.
    expect((await screen.findAllByText(SUPPORT_EMAIL)).length).toBeGreaterThan(0);
  });

  it("links it as a mailto", async () => {
    renderAt(routeById("contact").path);
    const link = await screen.findByRole("link", { name: content.contact.emailCta });
    expect(link.getAttribute("href")).toContain(`mailto:${SUPPORT_EMAIL}`);
  });

  it("shows the support address in the footer on every page", async () => {
    for (const route of ROUTES) {
      const { unmount } = renderAt(route.path);
      expect((await screen.findAllByText(SUPPORT_EMAIL)).length).toBeGreaterThan(0);
      unmount();
    }
  });

  it("offers no contact form, because there is no backend to receive one", async () => {
    renderAt(routeById("contact").path);
    await screen.findByRole("heading", { level: 1 });
    expect(document.querySelector("form")).toBeNull();
    expect(document.querySelector("input")).toBeNull();
  });
});

describe("chrome", () => {
  it("puts every route in the header navigation", () => {
    renderAt("/");
    const nav = screen.getByRole("navigation", { name: content.nav.menuLabel });
    for (const route of ROUTES) {
      expect(
        screen.getAllByRole("link", { name: route.nav }).length,
      ).toBeGreaterThan(0);
      expect(nav.querySelector(`a[href="${route.path}"]`)).toBeTruthy();
    }
  });

  it("marks the current route in the navigation", async () => {
    renderAt(routeById("docs").path);
    await screen.findByRole("heading", { level: 1 });
    const current = document.querySelector('a[aria-current="page"]');
    expect(current?.getAttribute("href")).toBe(routeById("docs").path);
  });

  it("opens with a skip link to the main landmark", () => {
    renderAt("/");
    const skip = screen.getByRole("link", { name: content.meta.skipToContent });
    expect(skip.getAttribute("href")).toBe("#main");
    expect(document.getElementById("main")).toBeTruthy();
  });

  it("names no social profiles or phone numbers anywhere", () => {
    renderAt("/");
    const text = document.body.textContent ?? "";
    // The project has none; the footer must not invent any.
    expect(text).not.toMatch(/twitter|facebook|instagram|discord/i);
    expect(text).not.toMatch(/\+\d{2}[\s\d]{7,}/);
  });
});
