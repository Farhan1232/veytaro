import { RELEASE, assetFor, hasAnyDownload } from "../config/releases";
import { content } from "../content";
import { formatBytes } from "../lib/format";
import type { DetectedOs } from "../lib/osDetection";
import { AppleIcon, ArrowRightIcon, CheckIcon, DownloadIcon, WindowsIcon } from "./Icons";
import "./Hero.css";

/**
 * Full-bleed photographic hero.
 *
 * The background is a real photograph of a floodlit pitch at night — chosen
 * because it is CC0, shows no club crest, sponsor board, kit or identifiable
 * person, and its lit green surface is the brand green. A scrim sits between
 * the photo and the copy so the text meets contrast requirements regardless of
 * what the image is doing behind it.
 *
 * The primary download is aimed at the detected platform. Detection only
 * decides which installer the button points at; both stay one click away in the
 * download section, and the button is never a dead link — with no build for the
 * detected platform, or no detection at all, it links to that section instead.
 */
export function Hero({ os }: { os: DetectedOs }) {
  const t = content.hero;
  const d = content.downloads;

  // "unknown" means detection found nothing; "mobile" has nothing to install.
  const target = os === "windows" || os === "macos" ? os : null;
  const asset = target ? assetFor(target) : null;
  const directDownload = asset?.status === "available" ? asset : null;
  const size = directDownload ? formatBytes(directDownload.sizeBytes) : null;
  const PlatformIcon = target === "macos" ? AppleIcon : WindowsIcon;

  return (
    <section className="hero" aria-labelledby="hero-heading">
      {/* Decorative: the heading beside it already says what the page is, so
          an alt description here would only be noise in a screen reader. */}
      <picture className="hero__media">
        <source
          media="(max-width: 640px)"
          srcSet="/img/pitch-night-760.webp"
          type="image/webp"
        />
        <source
          media="(max-width: 1200px)"
          srcSet="/img/pitch-night-1100.webp"
          type="image/webp"
        />
        <img
          src="/img/pitch-night-1600.webp"
          alt=""
          width="1600"
          height="1000"
          /* Above the fold and the largest paint on the page: fetch it early
             rather than letting it queue behind the bundle. */
          fetchPriority="high"
          decoding="async"
        />
      </picture>
      <div className="hero__scrim" aria-hidden="true" />

      <div className="container">
        <div className="hero__inner">
          <p className="eyebrow eyebrow--onPhoto">{t.eyebrow}</p>

          <h1 id="hero-heading" className="hero__heading">
            {t.headingLead} <span className="hero__accent">{t.headingAccent}</span>
          </h1>

          <p className="hero__description">{t.description}</p>

          <div className="hero__actions">
            {directDownload ? (
              <a
                className="btn btn--primary btn--lg"
                href={directDownload.path}
                download={directDownload.filename}
              >
                <DownloadIcon size={18} />
                {`${t.primaryCta} — ${d.platforms[target!].name}`}
              </a>
            ) : (
              <a className="btn btn--primary btn--lg" href={`#${d.id}`}>
                <DownloadIcon size={18} />
                {t.primaryCta}
              </a>
            )}

            <a className="btn btn--onPhoto btn--lg" href={`#${content.howItWorks.id}`}>
              {t.secondaryCta}
              <ArrowRightIcon size={18} />
            </a>
          </div>

          {/* Release facts, read from config/releases.ts. Never a download count
              or a rating — neither of those exists. */}
          {hasAnyDownload() && (
            <p className="hero__meta">
              {target && <PlatformIcon size={16} />}
              <span>
                {d.versionLabel} {RELEASE.version}
                {size ? ` · ${size}` : ""} · {d.signingUnsigned}
              </span>
            </p>
          )}

          <ul className="hero__assurances">
            {t.assurances.map((item) => (
              <li key={item}>
                <CheckIcon size={16} />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
