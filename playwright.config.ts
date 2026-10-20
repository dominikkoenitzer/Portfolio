import { existsSync } from "node:fs";
import { defineConfig, devices } from "@playwright/test";

/**
 * Browser gate over the built site: every route in Chromium, Firefox and
 * WebKit, served from `dist` by scripts/serve-dist.mjs with the production
 * headers. Run `bun run build` first, then `bun run test:e2e`.
 *
 * Visual baselines are rendered on the Linux runner only (see
 * e2e/visual.spec.ts); on any other system that spec is skipped.
 */

const PORT = Number(process.env.E2E_PORT ?? 4317);
const BASE_URL = `http://127.0.0.1:${PORT}`;

// On the owner's Windows PC a plain headless Chromium walks into a Windows
// credential prompt, so it starts from the installed build with these flags.
// CI and every other machine use Playwright's own Chromium unchanged.
const LOCAL_CHROME =
  "C:/Users/domin/AppData/Local/ms-playwright/chromium-1243/chrome-win64/chrome.exe";
const chromiumLaunch =
  process.platform === "win32" && existsSync(LOCAL_CHROME)
    ? {
        executablePath: LOCAL_CHROME,
        args: [
          "--password-store=basic",
          "--use-mock-keychain",
          "--auth-server-allowlist=_none_",
          "--auth-negotiate-delegate-allowlist=_none_",
          "--disable-features=PasswordManagerOnboarding,BiometricAuthenticationForFilling,BiometricAuthenticationInSettings",
          "--use-angle=swiftshader",
          "--enable-unsafe-swiftshader",
          "--no-sandbox",
          "--block-new-web-contents",
        ],
      }
    : {
        // Software WebGL on GPU-less runners, and text drawn the same way on
        // every run so the snapshots compare glyph for glyph.
        args: [
          "--use-angle=swiftshader",
          "--enable-unsafe-swiftshader",
          "--font-render-hinting=none",
          "--disable-lcd-text",
        ],
      };

export default defineConfig({
  testDir: "e2e",
  timeout: 60_000,
  expect: {
    timeout: 10_000,
    toHaveScreenshot: { maxDiffPixelRatio: 0.01, animations: "disabled" },
  },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : 3,
  reporter: process.env.CI
    ? [["list"], ["html", { open: "never" }], ["github"]]
    : [["list"]],
  snapshotPathTemplate:
    "{testDir}/__screenshots__/{projectName}/{arg}{-snapshotSuffix}{ext}",
  use: {
    baseURL: BASE_URL,
    trace: process.env.CI ? "retain-on-failure" : "off",
    screenshot: "off",
    colorScheme: "light",
    locale: "en-GB",
    timezoneId: "Europe/Zurich",
  },
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1440, height: 900 },
        launchOptions: chromiumLaunch,
      },
    },
    {
      name: "firefox",
      use: {
        ...devices["Desktop Firefox"],
        viewport: { width: 1440, height: 900 },
      },
    },
    {
      name: "webkit",
      use: {
        ...devices["Desktop Safari"],
        viewport: { width: 1440, height: 900 },
      },
    },
  ],
  webServer: {
    command: `node scripts/serve-dist.mjs --port ${PORT}`,
    url: `${BASE_URL}/`,
    reuseExistingServer: false,
    timeout: 30_000,
  },
});
