import { content } from "../content";
import { FEATURE_ICONS } from "./Icons";
import "./Features.css";

export function Features() {
  const t = content.features;

  return (
    <section className="section" id={t.id} aria-labelledby="features-heading">
      <div className="page">
        <div className="section__head reveal">
          <h2 id="features-heading">{t.heading}</h2>
          <p>{t.description}</p>
        </div>

        <ul className="features__grid reveal">
          {t.items.map((item) => {
            const Icon = FEATURE_ICONS[item.icon];
            return (
              <li className="feature" key={item.title}>
                <span className="feature__icon">
                  <Icon size={22} />
                </span>
                <h3 className="feature__title">{item.title}</h3>
                <p className="feature__body">{item.body}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
