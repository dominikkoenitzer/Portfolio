import type { ComponentType } from "react";

/** One section of a layout-e story: a claim, a few sentences, and a demo of it. */
export type StorySection = {
  /** Stable anchor for the index. */
  id: string;
  heading: string;
  /** A short label for the index, when the heading is too long for it. */
  index?: string;
  /** At most three short sentences, as one or two paragraphs. */
  body: string[];
  Demo: ComponentType;
};

/** A project told as a short essay with live demos (English in this preview). */
export type Story = {
  /** One or two sentences: what it is. */
  intro: string[];
  /** The app's key moment, right under the intro. */
  Hero: ComponentType;
  sections: StorySection[];
};
