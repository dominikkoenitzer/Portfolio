import { LayoutsDemo, StopDemo, TilingDemo } from "../demos/mochi";
import type { Story } from "../types";

/** Mochi, written as a case study around its live demos. */
export const story: Story = {
  opening: [
    "Mochi is a tiling window manager for Windows. Every window gets a tile, the tiles always fill the screen, and you move between them from the keyboard instead of dragging them around.",
    "It is also the only window manager I use. There is no fallback installed and nothing to switch back to on a bad day, so if Mochi ever loses a window, that window is gone until I find it. That one fact shaped more of the design than any feature did.",
    { Demo: TilingDemo },
    "Start tiles them in BSP, the default layout. The first window takes half the screen with a cut from top to bottom, the next takes half of what is left with a cut across, and the cuts keep alternating, so every new window halves the space the one before it left.",
  ],
  sections: [
    {
      id: "hiding",
      heading: "Hiding windows, and finding them again",
      blocks: [
        "Workspaces mean hiding windows. Switch away and Mochi takes the old workspace's windows off the screen. If Mochi were killed at that moment, those windows would stay hidden, and nothing on the desktop would know they exist.",
        "So every change to the hidden set is written to a small file, and the next start puts those windows back before doing anything else. Windows reuses window handles, so a record is only trusted if its window still exists and still belongs to the same process and class. The file is written under a temporary name, flushed to disk and then renamed into place, because a power cut halfway through a plain write leaves a record that does not parse and windows that nothing names anymore.",
        "The deliberate way out is one shortcut. Alt+Shift+E stops Mochi, shows every window it was hiding, takes its borders down and gives the keys back.",
        { Demo: StopDemo },
      ],
    },
    {
      id: "layouts",
      heading: "Seven layouts",
      blocks: [
        "BSP is one of seven layouts, and Alt+Shift+V steps through them: columns and rows, a main window beside a stack of the rest, a grid, and a version for ultrawide screens that keeps the main window in the middle.",
        { Demo: LayoutsDemo },
        "The layouts live in a crate with no Windows code in it at all. A layout is a function from an area and a number of windows to rectangles, so it is tested like any library: for every layout and one to six windows, the rectangles cover the area exactly, with no overlap and nothing left over. The gaps between windows are added afterwards, when the rectangles are placed.",
        "Real windows have opinions, though. Some refuse to get narrower than they like. Mochi asks each window for its minimum size and lays the others out around it, and a window that cannot fit anywhere keeps its own size rather than being squeezed into a tile it would overflow.",
      ],
    },
    {
      id: "motion",
      heading: "Smooth is a timer problem",
      blocks: [
        "Windows slide into their tiles instead of jumping. The first animations stuttered, and the drawing was never the problem. A program's default timer ticks so coarsely that a wait meant to last a sixtieth of a second takes about 31 milliseconds.",
        "Mochi raises the timer resolution to one millisecond only while something moves, and lets it go when the window lands. Borders move before their windows, so a border never trails the window it frames.",
      ],
    },
    {
      id: "testing",
      heading: "Tested on a real desktop",
      blocks: [
        "Unit tests prove the arithmetic. They cannot prove that a real window ended up where the arithmetic said. So the end-to-end suite opens throwaway windows, presses real keys and checks where the windows actually went, on a real Windows desktop, on every push. If those tests skip, the job fails, because a test that returns early still reports as passed.",
        "The suite also holds a budget. From opening a window to seeing it tiled takes a median of 27 milliseconds. An idle Mochi uses no measurable CPU. A hundred windows cost 44 KiB and not one extra handle.",
        "Then I ran it on my own desktop, and the first supervised day found what no test had: a window Mochi was hiding could be forgotten without ever being shown again. It is fixed and covered now, which is the whole argument for running software and not only testing it.",
      ],
    },
    {
      id: "now",
      heading: "Borders, and nothing else",
      blocks: [
        "Mochi draws a border around the focused window and nothing more. No bar, no tab strip, no workspace number in a corner, and none is planned. When a window is not being tiled and it is not obvious why, mochic why says what Mochi makes of it, in words rather than log lines.",
        {
          still: {
            name: "mochi-desktop",
            width: 1600,
            height: 1000,
            alt: "Mochi tiling three windows on a dark desktop: Remnants with source code on the left, Jester and a PowerShell terminal stacked on the right, the terminal with a pink border",
            caption: "Remnants, Jester and a PowerShell terminal, tiled by Mochi on my own desktop. The terminal has the focus.",
          },
        },
        "It runs as a normal user and asks for no admin rights. Windows does not let it move a window that belongs to an elevated program, so Mochi notices, says so once in its log and leaves that window alone instead of tiling around a hole it cannot fill. It is eight crates and more than a thousand tests, and it has arranged every window on my screen since September.",
      ],
    },
  ],
};
