import { describe, expect, it } from "vitest";

import { SUPPORTED_LANGUAGE_CODES } from "@/config/languages";
import { PORTFOLIO_PROJECTS, getProject, getProjects } from "./index";

/**
 * The project list is hand-maintained data that feeds the cards, the detail
 * routes, the sitemap and the JSON-LD. A wrong slug or a missing localized
 * module is a 404 or an untranslated page rather than a build failure, so the
 * invariants the module comments promise are asserted here.
 */

const projects = PORTFOLIO_PROJECTS;

describe("the project list", () => {
  it("is not empty", () => {
    expect(projects.length).toBeGreaterThan(0);
  });

  it("has a unique slug per project", () => {
    const slugs = projects.map((project) => project.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("uses URL-safe slugs", () => {
    for (const project of projects) {
      expect(project.slug, project.title).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    }
  });

  it("numbers priority 1-based with no gaps or repeats", () => {
    const priorities = projects.map((project) => project.priority).sort((a, b) => a - b);
    expect(priorities).toEqual(projects.map((_, index) => index + 1));
  });

  it("dates every project as ISO year-month", () => {
    for (const project of projects) {
      expect(project.date, project.slug).toMatch(/^\d{4}-(?:0[1-9]|1[0-2])$/);
    }
  });

  it("is ordered oldest first, as the module comment promises", () => {
    const dates = projects.map((project) => project.date);
    expect(dates).toEqual([...dates].sort());
  });

  it("derives year from date", () => {
    for (const project of projects) {
      expect(project.year, project.slug).toBe(project.date.slice(0, 4));
    }
  });

  it("renders a non-empty date label", () => {
    for (const project of projects) {
      expect(project.dateLabel, project.slug).not.toBe("");
      expect(project.dateLabel, project.slug).toContain(project.year);
    }
  });

  it("points repoUrl at a real repository", () => {
    for (const project of projects) {
      expect(project.repoUrl, project.slug).toMatch(
        /^https:\/\/github\.com\/[\w.-]+\/[\w.-]+$/,
      );
    }
  });

  it("gives every project either a live URL or a download", () => {
    for (const project of projects) {
      const target = project.liveUrl || project.downloadUrl;
      expect(target, project.slug).toBeTruthy();
      expect(() => new URL(target as string), project.slug).not.toThrow();
    }
  });

  it("uses absolute public paths for images", () => {
    for (const project of projects) {
      if (project.image) expect(project.image, project.slug).toMatch(/^\/.+\.\w+$/);
      for (const shot of project.gallery ?? []) {
        expect(shot, project.slug).toMatch(/^\/.+\.\w+$/);
      }
    }
  });

  it("fills the copy every detail page renders", () => {
    for (const project of projects) {
      for (const field of [
        "title",
        "tagline",
        "description",
        "overview",
        "roleSummary",
        "problemStatement",
        "impactHeading",
      ] as const) {
        expect(project[field]?.trim(), `${project.slug}.${field}`).toBeTruthy();
      }

      for (const field of [
        "objectives",
        "architectureDecisions",
        "implementationHighlights",
        "qualityAndSecurity",
        "hiringSignals",
        "nextIterations",
        "impactPoints",
        "tags",
      ] as const) {
        expect(project[field].length, `${project.slug}.${field}`).toBeGreaterThan(0);
      }
    }
  });

  it("pairs every challenge with a solution", () => {
    for (const project of projects) {
      for (const entry of project.challengesAndSolutions) {
        expect(entry.challenge.trim(), project.slug).toBeTruthy();
        expect(entry.solution.trim(), project.slug).toBeTruthy();
      }
    }
  });
});

describe("getProjects", () => {
  it.each(SUPPORTED_LANGUAGE_CODES)("returns every project in %s", (code) => {
    expect(getProjects(code).map((project) => project.slug)).toEqual(
      projects.map((project) => project.slug),
    );
  });

  it.each(SUPPORTED_LANGUAGE_CODES)("localizes the date label in %s", (code) => {
    for (const project of getProjects(code)) {
      expect(project.dateLabel, `${project.slug} ${code}`).toContain(project.year);
    }
  });

  it("renders at least one language differently from English", () => {
    // Guards against every language silently resolving to the en content.
    const english = getProjects("en").map((project) => project.tagline).join("|");
    const german = getProjects("de").map((project) => project.tagline).join("|");
    expect(german).not.toBe(english);
  });
});

describe("getProject", () => {
  it("finds a project by slug", () => {
    const slug = projects[0].slug;
    expect(getProject(slug, "en")?.slug).toBe(slug);
  });

  it("returns undefined for an unknown slug", () => {
    // The detail route reads this to decide between a page and a 404.
    expect(getProject("no-such-project", "en")).toBeUndefined();
  });

  it("agrees with the list for every slug", () => {
    for (const project of projects) {
      expect(getProject(project.slug, "en")).toEqual(project);
    }
  });
});
