import { Callout } from "../components/Callout";
import { ChecksumField } from "../components/ChecksumField";
import { CodeBlock } from "../components/CodeBlock";
import { Disclosure } from "../components/Disclosure";
import { DocsSidebar } from "../components/DocsSidebar";
import { Icon } from "../components/Icon";
import { AppleIcon, ArrowRightIcon, WindowsIcon } from "../components/Icons";
import { RELEASE, assetFor, type Platform } from "../config/releases";
import { SUPPORT_MAILTO } from "../config/site";
import { content } from "../content";
import { formatBytes } from "../lib/format";
import { Link } from "../lib/router";
import { routeById } from "../lib/routes";
import "./docs.css";

const PLATFORMS: Platform[] = ["windows", "macos"];

/**
 * The documentation page: a sticky contents rail beside a single reading
 * column, the layout technical documentation is normally read in.
 *
 * Scope is deliberately limited to operating the application — install it,
 * verify what you downloaded, open a save, fix the common failures, remove it.
 * Nothing here describes how the save format is decoded; that is internal work
 * and not the reader's business.
 *
 * Release facts come from `config/releases.ts`, so the commands quote the real
 * filenames and the expected digests can never drift from the files served.
 */
export function DocsPage() {
  const t = content.docs;
  const route = routeById("docs");

  const command = (platform: Platform) =>
    platform === "windows"
      ? `Get-FileHash .\\${assetFor("windows").filename} -Algorithm SHA256`
      : `shasum -a 256 ${assetFor("macos").filename}`;

  return (
    <>
      <header className="docs-hero">
        <div className="container">
          <p className="eyebrow">{route.nav}</p>
          <h1>{route.title}</h1>
          <p className="lede">{t.intro}</p>
          <p className="docs-hero__version">
            {content.downloads.versionLabel} {RELEASE.version}
          </p>
        </div>
      </header>

      <div className="container docs-layout">
        <DocsSidebar sections={t.sections} heading={t.tocHeading} />

        <article className="docs-body">
          {/* ---- Overview ---- */}
          <section className="docs-section" id="ueberblick">
            <h2>{t.overviewHeading}</h2>
            {t.overviewBody.map((p) => (
              <p key={p}>{p}</p>
            ))}

            <ul className="docs-cards">
              {t.overviewPoints.map((point) => (
                <li className="docs-card" key={point.title}>
                  <span className="docs-card__icon" aria-hidden="true">
                    <Icon name={point.icon} size={20} />
                  </span>
                  <h3>{point.title}</h3>
                  <p>{point.body}</p>
                </li>
              ))}
            </ul>
          </section>

          {/* ---- Requirements ---- */}
          <section className="docs-section" id="systemvoraussetzungen">
            <h2>{t.requirementsHeading}</h2>
            <p>{content.requirements.description}</p>

            <div className="docs-split">
              {PLATFORMS.map((platform) => {
                const group =
                  platform === "windows"
                    ? content.requirements.windows
                    : content.requirements.macos;
                const size = formatBytes(assetFor(platform).sizeBytes);
                const PlatformIcon = platform === "macos" ? AppleIcon : WindowsIcon;

                return (
                  <div className="docs-panel" key={platform}>
                    <h3 className="docs-panel__title">
                      <PlatformIcon size={18} />
                      {group.title}
                    </h3>
                    <dl className="docs-dl">
                      {group.rows.map(([label, value]) => (
                        <div key={label}>
                          <dt>{label}</dt>
                          <dd>{value}</dd>
                        </div>
                      ))}
                      <div>
                        <dt>{content.requirements.diskLabel}</dt>
                        <dd>
                          {size
                            ? content.requirements.diskValue(size)
                            : content.requirements.diskUnknown}
                        </dd>
                      </div>
                    </dl>
                  </div>
                );
              })}
            </div>
          </section>

          {/* ---- Installation ---- */}
          <section className="docs-section" id="installation">
            <h2>{t.installHeading}</h2>
            <p>{t.installIntro}</p>

            <div className="docs-split">
              {PLATFORMS.map((platform) => {
                const steps =
                  platform === "windows"
                    ? content.installation.windows
                    : content.installation.macos;
                const PlatformIcon = platform === "macos" ? AppleIcon : WindowsIcon;

                return (
                  <div className="docs-panel" key={platform}>
                    <h3 className="docs-panel__title">
                      <PlatformIcon size={18} />
                      {steps.title}
                    </h3>
                    <ol className="docs-steps">
                      {steps.steps.map((step) => (
                        <li key={step}>{step}</li>
                      ))}
                    </ol>
                  </div>
                );
              })}
            </div>

            <Callout tone="warning" title={t.unsignedNote.title}>
              <p>{t.unsignedNote.body}</p>
            </Callout>
          </section>

          {/* ---- Checksums ---- */}
          <section className="docs-section" id="pruefsumme">
            <h2>{t.checksumHeading}</h2>
            <p>{t.checksumIntro}</p>

            {PLATFORMS.map((platform) => {
              const asset = assetFor(platform);
              const name = content.downloads.platforms[platform].name;
              const label =
                platform === "windows"
                  ? content.security.windowsLabel
                  : content.security.macosLabel;

              return (
                <div className="docs-verify" key={platform}>
                  <CodeBlock
                    code={command(platform)}
                    label={label}
                    copyLabel={t.copyCommandLabel(name)}
                  />
                  <p className="docs-verify__expected">{t.checksumExpected}</p>
                  {asset.status === "available" && asset.sha256 ? (
                    <ChecksumField value={asset.sha256} platformName={name} />
                  ) : (
                    <p className="muted text-sm">{content.downloads.checksumUnknown}</p>
                  )}
                </div>
              );
            })}

            <Callout tone="warning" title={t.checksumMismatch.title}>
              <p>{t.checksumMismatch.body}</p>
            </Callout>
          </section>

          {/* ---- First run ---- */}
          <section className="docs-section" id="erste-schritte">
            <h2>{t.usageHeading}</h2>
            <p>{t.usageIntro}</p>

            <ol className="docs-numbered">
              {t.usageSteps.map((step, i) => (
                <li key={step.title}>
                  <span className="docs-numbered__num" aria-hidden="true">
                    {i + 1}
                  </span>
                  <div>
                    <h3>{step.title}</h3>
                    <p>{step.body}</p>
                  </div>
                </li>
              ))}
            </ol>

            <Callout tone="success" title={t.usageNote.title}>
              <p>{t.usageNote.body}</p>
            </Callout>
          </section>

          {/* ---- Troubleshooting ---- */}
          <section className="docs-section" id="fehlerbehebung">
            <h2>{t.troubleHeading}</h2>
            <p>{t.troubleIntro}</p>
            <Disclosure items={t.trouble} />
          </section>

          {/* ---- Uninstall ---- */}
          <section className="docs-section" id="deinstallation">
            <h2>{t.uninstallHeading}</h2>
            <ul className="docs-list">
              <li>{t.uninstallWindows}</li>
              <li>{t.uninstallMacos}</li>
            </ul>
          </section>

          {/* ---- Help ---- */}
          <section className="docs-section" id="hilfe">
            <h2>{t.helpHeading}</h2>
            <p>{t.helpBody}</p>
            <div className="docs-help__actions">
              <a className="btn btn--primary" href={SUPPORT_MAILTO}>
                {content.contact.emailCta}
              </a>
              <Link to={routeById("contact").path} className="btn btn--secondary">
                {t.helpCta}
                <ArrowRightIcon size={18} />
              </Link>
            </div>
          </section>
        </article>
      </div>
    </>
  );
}
