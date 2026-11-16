import { describe, expect, it } from "vitest";

import { keepFocus } from "./keep-focus";

type Node = { name: string };

function setup(focused: string) {
  const calls: string[] = [];
  const doc = { activeElement: { name: focused } as Node | null };
  const holder = (...names: string[]) => ({
    ownerDocument: doc,
    contains: (node: Node | null) => node !== null && names.includes(node.name),
  });
  const target = (name: string) => ({
    focus: (options?: FocusOptions) => {
      calls.push(`focus ${name} ${JSON.stringify(options)}`);
      doc.activeElement = { name };
    },
  });
  // React commits after the handler; a control that leaves drops the focus to the body.
  const leave = () => {
    calls.push("press");
    doc.activeElement = { name: "body" };
  };
  return { calls, doc, holder, target, leave };
}

describe("keepFocus", () => {
  it("hands focus to the next control without a scroll after the press", () => {
    const { calls, holder, target, leave } = setup("cancel");
    keepFocus(holder("cancel"), target("remove"), leave);
    expect(calls).toEqual(["press", 'focus remove {"preventScroll":true}']);
  });

  it("reads where the focus was before the press moves it", () => {
    const { calls, doc, holder, target, leave } = setup("reset");
    keepFocus(holder("reset"), target("card"), leave);
    expect(doc.activeElement).toEqual({ name: "card" });
    expect(calls).toContain('focus card {"preventScroll":true}');
  });

  it("counts focus on any control of a group", () => {
    const { calls, holder, target } = setup("good");
    keepFocus(holder("again", "hard", "good", "easy"), target("card"));
    expect(calls).toEqual(['focus card {"preventScroll":true}']);
  });

  it("leaves the focus alone when the pressed control did not hold it", () => {
    const { calls, doc, holder, target, leave } = setup("body");
    keepFocus(holder("draw"), target("stage"), leave);
    expect(calls).toEqual(["press"]);
    expect(doc.activeElement).toEqual({ name: "body" });
  });

  it("still runs the press when a control is not mounted", () => {
    const { calls, holder, target, leave } = setup("start");
    keepFocus(null, target("desktop"), leave);
    keepFocus(holder("start"), null, leave);
    expect(calls).toEqual(["press", "press"]);
  });
});
