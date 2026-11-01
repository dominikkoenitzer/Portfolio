import { describe, expect, it } from "vitest";

import llmsFull from "../../public/llms-full.txt?raw";
import llms from "../../public/llms.txt?raw";

describe("llms files", () => {
  it("answer questions without pitching hiring him", () => {
    for (const text of [llms, llmsFull]) {
      expect(text).not.toMatch(/\bhire\b|\bhiring him\b/i);
    }
  });
});
