import { expect, test } from "@playwright/test";

test.describe("Mochi's stop demo with both windows off screen", () => {
  for (const width of [390, 360]) {
    test.describe(`at ${width} px`, () => {
      test.use({ viewport: { width, height: 844 }, contextOptions: { reducedMotion: "reduce" } });

      test("keeps both windows inside the dashed row", async ({ page }) => {
        await page.goto("/projects/mochi");
        await expect(page.locator("main#main-content")).toBeVisible();
        const demo = page.getByRole("figure", { name: "Mochi stopping and bringing back every window it was hiding" });
        await demo.scrollIntoViewIfNeeded();
        await expect(demo).toBeVisible();
        await expect(demo.getByRole("button", { name: "Stop Mochi" })).toBeVisible();

        const row = demo.getByText("Off screen", { exact: true }).locator("xpath=..");
        await expect(row.locator(":scope > div")).toHaveCount(2);

        // How far each window runs past the row's box less its border.
        const over = await row.evaluate((el) => {
          const r = el.getBoundingClientRect();
          const left = r.left + el.clientLeft;
          const top = r.top + el.clientTop;
          return Array.from(el.querySelectorAll(":scope > div"), (w) => {
            const b = w.getBoundingClientRect();
            return Math.max(0, left - b.left, top - b.top, b.right - (left + el.clientWidth), b.bottom - (top + el.clientHeight));
          });
        });
        for (const [i, px] of over.entries()) expect(px, `window ${i + 1} past the border`).toBeLessThanOrEqual(0.5);
      });
    });
  }
});
