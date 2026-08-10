import { LINKS } from "../config/site";
import { content } from "../content";
import "./Footer.css";

export function Footer() {
  const t = content.footer;
  const year = new Date().getFullYear();

  // Only configured URLs become links. An unset entry renders nothing at all
  // rather than a placeholder that would 404.
  const legalLinks = (
    [
      ["imprint", t.links.imprint],
      ["privacy", t.links.privacy],
      ["support", t.links.support],
    ] as const
  ).filter(([key]) => LINKS[key] !== null);

  return (
    <footer className="site-footer">
      <div className="page site-footer__inner">
        <div className="site-footer__brand">
          <img
            className="site-footer__mark"
            src="/veytaro-mark.png"
            alt={t.markAlt}
            width={26}
            height={18}
          />
          <div>
            <p className="site-footer__name">Veytaro</p>
            <p className="site-footer__tagline">{t.tagline}</p>
          </div>
        </div>

        <div className="site-footer__meta">
          <p className="site-footer__availability">{t.availability}</p>
          {legalLinks.length > 0 ? (
            <nav className="site-footer__links" aria-label="Rechtliches">
              {legalLinks.map(([key, label]) => (
                <a key={key} href={LINKS[key] as string}>
                  {label}
                </a>
              ))}
            </nav>
          ) : null}
          <p className="site-footer__copy">{t.copyright(year)}</p>
        </div>
      </div>
    </footer>
  );
}
