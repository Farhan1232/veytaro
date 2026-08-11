import { content } from "../content";
import { useTheme } from "../hooks/useTheme";
import { MoonIcon, SunIcon } from "./Icons";
import "./ThemeToggle.css";

/**
 * The sun/moon switch.
 *
 * A real <button> whose accessible name states what the click will do ("Zu
 * hellem Design wechseln"), because an icon on its own tells a screen-reader
 * user nothing. `aria-pressed` is deliberately absent: this is not an on/off
 * control, it swaps between two equal options.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggle } = useTheme();
  const copy = content.theme;
  const label = theme === "dark" ? copy.toLight : copy.toDark;

  return (
    <button
      type="button"
      className={className ? `theme-toggle ${className}` : "theme-toggle"}
      onClick={toggle}
      title={label}
      aria-label={label}
    >
      {/* Both icons are rendered and cross-faded, so the button never changes
          size and the swap costs no layout. */}
      <span className="theme-toggle__icons" aria-hidden="true">
        <SunIcon className="theme-toggle__icon theme-toggle__icon--sun" />
        <MoonIcon className="theme-toggle__icon theme-toggle__icon--moon" />
      </span>
    </button>
  );
}
