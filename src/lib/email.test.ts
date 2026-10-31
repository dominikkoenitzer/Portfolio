import { describe, expect, it } from "vitest";

import { email, mailto } from "@/lib/email";
import { createPersonSchema } from "@/lib/seo-utils";
import { de } from "@/lib/translations/de";
import { en } from "@/lib/translations/en";
import { fr } from "@/lib/translations/fr";
import { zh } from "@/lib/translations/zh";

import shell from "../../index.html?raw";
import humans from "../../public/humans.txt?raw";
import llmsFull from "../../public/llms-full.txt?raw";
import llms from "../../public/llms.txt?raw";
import security from "../../public/.well-known/security.txt?raw";

const ADDRESS = /[\w.+-]+@[\w-]+\.[a-z]{2,}/i;

describe("email", () => {
  it("joins to one address", () => {
    expect(email()).toMatch(new RegExp(`^${ADDRESS.source}$`, "i"));
    expect(mailto("?subject=Hi")).toBe(`mailto:${email()}?subject=Hi`);
  });

  it("stays out of the served files and the bundled strings", () => {
    for (const text of [shell, humans, llms, llmsFull, security]) {
      expect(text).not.toMatch(ADDRESS);
    }
    expect(JSON.stringify(createPersonSchema())).not.toMatch(ADDRESS);
    for (const t of [de, en, fr, zh]) {
      expect(JSON.stringify(t)).not.toMatch(ADDRESS);
    }
  });

  it("keeps a valid contact in security.txt", () => {
    expect(security).toMatch(/^Contact: https:\/\/\S+$/m);
  });
});
