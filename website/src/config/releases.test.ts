import { describe, expect, it } from "vitest";
import { RELEASE, assetFor, hasAnyDownload } from "./releases";

/**
 * These assertions pin the release facts the download page publishes.
 *
 * They are deliberately strict about the filenames and digests: those values
 * describe the two installers that are actually served from `public/downloads`,
 * and a silent edit to either would make the site advertise a checksum that no
 * longer matches the file a visitor receives.
 */
describe("release assets", () => {
  it("ships an installer for both supported platforms", () => {
    expect(RELEASE.assets.map((a) => a.platform).sort()).toEqual(["macos", "windows"]);
    expect(hasAnyDownload()).toBe(true);
  });

  it("names the exact files that exist in public/downloads", () => {
    expect(assetFor("windows").filename).toBe("Veytaro_0.1.0_Windows_x64_Setup.exe");
    expect(assetFor("macos").filename).toBe("Veytaro_0.1.0_macOS_Universal.dmg");
  });

  it("points each download at its own file under /downloads", () => {
    for (const asset of RELEASE.assets) {
      expect(asset.path).toBe(`/downloads/${asset.filename}`);
    }
  });

  it("publishes a complete 64-character SHA-256 for every available asset", () => {
    for (const asset of RELEASE.assets) {
      if (asset.status !== "available") continue;
      // A truncated digest cannot verify anything, which is the only reason it
      // is on the page at all.
      expect(asset.sha256).toMatch(/^[0-9a-f]{64}$/);
    }
  });

  it("carries the digests computed from the published installers", () => {
    expect(assetFor("windows").sha256).toBe(
      "42639c7086381e8bab184511b8e97bac2f7a4edce71c80c55826137233819265",
    );
    expect(assetFor("macos").sha256).toBe(
      "9dab6e772fed45ec6d47bcc1ff7e207da7cad96d6f1f6c9959fe0cdb3772f2b0",
    );
  });

  it("records the byte size of each installer", () => {
    expect(assetFor("windows").sizeBytes).toBe(2979275);
    expect(assetFor("macos").sizeBytes).toBe(9320267);
  });

  it("declares both installers unsigned, matching what the site states", () => {
    for (const asset of RELEASE.assets) {
      expect(asset.signing).toBe("unsigned");
    }
  });

  it("matches the extension in the filename", () => {
    expect(assetFor("windows").filename.endsWith(assetFor("windows").extension)).toBe(true);
    expect(assetFor("macos").filename.endsWith(assetFor("macos").extension)).toBe(true);
  });
});
