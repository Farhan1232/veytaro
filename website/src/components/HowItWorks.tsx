import { content } from "../content";
import { Link } from "../lib/router";
import { routeById } from "../lib/routes";
import "./HowItWorks.css";

/**
 * The four steps from download to first result.
 *
 * An ordered list, because the order is the content — a screen reader should
 * announce "1 of 4", and the numbers must survive with CSS disabled.
 */
export function HowItWorks() {
  const t = content.howItWorks;

  return (
    <section className="section" id={t.id} aria-labelledby="how-heading">
      <div className="container">
        <div className="section__head">
          <p className="eyebrow">{t.eyebrow}</p>
          <h2 id="how-heading">{t.heading}</h2>
          <p className="lede">{t.description}</p>
        </div>

        <ol className="steps">
          {t.steps.map((step, index) => (
            <li className="steps__item" key={step.title}>
              <span className="steps__num" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="steps__title">{step.title}</h3>
              <p className="steps__body">{step.body}</p>
            </li>
          ))}
        </ol>

        <p className="steps__footnote">
          {t.footnote}{" "}
          <Link to={routeById("docs").path}>{routeById("docs").nav}</Link>
        </p>
      </div>
    </section>
  );
}
