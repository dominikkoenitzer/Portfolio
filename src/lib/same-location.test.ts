import { describe, expect, it } from "vitest";

import { isSameLocation } from "./same-location";

const at = (pathname: string, search = "", hash = "") => ({
  pathname,
  search,
  hash,
});

describe("isSameLocation", () => {
  it("is true for the same path, search and hash", () => {
    expect(isSameLocation(at("/skills"), "/skills")).toBe(true);
    expect(
      isSameLocation(
        at("/projects", "?tag=rust", "#list"),
        "/projects?tag=rust#list",
      ),
    ).toBe(true);
  });

  it("is false for a different path", () => {
    expect(isSameLocation(at("/skills"), "/services")).toBe(false);
    expect(isSameLocation(at("/projects/zephyr"), "/projects")).toBe(false);
  });

  it("is false for a different search", () => {
    expect(isSameLocation(at("/projects", "?tag=rust"), "/projects")).toBe(
      false,
    );
    expect(isSameLocation(at("/projects"), "/projects?tag=rust")).toBe(false);
  });

  it("is false for a different hash", () => {
    expect(isSameLocation(at("/services", "", "#faq"), "/services")).toBe(
      false,
    );
    expect(isSameLocation(at("/services"), "/services#faq")).toBe(false);
  });
});
