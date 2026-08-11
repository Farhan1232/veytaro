import { Icon } from "../components/Icon";
import { content } from "../content";
import { routeById } from "../lib/routes";
import { PageIntro } from "./PageIntro";
import "./page.css";

export function AboutPage() {
  const t = content.about;
  const route = routeById("about");

  return (
    <>
      <PageIntro
        eyebrow={route.nav}
        title={route.title}
        intro={t.intro}
        image={{
          src: "/img/stadium-aerial-1400.webp",
          srcSmall: "/img/stadium-aerial-900.webp",
          width: 1400,
          height: 787,
        }}
      />

      <div className="container container--narrow prose">
        {t.passages.map((passage) => (
          <section className="prose__block" key={passage.heading}>
            <h2>{passage.heading}</h2>
            {passage.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </section>
        ))}

        <section className="prose__block">
          <h2>{t.audienceHeading}</h2>
          <ul className="about-audience">
            {t.audience.map((item) => (
              <li className="card about-audience__item" key={item.title}>
                <span className="about-audience__icon" aria-hidden="true">
                  <Icon name={item.icon} size={20} />
                </span>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="prose__block">
          <h2>{t.limitsHeading}</h2>
          <ul className="prose__list">
            {t.limits.map((limit) => (
              <li key={limit}>{limit}</li>
            ))}
          </ul>
        </section>
      </div>
    </>
  );
}
