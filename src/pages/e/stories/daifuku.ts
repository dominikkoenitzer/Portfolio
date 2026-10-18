import { FleetDemo, JumpDemo } from "../demos/daifuku";
import type { Story } from "../types";

/** Daifuku, written as a case study around its live demos. */
export const story: Story = {
  opening: [
    "I run several AI coding agents at the same time, each in its own terminal. Most of the time they work on their own. Every so often one of them stops to ask a question, and then it waits, silently, until someone answers. With six terminals on screen, that someone was always me, a few minutes too late.",
    "Daifuku fixes the noticing. Ctrl+Alt+Enter opens a fleet of terminals in a grid on the monitor I choose, and every terminal's border shows what its agent is doing: blue while it works, yellow when it needs an answer, green when it is done, red when it failed.",
    { Demo: FleetDemo },
    "The grid in that demo is Daifuku's own planner. The shape whose cells come closest to a terminal's natural 1.3 aspect wins, with a cost for every empty cell. At a smaller cost, four terminals came out three on top and one stretched below, which looks broken. Five still get three and two, and the short row shares the full width rather than leaving a hole in the corner.",
  ],
  sections: [
    {
      id: "window",
      heading: "Which window is the agent in?",
      blocks: [
        "An agent reports its state through a hook, a small program it starts on every change. To colour the right border, the hook has to find the terminal window it runs in, and the obvious way does not work: every terminal window on the desktop belongs to one and the same process, so a process id says nothing about which window.",
        "The agent's console does. It is a hidden pseudo console window, and the terminal makes the window that hosts the tab its owner, so the hook walks from the console to its owner. The first real demo found the catch. An agent can start before its terminal is ready, and for that moment the only window its console points at is the hidden one, visible by its own account and zero pixels wide. All six demo agents named it. Now the hook never accepts that window, and the daemon follows it to its owner once the owner exists.",
        {
          still: {
            name: "daifuku-fleet",
            width: 1600,
            height: 1000,
            alt: "Six terminals in a three by two grid on a 4K monitor, their borders blue, yellow, green and red",
            caption: "Daifuku's six scripted demo agents on a 4K monitor, each border set by its agent.",
          },
        },
      ],
    },
    {
      id: "jump",
      heading: "From colour to the right window",
      blocks: [
        "Colour tells me that something needs me. Ctrl+Alt+N tells me which: it jumps to the agent that has waited longest, then to the next, then to the ones that failed. Waiting is tracked per tab, so two agents in one window cannot hide each other, and a waiting border breathes slowly, the one thing on screen that moves.",
        { Demo: JumpDemo },
      ],
    },
    {
      id: "colour",
      heading: "Colour is never the only signal",
      blocks: [
        "With colour alone, anyone with red-green colour blindness would be left guessing between done and failed. So every state is also drawn at a width of its own, each thicker than the one before: done, working, failed, waiting. Take the colour away in the demo above and the four still read.",
        "A colour-blind palette is one setting away, a high contrast theme hands the borders the theme's own colours, and a chime can play when an agent starts waiting, for when I am not looking at all.",
      ],
    },
    {
      id: "elevation",
      heading: "Elevated, so nothing ordinary steers it",
      blocks: [
        "The daemon has to run elevated, because Windows does not let an ordinary process move an administrator's window or draw beside it. That makes it a target: anything that can change what it starts gets administrator rights for free.",
        "So nothing an ordinary program can touch decides what it starts. The binaries live in Program Files, the config in a folder only administrators can write, commands arrive on a pipe only elevated processes can open, and the terminal is found through its installed package, never through PATH. The hooks get a pipe of their own, and the worst a message on it can do is change the colour of a border.",
      ],
    },
    {
      id: "now",
      heading: "Measured on a real desktop",
      blocks: [
        "The logic is unit tested like any library, but the bugs that mattered only showed on a real screen. A border lagged two seconds behind a moved window, because Windows delivers window events inside the message wait without ever ending it. Focus switches reported success and quietly did nothing. A window placed by its rectangle came out off by its invisible resize border.",
        "Each of those is fixed and pinned by a check, and CI runs the whole path on a real Windows desktop on every push. Daifuku is five crates and 387 tests, it runs beside Mochi without either getting in the other's way, and it is how I work every day.",
      ],
    },
  ],
};
