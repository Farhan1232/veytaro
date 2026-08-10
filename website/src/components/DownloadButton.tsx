import { assetFor, type Platform } from "../config/releases";
import { content } from "../content";
import { DownloadIcon } from "./Icons";
import "./DownloadButton.css";

interface DownloadButtonProps {
  platform: Platform;
  variant?: "primary" | "secondary";
  /** Extra context for screen readers, e.g. the platform name. */
  labelSuffix?: string;
}

/**
 * Renders an anchor only when a real file exists. While a build is pending it
 * renders a disabled <button> instead — never a "#" href, and never a link to
 * a file that would 404.
 */
export function DownloadButton({
  platform,
  variant = "primary",
  labelSuffix,
}: DownloadButtonProps) {
  const asset = assetFor(platform);
  const t = content.downloads;
  const className = `dl-button dl-button--${variant}`;

  if (asset.status !== "available") {
    return (
      <button
        type="button"
        className={`${className} is-disabled`}
        disabled
        aria-disabled="true"
        aria-describedby={`dl-unavailable-${platform}`}
      >
        {t.unavailableCta}
      </button>
    );
  }

  return (
    <a
      className={className}
      href={asset.path}
      download={asset.filename}
      aria-label={labelSuffix ? `${t.downloadCta} — ${labelSuffix}` : undefined}
    >
      <DownloadIcon size={18} />
      {t.downloadCta}
    </a>
  );
}
