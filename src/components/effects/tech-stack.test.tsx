import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";

import { getTechIcon } from "@/components/ui/tech-badge";
import { getProject } from "@/constants/projects";
import { ProjectTechLoop } from "./tech-stack";

const entropy = getProject("entropy", "en")!;
const names = [...new Set([...entropy.stack, ...entropy.tags])].filter((name) =>
  getTechIcon(name),
);

const render = (reduce: boolean) => {
  vi.stubGlobal("window", {
    matchMedia: (query: string) => ({
      matches: reduce && query === "(prefers-reduced-motion: reduce)",
    }),
  });
  return renderToStaticMarkup(createElement(ProjectTechLoop, { project: entropy }));
};

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("ProjectTechLoop", () => {
  it("lists every logo once and outside the moving track under reduced motion", () => {
    const html = render(true);
    expect(names.length).toBeGreaterThan(5);
    expect(html).not.toContain("logoloop__track");
    for (const name of names) {
      expect(html.split(`>${name}<`).length - 1, name).toBe(1);
    }
  });

  it("keeps the moving strip with motion on", () => {
    const html = render(false);
    expect(html).toContain("logoloop__track");
    for (const name of names) {
      expect(html, name).toContain(`>${name}<`);
    }
  });
});
