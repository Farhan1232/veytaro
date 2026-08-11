import { describe, expect, it } from "vitest";
import { LINKS, SITE, SUPPORT_EMAIL, SUPPORT_MAILTO } from "./site";
import { content } from "../content";

describe("support contact", () => {
  it("is the one address the project actually has", () => {
    expect(SUPPORT_EMAIL).toBe("Niclaskrieck@gmail.com");
  });

  it("builds a mailto link with a useful subject", () => {
    expect(SUPPORT_MAILTO.startsWith(`mailto:${SUPPORT_EMAIL}?subject=`)).toBe(true);
  });
});

describe("legal links", () => {
  it("links the terms page that exists", () => {
    expect(LINKS.terms).toBe("/bedingungen");
  });

  it("leaves imprint and privacy unset rather than inventing a legal identity", () => {
    // The footer renders a link only for non-null entries, so nothing 404s and
    // no company details are fabricated.
    expect(LINKS.imprint).toBeNull();
    expect(LINKS.privacy).toBeNull();
  });
});

describe("copy honesty", () => {
  it("never claims the installers are signed or notarised", () => {
    const haystack = JSON.stringify(content).toLowerCase();
    expect(haystack).not.toContain("signiert und notarisiert");
    expect(haystack).not.toContain("notarisiert von apple");
    // The site must state the opposite, and does.
    expect(haystack).toContain("nicht signiert");
  });

  it("states the site is in German for the right locale", () => {
    expect(SITE.locale).toBe("de_DE");
    expect(SITE.lang).toBe("de");
  });
});
