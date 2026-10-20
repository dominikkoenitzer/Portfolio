import { mkdirSync } from "node:fs";
import { join } from "node:path";
import { expect, test } from "@playwright/test";
import { FIXED_TIME, settle } from "./helpers";
import { SHOT_ROUTES, SIZES, slugOf } from "./routes";

/**
 * The screenshot sheet for a pull request: the snapshot pages at the four
 * sizes in each engine, with the canvases drawn, written to SHEET_DIR. Runs
 * only when SHEET_DIR is set; it asserts nothing beyond the page rendering.
 */
const dir = process.env.SHEET_DIR;
test.skip(!dir, "set SHEET_DIR to write the screenshot sheet");
test.use({ contextOptions: { reducedMotion: "reduce" } });

for (const size of SIZES) {
  test.describe(`${size.width}px`, () => {
    test.use({ viewport: size });
    for (const path of SHOT_ROUTES) {
      test(`sheet ${path}`, async ({ page, browserName }) => {
        const out = join(dir as string, browserName);
        mkdirSync(out, { recursive: true });
        await page.clock.setFixedTime(FIXED_TIME);
        await page.goto(path);
        await expect(page.locator("h1").first()).toBeVisible();
        await settle(page);
        // The sky mounts when the browser is idle; give it a frame or two.
        await page.waitForTimeout(1500);
        await page.screenshot({
          animations: "disabled",
          path: join(out, `${slugOf(path)}-${size.width}.png`),
        });
      });
    }
  });
}
