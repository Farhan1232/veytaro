import { content } from "../content";
import { Icon } from "./Icon";
import "./Features.css";

/**
 * The feature grid. Each card states one capability the shipped application
 * actually has — the copy was written against the app's own UI strings.
 */
export function Features() {
  const t = content.features;

  return (
    <section className="section section--alt" id={t.id} aria-labelledby="features-heading">
      <div className="container">
        <div className="section__head">
          <p className="eyebrow">{t.eyebrow}</p>
          <h2 id="features-heading">{t.heading}</h2>
          <p className="lede">{t.description}</p>
        </div>

        <ul className="feature-grid">
          {t.items.map((item) => (
            <li className="card card--interactive feature" key={item.title}>
              <span className="feature__icon" aria-hidden="true">
                <Icon name={item.icon} size={22} />
              </span>
              <h3 className="feature__title">{item.title}</h3>
              <p className="feature__body">{item.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
