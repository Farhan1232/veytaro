import { describe, expect, it } from "vitest";
import { detectOs, type NavigatorLike } from "./osDetection";

/** Real user-agent strings, so the fallbacks are tested against real input. */
const UA = {
  windows11Chrome:
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36",
  macSafari:
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Safari/605.1.15",
  androidChrome:
    "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Mobile Safari/537.36",
  iphoneSafari:
    "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1",
  ipadSafari:
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Safari/605.1.15",
  linuxFirefox:
    "Mozilla/5.0 (X11; Linux x86_64; rv:134.0) Gecko/20100101 Firefox/134.0",
};

describe("detectOs — userAgentData (modern Chromium)", () => {
  it("detects Windows", () => {
    const nav: NavigatorLike = {
      userAgentData: { platform: "Windows", mobile: false },
      userAgent: UA.windows11Chrome,
    };
    expect(detectOs(nav)).toBe("windows");
  });

  it("detects macOS", () => {
    const nav: NavigatorLike = {
      userAgentData: { platform: "macOS", mobile: false },
      userAgent: UA.macSafari,
    };
    expect(detectOs(nav)).toBe("macos");
  });

  it("detects mobile from the mobile flag even when the platform looks desktop", () => {
    const nav: NavigatorLike = {
      userAgentData: { platform: "Android", mobile: true },
      userAgent: UA.androidChrome,
    };
    expect(detectOs(nav)).toBe("mobile");
  });

  it("falls through to the next strategy when the platform is unrecognised", () => {
    const nav: NavigatorLike = {
      userAgentData: { platform: "Fuchsia", mobile: false },
      userAgent: UA.windows11Chrome,
    };
    expect(detectOs(nav)).toBe("windows");
  });
});

describe("detectOs — navigator.platform fallback (no userAgentData)", () => {
  it("detects Windows", () => {
    expect(detectOs({ platform: "Win32", userAgent: UA.windows11Chrome })).toBe(
      "windows",
    );
  });

  it("detects macOS", () => {
    expect(
      detectOs({ platform: "MacIntel", maxTouchPoints: 0, userAgent: UA.macSafari }),
    ).toBe("macos");
  });

  it("treats a touch-capable MacIntel as mobile (iPadOS 13+ masquerade)", () => {
    expect(
      detectOs({ platform: "MacIntel", maxTouchPoints: 5, userAgent: UA.ipadSafari }),
    ).toBe("mobile");
  });

  it("detects iPhone", () => {
    expect(detectOs({ platform: "iPhone", userAgent: UA.iphoneSafari })).toBe(
      "mobile",
    );
  });
});

describe("detectOs — userAgent fallback (no userAgentData, no platform)", () => {
  it("detects Windows", () => {
    expect(detectOs({ userAgent: UA.windows11Chrome })).toBe("windows");
  });

  it("detects macOS", () => {
    expect(detectOs({ userAgent: UA.macSafari })).toBe("macos");
  });

  it("detects Android before the Linux marker in the same string", () => {
    expect(detectOs({ userAgent: UA.androidChrome })).toBe("mobile");
  });

  it("detects iPhone", () => {
    expect(detectOs({ userAgent: UA.iphoneSafari })).toBe("mobile");
  });
});

describe("detectOs — unknown", () => {
  it("returns unknown for desktop Linux (no installer is offered for it)", () => {
    expect(detectOs({ platform: "Linux x86_64", userAgent: UA.linuxFirefox })).toBe(
      "unknown",
    );
  });

  it("returns unknown for an empty navigator", () => {
    expect(detectOs({})).toBe("unknown");
  });

  it("returns unknown when navigator is missing entirely", () => {
    expect(detectOs(null)).toBe("unknown");
    expect(detectOs(undefined)).toBe("unknown");
  });

  it("returns unknown for an unrecognised user agent", () => {
    expect(detectOs({ userAgent: "SomeBot/1.0 (+https://example.com/bot)" })).toBe(
      "unknown",
    );
  });

  it("does not throw when navigator properties are hostile getters", () => {
    const hostile = {
      get userAgentData(): never {
        throw new Error("blocked by privacy extension");
      },
    } as unknown as NavigatorLike;
    expect(detectOs(hostile)).toBe("unknown");
  });
});
