import { content } from "../content";
import { ChevronIcon } from "./Icons";
import "./Faq.css";

/**
 * Native <details>/<summary>: keyboard-operable and screen-reader friendly
 * without any JavaScript, and it still works if the bundle fails to load.
 */
export function Faq() {
  const t = content.faq;

  return (
    <section className="section" id={t.id} aria-labelledby="faq-heading">
      <div className="page">
        <div className="section__head reveal">
          <h2 id="faq-heading">{t.heading}</h2>
        </div>

        <div className="faq__list reveal">
          {t.items.map((item) => (
            <details className="faq__item" key={item.q}>
              <summary className="faq__q">
                <span>{item.q}</span>
                <ChevronIcon size={18} className="faq__chevron" />
              </summary>
              <p className="faq__a">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
