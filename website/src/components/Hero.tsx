import { HERO_SCREENSHOT } from "../config/site";
import { content } from "../content";
import type { DetectedOs } from "../lib/osDetection";
import { DownloadButton } from "./DownloadButton";
import { AppleIcon, WindowsIcon } from "./Icons";
import "./Hero.css";

interface HeroProps {
  os: DetectedOs;
}

export function Hero({ os }: HeroProps) {
  const t = content.hero;
  // Only a positive detection promotes one platform. Mobile and unknown
  // visitors get both options at equal weight.
  const recommended = os === "windows" || os === "macos" ? os : null;
  const secondary = recommended === "windows" ? "macos" : "windows";

  return (
    <section className="hero" id="top">
      <div className="page hero__inner">
        <div className="hero__content">
          <p className="eyebrow">{t.eyebrow}</p>

          <h1 className="hero__heading">
            {t.headingLead}{" "}
            <span className="hero__heading-accent">{t.headingAccent}</span>
          </h1>

          <p className="hero__description">{t.description}</p>

          <div className="hero__actions">
            {recommended ? (
              <>
                <div className="hero__primary">
                  <DownloadButton
                    platform={recommended}
                    variant="primary"
                    labelSuffix={content.downloads.platforms[recommended].name}
                  />
                  <span className="hero__hint">{t.primaryHint}</span>
                </div>
                <a className="hero__alt-link" href="#download">
                  {recommended === "windows" ? (
                    <AppleIcon size={17} />
                  ) : (
                    <WindowsIcon size={17} />
                  )}
                  {content.downloads.platforms[secondary].name}
                </a>
              </>
            ) : (
              <div className="hero__both">
                <DownloadButton
                  platform="windows"
                  variant="primary"
                  labelSuffix={content.downloads.platforms.windows.name}
                />
                <DownloadButton
                  platform="macos"
                  variant="secondary"
                  labelSuffix={content.downloads.platforms.macos.name}
                />
              </div>
            )}
          </div>

          <p className="hero__note">{t.platformNote}</p>
        </div>

        <div className="hero__visual">
          {HERO_SCREENSHOT ? (
            <img
              className="hero__screenshot"
              src={HERO_SCREENSHOT.src}
              alt={t.screenshotAlt}
              width={HERO_SCREENSHOT.width}
              height={HERO_SCREENSHOT.height}
              loading="eager"
            />
          ) : (
            <img
              className="hero__mark"
              src="/veytaro-mark.png"
              alt={t.markAlt}
              width={512}
              height={356}
              loading="eager"
              fetchPriority="high"
            />
          )}
        </div>
      </div>
    </section>
  );
}
