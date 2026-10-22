import { LayoutsDemo, StopDemo, TilingDemo } from "../demos/mochi";
import type { Story } from "../types";

/** Mochi, written as a case study around its live demos. */
export const story: Story = {
  lead: "A tiling window manager for Windows: every window gets a tile, the tiles fill the screen, and the keyboard moves between them.",
  hero: {
    name: "mochi-hero",
    width: 1600,
    height: 1000,
    alt: "Mochi tiling three windows on a dark desktop: Remnants with source code on the left, Jester and a PowerShell terminal stacked on the right, the terminal with a pink border",
    caption: "Remnants, Jester and a terminal, tiled by Mochi on my own desktop. The pink border marks the focus.",
  },
  opening: [
    "Mochi is the only window manager I use, with nothing installed to fall back to. If it ever loses a window, that window is gone until I find it, and that one fact shaped more of the design than any feature did.",
    { Demo: TilingDemo },
  ],
  sections: [
    {
      id: "keys",
      heading: "Everything from the keyboard",
      blocks: [
        "Alt is the one modifier, and the letters are the ones a programmer's hands already know. Alt with an arrow is left alone on purpose, because browsers use it for Back and Forward.",
        {
          points: [
            { term: "Alt + H J K L", text: "Focus the window to the left, below, above or to the right." },
            { term: "Alt + Shift + H J K L", text: "Move the focused window that way." },
            { term: "Alt + 1 to 9", text: "Switch workspace; with Shift, take the window along." },
            { term: "Alt + Shift + V", text: "Step through the seven layouts." },
            { term: "Alt + Shift + E", text: "Stop Mochi and put every window back." },
          ],
        },
      ],
    },
    {
      id: "layouts",
      heading: "Seven layouts, tested as arithmetic",
      blocks: [
        "The layouts live in a crate with no Windows code in it. A layout turns an area and a number of windows into rectangles, so it is tested like any library: for every layout and one to six windows, the rectangles cover the area exactly, with no overlap and nothing left over.",
        { Demo: LayoutsDemo },
      ],
    },
    {
      id: "measured",
      heading: "Smooth is a timer problem",
      blocks: [
        "Windows slide into their tiles. The first animations stuttered, and the drawing was never the cause: a program's default timer is so coarse that a wait meant to last a sixtieth of a second takes about 31 ms. Mochi raises the timer to 1 ms only while something moves.",
        "An end-to-end suite opens throwaway windows, presses real keys and checks where the windows went, on a real Windows desktop on every push, and a latency run prints the cost: a new window reaches its tile in a median of 27 ms.",
      ],
    },
    {
      id: "hiding",
      heading: "Hiding windows, and finding them again",
      blocks: [
        "Workspaces mean hiding windows. If Mochi were killed while windows are hidden, nothing on the desktop would know they exist. So every change to the hidden set goes to a small file, written under a temporary name and renamed into place, and the next start puts those windows back first.",
        { Demo: StopDemo },
      ],
    },
    {
      id: "now",
      heading: "Borders, and nothing else",
      blocks: [
        "Mochi draws a border around the focused window and nothing more: no bar, no tab strip, no workspace number in a corner. When a window is not being tiled and it is not obvious why, mochic why says what Mochi makes of it, in words rather than log lines. It has arranged every window on my screen since September.",
      ],
    },
  ],
};
