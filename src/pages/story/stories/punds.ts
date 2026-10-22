import type { Story } from "../types";

// From src/realm/qualityStepper.ts, its comments left out.
const QUALITY_CODE = `export const SLOW_FPS = 30
export const FAST_FPS = 58

export const SLOW_WINDOWS_TO_STEP_DOWN = 2
export const FAST_WINDOWS_TO_STEP_UP = 4
export const COOLDOWN_WINDOWS = 4`;

/** Punds, a small project: how you move, what is generated, how it spares a weak device, the plain links. */
export const story: Story = {
  lead: "My link hub, built as a shrine garden on an island above the clouds and rendered live in the browser.",
  hero: {
    name: "punds-garden",
    width: 5184,
    height: 2160,
    crop: [0.1, 0, 0.9, 1],
    alt: "The start view: a stone path between two stone lanterns leads up steps to a red shrine under cedars, with red maples, cherry blossom and a rack of wooden plaques on the right",
    caption: "The start view: the stone path, the shrine ahead and the rack of plaques on the right.",
  },
  opening: [
    "I got tired of pasting five links every time someone asked what I had built, so I made one page that points at all of them, and refused to make it a list.",
    "It is a place instead. You stand on the stone path of a small shrine garden in the late afternoon and look around. The links hang on the rack as three wooden plaques.",
  ],
  sections: [
    {
      id: "moving",
      heading: "Nothing on the page depends on scrolling",
      blocks: [
        "The camera stays on the path. You look around with the pointer and walk up to things with a click, and every way in has a way back out.",
        {
          points: [
            { term: "Look", text: "Move the pointer toward an edge, or drag; on a phone, swipe." },
            { term: "Walk up", text: "Click the rack, the pond or the shrine." },
            { term: "Come back", text: "Esc, the browser's back button or a click elsewhere." },
            { term: "Plaques", text: "Pointing turns one on its cord, a click opens it; on a phone, two taps." },
            { term: "M", text: "Sound on or off. Wind and water are made from noise, and start silent." },
          ],
        },
      ],
    },
    {
      id: "generated",
      heading: "Built in code when the page loads",
      blocks: [
        "Grass, trees, lanterns, the wall, the shrine and the torii are generated in code; only the rocks are scanned models. The heavy, pure work, like the tree pictures and the grass, runs in background workers while the page waits for its images.",
        "Until the garden is ready, a picture of the same start view holds the screen, then crossfades into the live scene.",
        {
          still: {
            name: "punds-garden",
            width: 5184,
            height: 2160,
            crop: [0.1, 0.25, 0.5, 1],
            alt: "Beside the path: a stone lantern at the pond, grass and ferns, raked gravel, a low stone wall and a red maple in the late sun",
            caption: "The lantern, the wall, the maple and every blade of grass here are built in code at load.",
          },
        },
      ],
    },
    {
      id: "quality",
      heading: "Stepping down fast and up slowly",
      blocks: [
        "Frames are capped at 60, at 30 when nothing moves and on phones, and stop while the tab is hidden. Every 1.5 seconds the frame rate is sampled and the resolution moves between three tiers; the look stays the same. A device still below 14 frames a second at the lowest tier in its first half minute gets the still picture with the links instead.",
        "The decision is a pure function, walked through made-up frame-rate traces by 18 tests.",
        {
          code: {
            file: "src/realm/qualityStepper.ts",
            text: QUALITY_CODE,
            caption: "Uneven on purpose: two slow windows bring relief, a step up takes four fast ones, and every change waits out four.",
          },
        },
      ],
    },
    {
      id: "plain",
      heading: "The same three links, as plain HTML",
      blocks: [
        "The canvas is hidden from assistive technology. Underneath, the three links are written out for real, so a screen reader or a crawler gets them without the scene. Tab walks through them, and focusing one turns its plaque on the rack. Without WebGL, the same list shows over the still picture of the garden.",
      ],
    },
  ],
};
