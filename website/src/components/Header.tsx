import { useEffect, useId, useRef, useState } from "react";
import { content } from "../content";
import { Link } from "../lib/router";
import { useRouter } from "../lib/routerContext";
import { ROUTES, routeById } from "../lib/routes";
import { BrandMark } from "./BrandMark";
import { CloseIcon, DownloadIcon, MenuIcon } from "./Icons";
import { ThemeToggle } from "./ThemeToggle";
import "./Header.css";

/**
 * Sticky site header.
 *
 * `overPhoto` is set on the home page, where the hero photograph runs behind
 * the bar and the nav needs fixed light colours until the header gains its own
 * background on scroll.
 *
 * Below 900px the links collapse into a disclosure panel. The theme toggle
 * stays outside that panel at every width — switching theme should never
 * require opening a menu first.
 */
export function Header({ overPhoto = false }: { overPhoto?: boolean }) {
  const t = content.nav;
  const { path } = useRouter();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const panelId = useId();
  const toggleRef = useRef<HTMLButtonElement>(null);

  // The header gains a border and a stronger background once the page moves,
  // so it separates from the hero instead of floating over it.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Any navigation closes the panel — the route changed underneath it.
  useEffect(() => setOpen(false), [path]);

  // Escape closes it and returns focus to the button that opened it, so a
  // keyboard user is not left somewhere unexpected.
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      toggleRef.current?.focus();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const download = `${routeById("home").path}#${content.downloads.id}`;

  const classes = [
    "site-header",
    // Only the home page puts a photograph behind the bar.
    overPhoto ? "site-header--overPhoto" : "",
    scrolled ? "is-scrolled" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <header className={classes}>
      <div className="container site-header__inner">
        <Link to="/" className="site-header__brand" aria-label={t.homeLabel}>
          <BrandMark width={30} className="site-header__mark" />
          <span className="site-header__word">Veytaro</span>
        </Link>

        <nav
          id={panelId}
          className={open ? "site-nav is-open" : "site-nav"}
          aria-label={t.menuLabel}
        >
          <ul className="site-nav__list">
            {ROUTES.map((route) => (
              <li key={route.id}>
                <Link
                  to={route.path}
                  className="site-nav__link"
                  aria-current={route.path === path ? "page" : undefined}
                >
                  {route.nav}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="site-header__actions">
          <ThemeToggle />

          <a className="btn btn--primary site-header__cta" href={download}>
            <DownloadIcon size={18} />
            {t.downloadCta}
          </a>

          <button
            ref={toggleRef}
            type="button"
            className="site-header__burger"
            aria-expanded={open}
            aria-controls={panelId}
            aria-label={open ? t.closeMenu : t.openMenu}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>
    </header>
  );
}
