import { describe, expect, it } from "vitest";

import curriculumVitae from "../../public/cv/curriculum-vitae.html?raw";
import lebenslauf from "../../public/cv/lebenslauf.html?raw";
import llmsFull from "../../public/llms-full.txt?raw";
import llms from "../../public/llms.txt?raw";

describe("public documents", () => {
  it("links no address over plain http from the CV files", () => {
    expect(curriculumVitae).not.toMatch(/href="http:\/\//);
    expect(lebenslauf).not.toMatch(/href="http:\/\//);
  });

  it("gives both llms files the same review date", () => {
    const date = (text: string) => text.match(/Last reviewed:? (\d{4}-\d{2}-\d{2})/)?.[1];
    expect(date(llms)).toBeTruthy();
    expect(date(llms)).toBe(date(llmsFull));
  });
});
