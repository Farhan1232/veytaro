/**
 * Single source of truth for everything the download page states about a build.
 *
 * Nothing here is inferred at runtime: if a field is not known yet it stays
 * `null` and the UI says so. A card whose `status` is not `"available"` renders
 * a disabled button — the site never links to a file that does not exist.
 *
 * Filled in by `node scripts/sync-release-to-website.mjs <artifact...>` from the
 * repository root, which copies real installers into `website/public/downloads/`
 * and writes back the real size and SHA-256. See RELEASE.md.
 */

export type Platform = "windows" | "macos";

export type ReleaseStatus =
  /** File exists in public/downloads/ and the button links to it. */
  | "available"
  /** Not built yet. Button is visibly disabled, with an honest label. */
  | "pending";

export type SigningStatus =
  | "signed"
  | "notarized"
  /** Built, but with no code-signing certificate — the OS will warn. */
  | "unsigned";

export interface ReleaseAsset {
  platform: Platform;
  /** Human label for the CPU architectures the file covers. */
  architecture: string;
  /** Exact filename as produced by the release workflow. */
  filename: string;
  /** Site-root-relative path. Only followed when status is "available". */
  path: string;
  /** Bytes. `null` until a real artifact is measured. */
  sizeBytes: number | null;
  /** Lowercase hex SHA-256 of the artifact. `null` until measured. */
  sha256: string | null;
  signing: SigningStatus;
  status: ReleaseStatus;
  /** File extension shown on the card, e.g. ".exe". */
  extension: string;
}

export interface Release {
  /** Mirrors `version` in src-tauri/tauri.conf.json. */
  version: string;
  /** ISO date (YYYY-MM-DD) or null while unreleased. */
  releasedAt: string | null;
  assets: ReleaseAsset[];
}

export const RELEASE: Release = {
  version: "0.1.0",
  releasedAt: null,
  assets: [
    {
      platform: "windows",
      architecture: "x64",
      filename: "Veytaro_0.1.0_Windows_x64_Setup.exe",
      path: "/downloads/Veytaro_0.1.0_Windows_x64_Setup.exe",
      sizeBytes: null,
      sha256: null,
      signing: "unsigned",
      status: "pending",
      extension: ".exe",
    },
    {
      platform: "macos",
      architecture: "Apple Silicon + Intel",
      filename: "Veytaro_0.1.0_macOS_Universal.dmg",
      path: "/downloads/Veytaro_0.1.0_macOS_Universal.dmg",
      sizeBytes: null,
      sha256: null,
      signing: "unsigned",
      status: "pending",
      extension: ".dmg",
    },
  ],
};

export function assetFor(platform: Platform): ReleaseAsset {
  const asset = RELEASE.assets.find((a) => a.platform === platform);
  if (!asset) {
    throw new Error(`No release asset configured for platform "${platform}"`);
  }
  return asset;
}

/** True when at least one artifact is real and downloadable. */
export function hasAnyDownload(): boolean {
  return RELEASE.assets.some((a) => a.status === "available");
}
