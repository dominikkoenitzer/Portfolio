import { FleetDemo, GreyscaleDemo, JumpDemo } from "../demos/daifuku";
import type { Story } from "../types";

/** Daifuku told as a short essay with live demos. */
export const story: Story = {
  intro: [
    "A Windows tool for running many AI coding agents at once. One key opens a fleet of terminals in a grid, and each border says what its agent is doing.",
  ],
  Hero: FleetDemo,
  sections: [
    {
      id: "jump",
      heading: "Borders that say who needs you",
      index: "Who needs you",
      body: [
        "With six agents running, the hard part is noticing which one is waiting. Blue works, yellow waits for an answer, green is done, red failed. One key jumps to the agent that has waited longest, then to the ones that failed.",
      ],
      Demo: JumpDemo,
    },
    {
      id: "colour",
      heading: "Colour is never the only signal",
      index: "Without colour",
      body: [
        "Four states in four colours fails the first reader with red-green colour blindness. So every state also has its own border width, and the states still read in greyscale.",
      ],
      Demo: GreyscaleDemo,
    },
  ],
};
