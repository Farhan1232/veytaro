import { content } from "../content";
import { Link } from "../lib/router";
import { routeById } from "../lib/routes";
import { ArrowRightIcon, DownloadIcon } from "./Icons";
import "./CtaBand.css";

/**
 * Closing call to action, over a real turf photograph.
 *
 * The primary button is an in-page anchor to the download section rather than a
 * second download trigger — one place on the page owns the actual files, so
 * there is only ever one set of links to keep correct.
 */
export function CtaBand() {
  const t = content.cta;

  return (
    <section className="cta-band" aria-labelledby="cta-heading">
      <div className="container">
        <div className="cta-band__inner">
          {/* Decorative texture; the heading carries the meaning. */}
          <picture className="cta-band__media">
            <source
              media="(max-width: 760px)"
              srcSet="/img/turf-700.webp"
              type="image/webp"
            />
            <img
              src="/img/turf-1200.webp"
              alt=""
              width="1200"
              height="260"
              loading="lazy"
              decoding="async"
            />
          </picture>

          <div className="cta-band__copy">
            <h2 id="cta-heading">{t.heading}</h2>
            <p>{t.body}</p>
          </div>

          <div className="cta-band__actions">
            <a className="btn btn--primary btn--lg" href={`#${content.downloads.id}`}>
              <DownloadIcon size={18} />
              {t.primary}
            </a>
            <Link to={routeById("docs").path} className="btn btn--onPhoto btn--lg">
              {t.secondary}
              <ArrowRightIcon size={18} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
