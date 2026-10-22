import { FaceDemo, SyncDemo } from "../demos/time";
import type { Story } from "../types";

/** The part of each capture that carries the date, the hour and the zone. */
const ZONE_CROP: [number, number, number, number] = [0.135, 0.3, 0.345, 0.7];

/** Time, told around its two moments: the correction and the face. */
export const story: Story = {
  lead: "A web clock that measures how wrong the device showing it is, and shows the true time anyway.",
  hero: {
    name: "time-hero",
    width: 3200,
    height: 2000,
    alt: "Time's one screen: 17:13:06 in large white digits with red square colons, the date and week above, Central European Standard Time and UTC+01:00 below",
  },
  opening: [
    "A clock on a web page usually reads the device's own clock, so a device that is a few seconds off shows the same mistake, neatly set. I wanted a clock that is right on any screen and says how far that screen is off.",
    { Demo: SyncDemo },
  ],
  sections: [
    {
      id: "fastest",
      heading: "The fastest of five trips sets the clock",
      blocks: [
        "Each trip is timed with the browser's monotonic clock, which a jumping device clock cannot corrupt. The server's stamp is placed halfway through the trip, so a sample is wrong by half its trip at most, and the shortest trip wins outright: an average would let one slow reply pull it off.",
        {
          code: {
            file: "lib/clock-sync.ts",
            text: `export function sampleOffsetMs(
  serverNowMs: number,
  startWallMs: number,
  rttMs: number
): number {
  return serverNowMs - (startWallMs + rttMs / 2)
}

export function pickBestSample(samples: readonly SyncSample[]): SyncSample {
  return samples.reduce((a, b) => (b.rttMs < a.rttMs ? b : a))
}`,
            caption: "The whole correction: the stamp placed halfway through the trip, and the fastest sample taken as it is.",
          },
        },
        "It measures again when the wall clock jumps more than a second against the monotonic one, as it does when a laptop wakes.",
      ],
    },
    {
      id: "server",
      heading: "The server checks its own clock first",
      blocks: [
        "Correcting a visitor against a server only helps if the server is right, and a serverless host can sit a second off. So before it answers, the endpoint measures its own host, keeps that offset for five minutes, and says where it came from.",
        {
          points: [
            { term: "UDP", text: "Three public time servers raced; the first usable reply wins." },
            { term: "HTTP", text: "When UDP is blocked. Good to tens of milliseconds." },
            { term: "Neither", text: "The host's raw clock, labelled uncorrected." },
            { term: "Refusals", text: "A refusing server sends zeroed stamps that read as 1900; they are dropped first." },
          ],
        },
      ],
    },
    {
      id: "face",
      heading: "Only the colons move",
      blocks: [
        "The digits change on the tick and nowhere else. The colons go dark for the last 100 ms of every second and light on the tick, locked to the corrected time rather than the device's.",
        { Demo: FaceDemo },
        "They are drawn, not typed. The font's colon is set for lowercase and hangs low between digits, so Time lays two squares over an invisible typed one: centred on the digits, and the face still copies as 17:13:06.",
      ],
    },
    {
      id: "zone",
      heading: "Nothing to set, wherever it opens",
      blocks: [
        "Time reads the visitor's zone and names it in full from the browser's own data, so it follows summer time in and out without a single timezone file.",
        {
          pair: [
            {
              name: "time-hero",
              width: 3200,
              height: 2000,
              crop: ZONE_CROP,
              alt: "Time in Zurich: Wednesday, 28 October 2026, the hour 17, Central European Standard Time, Device exact ±0.03 s",
            },
            {
              name: "time-tokyo",
              width: 3200,
              height: 2000,
              crop: ZONE_CROP,
              alt: "Time in Tokyo three seconds later: Thursday, 29 October 2026, the hour 01, Japan Standard Time, Device exact ±0.03 s",
            },
          ],
          caption: "Zurich, then Tokyo three seconds later, where it is already Thursday. Nothing on the page was set by hand.",
        },
      ],
    },
  ],
};
