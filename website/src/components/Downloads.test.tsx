import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Downloads } from "./Downloads";
import { RELEASE, assetFor } from "../config/releases";
import { content } from "../content";

const WINDOWS = assetFor("windows");
const MACOS = assetFor("macos");

describe("<Downloads> links", () => {
  it("points each card at the real installer file", () => {
    render(<Downloads os="unknown" />);

    const links = screen.getAllByRole("link", { name: /Herunterladen/ });
    const hrefs = links.map((a) => a.getAttribute("href"));

    expect(hrefs).toContain("/downloads/Veytaro_0.1.0_Windows_x64_Setup.exe");
    expect(hrefs).toContain("/downloads/Veytaro_0.1.0_macOS_Universal.dmg");
  });

  it("sets the download attribute to the installer filename", () => {
    render(<Downloads os="unknown" />);

    const win = screen.getByRole("link", {
      name: `${content.downloads.downloadCta} — Windows`,
    });
    expect(win.getAttribute("download")).toBe(WINDOWS.filename);
  });

  it("shows both platforms regardless of the detected system", () => {
    render(<Downloads os="windows" />);
    expect(screen.getByRole("heading", { name: "Windows" })).toBeTruthy();
    expect(screen.getByRole("heading", { name: "macOS" })).toBeTruthy();
  });
});

describe("<Downloads> checksums", () => {
  it("prints the full 64-character SHA-256 for both installers", () => {
    render(<Downloads os="unknown" />);

    expect(screen.getByText(WINDOWS.sha256!)).toBeTruthy();
    expect(screen.getByText(MACOS.sha256!)).toBeTruthy();
  });

  it("gives each copy button a platform-specific accessible name", () => {
    render(<Downloads os="unknown" />);

    expect(
      screen.getByRole("button", { name: content.downloads.checksumCopyLabel("Windows") }),
    ).toBeTruthy();
    expect(
      screen.getByRole("button", { name: content.downloads.checksumCopyLabel("macOS") }),
    ).toBeTruthy();
  });

  it("states the release version and the unsigned status on every card", () => {
    render(<Downloads os="unknown" />);

    expect(screen.getAllByText(RELEASE.version).length).toBe(RELEASE.assets.length);
    expect(screen.getAllByText(content.downloads.signingUnsigned).length).toBe(
      RELEASE.assets.length,
    );
  });
});

describe("<Downloads> OS recommendation", () => {
  it("marks the Windows card when Windows is detected", () => {
    render(<Downloads os="windows" />);

    const card = screen.getByRole("heading", { name: "Windows" }).closest("article")!;
    expect(within(card).getByText(content.downloads.recommendedBadge)).toBeTruthy();
  });

  it("marks the macOS card when macOS is detected", () => {
    render(<Downloads os="macos" />);

    const card = screen.getByRole("heading", { name: "macOS" }).closest("article")!;
    expect(within(card).getByText(content.downloads.recommendedBadge)).toBeTruthy();
  });

  it("puts the detected platform first without hiding the other", () => {
    render(<Downloads os="macos" />);

    const headings = screen
      .getAllByRole("heading", { level: 3 })
      .map((h) => h.textContent);
    expect(headings).toEqual(["macOS", "Windows"]);
  });

  it("recommends nothing when the platform is unknown", () => {
    render(<Downloads os="unknown" />);
    expect(screen.queryByText(content.downloads.recommendedBadge)).toBeNull();
  });

  it("explains on mobile that the app is desktop-only, and still lists both files", () => {
    render(<Downloads os="mobile" />);

    expect(screen.getByText(content.downloads.mobileNote)).toBeTruthy();
    expect(screen.queryByText(content.downloads.recommendedBadge)).toBeNull();
    expect(screen.getAllByRole("link", { name: /Herunterladen/ }).length).toBe(2);
  });
});
