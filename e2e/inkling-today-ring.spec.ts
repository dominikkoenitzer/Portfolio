import { expect, type Locator, test } from "@playwright/test";

/** Each clipping ancestor up to the demo, its row first, that the checkbox's focus ring reaches past. */
async function ringClips(box: Locator) {
  return box.evaluate((el) => {
    const style = getComputedStyle(el);
    const grow = Number.parseFloat(style.outlineOffset) + Number.parseFloat(style.outlineWidth);
    const r = el.getBoundingClientRect();
    const ring = { left: r.left - grow, top: r.top - grow, right: r.right + grow, bottom: r.bottom + grow };
    const cut: string[] = [];
    for (let a = el.parentElement; a && a.tagName !== "FIGURE"; a = a.parentElement) {
      const s = getComputedStyle(a);
      if (s.overflowX === "visible" && s.overflowY === "visible") continue;
      const p = a.getBoundingClientRect();
      const left = p.left + a.clientLeft;
      const top = p.top + a.clientTop;
      const over = Math.max(left - ring.left, top - ring.top, ring.right - (left + a.clientWidth), ring.bottom - (top + a.clientHeight));
      if (over > 0.5) cut.push(`${a.tagName.toLowerCase()} by ${over.toFixed(1)} px`);
    }
    return { grow, visible: el.matches(":focus-visible"), cut };
  });
}

test.describe("Inkling's Today checkboxes by keyboard", () => {
  for (const width of [1280, 390, 360]) {
    test.describe(`at ${width} px`, () => {
      test.use({ viewport: { width, height: width > 600 ? 900 : 844 }, contextOptions: { reducedMotion: "reduce" } });

      test("show the whole focus ring inside their rows", async ({ page }) => {
        await page.goto("/projects/inkling");
        await expect(page.locator("main#main-content")).toBeVisible();
        const demo = page.getByRole("figure", { name: "An Inkling note whose to-dos appear on Today and whose card lines become flashcards" });
        await demo.scrollIntoViewIfNeeded();
        await expect(demo).toBeVisible();

        // Tab on from the last checkbox in the note into Today.
        await demo.getByRole("checkbox", { name: "Make flashcards from the terms, in the note" }).focus();
        for (const name of ["Read chapter 4, on Today", "Make flashcards from the terms, on Today"]) {
          await page.keyboard.press("Tab");
          const box = demo.getByRole("checkbox", { name });
          await expect(box).toBeFocused();
          expect(await ringClips(box)).toEqual({ grow: 4, visible: true, cut: [] });
        }
      });
    });
  }
});
