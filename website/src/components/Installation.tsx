import { assetFor, type Platform } from "../config/releases";
import { content } from "../content";
import type { PlatformSteps } from "../content/types";
import { AppleIcon, WindowsIcon } from "./Icons";
import "./Installation.css";

function Steps({ platform, data }: { platform: Platform; data: PlatformSteps }) {
  const Icon = platform === "windows" ? WindowsIcon : AppleIcon;
  // The security warning is a consequence of the signing status, so it is
  // driven by the release config rather than hard-coded into the copy.
  const showSecurityNote = assetFor(platform).signing === "unsigned";
  const headingId = `install-${platform}`;

  return (
    <article className="install-card" aria-labelledby={headingId}>
      <h3 className="install-card__title" id={headingId}>
        <span className="install-card__icon">
          <Icon size={20} />
        </span>
        {data.title}
      </h3>

      <ol className="install-card__steps">
        {data.steps.map((step) => (
          <li key={step}>{step}</li>
        ))}
      </ol>

      {showSecurityNote ? (
        <p className="install-card__security">{data.securityNote}</p>
      ) : null}
    </article>
  );
}

export function Installation() {
  const t = content.installation;

  return (
    <section className="section" id={t.id} aria-labelledby="install-heading">
      <div className="container">
        <div className="section__head">
          <h2 id="install-heading">{t.heading}</h2>
          <p>{t.description}</p>
        </div>

        <div className="install-grid">
          <Steps platform="windows" data={t.windows} />
          <Steps platform="macos" data={t.macos} />
        </div>
      </div>
    </section>
  );
}
