import react from "@vitejs/plugin-react";
/** vitest/config re-exports Vite's defineConfig with the `test` key typed. */
import { defineConfig } from "vitest/config";

// Static site. No proxy, no backend, no environment-specific configuration —
// `npm run build` must produce a directory that can be served as plain files.
export default defineConfig({
  plugins: [react()],
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
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
});
