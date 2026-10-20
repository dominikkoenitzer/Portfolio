import { FleetDemo, JumpDemo } from "../demos/daifuku";
import type { Story } from "../types";

/** Daifuku, written as a case study around its live demos. */
export const story: Story = {
  lead: "A Windows tool for running many AI coding agents at once: one key opens a grid of terminals, and each border says what its agent is doing.",
  hero: {
    name: "daifuku-hero",
    width: 1600,
    height: 1000,
    alt: "Six terminals in a three by two grid, tabs named Administrator: demo 1 to demo 6, their borders blue, green, red and yellow",
    caption: "Daifuku's six scripted demo agents, each border set by its own agent.",
  },
  opening: [
    "I run several coding agents at the same time, each in its own terminal. Every so often one stops to ask a question and then waits, silently, until someone answers. With six terminals on screen, that someone was always me, a few minutes too late.",
    "Daifuku fixes the noticing. Ctrl+Alt+Enter opens the fleet in a grid on the monitor I choose, in the shape its planner picks: the cells closest to a terminal's natural 1.3 aspect, with a cost for every empty one.",
    { Demo: FleetDemo },
  ],
  sections: [
    {
      id: "states",
      heading: "Borders that say who needs you",
      blocks: [
        "Blue works, yellow waits for an answer, green is done, red failed. Colour alone would leave anyone with red-green colour blindness guessing between done and failed, so every state also has a width of its own, each thicker than the one before: done, working, failed, waiting.",
        {
          still: {
            name: "daifuku-fleet",
            width: 1600,
            height: 1000,
            crop: [0, 0.38, 0.34, 0.7],
            alt: "Two of Daifuku's terminals: one working with a blue border above, one waiting for an answer below with a yellow border twice as thick",
            caption: "Working above, waiting below: the waiting border is twice as thick, so the two read apart without colour.",
          },
        },
      ],
    },
    {
      id: "jump",
      heading: "From colour to the right window",
      blocks: [
        "Colour says that something needs me. Ctrl+Alt+N says which: it jumps to the agent that has waited longest, then the next, then the ones that failed. A waiting border breathes slowly, the one thing on screen that moves.",
        { Demo: JumpDemo },
      ],
    },
    {
      id: "elevation",
      heading: "Elevated, so nothing ordinary steers it",
      blocks: [
        "The daemon runs elevated, because Windows lets no ordinary process move an administrator's window. That makes it a target: whatever can change what it starts gets administrator rights for free. So nothing an ordinary program can touch decides what it starts.",
        {
          points: [
            { term: "Binaries", text: "Live in Program Files." },
            { term: "Config", text: "In a folder only administrators can write." },
            { term: "Commands", text: "Arrive on a pipe only elevated processes can open." },
            { term: "Terminal", text: "Found through its installed package, never through PATH." },
            { term: "Hooks", text: "Get a pipe of their own; the worst a message can do is recolour a border." },
          ],
        },
      ],
    },
    {
      id: "now",
      heading: "Measured on a real desktop",
      blocks: [
        "The bugs that mattered only showed on a real screen. A border lagged two seconds behind a moved window, because Windows delivers window events inside the message wait without ending it. An agent that started before its terminal was ready named a hidden console window zero pixels wide. Each is fixed and pinned by a check, and CI runs the whole path on a real Windows desktop on every push.",
        {
          figures: [
            { value: "458", label: "tests" },
            { value: "5", label: "crates" },
            { value: "4", label: "states, told apart without colour" },
          ],
        },
        "It runs beside Mochi without either getting in the other's way, and it is how I work every day.",
      ],
    },
  ],
};
