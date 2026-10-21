import { expect, test } from "@playwright/test";
import { FIXED_TIME, settle } from "./helpers";
import { SHOT_ROUTES, SIZES, slugOf } from "./routes";

/**
 * Visual snapshots at the four sizes, compared against baselines rendered on
 * the Linux runner. Fonts and anti-aliasing differ per system, so a baseline
 * from any other machine would only ever fail; this spec skips itself there.
 * New baselines come from the "update snapshots" run of the CI workflow.
 *
 * Motion is reduced and CSS animations are stopped, the clock is fixed for
 * the sky's colours, and every canvas is hidden: WebGL output differs between
 * GPUs and software renderers, and the canvases are covered by the smoke spec.
 * Hidden rather than masked, since the background canvas fills the viewport
 * and a mask over it would leave one flat colour to compare.
 */
test.skip(process.platform !== "linux", "baselines are rendered on Linux");
test.use({ contextOptions: { reducedMotion: "reduce" } });

for (const size of SIZES) {
  test.describe(`${size.width}px`, () => {
    test.use({ viewport: size });
    for (const path of SHOT_ROUTES) {
      test(`${path} looks as before`, async ({ page }) => {
        await page.clock.setFixedTime(FIXED_TIME);
        await page.goto(path);
        await expect(page.locator("h1").first()).toBeVisible();
        await settle(page);
        await expect(page).toHaveScreenshot(`${slugOf(path)}-${size.width}.png`, {
          style: "canvas { visibility: hidden !important; }",
        });
      });
    }
  });
}
