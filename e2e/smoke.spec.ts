import AxeBuilder from "@axe-core/playwright";
import { expect, type Page, test } from "@playwright/test";
import {
  canWebGL,
  liveCanvases,
  loseContexts,
  revealAll,
  settle,
  watchErrors,
} from "./helpers";
import { ROUTES } from "./routes";

const AXE_TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];

async function seriousViolations(page: Page) {
  const result = await new AxeBuilder({ page }).withTags(AXE_TAGS).analyze();
  return result.violations
    .filter((v) => v.impact === "serious" || v.impact === "critical")
    .map((v) => ({
      id: v.id,
      impact: v.impact,
      nodes: v.nodes.slice(0, 5).map((n) => ({
        target: n.target.join(" "),
        why: n.failureSummary?.split("\n").slice(1, 2).join(" ").trim(),
      })),
    }));
}

async function expectRendered(page: Page) {
  await expect(page.locator("#root > *").first()).toBeAttached();
  await expect(page.locator("main#main-content")).toBeVisible();
  await expect(page.locator("h1").first()).toBeVisible();
}

test.describe("every route", () => {
  for (const route of ROUTES) {
    test(`${route.path} renders cleanly and passes axe in both themes`, async ({
      page,
    }) => {
      const errors = watchErrors(page, { notFound: route.status === 404 });
      const response = await page.goto(route.path);
      expect(response?.status()).toBe(route.status);
      await expectRendered(page);
      await revealAll(page);
      expect(await seriousViolations(page), "axe, light theme").toEqual([]);

      await page.emulateMedia({ colorScheme: "dark" });
      await page.reload();
      await expectRendered(page);
      await expect(page.locator("html")).toHaveClass(/\bdark\b/);
      await revealAll(page);
      expect(await seriousViolations(page), "axe, dark theme").toEqual([]);

      expect(errors).toEqual([]);
    });
  }
});

/**
 * Where the site draws with WebGL. Whether a context is possible is measured
 * in the browser first: with one, the canvas must be there and live; without,
 * the page must still render with no error.
 */
const CANVAS_PAGES = [
  // The sky behind every page, mounted once the browser is idle.
  { path: "/", canvases: 1 },
  // The sky plus the skill sphere (wide screens, motion allowed).
  { path: "/skills", canvases: 2 },
  // The sky plus the services tree (wide screens, motion allowed).
  { path: "/services", canvases: 2 },
];

test.describe("WebGL", () => {
  for (const { path, canvases } of CANVAS_PAGES) {
    test(`${path} holds ${canvases} live WebGL canvas(es) where WebGL works`, async ({
      page,
    }) => {
      const errors = watchErrors(page);
      await page.goto(path);
      await expectRendered(page);
      if (await canWebGL(page)) {
        await expect
          .poll(async () => (await liveCanvases(page)).length, { timeout: 15_000 })
          .toBeGreaterThanOrEqual(canvases);
      } else {
        test.info().annotations.push({
          type: "webgl",
          description: "this browser could not create a WebGL context; checked the page without it",
        });
        await settle(page);
        expect(await liveCanvases(page)).toEqual([]);
      }
      expect(errors).toEqual([]);
    });
  }

  test("a lost context leaves the page standing", async ({ page }) => {
    const errors = watchErrors(page);
    await page.goto("/skills");
    await expectRendered(page);
    test.skip(!(await canWebGL(page)), "no WebGL in this browser");
    await expect.poll(async () => (await liveCanvases(page)).length).toBeGreaterThanOrEqual(2);
    await loseContexts(page);
    await page.waitForTimeout(500);
    await expect(page.locator("h1").first()).toBeVisible();
    expect(errors.filter((e) => e.startsWith("pageerror"))).toEqual([]);
  });
});

test.describe("reduced motion", () => {
  test.use({ contextOptions: { reducedMotion: "reduce" } });

  test("the sphere and the tree stay off and the native cursor stays", async ({
    page,
  }) => {
    const errors = watchErrors(page);
    await page.goto("/skills");
    await expectRendered(page);
    await settle(page);
    // Only the sky may draw; the sphere is not mounted under reduced motion.
    expect((await liveCanvases(page)).length).toBeLessThanOrEqual(1);
    const cursor = await page.evaluate(() => getComputedStyle(document.body).cursor);
    expect(cursor).not.toBe("none");

    await page.goto("/services");
    await expectRendered(page);
    await settle(page);
    expect((await liveCanvases(page)).length).toBeLessThanOrEqual(1);
    expect(errors).toEqual([]);
  });

  test("the logo strip stands still", async ({ page }) => {
    await page.goto("/projects/entropy");
    await expectRendered(page);
    const track = page.locator(".logoloop__track").first();
    await track.scrollIntoViewIfNeeded();
    const before = await track.evaluate((el) => getComputedStyle(el).transform);
    await page.waitForTimeout(800);
    const after = await track.evaluate((el) => getComputedStyle(el).transform);
    expect(after).toBe(before);
  });
});

test.describe("keyboard", () => {
  test("skip link, then the nav, reach the content and the next page", async ({
    page,
    browserName,
  }) => {
    // WebKit, like Safari out of the box, moves Tab between form controls
    // only and never to a link, so the link path is walked in the other two.
    test.skip(browserName === "webkit", "WebKit does not tab to links by default");
    await page.goto("/");
    await expectRendered(page);
    await settle(page);

    await page.keyboard.press("Tab");
    const skip = page.locator('a[href="#main-content"]');
    await expect(skip).toBeFocused();
    await expect(skip).toBeVisible();
    await page.keyboard.press("Enter");
    await expect(page.locator("main#main-content")).toBeFocused();

    await page.evaluate(() => window.scrollTo(0, 0));
    await page.locator("body").focus();
    let reached = false;
    for (let i = 0; i < 25 && !reached; i++) {
      await page.keyboard.press("Tab");
      reached = await page.evaluate(() => {
        const el = document.activeElement as HTMLAnchorElement | null;
        return !!el?.closest("nav") && el.getAttribute("href") === "/about";
      });
    }
    expect(reached, "a nav link to /about is reachable by keyboard").toBe(true);
    const outline = await page.evaluate(() => {
      const el = document.activeElement as HTMLElement;
      const style = getComputedStyle(el);
      return { outline: style.outlineStyle, shadow: style.boxShadow };
    });
    expect(
      outline.outline !== "none" || outline.shadow !== "none",
      "the focused link shows a focus ring",
    ).toBe(true);
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/\/about$/);
    await expect(page.locator("h1").first()).toBeVisible();
  });
});

test.describe("diagnostics", () => {
  test("/diag measures, stays out of search and sends nothing without an endpoint", async ({
    page,
  }) => {
    test.slow();
    const errors = watchErrors(page);
    const posts: string[] = [];
    page.on("request", (request) => {
      if (request.method() === "POST") posts.push(request.url());
    });
    const response = await page.goto("/diag");
    expect(response?.status()).toBe(200);
    expect(response?.headers()["x-robots-tag"]).toBe("noindex, nofollow");
    // The prerendered document says noindex before any script runs, and so
    // does every robots tag the app adds once it has.
    expect(await response?.text()).toMatch(/name="robots"\s+content="noindex, nofollow"/);
    await expectRendered(page);
    const robots = await page
      .locator('meta[name="robots"], meta[name="googlebot"]')
      .evaluateAll((tags) => tags.map((tag) => tag.getAttribute("content") ?? ""));
    expect(robots.length).toBeGreaterThan(0);
    for (const content of robots) expect(content).toMatch(/^noindex, nofollow/);

    // Locators reach into the panel's open shadow root.
    const panel = page.locator("[data-diag-panel]");
    await expect(panel).toBeAttached({ timeout: 10_000 });
    const send = panel.locator("button.primary");
    await expect(send).toBeVisible({ timeout: 40_000 });
    await expect(send).toBeFocused();
    expect(await seriousViolations(page), "axe, the panel's result").toEqual([]);
    await send.click();
    await expect(panel.locator('p[role="status"]')).toContainText(
      "No address for reports is set up",
    );
    await expect(send).toBeEnabled();
    expect(posts).toEqual([]);

    await page.keyboard.press("Escape");
    await expect(panel).toHaveCount(0);
    await expect(page.getByRole("button", { name: "Open the panel again" })).toBeVisible();
    expect(errors).toEqual([]);
  });
});
