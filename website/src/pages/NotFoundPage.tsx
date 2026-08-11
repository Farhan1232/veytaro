import { ArrowRightIcon } from "../components/Icons";
import { content } from "../content";
import { Link } from "../lib/router";
import "./page.css";

export function NotFoundPage() {
  const t = content.notFound;

  return (
    <div className="container container--narrow not-found">
      <p className="eyebrow">404</p>
      <h1>{t.heading}</h1>
      <p className="lede">{t.body}</p>
      <Link to="/" className="btn btn--primary btn--lg">
        {t.cta}
        <ArrowRightIcon size={18} />
      </Link>
    </div>
  );
}
