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
 * above and is listed in EXCEPTIONS with the median measured when it was
 * listed; that assertion warns instead of failing, so the gap shows in every
 * run, and the entry is removed once the page meets the budget.
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
};

const ONLY = process.env.LIGHTHOUSE_PAGE;
if (ONLY && !(ONLY in PAGES)) {
  throw new Error(`LIGHTHOUSE_PAGE=${ONLY} is not one of ${Object.keys(PAGES).join(", ")}`);
}
const PATHS = ONLY ? [PAGES[ONLY]] : Object.values(PAGES);

const BUDGETS = {
  "categories:performance": { minScore: PRESET === "desktop" ? 0.95 : 0.9 },
  "categories:accessibility": { minScore: 1 },
  "categories:best-practices": { minScore: 1 },
  "largest-contentful-paint": { maxNumericValue: 2000 },
  "total-blocking-time": { maxNumericValue: 150 },
  "cumulative-layout-shift": { maxNumericValue: 0.05 },
};

/** Named exceptions: [preset, audit, measured median, reason]. */
const EXCEPTIONS = [];

const exceptionFor = (audit) =>
  EXCEPTIONS.find(([preset, id]) => preset === PRESET && id === audit);

const assertions = Object.fromEntries(
  Object.entries(BUDGETS).map(([audit, budget]) => [
    audit,
    [exceptionFor(audit) ? "warn" : "error", { ...budget, aggregationMethod: "median" }],
  ]),
);

module.exports = {
  ci: {
    collect: {
      startServerCommand: `node scripts/serve-dist.mjs --port ${PORT}`,
      startServerReadyPattern: "serving",
      url: PATHS.map((path) => `http://127.0.0.1:${PORT}${path}`),
      numberOfRuns: 3,
      settings: {
        ...(PRESET === "desktop" ? { preset: "desktop" } : {}),
        onlyCategories: ["performance", "accessibility", "best-practices"],
        chromeFlags: "--headless=new --no-sandbox",
      },
    },
    assert: { assertions },
    upload: {
      target: "filesystem",
      outputDir: `.lighthouseci/${PRESET}${ONLY ? `-${ONLY}` : ""}`,
    },
  },
};
