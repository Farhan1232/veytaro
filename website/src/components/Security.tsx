import { assetFor } from "../config/releases";
import { content } from "../content";
import { Icon } from "./Icon";
import { AlertIcon } from "./Icons";
import "./Security.css";

/**
 * Explains what the SHA-256 value on the download cards is for, gives the
 * command for each platform, and states plainly that the installers are not
 * signed.
 *
 * The commands are built from the real filenames in `config/releases.ts`, so a
 * visitor can paste them without editing, and they cannot drift from the files
 * that are actually served.
 */
export function Security() {
  const t = content.security;
  const windows = assetFor("windows");
  const macos = assetFor("macos");

  const windowsCmd = `Get-FileHash .\\${windows.filename} -Algorithm SHA256`;
  const macosCmd = `shasum -a 256 ${macos.filename}`;

  return (
    <section className="section" id={t.id} aria-labelledby="security-heading">
      <div className="container">
        <div className="section__head">
          <p className="eyebrow">{t.eyebrow}</p>
          <h2 id="security-heading">{t.heading}</h2>
          <p className="lede">{t.description}</p>
        </div>

        <ul className="security__points">
          {t.points.map((point) => (
            <li className="security__point" key={point.title}>
              <span className="security__icon" aria-hidden="true">
                <Icon name={point.icon} size={20} />
              </span>
              <div>
                <h3 className="security__point-title">{point.title}</h3>
                <p className="security__point-body">{point.body}</p>
              </div>
            </li>
          ))}
        </ul>

        <div className="card security__verify">
          <h3>{t.verifyHeading}</h3>
          <p className="security__verify-intro">{t.verifyIntro}</p>

          <div className="security__commands">
            <div>
              <p className="security__cmd-label">{t.windowsLabel}</p>
              <code className="code">{windowsCmd}</code>
            </div>
            <div>
              <p className="security__cmd-label">{t.macosLabel}</p>
              <code className="code">{macosCmd}</code>
            </div>
          </div>

          <p className="security__verify-outro">{t.verifyOutro}</p>
        </div>

        <div className="security__unsigned" role="note">
          <AlertIcon size={20} />
          <div>
            <h3 className="security__unsigned-title">{t.unsignedHeading}</h3>
            <p className="security__unsigned-body">{t.unsignedBody}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
