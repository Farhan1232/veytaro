import type { ReactNode } from "react";
import "./page.css";

export interface PageIntroImage {
  /** Wide source; a narrower one is picked below 760px. */
  src: string;
  srcSmall: string;
  width: number;
  height: number;
}

/**
 * The banner every inner page opens with.
 *
 * It renders the <h1>, so each route has exactly one — the home page's lives in
 * the hero, and these pages get theirs here.
 *
 * With an `image`, the banner becomes photographic and the copy sits on a
 * scrim, matching the home page hero. Without one it stays on the page
 * background — most pages do not need a picture, and adding one to a legal
 * page would be decoration for its own sake.
 */
export function PageIntro({
  eyebrow,
  title,
  intro,
  image,
  children,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  image?: PageIntroImage;
  children?: ReactNode;
}) {
  return (
    <header className={image ? "page-intro page-intro--photo" : "page-intro"}>
      {image && (
        <>
          {/* Decorative: the heading states what the page is. */}
          <picture className="page-intro__media">
            <source
              media="(max-width: 760px)"
              srcSet={image.srcSmall}
              type="image/webp"
            />
            <img
              src={image.src}
              alt=""
              width={image.width}
              height={image.height}
              fetchPriority="high"
              decoding="async"
            />
          </picture>
          <div className="page-intro__scrim" aria-hidden="true" />
        </>
      )}

      <div className="container container--narrow page-intro__inner">
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p className="lede">{intro}</p>
        {children}
      </div>
    </header>
  );
}
