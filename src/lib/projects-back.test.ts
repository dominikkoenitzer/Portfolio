import { describe, expect, it } from "vitest";

import { projectsBackTarget } from "./projects-back";

describe("projectsBackTarget", () => {
  it("returns to the list with the search it was left with", () => {
    expect(projectsBackTarget("?type=desktop")).toBe("/projects?type=desktop");
    expect(projectsBackTarget("?q=game&sort=az")).toBe("/projects?q=game&sort=az");
  });

  it("returns to the whole list without a search in state", () => {
    expect(projectsBackTarget(undefined)).toBe("/projects");
    expect(projectsBackTarget(null)).toBe("/projects");
    expect(projectsBackTarget(42)).toBe("/projects");
    expect(projectsBackTarget({ search: "?type=desktop" })).toBe("/projects");
    expect(projectsBackTarget("type=desktop")).toBe("/projects");
    expect(projectsBackTarget("")).toBe("/projects");
  });
});
