import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

// Fonts are self-hosted rather than loaded from a CDN: the site targets a
// German audience and must not make third-party requests on page load.
// Only the `latin` subset is imported — it already covers every character the
// German copy uses (ä ö ü ß), and skipping the other subsets keeps the build
// to a handful of font files instead of dozens.
import "@fontsource/outfit/latin-300.css";
import "@fontsource/outfit/latin-400.css";
import "@fontsource/outfit/latin-500.css";
import "@fontsource/outfit/latin-600.css";
import "@fontsource/sora/latin-600.css";
import "@fontsource/sora/latin-700.css";
import "@fontsource/jetbrains-mono/latin-400.css";

import { App } from "./App";
import "./styles/global.css";

const container = document.getElementById("root");
if (!container) {
  throw new Error('Root element "#root" not found');
}

createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
