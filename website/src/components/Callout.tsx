import type { ReactNode } from "react";
import { AlertIcon, InfoIcon, VerifiedIcon } from "./Icons";
import "./Callout.css";

export type CalloutTone = "info" | "warning" | "success";

const ICONS = {
  info: InfoIcon,
  warning: AlertIcon,
  success: VerifiedIcon,
} as const;

/**
 * A boxed aside in documentation prose.
 *
 * The tone is carried by an icon and a heading as well as by colour, so it
 * still reads as a warning in greyscale or to someone who cannot separate the
 * hues. Rendered as <aside> because it is supporting material next to the main
 * flow, not part of it.
 */
export function Callout({
  tone = "info",
  title,
  children,
}: {
  tone?: CalloutTone;
  title: string;
  children: ReactNode;
}) {
  const Icon = ICONS[tone];

  return (
    <aside className={`callout callout--${tone}`}>
      <span className="callout__icon">
        <Icon size={18} />
      </span>
      <div className="callout__body">
        <p className="callout__title">{title}</p>
        {children}
      </div>
    </aside>
  );
}
