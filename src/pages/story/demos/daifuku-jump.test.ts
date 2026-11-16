import { describe, expect, it } from "vitest";
import { jumpStatus } from "./daifuku-jump";

const start = { miss: false, needed: 0, visit: 0, focus: 0, label: "working", waiting: 0 };

describe("jumpStatus", () => {
  it("says nobody needs you after a miss while nobody does", () => {
    expect(jumpStatus({ ...start, miss: true })).toEqual({
      text: "Nobody needs you yet, so the focus stays where it is.",
      announce: true,
    });
  });

  it("names who waits once one agent waits after a miss", () => {
    expect(jumpStatus({ ...start, miss: true, needed: 1, waiting: 1 })).toEqual({
      text: "1 waiting. Ctrl+Alt+N goes to the one that has waited longest.",
      announce: false,
    });
  });

  it("says where Jump went after a visit", () => {
    expect(jumpStatus({ ...start, needed: 2, visit: 1, focus: 3, label: "waiting for you", waiting: 2 })).toEqual({
      text: "On demo 4: waiting for you.",
      announce: true,
    });
  });

  it("says the agents are at work before anything happens", () => {
    expect(jumpStatus(start)).toEqual({ text: "Six agents at work. Ctrl+Alt+N waits for one to need you.", announce: false });
  });
});
