import type { Page } from "@playwright/test";

/**
 * Collects everything a visitor's console would show as an error: uncaught
 * exceptions, `console.error`, and the browser's own reports (a refused
 * stylesheet, a blocked request). Warnings are not collected.
 */
export function watchErrors(page: Page, { notFound = false } = {}) {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(`pageerror: ${error.message}`));
  page.on("console", (message) => {
    if (message.type() !== "error") return;
    // On the 404 page Chromium reports the document's own 404 status.
    if (
      notFound &&
      message.text().startsWith("Failed to load resource") &&
      message.location().url === page.url()
    ) {
      return;
    }
    errors.push(`console: ${message.text()}`);
  });
  page.on("requestfailed", (request) => {
    // A navigation away cancels what the old page still had in flight; that is
    // not a failure the visitor sees.
    const reason = request.failure()?.errorText ?? "";
    if (/abort|cancel/i.test(reason)) return;
    errors.push(`requestfailed: ${request.url()} ${reason}`);
  });
  return errors;
}

/** Waits until the route is drawn: fonts loaded and the network quiet. */
export async function settle(page: Page) {
  await page.waitForLoadState("networkidle");
  await page.evaluate(() => document.fonts.ready.then(() => undefined));
}

/**
 * Scrolls through the whole page so every section that fades in on scroll
 * has arrived, then waits for the fades to end. axe measures contrast as
 * painted, and text caught half-faded would read as a contrast failure.
 */
export async function revealAll(page: Page) {
  await settle(page);
  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  const step = page.viewportSize()?.height ?? 800;
  for (let y = 0; y < height; y += step / 2) {
    await page.evaluate((top) => window.scrollTo({ top, behavior: "instant" }), y);
    await page.waitForTimeout(60);
  }
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await page.waitForFunction(
    () =>
      document
        .getAnimations()
        .filter((a) => a.playState === "running")
        .every((a) => {
          const end = a.effect?.getComputedTiming().endTime;
          return typeof end !== "number" || !Number.isFinite(end);
        }),
    undefined,
    { timeout: 10_000 },
  );
  await page.waitForTimeout(300);
}

/** Whether this browser can create a WebGL context at all, measured. */
export function canWebGL(page: Page) {
  return page.evaluate(() => {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2") ?? canvas.getContext("webgl");
    const ok = !!gl;
    gl?.getExtension("WEBGL_lose_context")?.loseContext();
    return ok;
  });
}

/**
 * The canvases on the page whose WebGL context is live, with their sizes.
 *
 * Asking a canvas for a WebGL context would create one where the app had
 * none and turn a canvas that never started into a pass. Asking for a 2D
 * context first tells them apart without that: it is refused on a canvas
 * that already holds a WebGL context, and granted on one that held nothing.
 * A canvas still at the default 300 by 150 has not been set up by its
 * renderer yet and is left alone, so the probe never takes it first.
 */
export function liveCanvases(page: Page) {
  return page.evaluate(() =>
    [...document.querySelectorAll("canvas")]
      .filter((canvas) => !canvas.closest("[data-diag-panel]"))
      .filter((canvas) => !(canvas.width === 300 && canvas.height === 150))
      .filter((canvas) => canvas.getContext("2d") === null)
      .map((canvas) => ({
        gl: canvas.getContext("webgl2") ?? canvas.getContext("webgl"),
        width: canvas.width,
        height: canvas.height,
      }))
      .filter((c) => !!c.gl && !c.gl.isContextLost() && c.width > 0 && c.height > 0)
      .map(({ width, height }) => ({ width, height })),
  );
}

/** Loses every live WebGL context on the page, the way a GPU reset does. */
export function loseContexts(page: Page) {
  return page.evaluate(() => {
    for (const canvas of document.querySelectorAll("canvas")) {
      if (canvas.getContext("2d") !== null) continue;
      const gl = canvas.getContext("webgl2") ?? canvas.getContext("webgl");
      gl?.getExtension("WEBGL_lose_context")?.loseContext();
    }
  });
}

/** A fixed moment for anything that follows the visitor's clock (the sky). */
export const FIXED_TIME = new Date("2026-06-15T10:00:00+02:00");
