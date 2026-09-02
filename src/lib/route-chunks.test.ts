import { describe, expect, it } from "vitest";

import { chunkPathFor, ROUTE_CHUNKS } from "./route-chunks";

describe("chunkPathFor", () => {
  it("matches a static route", () => {
    expect(chunkPathFor("/about")).toBe("/about");
    expect(chunkPathFor("/projects")).toBe("/projects");
    expect(chunkPathFor("/privacy")).toBe("/privacy");
  });

  it("matches the project detail route on any slug", () => {
    expect(chunkPathFor("/projects/zephyr")).toBe("/projects/:projectSlug");
    expect(chunkPathFor("/projects/spectrum")).toBe("/projects/:projectSlug");
  });

  it("ignores a query string and a hash", () => {
    expect(chunkPathFor("/projects?q=react&type=web")).toBe("/projects");
    expect(chunkPathFor("/about#contact")).toBe("/about");
  });

  it("ignores a trailing slash", () => {
    expect(chunkPathFor("/about/")).toBe("/about");
    expect(chunkPathFor("/projects/zephyr/")).toBe("/projects/:projectSlug");
  });

  it("has nothing to warm for Home, which is in the entry chunk", () => {
    expect(chunkPathFor("/")).toBeUndefined();
  });

  it("has nothing to warm for an off-site or non-path href", () => {
    expect(chunkPathFor("https://github.com/dominikkoenitzer")).toBeUndefined();
    expect(chunkPathFor("mailto:dominik@example.com")).toBeUndefined();
    expect(chunkPathFor("#main-content")).toBeUndefined();
    expect(chunkPathFor("//evil.example.com")).toBeUndefined();
    expect(chunkPathFor("")).toBeUndefined();
  });

  it("has nothing to warm for a path no route covers", () => {
    // Anything unmatched renders NotFound, which is not worth a request.
    expect(chunkPathFor("/nope")).toBeUndefined();
    expect(chunkPathFor("/projects/zephyr/gallery")).toBeUndefined();
  });

  it("keeps a loader for every path it can return", () => {
    for (const path of Object.keys(ROUTE_CHUNKS)) {
      expect(typeof ROUTE_CHUNKS[path as keyof typeof ROUTE_CHUNKS]).toBe(
        "function",
      );
    }
  });
});
