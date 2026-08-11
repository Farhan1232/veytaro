import { MailIcon } from "../components/Icons";
import { SUPPORT_EMAIL, SUPPORT_MAILTO } from "../config/site";
import { content } from "../content";
import { routeById } from "../lib/routes";
import { PageIntro } from "./PageIntro";
import "./page.css";

/**
 * Contact page.
 *
 * One email address and nothing else. There is no form: the site is static and
 * has no backend to receive a submission, so a form would either do nothing or
 * hand the message to a third-party service — the page says so rather than
 * pretending otherwise.
 */
export function ContactPage() {
  const t = content.contact;
  const route = routeById("contact");

  return (
    <>
      <PageIntro eyebrow={route.nav} title={route.title} intro={t.intro} />

      <div className="container container--narrow prose">
        <section className="prose__block">
          <h2>{t.emailHeading}</h2>
          <p>{t.emailBody}</p>

          <div className="card contact-card">
            <span className="contact-card__address">
              <MailIcon size={18} />
              {SUPPORT_EMAIL}
            </span>
            <a className="btn btn--primary" href={SUPPORT_MAILTO}>
              <MailIcon size={18} />
              {t.emailCta}
            </a>
          </div>
        </section>

        <section className="prose__block">
          <h2>{t.checklistHeading}</h2>
          <p>{t.checklistIntro}</p>
          <ul className="prose__list">
            {t.checklist.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="prose__block">
          <h2>{t.responseHeading}</h2>
          <p>{t.responseBody}</p>
        </section>
      </div>
    </>
  );
}
