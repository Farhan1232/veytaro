import react from "@vitejs/plugin-react";
/** vitest/config re-exports Vite's defineConfig with the `test` key typed. */
import { defineConfig, type Plugin } from "vitest/config";

/**
 * The faces that draw text above the fold: body copy, the section and card
 * headings, and the hero headline. Matched against the emitted filenames, which
 * carry a content hash — so nothing here has to be updated when a font package
 * is upgraded and the hash changes.
 */
const CRITICAL_FONTS = [
  "outfit-latin-400-normal",
  "outfit-latin-600-normal",
  "sora-latin-600-normal",
  "sora-latin-700-normal",
];

/**
 * Emits <link rel="preload"> for those faces.
 *
 * Without it the browser only discovers the fonts after parsing the stylesheet,
 * paints the page in the fallback, and reflows when the real font arrives —
 * a layout shift big enough to cost the home page a Lighthouse performance
 * grade. Preloading starts the fetch alongside the CSS instead.
 *
 * The hrefs are read from the build output rather than written by hand: a
 * preload pointing at a stale hash would silently download a file the page
 * never uses.
 */
function preloadCriticalFonts(): Plugin {
  return {
    name: "veytaro-preload-critical-fonts",
    apply: "build",
    transformIndexHtml: {
      order: "post",
      handler(html, ctx) {
        const files = Object.keys(ctx.bundle ?? {}).filter(
          (file) =>
            file.endsWith(".woff2") && CRITICAL_FONTS.some((f) => file.includes(f)),
        );

        return {
          html,
          tags: files.map((file) => ({
            tag: "link",
            injectTo: "head" as const,
            attrs: {
              rel: "preload",
              as: "font",
              type: "font/woff2",
              href: `/${file}`,
              // Fonts are always fetched anonymously, even same-origin; without
              // this the preload is discarded and fetched a second time.
              crossorigin: "",
            },
          })),
        };
      },
    },
  };
}

// Static site. No proxy, no backend, no environment-specific configuration —
// `npm run build` must produce a directory that can be served as plain files.
export default defineConfig({
  plugins: [react(), preloadCriticalFonts()],
  server: {
    port: 5180,
    strictPort: false,
  },
  build: {
    outDir: "dist",
    // Installers in public/downloads/ are copied verbatim; nothing is inlined.
    assetsInlineLimit: 4096,
    sourcemap: false,
  },
  test: {
    // jsdom rather than node: the suite renders components to assert on the
    // real DOM — the theme attribute, the download hrefs, the printed hashes.
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
    include: ["src/**/*.test.ts", "src/**/*.test.tsx"],
    // CSS is not processed for tests: nothing here asserts on styling, and
    // skipping it keeps the run fast.
    css: false,
  },
});
