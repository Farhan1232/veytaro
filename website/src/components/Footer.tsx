import { LINKS, SUPPORT_EMAIL, SUPPORT_MAILTO } from "../config/site";
import { content } from "../content";
import { Link } from "../lib/router";
import { ROUTES } from "../lib/routes";
import { BrandMark } from "./BrandMark";
import { MailIcon } from "./Icons";
import "./Footer.css";

/**
 * Site footer.
 *
 * It shows only contact details that exist: one support address. There is no
 * phone number, no postal address, no opening hours and no social profile,
 * because the project has none and inventing them would be a lie in the one
 * place visitors go looking for accountability.
 *
 * Imprint and privacy links render only when `LINKS` holds a real URL, so the
 * footer never ships a dead link.
 */
export function Footer() {
  const t = content.footer;
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="container site-footer__inner">
        <div className="site-footer__brand">
          <Link to="/" className="site-footer__logo" aria-label={t.markAlt}>
            <BrandMark width={28} />
            <span>Veytaro</span>
          </Link>
          <p className="site-footer__tagline">{t.tagline}</p>
          <p className="site-footer__availability">{t.availability}</p>
        </div>

        <nav className="site-footer__col" aria-label={t.navHeading}>
          <h2 className="site-footer__heading">{t.navHeading}</h2>
          <ul>
            {ROUTES.map((route) => (
              <li key={route.id}>
                <Link to={route.path}>{route.nav}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="site-footer__col">
          <h2 className="site-footer__heading">{t.supportHeading}</h2>
          <p className="site-footer__support">{t.supportBody}</p>
          <a className="site-footer__mail" href={SUPPORT_MAILTO}>
            <MailIcon size={16} />
            <span>{SUPPORT_EMAIL}</span>
          </a>
        </div>

        <div className="site-footer__col">
          <h2 className="site-footer__heading">{t.legalHeading}</h2>
          <ul>
            {LINKS.terms && (
              <li>
                <Link to={LINKS.terms}>{t.links.terms}</Link>
              </li>
            )}
            {LINKS.imprint && (
              <li>
                <a href={LINKS.imprint}>{t.links.imprint}</a>
              </li>
            )}
            {LINKS.privacy && (
              <li>
                <a href={LINKS.privacy}>{t.links.privacy}</a>
              </li>
            )}
          </ul>
        </div>
      </div>

      <div className="container site-footer__legal">
        <p>{t.trademark}</p>
        <p>{t.noAffiliation}</p>
        <p className="site-footer__copy">{t.copyright(year)}</p>
      </div>
    </footer>
  );
}
