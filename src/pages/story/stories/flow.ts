import type { Still, Story } from "../types";

// From HighResTimer::PreciseDelayMs in src/FlowEngine.cpp, its comments left
// out. The target it spins towards is set just above: the start plus the delay.
const DELAY_CODE = `if (milliseconds > 2) {
    DWORD remaining = milliseconds - 2;
    while (remaining > 0) {
        if (cancel && cancel->load()) return;
        const DWORD slice = remaining > 50 ? 50 : remaining;
        Sleep(slice);
        remaining -= slice;
    }
}
do {
    if (cancel && cancel->load()) return;
    QueryPerformanceCounter(&now);
} while (now.QuadPart < target);`;

/** Two captures of the same window from Flow's download page, cut to the record and playback half. */
const WINDOW_TOP: Still["crop"] = [0, 0, 1, 0.585];

/** Flow, a small project: its timing, its hand-drawn window, its file format and its build. */
export const story: Story = {
  lead: "A macro recorder and auto-clicker for Windows, written in C++17 straight on Win32 and shipped as one exe.",
  hero: {
    name: "flow-hero",
    width: 1600,
    height: 1000,
    alt: "Flow's window: Record on F8, Play on F9 with speed and loop settings, and the auto-clicker set to a 10 ms interval",
    caption: "Flow's one window: record and play back on F8 and F9, and the auto-clicker at 10 ms, about 100 clicks a second.",
  },
  opening: [
    "Every auto-clicker I could find online was either spyware or a forum download from 2009, so I wrote my own. Flow records mouse moves, clicks, the wheel and keys with microsecond timestamps, replays them at any speed and loop count, and runs a separate auto-clicker.",
    "Playback sends every mouse move as an absolute point on the whole virtual desktop, so a click lands on the same pixel on every monitor.",
  ],
  sections: [
    {
      id: "timing",
      heading: "Sleep through the wait, spin the last two milliseconds",
      blocks: [
        "A macro is only as good as the gaps between its events. Sleep alone is far too coarse for them, and a pure busy-wait keeps a CPU core at full load through every pause. So each delay runs towards an absolute target on QueryPerformanceCounter: Flow sleeps through most of it and spins only the tail.",
        {
          code: {
            file: "src/FlowEngine.cpp",
            text: DELAY_CODE,
            caption: "The auto-clicker's wait: the sleep stops 2 ms short, in 50 ms slices so Stop works mid-pause; the loop spins the rest.",
          },
        },
        "Playback places every event on one clock for the whole loop, so the time spent sending input never adds up over a long macro.",
      ],
    },
    {
      id: "window",
      heading: "No framework: every control is drawn by hand",
      blocks: [
        "The window is raw Win32 with GDI+ for the anti-aliased shapes, and every button, switch and number field is owner-drawn.",
        "Painting and control creation used to keep their own coordinates, and a nudge to one drifted silently from the other. Now both read the layout from one header, Theme.h, in units at 96 DPI, scaled again when the window reaches a monitor with another scale.",
        {
          pair: [
            {
              name: "flow-recording",
              width: 694,
              height: 1203,
              crop: WINDOW_TOP,
              alt: "Flow while recording: the status reads Recording in red, the button Stop Recording, with 310 events and 6.7 s recorded",
            },
            {
              name: "flow-playing",
              width: 694,
              height: 1203,
              crop: WINDOW_TOP,
              alt: "Flow while playing back: the status reads Playing in green, the button Stop Playback, at speed 2 and 5 loops",
            },
          ],
          caption: "Recording, then playing back: the status and the Record and Play buttons are repainted for each state.",
        },
      ],
    },
    {
      id: "file",
      heading: "A .rec file is checked before it is believed",
      blocks: [
        "A macro is saved as a FLOW header, a format version, an event count and then every event at a fixed width. A broken download can declare any count it likes, so LoadMacro decodes into a scratch list and refuses the file at the first thing that does not add up, leaving the macro already loaded in place.",
        {
          points: [
            { term: "Header", text: "Must start with FLOW; a format newer than this build is refused." },
            { term: "Count", text: "Must fit the bytes left, checked before anything is allocated." },
            { term: "Payload", text: "Must hold every event it declares, to the last byte." },
            { term: "Timestamps", text: "May never step back, or a gap underflows into centuries." },
            { term: "Old files", text: "The first format, in whole milliseconds, still loads." },
          ],
        },
      ],
    },
    {
      id: "build",
      heading: "One exe, checked by CI",
      blocks: [
        "Windows keeps an ordinary process from recording or clicking into programs that run elevated, so the manifest asks for administrator rights. The build links statically: without that, std::thread pulls in a MinGW DLL and the exe will not start on a machine without MinGW.",
        "CI runs the tests and fails if objdump finds a MinGW runtime DLL among the imports, or if the manifest did not make it into the binary.",
      ],
    },
  ],
};
