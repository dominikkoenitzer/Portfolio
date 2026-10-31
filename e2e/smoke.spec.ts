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

  test("scrolling stays native", async ({ page }) => {
    await page.goto("/about");
    await expectRendered(page);
    await settle(page);
    await expect(page.locator("html")).not.toHaveClass(/\blenis\b/);
    await page.locator("body").focus();
    await page.keyboard.press("PageDown");
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(0);
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

/**
 * The smooth scroll's frame loop runs only while a glide is under way, so the
 * page is at rest between glides. Keyboard scrolling is native and must work
 * in that rest, and a wheel glide afterwards must start from where the keys
 * left the page rather than from where the last glide ended.
 */
test.describe("smooth scroll", () => {
  const scrollY = (page: Page) => page.evaluate(() => Math.round(window.scrollY));
  const atRest = async (page: Page) => {
    await expect(page.locator("html")).not.toHaveClass(/lenis-smooth/);
    // Settled once the position has held for half a second: on a slow runner
    // two frames can be more than one poll apart.
    let last = -1;
    let since = 0;
    await expect
      .poll(
        async () => {
          const y = await scrollY(page);
          if (y !== last) {
            last = y;
            since = Date.now();
          }
          return Date.now() - since;
        },
        { intervals: [100] },
      )
      .toBeGreaterThanOrEqual(500);
  };

  test("a wheel glide settles, the keys scroll at rest, the next glide starts there", async ({
    page,
  }) => {
    const errors = watchErrors(page);
    await page.goto("/about");
    await expectRendered(page);
    await settle(page);
    await expect(page.locator("html")).toHaveClass(/\blenis\b/);
    await page.mouse.move(400, 400);

    await page.mouse.wheel(0, 300);
    await expect(page.locator("html")).toHaveClass(/lenis-smooth/);
    await atRest(page);
    expect(await scrollY(page)).toBe(300);

    await page.locator("body").focus();
    await page.keyboard.press("PageDown");
    // A browser that animates key scrolling may start a frame or two late on
    // a slow machine, so wait for the move before waiting for the rest.
    await expect.poll(() => scrollY(page)).toBeGreaterThan(300);
    await atRest(page);
    const afterKeys = await scrollY(page);

    // Upwards, so the end of the page cannot clamp it: a glide that started
    // from the last glide's target would end at 100, not here.
    await page.mouse.wheel(0, -200);
    await atRest(page);
    expect(await scrollY(page)).toBe(afterKeys - 200);
    expect(errors).toEqual([]);
  });
});

test.describe("keyboard", () => {
  test("closing the phone menu after a click hands focus to the menu button", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    await expectRendered(page);
    await settle(page);
    await page.getByRole("button", { name: "Open menu" }).click();
    const menu = page.getByRole("dialog", { name: "Menu" });
    await expect(menu.getByRole("button", { name: "Close menu" })).toBeFocused();
    await page.keyboard.press("Escape");
    await expect(menu).toBeHidden();
    await expect(page.getByRole("button", { name: "Open menu" })).toBeFocused();
  });

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

  test("a click inside the search panel keeps its keys working", async ({ page }) => {
    await page.goto("/");
    await expectRendered(page);
    await settle(page);
    await page.locator("header [data-search-trigger]:visible").first().click();
    const field = page.getByRole("combobox");
    await expect(field).toBeFocused();
    // The key hints along the bottom edge hold nothing focusable.
    const hints = page.getByRole("dialog", { name: "Site search" }).locator('div[aria-hidden="true"]');
    await expect(hints).toHaveCount(1);
    await hints.click();
    const highlighted = (await field.getAttribute("aria-activedescendant")) ?? "";
    await page.keyboard.press("ArrowDown");
    await expect(field).not.toHaveAttribute("aria-activedescendant", highlighted);
    await page.keyboard.press("Tab");
    await expect(field).toBeFocused();
  });

  test("Enter and Escape that end a composition leave the search open", async ({
    page,
  }) => {
    await page.goto("/");
    await expectRendered(page);
    await settle(page);
    await page.locator("header [data-search-trigger]:visible").first().click();
    const field = page.getByRole("combobox");
    await expect(field).toBeFocused();
    await field.fill("contact");

    for (const key of ["Enter", "Escape"]) {
      for (const legacy of [false, true]) {
        await field.evaluate(
          (el, [key, legacy]) => {
            const event = new KeyboardEvent("keydown", {
              key,
              bubbles: true,
              cancelable: true,
              isComposing: !legacy,
            });
            // Safari sends the key that ends a composition after it, marked only by keyCode 229.
            if (legacy) Object.defineProperty(event, "keyCode", { value: 229 });
            el.dispatchEvent(event);
          },
          [key, legacy] as const,
        );
      }
    }
    await page.keyboard.type("s");
    await expect(field).toHaveValue("contacts");
    await expect(page).toHaveURL(/\/$/);
  });

  test("Tab stays inside the phone menu", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    await expectRendered(page);
    await settle(page);
    await page.getByRole("button", { name: "Open menu" }).click();
    const menu = page.getByRole("dialog", { name: "Menu" });
    await expect(menu.getByRole("button", { name: "Close menu" })).toBeFocused();

    for (const key of ["Tab", "Shift+Tab"]) {
      for (let i = 1; i <= 16; i++) {
        await page.keyboard.press(key);
        const inside = await menu.evaluate((el) => el.contains(document.activeElement));
        expect(inside, `${key} press ${i} stays in the menu`).toBe(true);
      }
    }
  });

  test("the chosen subject goes into the mail link", async ({ page }) => {
    await page.goto("/contact");
    await expectRendered(page);
    await settle(page);
    const mail = page.locator('main a[href^="mailto:"]').first();
    const subject = async () =>
      new URL((await mail.getAttribute("href")) ?? "").searchParams.get("subject");
    expect(await subject()).toBe("Role at [company]");

    await page.getByRole("button", { name: "a role, Change what this is about" }).click();
    await page.getByRole("button", { name: "a freelance project", exact: true }).click();
    await expect.poll(subject).toBe("Freelance project: [short description]");
  });

  test("the mail links work while the served html holds no address", async ({ page }) => {
    const address = /[\w.+-]+@[\w-]+\.[a-z]{2,}/i;
    for (const route of ["/", "/contact", "/privacy"]) {
      const html = await (await page.request.get(route)).text();
      expect(html, `${route} as served`).not.toMatch(address);
    }

    await page.goto("/contact");
    await expectRendered(page);
    const mail = page.locator('main a[href^="mailto:"]').first();
    const href = new URL((await mail.getAttribute("href")) ?? "");
    expect(href.pathname).toMatch(new RegExp(`^${address.source}$`, "i"));
    expect((await mail.innerText()).trim()).toBe(href.pathname);
    await expect(page.locator('footer a[href^="mailto:"]')).toHaveAttribute(
      "href",
      `mailto:${href.pathname}`,
    );
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
