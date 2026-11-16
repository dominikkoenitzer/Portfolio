import { describe, expect, it } from "vitest";

import { techChipText } from "./tech-chip";
import { de } from "./translations/de";
import { en } from "./translations/en";
import { fr } from "./translations/fr";
import { zh } from "./translations/zh";

const copies = { en, de, fr, zh };

describe("techChipText", () => {
  it("fills in a plain technology", () => {
    expect(techChipText(en.projects.techFilter, "Rust")).toBe("Built with Rust");
  });

  it("shows dollar sequences from the address as typed", () => {
    for (const [code, t] of Object.entries(copies)) {
      for (const tech of ["a$$b", "$&", "x$'y", "x$`y"]) {
        const [before, after] = t.projects.techFilter.split("{tech}");
        expect(techChipText(t.projects.techFilter, tech), code).toBe(
          `${before}${tech}${after}`,
        );
      }
    }
  });
});
