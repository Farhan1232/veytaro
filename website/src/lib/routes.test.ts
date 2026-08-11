import { describe, expect, it } from "vitest";
import { ROUTES, normalisePath, routeById, routeByPath } from "./routes";

describe("route table", () => {
  it("defines the five pages the site ships", () => {
    expect(ROUTES.map((r) => r.path)).toEqual([
      "/",
      "/ueber-veytaro",
      "/dokumentation",
      "/bedingungen",
      "/kontakt",
    ]);
  });

  it("has no duplicate paths or ids", () => {
    expect(new Set(ROUTES.map((r) => r.path)).size).toBe(ROUTES.length);
    expect(new Set(ROUTES.map((r) => r.id)).size).toBe(ROUTES.length);
  });

  it("gives every route a title and description for SEO", () => {
    for (const route of ROUTES) {
      expect(route.title.length).toBeGreaterThan(0);
      expect(route.description.length).toBeGreaterThan(0);
      expect(route.nav.length).toBeGreaterThan(0);
    }
  });
});

describe("routeByPath", () => {
  it("resolves each declared path", () => {
    for (const route of ROUTES) {
      expect(routeByPath(route.path)?.id).toBe(route.id);
    }
  });

  it("treats a trailing slash as the same route", () => {
    expect(routeByPath("/kontakt/")?.id).toBe("contact");
  });

  it("returns null for an unknown path, which renders the 404 page", () => {
    expect(routeByPath("/gibt-es-nicht")).toBeNull();
  });
});

describe("routeById", () => {
  it("resolves a known id", () => {
    expect(routeById("docs").path).toBe("/dokumentation");
  });
});

describe("normalisePath", () => {
  it("keeps the root as /", () => {
    expect(normalisePath("/")).toBe("/");
    expect(normalisePath("")).toBe("/");
  });

  it("strips trailing slashes", () => {
    expect(normalisePath("/kontakt/")).toBe("/kontakt");
    expect(normalisePath("/kontakt///")).toBe("/kontakt");
  });
});
