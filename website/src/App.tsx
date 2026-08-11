import { useEffect, useState, type ReactNode } from "react";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { SeoHead } from "./components/SeoHead";
import { content } from "./content";
import { Router } from "./lib/router";
import { useRouter } from "./lib/routerContext";
import { detectCurrentOs, type DetectedOs } from "./lib/osDetection";
import { routeByPath, type RouteId } from "./lib/routes";
import { AboutPage } from "./pages/AboutPage";
import { ContactPage } from "./pages/ContactPage";
import { DocsPage } from "./pages/DocsPage";
import { HomePage } from "./pages/HomePage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { TermsPage } from "./pages/TermsPage";

/**
 * All five pages are in the main bundle.
 *
 * Splitting them out with React.lazy was measured and reverted: the four
 * secondary pages are a few kilobytes of markup each, and putting them behind a
 * dynamic import cost a whole extra round trip before their first paint. On a
 * throttled connection that dropped their Lighthouse performance score by
 * roughly fifteen points while saving the home page almost nothing. The bundle
 * is dominated by React itself, which every route needs anyway.
 */

export function App() {
  return (
    <Router>
      <Shell />
    </Router>
  );
}

function Shell() {
  const { path } = useRouter();
  const route = routeByPath(path);

  /**
   * The detected platform decides which download card is emphasised and listed
   * first. It never hides a platform and never starts a download.
   *
   * Read during the first render rather than in an effect. Doing it in an
   * effect meant the cards painted in one order and then swapped, which
   * Lighthouse scored as a 0.3 layout shift on the home page. There is no
   * server render to match here, so reading `navigator` up front is safe;
   * `detectCurrentOs` already returns "unknown" when there is no navigator at
   * all, which is what a non-DOM environment gets.
   */
  const [os] = useState<DetectedOs>(detectCurrentOs);

  /**
   * Resolve a fragment the browser could not.
   *
   * Arriving at /#download from another page is a full document load: the
   * browser looks for #download while the body is still an empty root div,
   * finds nothing, and leaves the page at the top. By the time React has
   * mounted, the browser has given up. Re-running the jump after the first
   * paint is what makes the header's download link work from every page.
   *
   * `scroll-padding-top` in global.css keeps the target clear of the sticky
   * header, so no offset maths is needed here.
   */
  useEffect(() => {
    const { hash } = window.location;
    if (!hash || hash.length < 2) return;

    // One frame later, so the section has been laid out and has a position.
    const frame = requestAnimationFrame(() => {
      document.getElementById(decodeURIComponent(hash.slice(1)))?.scrollIntoView();
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div className="page">
      <SeoHead route={route} />

      <a className="skip-link" href="#main">
        {content.meta.skipToContent}
      </a>

      <Header overPhoto={route?.id === "home" || route?.id === "about"} />

      {/* tabIndex -1 so the skip link can move focus here, not just scroll. */}
      <main id="main" className="page__main" tabIndex={-1}>
        {pageFor(route?.id, os)}
      </main>

      <Footer />
    </div>
  );
}

function pageFor(id: RouteId | undefined, os: DetectedOs): ReactNode {
  switch (id) {
    case "home":
      return <HomePage os={os} />;
    case "about":
      return <AboutPage />;
    case "docs":
      return <DocsPage />;
    case "terms":
      return <TermsPage />;
    case "contact":
      return <ContactPage />;
    default:
      return <NotFoundPage />;
  }
}
