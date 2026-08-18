import { describe, expect, it } from "vitest";

import { isActivePath } from "./active-path";

describe("isActivePath", () => {
  it("matches the exact path", () => {
    expect(isActivePath("/projects", "/projects")).toBe(true);
  });

  it("stays active on a nested sub-route", () => {
    // The "Projects" link has to stay lit on /projects/:slug.
    expect(isActivePath("/projects/zephyr", "/projects")).toBe(true);
    expect(isActivePath("/projects/zephyr/gallery", "/projects")).toBe(true);
  });

  it("does not match an unrelated path", () => {
    expect(isActivePath("/about", "/projects")).toBe(false);
    expect(isActivePath("/", "/projects")).toBe(false);
  });

  it("does not match a sibling that merely shares a prefix", () => {
    // The separator check is what keeps /projects-archive from lighting
    // /projects.
    expect(isActivePath("/projects-archive", "/projects")).toBe(false);
    expect(isActivePath("/aboutus", "/about")).toBe(false);
  });

  it("is case-sensitive, like the router", () => {
    expect(isActivePath("/Projects", "/projects")).toBe(false);
  });
});
