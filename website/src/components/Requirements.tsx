import { assetFor, type Platform } from "../config/releases";
import { content } from "../content";
import type { RequirementGroup } from "../content/types";
import { formatBytes } from "../lib/format";
import "./Requirements.css";

function Group({
  platform,
  data,
}: {
  platform: Platform;
  data: RequirementGroup;
}) {
  const t = content.requirements;
  const size = formatBytes(assetFor(platform).sizeBytes);
  const headingId = `req-${platform}`;

  return (
    <article className="req-card" aria-labelledby={headingId}>
      <h3 className="req-card__title" id={headingId}>
        {data.title}
      </h3>

      <dl className="req-card__list">
        {data.rows.map(([label, value]) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
        <div>
          <dt>{t.diskLabel}</dt>
          {/* Stated only once a real artifact has been measured. */}
          <dd>{size ? t.diskValue(size) : t.diskUnknown}</dd>
        </div>
      </dl>
    </article>
  );
}

export function Requirements() {
  const t = content.requirements;

  return (
    <section className="section" id={t.id} aria-labelledby="req-heading">
      <div className="page">
        <div className="section__head reveal">
          <h2 id="req-heading">{t.heading}</h2>
          <p>{t.description}</p>
        </div>

        <div className="req-grid reveal">
          <Group platform="windows" data={t.windows} />
          <Group platform="macos" data={t.macos} />
        </div>
      </div>
    </section>
  );
}
