import { RELEASE, type Platform, type ReleaseAsset } from "../config/releases";
import { content } from "../content";
import { formatBytes } from "../lib/format";
import type { DetectedOs } from "../lib/osDetection";
import { ChecksumField } from "./ChecksumField";
import { AppleIcon, DownloadIcon, WindowsIcon } from "./Icons";
import "./Downloads.css";

const PLATFORM_ORDER: Platform[] = ["windows", "macos"];

/**
 * Both installers, side by side, each with version, size and the full SHA-256.
 *
 * Detection reorders the cards and marks one "for your system". It never hides
 * a platform, never disables the other card, and never starts a download by
 * itself — a visitor on Linux, or one whose browser reports nothing useful,
 * still sees both files with equal access.
 */
export function Downloads({ os }: { os: DetectedOs }) {
  const t = content.downloads;

  const recommended: Platform | null =
    os === "windows" || os === "macos" ? os : null;

  const order = recommended
    ? [recommended, ...PLATFORM_ORDER.filter((p) => p !== recommended)]
    : PLATFORM_ORDER;

  return (
    <section className="section section--alt" id={t.id} aria-labelledby="downloads-heading">
      <div className="container">
        <div className="section__head">
          <p className="eyebrow">{t.eyebrow}</p>
          <h2 id="downloads-heading">{t.heading}</h2>
          <p className="lede">{t.description}</p>
        </div>

        {os === "mobile" && (
          <p className="downloads__notice" role="note">
            {t.mobileNote}
          </p>
        )}

        <div className="downloads__grid">
          {order.map((platform) => (
            <DownloadCard
              key={platform}
              platform={platform}
              asset={RELEASE.assets.find((a) => a.platform === platform) ?? null}
              recommended={platform === recommended}
            />
          ))}
        </div>

        <p className="downloads__hint">{t.otherPlatformsHint}</p>
      </div>
    </section>
  );
}

function DownloadCard({
  platform,
  asset,
  recommended,
}: {
  platform: Platform;
  asset: ReleaseAsset | null;
  recommended: boolean;
}) {
  const t = content.downloads;
  const meta = t.platforms[platform];
  const PlatformIcon = platform === "macos" ? AppleIcon : WindowsIcon;
  const available = asset?.status === "available";
  const size = asset ? formatBytes(asset.sizeBytes) : null;
  const headingId = `download-${platform}`;

  return (
    <article
      className={`card download-card${recommended ? " is-recommended" : ""}`}
      aria-labelledby={headingId}
    >
      <header className="download-card__head">
        <span className="download-card__icon" aria-hidden="true">
          <PlatformIcon size={26} />
        </span>

        <div className="download-card__titles">
          <h3 id={headingId} className="download-card__name">
            {meta.name}
          </h3>
          <p className="download-card__req">{meta.requirement}</p>
        </div>

        {recommended && <span className="download-card__badge">{t.recommendedBadge}</span>}
      </header>

      <dl className="download-card__facts">
        <div>
          <dt>{t.versionLabel}</dt>
          <dd>{RELEASE.version}</dd>
        </div>
        <div>
          <dt>{t.architectureLabel}</dt>
          <dd>{meta.architecture}</dd>
        </div>
        <div>
          <dt>{t.sizeLabel}</dt>
          <dd>{size ?? t.sizeUnknown}</dd>
        </div>
        <div>
          <dt>{t.signingLabel}</dt>
          {/* Stated plainly. The installers are not signed and the site must
              never suggest otherwise. */}
          <dd>{t.signingUnsigned}</dd>
        </div>
      </dl>

      {available && asset?.sha256 ? (
        <ChecksumField value={asset.sha256} platformName={meta.name} />
      ) : (
        <p className="download-card__nochecksum">
          {t.checksumLabel}: {t.checksumUnknown}
        </p>
      )}

      {available && asset ? (
        <a
          className="btn btn--primary btn--block"
          href={asset.path}
          download={asset.filename}
          aria-label={`${t.downloadCta} — ${meta.name}`}
        >
          <DownloadIcon size={18} />
          {t.downloadCta}
        </a>
      ) : (
        <>
          <button
            type="button"
            className="btn btn--secondary btn--block"
            disabled
            aria-disabled="true"
            aria-describedby={`dl-unavailable-${platform}`}
          >
            {t.unavailableCta}
          </button>
          <p id={`dl-unavailable-${platform}`} className="download-card__note">
            {t.unavailableNote}
          </p>
        </>
      )}

      {available && asset && (
        <p className="download-card__file">{asset.filename}</p>
      )}
    </article>
  );
}
