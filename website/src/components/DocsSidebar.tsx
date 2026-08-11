import { useEffect, useState } from "react";
import "./DocsSidebar.css";

export interface DocsSection {
  id: string;
  label: string;
}

/**
 * Sticky "on this page" navigation with active-section highlighting.
 *
 * The highlight comes from an IntersectionObserver rather than a scroll
 * handler: the browser does the hit-testing off the main thread, so it costs
 * nothing while scrolling. The root margin pulls the detection line down under
 * the sticky header and up from the bottom, so the active entry is the heading
 * nearest the top of the readable area rather than whichever section happens to
 * be tallest.
 *
 * It is a real <nav> of real anchors — with JavaScript off, every link still
 * jumps to its section; only the highlight is lost.
 */
export function DocsSidebar({
  sections,
  heading,
}: {
  sections: readonly DocsSection[];
  heading: string;
}) {
  const [active, setActive] = useState<string>(sections[0]?.id ?? "");

  useEffect(() => {
    const targets = sections
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => el !== null);

    if (targets.length === 0) return;

    // Not universal, and not essential: without it the links still work, only
    // the active highlight is lost. Bailing out beats throwing during render.
    if (typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Several sections can be on screen at once; take the highest one that
        // is currently intersecting.
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible[0]) setActive(visible[0].target.id);
      },
      {
        rootMargin: "-88px 0px -65% 0px",
        threshold: 0,
      },
    );

    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [sections]);

  return (
    <nav className="docs-sidebar" aria-label={heading}>
      <p className="docs-sidebar__heading">{heading}</p>
      <ul className="docs-sidebar__list">
        {sections.map((section) => (
          <li key={section.id}>
            <a
              href={`#${section.id}`}
              className="docs-sidebar__link"
              aria-current={active === section.id ? "true" : undefined}
            >
              {section.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
