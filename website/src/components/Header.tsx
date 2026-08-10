import { content } from "../content";
import "./Header.css";

export function Header() {
  const t = content.header;

  return (
    <header className="site-header">
      <div className="page site-header__inner">
        <a className="site-header__brand" href="#top" aria-label={t.homeLabel}>
          <img
            className="site-header__mark"
            src="/veytaro-mark.png"
            alt=""
            width={30}
            height={21}
            aria-hidden="true"
          />
          <span className="site-header__wordmark">Veytaro</span>
        </a>

        <nav aria-label={t.downloadNav}>
          <a className="site-header__cta" href="#download">
            {t.downloadNav}
          </a>
        </nav>
      </div>
    </header>
  );
}
