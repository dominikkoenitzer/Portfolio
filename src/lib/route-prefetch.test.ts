import { describe, expect, it, vi } from "vitest";

import {
  allowsPrefetch,
  type ConnectionHint,
  createPrefetchRegistry,
} from "./route-prefetch";

const setup = (connection: ConnectionHint | null = null) => {
  const load = vi.fn(() => Promise.resolve({}));
  const registry = createPrefetchRegistry(load, () => connection);
  return { load, registry };
};

describe("allowsPrefetch", () => {
  it("allows it where the browser reports nothing", () => {
    // Safari and Firefox have no Network Information API at all.
    expect(allowsPrefetch(null)).toBe(true);
    expect(allowsPrefetch(undefined)).toBe(true);
    expect(allowsPrefetch({})).toBe(true);
  });

  it("allows it on a fast connection", () => {
    expect(allowsPrefetch({ effectiveType: "4g" })).toBe(true);
    expect(allowsPrefetch({ effectiveType: "3g" })).toBe(true);
  });

  it("refuses on Data Saver", () => {
    expect(allowsPrefetch({ saveData: true, effectiveType: "4g" })).toBe(false);
  });

  it("refuses on 2G", () => {
    expect(allowsPrefetch({ effectiveType: "2g" })).toBe(false);
    expect(allowsPrefetch({ effectiveType: "slow-2g" })).toBe(false);
  });
});

describe("createPrefetchRegistry", () => {
  it("does nothing before it is armed", async () => {
    const { load, registry } = setup();
    registry.prefetch("/about");
    await Promise.resolve();
    expect(load).not.toHaveBeenCalled();
    expect(registry.warmed()).toEqual([]);
  });

  it("warms a route once it is armed", async () => {
    const { load, registry } = setup();
    registry.arm();
    registry.prefetch("/about");
    await Promise.resolve();
    expect(load).toHaveBeenCalledWith("/about");
    expect(registry.warmed()).toEqual(["/about"]);
  });

  it("warms each route only once", async () => {
    const { load, registry } = setup();
    registry.arm();
    registry.prefetch("/about");
    registry.prefetch("/about");
    registry.prefetch("/about?from=nav");
    await Promise.resolve();
    expect(load).toHaveBeenCalledTimes(1);
  });

  it("collapses every project slug onto the one detail chunk", async () => {
    const { load, registry } = setup();
    registry.arm();
    registry.prefetch("/projects/zephyr");
    registry.prefetch("/projects/spectrum");
    await Promise.resolve();
    expect(load).toHaveBeenCalledTimes(1);
    expect(load).toHaveBeenCalledWith("/projects/:projectSlug");
  });

  it("skips hrefs with no chunk of their own", async () => {
    const { load, registry } = setup();
    registry.arm();
    registry.prefetch("/");
    registry.prefetch("https://github.com/dominikkoenitzer");
    registry.prefetch("#main-content");
    await Promise.resolve();
    expect(load).not.toHaveBeenCalled();
  });

  it("refuses to spend a metered connection", async () => {
    const { load, registry } = setup({ saveData: true });
    registry.arm();
    registry.prefetch("/about");
    await Promise.resolve();
    expect(load).not.toHaveBeenCalled();
    expect(registry.warmed()).toEqual([]);
  });

  it("forgets a route whose warm-up failed, so the click can retry", async () => {
    const load = vi.fn(() => Promise.reject(new Error("offline")));
    const registry = createPrefetchRegistry(load, () => null);
    registry.arm();
    registry.prefetch("/about");
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(registry.warmed()).toEqual([]);
  });

  it("resets back to unarmed and empty", async () => {
    const { load, registry } = setup();
    registry.arm();
    registry.prefetch("/about");
    await Promise.resolve();
    registry.reset();
    expect(registry.warmed()).toEqual([]);
    registry.prefetch("/about");
    await Promise.resolve();
    expect(load).toHaveBeenCalledTimes(1);
  });
});
