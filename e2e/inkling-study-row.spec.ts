import { expect, type Locator, test } from "@playwright/test";

/** Each clipping ancestor up to the demo that cuts the element's box, with how far. */
async function clips(el: Locator) {
  return el.evaluate((node) => {
    const r = node.getBoundingClientRect();
    const cut: string[] = [];
    for (let a = node.parentElement; a && a.tagName !== "FIGURE"; a = a.parentElement) {
      const s = getComputedStyle(a);
      if (s.overflowX === "visible" && s.overflowY === "visible") continue;
      const p = a.getBoundingClientRect();
      const left = p.left + a.clientLeft;
      const top = p.top + a.clientTop;
      const over = Math.max(left - r.left, top - r.top, r.right - (left + a.clientWidth), r.bottom - (top + a.clientHeight));
      if (over > 0.5) cut.push(`${a.tagName.toLowerCase()}.${a.className.split(" ")[0]} by ${over.toFixed(1)} px`);
    }
    return cut;
  });
}

test.describe("Inkling's note demo after Flashcards", () => {
  for (const width of [1280, 390, 360]) {
    test.describe(`at ${width} px`, () => {
      test.use({ viewport: { width, height: width > 600 ? 900 : 844 }, contextOptions: { reducedMotion: "reduce" } });

      test("shows the whole Study row on Today", async ({ page }) => {
        await page.goto("/projects/inkling");
        await expect(page.locator("main#main-content")).toBeVisible();
        const demo = page.getByRole("figure", { name: "An Inkling note whose to-dos appear on Today and whose card lines become flashcards" });
        await demo.scrollIntoViewIfNeeded();
        await expect(demo).toBeVisible();

        await demo.getByRole("button", { name: "Flashcards", exact: true }).click();
        const due = demo.getByText("2 cards due");
        await expect(due).toBeVisible();
        // The Study heading and its row share one block.
        const study = due.locator("xpath=ancestor::div[1]");
        await expect(study).toContainText("Study");

        expect(await clips(study), "nothing ticked").toEqual([]);
        for (const name of ["Read chapter 4, on Today", "Make flashcards from the terms, on Today"]) {
          const box = demo.getByRole("checkbox", { name });
          await box.click();
          await expect(box).toBeChecked();
          expect(await clips(study), `${name} ticked`).toEqual([]);
        }
      });
    });
  }
});
