/**
 * Client-side OS detection, used only to decide which download card is
 * *recommended* first. Both platforms always stay visible and nothing ever
 * downloads without a click.
 *
 * Detection is deliberately conservative: anything it cannot positively
 * identify becomes "unknown", which presents Windows and macOS as equals.
 */

export type DetectedOs = "windows" | "macos" | "mobile" | "unknown";

/** The slice of `navigator` we read. Injectable so tests need no DOM. */
export interface NavigatorLike {
  userAgentData?: {
    platform?: string;
    mobile?: boolean;
  };
  platform?: string;
  userAgent?: string;
  maxTouchPoints?: number;
}

function fromUserAgentData(nav: NavigatorLike): DetectedOs | null {
  const data = nav.userAgentData;
  if (!data) return null;

  // `mobile` is the most reliable signal the API offers; trust it first.
  if (data.mobile === true) return "mobile";

  const platform = data.platform?.toLowerCase() ?? "";
  if (!platform) return null;
  if (platform.includes("win")) return "windows";
  if (platform.includes("mac")) return "macos";
  if (platform.includes("android")) return "mobile";
  if (platform.includes("ios")) return "mobile";
  return null;
}

function fromPlatform(nav: NavigatorLike): DetectedOs | null {
  const platform = nav.platform?.toLowerCase() ?? "";
  if (!platform) return null;

  if (platform.includes("win")) return "windows";
  if (platform.includes("iphone") || platform.includes("ipod")) return "mobile";
  // iPadOS 13+ reports "MacIntel" and is separated from a real Mac only by
  // its touch points. Checking this before the generic "mac" branch matters.
  if (platform.includes("ipad")) return "mobile";
  if (platform.includes("mac")) {
    return (nav.maxTouchPoints ?? 0) > 1 ? "mobile" : "macos";
  }
  if (platform.includes("android") || platform.includes("linux arm")) {
    return "mobile";
  }
  return null;
}

function fromUserAgent(nav: NavigatorLike): DetectedOs | null {
  const ua = nav.userAgent?.toLowerCase() ?? "";
  if (!ua) return null;

  // Mobile markers are checked first: an Android UA also contains "linux",
  // and an iPad UA can contain "macintosh".
  if (
    ua.includes("android") ||
    ua.includes("iphone") ||
    ua.includes("ipad") ||
    ua.includes("ipod") ||
    ua.includes("windows phone") ||
    ua.includes("mobile")
  ) {
    return "mobile";
  }
  if (ua.includes("windows")) return "windows";
  if (ua.includes("mac os") || ua.includes("macintosh")) return "macos";
  return null;
}

/**
 * Best-effort OS detection. Never throws — a missing or hostile `navigator`
 * yields "unknown" rather than breaking the page.
 */
export function detectOs(nav?: NavigatorLike | null): DetectedOs {
  if (!nav) return "unknown";
  try {
    return (
      fromUserAgentData(nav) ?? fromPlatform(nav) ?? fromUserAgent(nav) ?? "unknown"
    );
  } catch {
    return "unknown";
  }
}

/** Reads the real browser navigator; safe to call during SSR/prerender. */
export function detectCurrentOs(): DetectedOs {
  if (typeof navigator === "undefined") return "unknown";
  return detectOs(navigator as NavigatorLike);
}
