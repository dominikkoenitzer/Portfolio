import type { ComponentType } from "react";

/**
 * A real capture of the app, shown whole in the demo box. The files live in
 * `public/projects/e/` as `<name>-<width>.avif|webp|jpg`, written by
 * `scripts/gen-story-stills.ts` from the original capture.
 */
export type Still = {
  name: string;
  /** The night-theme capture, where the app has one. */
  dark?: string;
  /** The original capture's pixel size, which reserves the space. */
  width: number;
  height: number;
  alt: string;
  caption: string;
};

/** One piece of a story: a paragraph, a live demo, or a still. */
export type Block = string | { Demo: ComponentType } | { still: Still };

/** One section of a story: a heading and whatever the text needs below it. */
export type StorySection = {
  /** Stable anchor for the index. */
  id: string;
  /** Also the section's entry in the index, word for word. */
  heading: string;
  blocks: Block[];
};

/** A project told as an essay with live demos and stills (English in this preview). */
export type Story = {
  /** Before the first heading: what it is and why it matters. */
  opening: Block[];
  sections: StorySection[];
};
