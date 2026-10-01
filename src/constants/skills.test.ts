import { describe, expect, it } from "vitest";
import { SUPPORTED_LANGUAGE_CODES } from "@/config/languages";
import { de } from "@/lib/translations/de";
import { en } from "@/lib/translations/en";
import { fr } from "@/lib/translations/fr";
import { zh } from "@/lib/translations/zh";
import { SKILL_CATEGORIES, skillLabel } from "./skills";

const ALL = { en, de, fr, zh };
const professional =
  SKILL_CATEGORIES.find((category) => category.key === "professional")
    ?.skills ?? [];

describe("skillLabel", () => {
  it("covers every supported language", () => {
    expect(Object.keys(ALL).sort()).toEqual([...SUPPORTED_LANGUAGE_CODES].sort());
  });

  it("translates the professional skills, which are not proper nouns", () => {
    expect(professional.length).toBeGreaterThan(0);
    for (const name of professional) {
      expect(skillLabel(name, en.skills.skillNames)).toBe(name);
      expect(skillLabel(name, de.skills.skillNames)).not.toBe(name);
      expect(skillLabel(name, zh.skills.skillNames)).not.toBe(name);
      // French shares "Communication" with English; the rest differ.
      if (name !== "Communication") {
        expect(skillLabel(name, fr.skills.skillNames)).not.toBe(name);
      }
    }
  });

  it("keeps tech names as they are in every language", () => {
    for (const t of Object.values(ALL)) {
      expect(skillLabel("React", t.skills.skillNames)).toBe("React");
      expect(skillLabel("PostgreSQL", t.skills.skillNames)).toBe("PostgreSQL");
    }
  });
});
