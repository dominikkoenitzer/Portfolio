import path from "node:path";
import { defineConfig } from "vitest/config";

/**
 * Kept separate from vite.config.ts: that config wires a dev-only middleware
 * that imports the Vercel API handler, which has no business running under the
 * test runner.
 */
export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    environment: "node",
    include: ["src/**/*.test.ts", "src/**/*.test.tsx"],
  },
});
