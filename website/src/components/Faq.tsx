import { content } from "../content";
import { Disclosure } from "./Disclosure";

export function Faq() {
  const t = content.faq;

  return (
    <section className="section section--alt" id={t.id} aria-labelledby="faq-heading">
      <div className="container">
        <div className="section__head">
          <p className="eyebrow">{t.eyebrow}</p>
          <h2 id="faq-heading">{t.heading}</h2>
          <p className="lede">{t.description}</p>
        </div>

        <Disclosure items={t.items} />
      </div>
    </section>
  );
}
