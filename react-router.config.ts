import type { Config } from "@react-router/dev/config";

// Keep in lockstep with the project slugs in src/constants/projects and the
// routes in src/routes.ts. The CI sitemap-parity guard covers sitemap drift;
// these are the paths React Router renders to static HTML at build time.
const PROJECT_SLUGS = ["zephyr", "flow", "spectrum", "entropy", "remnants"];

export default {
  appDirectory: "src",
  // SPA mode: no runtime server. The listed paths are still rendered to static
  // HTML at build time (so non-JS AI crawlers see full per-route content), and
  // a SPA fallback is emitted for anything not listed.
  ssr: false,
  prerender: [
    "/",
    "/about",
    "/skills",
    "/projects",
    ...PROJECT_SLUGS.map((slug) => `/projects/${slug}`),
    "/services",
    "/contact",
    "/donate",
    "/privacy",
  ],
} satisfies Config;
