import { content } from "../content";
import { routeById } from "../lib/routes";
import { PageIntro } from "./PageIntro";
import "./page.css";

/**
 * Terms of use.
 *
 * They cover only what can be stated truthfully about this project: what the
 * application is, what use is permitted, that the installers are unsigned, how
 * data is handled, and the trademark position. No company name, address,
 * jurisdiction or registration number appears anywhere, because none has been
 * provided — an invented legal identity would be worse than none.
 */
export function TermsPage() {
  const t = content.terms;
  const route = routeById("terms");

  return (
    <>
      <PageIntro eyebrow={route.nav} title={route.title} intro={t.intro}>
        <p className="subtle text-sm">{t.updated}</p>
      </PageIntro>

      <div className="container container--narrow prose">
        {t.passages.map((passage) => (
          <section className="prose__block" key={passage.heading}>
            <h2>{passage.heading}</h2>
            {passage.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
            {passage.bullets && (
              <ul className="prose__list">
                {passage.bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </div>
    </>
  );
}
