import type { ComponentType } from "react";

/**
 * A real capture of the app. The files live in `public/projects/e/` as
 * `<name>-<width>.avif|webp|jpg`, written by `scripts/gen-story-stills.ts`
 * from the original capture.
 */
export type Still = {
  name: string;
  /** The night-theme capture, where the app has one. */
  dark?: string;
  /** The original capture's pixel size, which reserves the space. */
  width: number;
  height: number;
  alt: string;
  /** Under the picture; a still inside a pair takes the pair's caption instead. */
  caption?: string;
  /** The part shown on the page, as fractions of the capture [left, top, right, bottom]; the whole of it opens on click. */
  crop?: [number, number, number, number];
};

/** A headline number: the value set large, what it counts in a few words below. */
export type Figure = { value: string; label: string };

/** A short excerpt from the real source, where it shows a decision better than prose. */
export type Code = {
  /** The file it comes from, as the path inside the repository. */
  file: string;
  text: string;
  caption: string;
};

/** One row of a points list: a term (a key, a command, a rule's name) and one line about it. */
export type Point = { term: string; text: string };

/**
 * One piece of a story. Each form shows a different kind of thing: words, the
 * app working (a live demo), the app as it looks (a still, or two side by
 * side), what it adds up to (figures), how it is made (code), or what it
 * answers to (points).
 */
export type Block =
  | string
  | { Demo: ComponentType }
  | { still: Still }
  | { pair: [Still, Still]; caption: string }
  | { figures: Figure[] }
  | { code: Code }
  | { points: Point[] };

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
  /** One sentence under the name: what it is, plainly. */
  lead: string;
  /** The app as it really looks, shown wide under the header. */
  hero: Still;
  /** After the picture, before the first heading: why it matters. */
  opening: Block[];
  sections: StorySection[];
};
