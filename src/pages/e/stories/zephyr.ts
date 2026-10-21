import { QuickAddDemo, TimerDemo } from "../demos/zephyr";
import type { Story } from "../types";

/** Zephyr, told around its two moments: a typed line becoming a task, and a session as a day. */
export const story: Story = {
  lead: "A to-do list and a focus timer that keep everything in the browser: no account, no server, and offline once installed.",
  hero: {
    name: "zephyr-hero",
    width: 3200,
    height: 2000,
    alt: "Zephyr's dashboard on a Wednesday: seven open tasks, one overdue, 2h 30m of focus, a week of focus bars, the next task and the timer paused at 17:13",
  },
  opening: [
    "Every productivity app I tried wanted an account and a copy of my whole day on its server. Zephyr keeps every task and focus session in the browser, and once installed it works with the Wi-Fi off.",
    "Adding a task is one line, read on the device by plain pattern matching, with no network call behind it.",
    { Demo: QuickAddDemo },
  ],
  sections: [
    {
      id: "dates",
      heading: "Most of the parser is what it refuses",
      blocks: [
        "The date rules run from the most specific to the least, ISO dates first and bare weekdays last, and the first match wins. The harder part is the lines that only look like dates.",
        {
          points: [
            { term: "1/2 kg", text: "An amount before a unit, not the second of January." },
            { term: "buy sun cream", text: "A short weekday counts only after on, by or this, or at the end." },
            { term: "mars bars", text: "Not March: a month counts only as a whole word beside a day." },
            { term: "2/30", text: "No such day, so no date at all." },
            { term: "at 3pm", text: "Today while it is ahead, else tomorrow; the time stays in the title." },
          ],
        },
      ],
    },
    {
      id: "less",
      heading: "Two tools, and the rest came out",
      blocks: [
        "Zephyr used to carry notes, a journal and a calendar as well. I took them out one by one and kept the two tools I opened every day. The old addresses lead to the task list, and the old storage keys are still known, so a wipe still clears that data and an export still carries it.",
        {
          still: {
            name: "zephyr-tasks",
            width: 3200,
            height: 2000,
            crop: [0.175, 0.08, 0.71, 0.72],
            alt: "Zephyr's task list: an Add a task field, filters for today, overdue, upcoming and tags, and tasks grouped under Overdue, Today and Tomorrow with priority and day chips",
            caption: "The task list: every task under the day it is due, with the chips quick add fills in.",
          },
        },
      ],
    },
    {
      id: "sun",
      heading: "The timer is a sunset",
      blocks: [
        "Every timer has a progress ring, so mine is a day passing instead. A sun rises at the left end of a horizon, crosses the sky and sets as the session ends; on a break it is a moon.",
        { Demo: TimerDemo },
        "The sun rides one group that turns around the middle of the horizon, so each second is a single transform spread over the whole second, and the sun glides instead of ticking.",
      ],
    },
    {
      id: "store",
      heading: "Every view hears every write",
      blocks: [
        "There is no state library. Tasks, sessions and settings live in small services that write to local storage, and every write fires an event of its own, because the browser's storage event only reaches the other tabs.",
        {
          code: {
            file: "src/hooks/useStore.js",
            text: `useEffect(() => {
  window.addEventListener(CHANGE_EVENT, refresh);
  window.addEventListener('storage', refresh);
  window.addEventListener('focus', refresh);
  return () => {
    window.removeEventListener(CHANGE_EVENT, refresh);
    window.removeEventListener('storage', refresh);
    window.removeEventListener('focus', refresh);
  };
}, [refresh]);`,
            caption: "Each view re-reads on three signals: a write in this tab, a write in another, and the window coming back.",
          },
        },
      ],
    },
    {
      id: "bugs",
      heading: "Bugs that took a minute to show",
      blocks: [
        "Task ids used to be the current time, so two tasks quick-added in the same millisecond shared one, and deleting one deleted both. Reminders were held back by title for 60 seconds, exactly how often the poller ran, so every due task chimed again every minute. Ids are random UUIDs now, and each reminder is keyed to its task and its day.",
      ],
    },
  ],
};
