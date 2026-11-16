import { expect, type Locator, type Page, test } from "@playwright/test";

/** Opens the Psyche page with the picker demo in view, on a site that only probably matches. */
async function openPicker(page: Page) {
  await page.goto("/projects/psyche");
  await expect(page.locator("main#main-content")).toBeVisible();
  const demo = page.getByRole("figure", { name: "Psyche choosing the right two-factor code for the site in front" });
  await demo.scrollIntoViewIfNeeded();
  await expect(demo).toBeVisible();
  const site = demo.getByRole("radio", { name: "acme-corp.example" });
  await site.focus();
  await page.keyboard.press("Space");
  await expect(site).toHaveAttribute("aria-checked", "true");
  const altP = demo.getByRole("button", { name: "Alt+P", exact: true });
  const picker = demo.getByRole("dialog", { name: "Psyche picker" });
  await altP.focus();
  await page.keyboard.press("Enter");
  await expect(picker).toBeVisible();
  return { demo, altP, picker };
}

/** Picks the first row, which asks before remembering the site. */
async function ask(page: Page, picker: Locator) {
  await expect(picker.getByRole("button", { name: /^Acme Corp/ })).toBeFocused();
  await page.keyboard.press("Enter");
  const yes = picker.getByRole("button", { name: /Yes$/ });
  await expect(yes).toBeFocused();
  return { yes, no: picker.getByRole("button", { name: /No$/ }) };
}

test.describe("Psyche's picker by keyboard", () => {
  for (const width of [1280, 390]) {
    test.describe(`at ${width} px`, () => {
      test.use({ viewport: { width, height: width > 600 ? 900 : 844 } });

      test("Enter on No answers No and hands the focus back to Alt+P", async ({ page }) => {
        const { demo, altP, picker } = await openPicker(page);
        const { no } = await ask(page, picker);
        await no.focus();
        await page.keyboard.press("Enter");
        await expect(picker).toBeHidden();
        await expect(demo.getByText("Typed, and nothing remembered: the next visit asks again.").first()).toBeVisible();
        await expect(altP).toBeFocused();

        // Nothing was remembered, so the next Alt+P asks again.
        await page.keyboard.press("Enter");
        await expect(picker).toBeVisible();
        await expect(picker.getByRole("button", { name: /^Acme Corp/ })).toBeFocused();
      });

      test("Enter on Yes remembers the site and hands the focus back to Alt+P", async ({ page }) => {
        const { demo, altP, picker } = await openPicker(page);
        await ask(page, picker);
        await page.keyboard.press("Enter");
        await expect(picker).toBeHidden();
        await expect(demo.getByText(/is now an exact match for Acme Corp/).first()).toBeVisible();
        await expect(altP).toBeFocused();
      });

      test("Escape closes the picker and the question with the focus on Alt+P", async ({ page }) => {
        const { altP, picker } = await openPicker(page);
        await page.keyboard.press("Escape");
        await expect(picker).toBeHidden();
        await expect(altP).toBeFocused();

        await page.keyboard.press("Enter");
        await ask(page, picker);
        await page.keyboard.press("Escape");
        await expect(picker).toBeHidden();
        await expect(altP).toBeFocused();
      });
    });
  }
});
