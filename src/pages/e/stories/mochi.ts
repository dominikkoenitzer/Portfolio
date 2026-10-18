import { LayoutsDemo, StopDemo, TilingDemo } from "../demos/mochi";
import type { Story } from "../types";

/** Mochi told as a short essay with live demos. */
export const story: Story = {
  intro: [
    "A tiling window manager for Windows, written in Rust. It lays every window out in tiles, moves between them from the keyboard, and gives every window back when it stops.",
  ],
  Hero: TilingDemo,
  sections: [
    {
      id: "layouts",
      heading: "Seven layouts, one key",
      index: "Layouts",
      body: [
        "The layouts live in a pure core with no Windows code in it, so they are tested like any library: every one tiles its area exactly, with no gap and no overlap.",
      ],
      Demo: LayoutsDemo,
    },
    {
      id: "leave",
      heading: "One key to leave",
      index: "Leaving",
      body: [
        "A tiling manager moves every window the moment it starts, so the way out matters more than the way in. Alt+Shift+E stops Mochi, shows every window it was hiding, takes the borders down and unbinds its keys. If it ever crashes, the next start brings hidden windows back first.",
      ],
      Demo: StopDemo,
    },
  ],
};
