import { describe, expect, it } from "vitest";

import { SUPPORTED_LANGUAGE_CODES } from "@/config/languages";
import {
  cardImageSrc,
  getProject,
  getProjects,
  PORTFOLIO_PROJECTS,
} from "./index";
import { PROJECT_STACKS } from "./stacks";
import { SKILL_CATEGORIES } from "@/constants/skills";

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

  // A project may run only locally (no live site, no binary), but whatever
  // it does link to has to be a real URL.
  it("links a live site and a download only by absolute URL", () => {
    for (const project of projects) {
      for (const target of [project.liveUrl, project.downloadUrl]) {
        if (target === undefined) continue;
        expect(() => new URL(target), project.slug).not.toThrow();
      }
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

  /**
   * The catalogue card advertises the small copy as a `srcset` candidate, so
   * the derived name has to stay a real .jpg path next to the original. That
   * the file behind it exists is checked by the prerender step, which is the
   * only place that can see `public/`.
   */
  it("derives a catalogue copy for every screenshot", () => {
    for (const project of projects) {
      if (!project.image || project.imageIcon) continue;
      const card = cardImageSrc(project.image);
      expect(card, project.slug).toMatch(/^\/projects\/[\w-]+-card\.jpg$/);
      expect(card, project.slug).not.toBe(project.image);
    }
  });

  it("declares an intrinsic width for every screenshot", () => {
    for (const project of projects) {
      expect(project.imageWidth, project.slug).toBeGreaterThanOrEqual(1600);
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
      ] as const) {
        expect(project[field]?.trim(), `${project.slug}.${field}`).toBeTruthy();
      }
      expect(project.tags.length, `${project.slug}.tags`).toBeGreaterThan(0);
    }
  });

  // Every section needs a heading and text; an empty one renders a numbered
  // heading over nothing.
  it("gives every project a complete case study", () => {
    for (const code of SUPPORTED_LANGUAGE_CODES) {
      for (const project of getProjects(code)) {
        const at = `${project.slug} ${code}`;
        expect(project.sections.length, at).toBeGreaterThan(0);
        for (const section of project.sections) {
          expect(section.heading.trim(), at).toBeTruthy();
          expect(section.body.length, `${at} ${section.heading}`).toBeGreaterThan(0);
          for (const paragraph of section.body) {
            expect(paragraph.trim(), `${at} ${section.heading}`).toBeTruthy();
          }
          if (section.code) {
            expect(section.code.text.trim(), at).toBeTruthy();
            expect(section.code.caption.trim(), at).toBeTruthy();
          }
        }
      }
    }
  });

  // Every picture gets a caption and every section figure points at a picture
  // that exists: a figure index past the end would render nothing, silently.
  it("captions every picture a rewritten case study shows", () => {
    for (const code of SUPPORTED_LANGUAGE_CODES) {
      for (const project of getProjects(code)) {
        const at = `${project.slug} ${code}`;
        const pictures =
          (project.image && !project.imageIcon ? 1 : 0) +
          (project.gallery?.length ?? 0);
        expect(project.captions.length, at).toBe(pictures);
        for (const caption of project.captions) {
          expect(caption.trim(), at).toBeTruthy();
        }
        for (const section of project.sections) {
          if (section.figure === undefined) continue;
          expect(section.figure, `${at} ${section.heading}`).toBeGreaterThanOrEqual(0);
          expect(section.figure, `${at} ${section.heading}`).toBeLessThan(pictures);
        }
      }
    }
  });

  it("ends a project no earlier than it started", () => {
    for (const project of projects) {
      if (!project.ended) continue;
      expect(project.ended, project.slug).toMatch(/^\d{4}-(?:0[1-9]|1[0-2])$/);
      expect(project.ended >= project.date, project.slug).toBe(true);
    }
  });
});

describe("project stacks", () => {
  const skills = new Set(SKILL_CATEGORIES.flatMap((category) => category.skills));

  it("lists a stack for every project", () => {
    for (const project of projects) {
      expect(project.stack.length, project.slug).toBeGreaterThan(0);
    }
  });

  // /skills links a chip to /projects?tech=<name> by exact name, so a stack
  // entry that is not a chip would be counted nowhere and filtered to nothing.
  it("names only skills that /skills shows", () => {
    for (const project of projects) {
      for (const skill of project.stack) {
        expect(skills.has(skill), `${project.slug}: ${skill}`).toBe(true);
      }
    }
  });

  it("has no stack for a project that is not in the catalogue", () => {
    const slugs = new Set(projects.map((project) => project.slug));
    for (const slug of Object.keys(PROJECT_STACKS)) {
      expect(slugs.has(slug), slug).toBe(true);
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
