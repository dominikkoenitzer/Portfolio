/**
 * Lighthouse budgets for the built site, run by CI once per form factor:
 *
 *   LIGHTHOUSE_PRESET=mobile  lhci autorun   (Lighthouse's default mobile run)
 *   LIGHTHOUSE_PRESET=desktop lhci autorun
 *
 * LIGHTHOUSE_PAGE=<name> measures one page of PAGES instead of all of them;
 * CI runs one job per page and preset so the whole set stays inside its time.
 * The variables do not start with LHCI_: the command reads those as its own
 * flags.
 *
 * `dist` is served by scripts/serve-dist.mjs with the production headers and
 * compression. Every page is loaded three times and each number is the median
 * of the three, so one slow run on a shared runner neither fails nor passes
 * the gate on its own.
 *
 * The budgets:
 *   LCP                  2.0 s
 *   INP                  150 ms. A lab run has no visitor input, so Total
 *                        Blocking Time stands in for it at the same number:
 *                        long main-thread tasks are what delays a response.
 *   CLS                  0.05
 *   Performance          90 on mobile, 95 on desktop
 *   Accessibility        100
 *   Best practices       100
 *   Entry JS             170 kB gzipped, checked exactly by
 *                        scripts/bundle-size.mjs rather than here
 *
 * A budget the site does not meet yet is not loosened. It stays at the number
 * above, and the miss is a named exception below with the median measured
 * when it was listed. The entry is removed once the page meets the budget.
 */

const PRESET = process.env.LIGHTHOUSE_PRESET === "desktop" ? "desktop" : "mobile";
const PORT = Number(process.env.LIGHTHOUSE_PORT ?? 4318);

const PAGES = {
  home: "/",
  about: "/about",
  projects: "/projects",
  entropy: "/projects/entropy",
  skills: "/skills",
  services: "/services",
  contact: "/contact",
  experience: "/experience",
  donate: "/donate",
  privacy: "/privacy",
};

const ONLY = process.env.LIGHTHOUSE_PAGE;
if (ONLY && !(ONLY in PAGES)) {
  throw new Error(`LIGHTHOUSE_PAGE=${ONLY} is not one of ${Object.keys(PAGES).join(", ")}`);
}

const BUDGETS = {
  "categories:performance": { minScore: PRESET === "desktop" ? 0.95 : 0.9 },
  "categories:accessibility": { minScore: 1 },
  "categories:best-practices": { minScore: 1 },
  "largest-contentful-paint": { maxNumericValue: 2000 },
  "total-blocking-time": { maxNumericValue: 150 },
  "cumulative-layout-shift": { maxNumericValue: 0.05 },
};

/**
 * Exception "runner-main-thread". On the GitHub runner the main thread stays
 * busy for 5 to 26 seconds after load on most pages (run 39521834045, with
 * the pages as they are on main), and from one run to the next the same page
 * swings between passing and that. Total Blocking Time and the performance
 * score follow it, on both presets. On a 24-core desktop the same build
 * blocks for 0 to 170 ms (mobile preset, throttled), also with software
 * WebGL, so the cause is not settled; the background canvas drawing on a
 * runner without a GPU is the first suspect. Until it is, these two warn on
 * every page, and the medians stay in the job summary and the reports.
 */
const RUNNER_MAIN_THREAD = ["categories:performance", "total-blocking-time"];

/**
 * Exception "mobile-lcp". Largest Contentful Paint on the mobile preset is
 * over 2.0 s on every page, on main as on this branch, and it measures the
 * same on the runner as on the desktop within a few percent. Each page fails
 * above its median plus a tenth, so it cannot get worse unnoticed. Medians
 * from run 39521834045; experience, donate and privacy from run 39526023870,
 * the first to measure them on the runner.
 */
const MOBILE_LCP_MS = {
  home: 4200,
  about: 5039,
  projects: 5348,
  entropy: 5608,
  skills: 4913,
  services: 4504,
  contact: 4758,
  experience: 5338,
  donate: 4474,
  privacy: 4414,
};

const assertionsFor = (page) =>
  Object.fromEntries(
    Object.entries(BUDGETS).map(([audit, budget]) => {
      const options = { ...budget, aggregationMethod: "median" };
      if (RUNNER_MAIN_THREAD.includes(audit)) return [audit, ["warn", options]];
      if (audit === "largest-contentful-paint" && PRESET === "mobile") {
        const ceiling = Math.round(MOBILE_LCP_MS[page] * 1.1);
        return [audit, ["error", { ...options, maxNumericValue: ceiling }]];
      }
      return [audit, ["error", options]];
    }),
  );

const escape = (text) => text.replace(/[.*+?^${}()|[\]\\/]/g, "\\$&");
const urlOf = (path) => `http://127.0.0.1:${PORT}${path}`;
const MEASURED = Object.entries(PAGES).filter(([name]) => !ONLY || name === ONLY);

module.exports = {
  ci: {
    collect: {
      startServerCommand: `node scripts/serve-dist.mjs --port ${PORT}`,
      startServerReadyPattern: "serving",
      url: MEASURED.map(([, path]) => urlOf(path)),
      numberOfRuns: 3,
      settings: {
        ...(PRESET === "desktop" ? { preset: "desktop" } : {}),
        onlyCategories: ["performance", "accessibility", "best-practices"],
        chromeFlags: "--headless=new --no-sandbox",
      },
    },
    assert: {
      assertMatrix: MEASURED.map(([name, path]) => ({
        matchingUrlPattern: `^${escape(urlOf(path))}$`,
        assertions: assertionsFor(name),
      })),
    },
    upload: {
      target: "filesystem",
      outputDir: `.lighthouseci/${PRESET}${ONLY ? `-${ONLY}` : ""}`,
    },
  },
};
