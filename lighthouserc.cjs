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

const BUDGETS = {
  "categories:performance": { minScore: PRESET === "desktop" ? 0.95 : 0.9 },
  "categories:accessibility": { minScore: 1 },
  "categories:best-practices": { minScore: 1 },
  "largest-contentful-paint": { maxNumericValue: 2000 },
  "total-blocking-time": { maxNumericValue: 150 },
  "cumulative-layout-shift": { maxNumericValue: 0.05 },
};

/**
 * Named exceptions: [preset, page, audit, median measured on the CI runner].
 *
 * runner-main-thread: measured in run 39521834045 on the branch that added
 * this gate, with the site as it is on main. On the GitHub runner the main
 * thread is busy for 5 to 26 seconds after load on most pages, which takes
 * Total Blocking Time and the performance score with it, and on mobile the
 * largest paint lands at 4.2 to 5.6 s. On a 24-core desktop the same build
 * measures 0 to 170 ms of blocking time (mobile preset, throttled), also
 * with software WebGL, so the cause is not settled yet; the background
 * canvas drawing on a runner without a GPU is the first suspect. Open until
 * the reports in the run's artifacts are read and the page is fixed.
 */
const EXCEPTIONS = [
  ["mobile", "home", "categories:performance", 0.48],
  ["mobile", "home", "largest-contentful-paint", 4200],
  ["mobile", "home", "total-blocking-time", 10605],
  ["mobile", "about", "categories:performance", 0.43],
  ["mobile", "about", "largest-contentful-paint", 5039],
  ["mobile", "about", "total-blocking-time", 24618],
  ["mobile", "projects", "categories:performance", 0.4],
  ["mobile", "projects", "largest-contentful-paint", 5348],
  ["mobile", "projects", "total-blocking-time", 26467],
  ["mobile", "entropy", "categories:performance", 0.42],
  ["mobile", "entropy", "largest-contentful-paint", 5608],
  ["mobile", "entropy", "total-blocking-time", 4893],
  ["mobile", "skills", "categories:performance", 0.44],
  ["mobile", "skills", "largest-contentful-paint", 4913],
  ["mobile", "skills", "total-blocking-time", 10212],
  ["mobile", "services", "categories:performance", 0.46],
  ["mobile", "services", "largest-contentful-paint", 4504],
  ["mobile", "services", "total-blocking-time", 5214],
  ["mobile", "contact", "categories:performance", 0.45],
  ["mobile", "contact", "largest-contentful-paint", 4758],
  ["mobile", "contact", "total-blocking-time", 17523],
  ["desktop", "about", "categories:performance", 0.6],
  ["desktop", "about", "total-blocking-time", 6370],
  ["desktop", "skills", "categories:performance", 0.55],
  ["desktop", "skills", "total-blocking-time", 21566],
  ["desktop", "services", "categories:performance", 0.56],
  ["desktop", "services", "total-blocking-time", 25510],
  ["desktop", "contact", "categories:performance", 0.59],
  ["desktop", "contact", "total-blocking-time", 18873],
];

const isException = (page, audit) =>
  EXCEPTIONS.some(([preset, name, id]) => preset === PRESET && name === page && id === audit);

const assertionsFor = (page) =>
  Object.fromEntries(
    Object.entries(BUDGETS).map(([audit, budget]) => [
      audit,
      [isException(page, audit) ? "warn" : "error", { ...budget, aggregationMethod: "median" }],
    ]),
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
