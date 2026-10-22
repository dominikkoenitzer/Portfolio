import { ContrastDemo, VisionDemo } from "../demos/spectrum";
import type { Story } from "../types";

const HUE_TEST = `it('changes name exactly once per band boundary', () => {
  // …
  let flips = 0;
  for (let h = 1; h < 360; h++) {
    if (getHueName(h) !== getHueName(h - 1)) flips++;
  }
  // …
  expect(flips).toBe(9);
});`;

/** Spectrum: a mid-sized story, two live demos between real captures. */
export const story: Story = {
  lead: "Eight colour tools in one browser app that runs entirely in the tab, so a picture never leaves the computer.",
  hero: {
    name: "spectrum-hero",
    width: 3200,
    height: 2000,
    alt: "Spectrum's picker: an example picture with five marked points, each colour listed with its hex code and a name, beside the drop zone",
  },
  opening: [
    "Picking a colour used to mean five browser tabs, each doing one trick and none talking to the others. In Spectrum they are one site.",
    "A picture you drop in is drawn onto a canvas in the tab, and every pick reads one pixel back from it. With no server behind it, a picture from a site that will not share it is refused, not fetched through a proxy.",
  ],
  sections: [
    {
      id: "vision",
      heading: "Hue alone does not survive a missing cone",
      blocks: [
        "The simulator runs the published matrices of Machado, Oliveira and Fernandes over every pixel, one for each missing or weak cone, on linear light.",
        "The palette tool turns that into a check. It looks at every pair of colours under each full colour blindness and names the pairs that land closer than 0.05 in OKLab, two and a half just-noticeable steps.",
        { Demo: VisionDemo },
      ],
    },
    {
      id: "chrome",
      heading: "The interface has no colour of its own",
      blocks: [
        "Colours around a swatch change how it looks, so I took them out of the interface. The page is a greige paper tone, #e8e6e2, text and buttons are near-black ink, and the only saturated thing on screen is the colour being worked on.",
        {
          pair: [
            {
              name: "spectrum-generator",
              width: 3200,
              height: 2000,
              crop: [0.15, 0.09, 0.6, 0.5],
              alt: "Spectrum's colour generator with #2596be entered: a large blue swatch, its values in five formats and its place on a hue bar",
            },
            {
              name: "spectrum-gradients",
              width: 3200,
              height: 2000,
              crop: [0.15, 0.09, 0.6, 0.5],
              alt: "Spectrum's gradient maker: a blue to violet linear gradient at 90 degrees, with the type, direction and presets below",
            },
          ],
          caption: "The generator and the gradient maker: grey paper and black ink, and the colour itself the only colour.",
        },
      ],
    },
    {
      id: "contrast",
      heading: "Contrast is measured as it looks on screen",
      blocks: [
        "Many colours in an interface are translucent, and a checker that reads them as written measures something nobody sees. Spectrum paints a translucent background onto white, the foreground onto that, and only then takes the ratio. The APCA value and the suggested fixes go through the same blend.",
        { Demo: ContrastDemo },
      ],
    },
    {
      id: "names",
      heading: "Hue 200 used to be two colours",
      blocks: [
        "Three tables of hue names used to disagree: hue 200 was Blue in one tool and Cyan in another. Now there is one table with nine names, and a test walks the wheel one degree at a time so a second table cannot creep back in.",
        {
          code: {
            file: "src/lib/color.test.ts",
            text: HUE_TEST,
            caption: "Nine changes around the wheel, not eight: red owns both ends, at 0 and from 345 degrees.",
          },
        },
      ],
    },
  ],
};
