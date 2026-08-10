import { assetFor, RELEASE, type Platform } from "../config/releases";
import { content } from "../content";
import { formatBytes } from "../lib/format";
import type { DetectedOs } from "../lib/osDetection";
import { DownloadButton } from "./DownloadButton";
import { AppleIcon, WindowsIcon } from "./Icons";
import "./Downloads.css";

interface DownloadsProps {
  os: DetectedOs;
}

function PlatformCard({
  platform,
  recommended,
}: {
  platform: Platform;
  recommended: boolean;
}) {
  const t = content.downloads;
  const asset = assetFor(platform);
  const labels = t.platforms[platform];
  const Icon = platform === "windows" ? WindowsIcon : AppleIcon;
  const size = formatBytes(asset.sizeBytes);
  const headingId = `dl-card-${platform}`;

  return (
    <article
      className={`dl-card${recommended ? " is-recommended" : ""}`}
      aria-labelledby={headingId}
    >
      <div className="dl-card__top">
        <span className="dl-card__icon">
          <Icon size={26} />
        </span>
        {recommended ? (
          <span className="dl-card__badge">{t.recommendedBadge}</span>
        ) : null}
      </div>

      <h3 className="dl-card__title" id={headingId}>
        {labels.name}
      </h3>
      <p className="dl-card__req">{labels.requirement}</p>

      <dl className="dl-card__meta">
        <div>
          <dt>{t.versionLabel}</dt>
          <dd>{RELEASE.version}</dd>
        </div>
        <div>
          <dt>Architektur</dt>
          <dd>{labels.architecture}</dd>
        </div>
        <div>
          <dt>Format</dt>
          <dd>{asset.extension}</dd>
        </div>
        <div>
          <dt>{t.sizeLabel}</dt>
          <dd>{size ?? <span className="dl-card__pending">{t.sizeUnknown}</span>}</dd>
        </div>
      </dl>

      <div className="dl-card__action">
        <DownloadButton
          platform={platform}
          variant={recommended ? "primary" : "secondary"}
          labelSuffix={labels.name}
        />
        {asset.status !== "available" ? (
          <p className="dl-card__note" id={`dl-unavailable-${platform}`}>
            {t.unavailableNote}
          </p>
        ) : null}
      </div>

      {asset.sha256 ? (
        <p className="dl-card__checksum">
          <span className="dl-card__checksum-label">{t.checksumLabel}</span>
          <code>{asset.sha256}</code>
        </p>
      ) : null}
    </article>
  );
}

export function Downloads({ os }: DownloadsProps) {
  const t = content.downloads;
  const recommended = os === "windows" || os === "macos" ? os : null;

  return (
    <section className="section" id={t.id} aria-labelledby="downloads-heading">
      <div className="page">
        <div className="section__head reveal">
          <h2 id="downloads-heading">{t.heading}</h2>
          <p>{t.description}</p>
        </div>

        <div className="dl-grid reveal">
          <PlatformCard platform="windows" recommended={recommended === "windows"} />
          <PlatformCard platform="macos" recommended={recommended === "macos"} />
        </div>
      </div>
    </section>
  );
}
