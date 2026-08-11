import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

// Fonts are self-hosted rather than loaded from a CDN: the site targets a
// German audience and must not make third-party requests on page load.
// Only the `latin` subset is imported — it already covers every character the
// German copy uses (ä ö ü ß), and skipping the other subsets keeps the build
// to a handful of font files instead of dozens. Each weight listed here is
// actually used by the stylesheet; an unused one is a wasted download.
import "@fontsource/outfit/latin-400.css";
import "@fontsource/outfit/latin-500.css";
import "@fontsource/outfit/latin-600.css";
import "@fontsource/sora/latin-600.css";
import "@fontsource/sora/latin-700.css";
import "@fontsource/jetbrains-mono/latin-400.css";

// The base layer must be emitted before any component stylesheet. Component
// CSS is pulled in transitively by the App import below, and several component
// rules (for example hiding the header's download button on a phone) have the
// same specificity as their global counterpart — so whichever comes last wins.
// Importing global.css first makes the components the override layer, which is
// the cascade the design system assumes.
import "./styles/global.css";
import { App } from "./App";

const container = document.getElementById("root");
if (!container) {
  throw new Error('Root element "#root" not found');
}

createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
