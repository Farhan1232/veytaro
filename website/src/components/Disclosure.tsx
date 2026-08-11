import type { FaqItem } from "../content/types";
import { ChevronIcon } from "./Icons";
import "./Disclosure.css";

/**
 * A question-and-answer list built on native <details>/<summary>.
 *
 * Native rather than a custom widget: it is keyboard-operable, exposes the
 * right role and expanded state to a screen reader with no ARIA of our own, is
 * findable by the browser's in-page search, and still opens if the JavaScript
 * bundle fails to load.
 *
 * Used by both the home page FAQ and the troubleshooting list in the docs, so
 * the behaviour and styling exist once.
 */
export function Disclosure({ items }: { items: readonly FaqItem[] }) {
  return (
    <div className="disclosure">
      {items.map((item) => (
        <details className="disclosure__item" key={item.q}>
          <summary className="disclosure__q">
            <span>{item.q}</span>
            <ChevronIcon size={18} className="disclosure__chevron" />
          </summary>
          <div className="disclosure__a">
            <p>{item.a}</p>
          </div>
        </details>
      ))}
    </div>
  );
}
