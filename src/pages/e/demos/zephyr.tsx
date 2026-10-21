import { type ReactNode, useEffect, useId, useRef, useState } from "react";
import { Action, BarText, Demo, Frame, Pills } from "../kit";
import { useMotionSafe, useSeenOnce } from "../motion";
import "./zephyr.css";

/*
 * Zephyr, told through its key moments, in its own look (zephyr.css): warm
 * stone, white cards, one apricot accent, indigo night for the timer, and its
 * dark theme when the page is dark. The parser below is
 * Zephyr's quickParse.js, ported line for line; the dial is its SunDial.
 */

const Z = {
  stone: "hsl(var(--z-bg))",
  card: "hsl(var(--z-card))",
  ink: "hsl(var(--z-ink))",
  muted: "hsl(var(--z-muted))",
  accent: "hsl(var(--z-accent))",
  primaryStrong: "hsl(var(--z-primary-strong))",
  primaryTint: "hsl(var(--z-primary) / 0.14)",
  heroFrom: "hsl(var(--z-hero-from))",
  heroTo: "hsl(var(--z-hero-to))",
  heroText: "hsl(var(--z-hero-text))",
  sun: "hsl(var(--z-sun))",
};

/* ------------------------------------------------------------------ */
/* Quick add: Zephyr's parser                                          */
/* ------------------------------------------------------------------ */

const WEEKDAYS = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
const WEEKDAY_ALIASES: Record<string, number> = { sun: 0, mon: 1, tue: 2, tues: 2, wed: 3, thu: 4, thur: 4, thurs: 4, fri: 5, sat: 6 };
const MONTHS = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
const MONTH_WORD =
  "(?:january|february|march|april|may|june|july|august|september|october|november|december|jan|feb|mar|apr|jun|jul|aug|sept|sep|oct|nov|dec)";
const YEAR = "(?:,?\\s+(\\d{4}))?";
const SHORT_DAY = `(?:${Object.keys(WEEKDAY_ALIASES).join("|")})`;
const TIME = "(?:at\\s+)?(?:\\d{1,2}(?::[0-5]\\d)?\\s*(?:am|pm)|\\d{1,2}:[0-5]\\d)";
const UNIT = "(?:kg|g|l|ml|cups?|tsp|tbsp|lb|oz|m|km|cm|h|min|x)";

const PRIORITY_MAP: Record<string, "high" | "medium" | "low"> = {
  "!high": "high", "!h": "high", "!1": "high", p1: "high",
  "!medium": "medium", "!med": "medium", "!m": "medium", "!2": "medium", p2: "medium",
  "!low": "low", "!l": "low", "!3": "low", p3: "low",
};

const pad = (n: number) => String(n).padStart(2, "0");
const toISODate = (date: Date) => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
const startOfToday = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};
const addDays = (date: Date, days: number) => {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
};
const nextWeekday = (targetDow: number, allowToday = false) => {
  const today = startOfToday();
  const diff = (targetDow - today.getDay() + 7) % 7;
  return addDays(today, diff === 0 && !allowToday ? 7 : diff);
};
const collapse = (text: string) => text.replace(/\s{2,}/g, " ").trim();
const realDate = (year: number, monthIndex: number, day: number) => {
  const d = new Date(year, monthIndex, day);
  return d.getFullYear() === year && d.getMonth() === monthIndex && d.getDate() === day ? d : null;
};
const timeOfDay = (text: string) => {
  const twelve = text.match(/(^|\s)(?:at\s+)?(\d{1,2})(?::([0-5]\d))?\s*(am|pm)(?=\s|$)/i);
  if (twelve) {
    const hour = Number(twelve[2]);
    if (hour < 1 || hour > 12) return null;
    const pm = twelve[4].toLowerCase() === "pm";
    return ((hour % 12) + (pm ? 12 : 0)) * 60 + Number(twelve[3] || 0);
  }
  const clock = text.match(/(^|\s)(?:at\s+)?([01]?\d|2[0-3]):([0-5]\d)(?=\s|$)/i);
  if (clock) return Number(clock[2]) * 60 + Number(clock[3]);
  return null;
};

type Parsed = { title: string; dueDate: string | null; priority: "high" | "medium" | "low" | null; tags: string[] };

function parseQuickTask(input: string): Parsed {
  const result: Parsed = { title: "", dueDate: null, priority: null, tags: [] };
  if (!input) return result;
  let text = ` ${input} `;

  text = text.replace(/(^|\s)#([\p{L}\d_-]+)/gu, (_, lead: string, tag: string) => {
    const clean = tag.toLowerCase();
    if (!result.tags.includes(clean)) result.tags.push(clean);
    return lead;
  });

  text = text.replace(/(^|\s)(![a-z0-9]+|p[123])(?=\s|$)/gi, (match, lead: string, token: string) => {
    const mapped = PRIORITY_MAP[token.toLowerCase()];
    if (mapped) {
      result.priority = mapped;
      return lead;
    }
    return match;
  });

  const today = startOfToday();
  const monthDay = (monthWord: string, dayText: string, yearText?: string) => {
    const month = MONTHS.indexOf(monthWord.slice(0, 3).toLowerCase());
    const day = Number(dayText);
    if (yearText) return realDate(Number(yearText), month, day);
    const d = realDate(today.getFullYear(), month, day);
    return d && d < today ? realDate(today.getFullYear() + 1, month, day) : d;
  };
  const dateRules: Array<{ re: RegExp; run: (m: RegExpMatchArray) => Date | null }> = [
    { re: /(^|\s)(\d{4})-(\d{2})-(\d{2})(?=\s|$)/, run: (m) => realDate(Number(m[2]), Number(m[3]) - 1, Number(m[4])) },
    {
      re: new RegExp(`(^|\\s)(\\d{1,2})\\/(\\d{1,2})(?:\\/(\\d{2,4})|(?!\\s+${UNIT}(?=\\s|$)))(?=\\s|$)`, "i"),
      run: (m) => {
        const month = Number(m[2]) - 1;
        const day = Number(m[3]);
        if (m[4]) return realDate(Number(m[4].length === 2 ? `20${m[4]}` : m[4]), month, day);
        const d = realDate(today.getFullYear(), month, day);
        return d && d < today ? realDate(today.getFullYear() + 1, month, day) : d;
      },
    },
    { re: new RegExp(`(^|\\s)(${MONTH_WORD})\\.?\\s+(\\d{1,2})(?:st|nd|rd|th)?${YEAR}(?=\\s|$)`, "i"), run: (m) => monthDay(m[2], m[3], m[4]) },
    { re: new RegExp(`(^|\\s)(\\d{1,2})(?:st|nd|rd|th)?\\s+(${MONTH_WORD})\\.?${YEAR}(?=\\s|$)`, "i"), run: (m) => monthDay(m[3], m[2], m[4]) },
    { re: /(^|\s)in\s+(\d{1,3})\s+(day|days|week|weeks)(?=\s|$)/i, run: (m) => addDays(today, Number(m[2]) * (/week/i.test(m[3]) ? 7 : 1)) },
    {
      re: new RegExp(`(^|\\s)next\\s+(week|${WEEKDAYS.join("|")}|${Object.keys(WEEKDAY_ALIASES).join("|")})(?=\\s|$)`, "i"),
      run: (m) => {
        const word = m[2].toLowerCase();
        if (word === "week") return addDays(today, 7);
        const dow = WEEKDAYS.indexOf(word) !== -1 ? WEEKDAYS.indexOf(word) : WEEKDAY_ALIASES[word];
        return nextWeekday(dow);
      },
    },
    { re: new RegExp(`(^|\\s)(${WEEKDAYS.join("|")})(?=\\s|$)`, "i"), run: (m) => nextWeekday(WEEKDAYS.indexOf(m[2].toLowerCase())) },
    {
      re: new RegExp(`(^|\\s)(?:(?:on|by|due|until|this)\\s+(${SHORT_DAY})|(${SHORT_DAY})(?=(?:\\s+${TIME})?\\s*$))(?=\\s|$)`, "i"),
      run: (m) => nextWeekday(WEEKDAY_ALIASES[(m[2] || m[3]).toLowerCase()]),
    },
    { re: /(^|\s)(today|tonight)(?=\s|$)/i, run: () => today },
    { re: /(^|\s)(tomorrow|tmrw|tmr)(?=\s|$)/i, run: () => addDays(today, 1) },
  ];

  for (const rule of dateRules) {
    const match = text.match(rule.re);
    if (match && match.index !== undefined) {
      const date = rule.run(match);
      if (date && !Number.isNaN(date.getTime())) {
        result.dueDate = toISODate(date);
        const before = text.slice(0, match.index).replace(/\s(?:by|on|due|until)\s*$/i, " ");
        text = before + match[1] + text.slice(match.index + match[0].length);
        break;
      }
    }
  }

  if (!result.dueDate) {
    const minutes = timeOfDay(text);
    if (minutes !== null) {
      const now = new Date();
      const passed = minutes <= now.getHours() * 60 + now.getMinutes();
      result.dueDate = toISODate(passed ? addDays(today, 1) : today);
    }
  }

  result.title = collapse(text) || input.trim();
  return result;
}

/** How Zephyr's task list writes a due day. */
function formatDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  const now = startOfToday();
  const diff = Math.round((date.getTime() - now.getTime()) / 86400000);
  if (diff === 0) return "today";
  if (diff === 1) return "tomorrow";
  if (diff > 1 && diff < 7) return date.toLocaleDateString("en-US", { weekday: "long" }).toLowerCase();
  return date
    .toLocaleDateString("en-US", { month: "short", day: "numeric", year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined })
    .toLowerCase();
}

/**
 * Which typed words the parser took. It only removes words and collapses the
 * space between them, so the title's words are the typed words it kept, in order.
 */
function takenWords(input: string, title: string) {
  const kept = title.split(/\s+/).filter(Boolean);
  let k = 0;
  return input.split(/(\s+)/).map((part) => {
    if (!part.trim()) return { part, taken: false };
    if (kept[k] === part) {
      k += 1;
      return { part, taken: false };
    }
    return { part, taken: true };
  });
}

const EXAMPLES = ["buy sun cream", "1/2 kg flour", "dentist 5 nov at 3pm"];

/** The key moment: one typed line becomes a task with a day, a priority and a tag. */
export function QuickAddDemo() {
  const [text, setText] = useState("Email Sam tomorrow !high #work");
  const input = useRef<HTMLInputElement>(null);
  const mirror = useRef<HTMLDivElement>(null);
  const parsed = parseQuickTask(text);
  const words = takenWords(text, parsed.title);
  const priority = parsed.priority === "high" || parsed.priority === "low" ? parsed.priority : null;
  const due = parsed.dueDate ? formatDate(parsed.dueDate) : null;

  // The highlighted copy behind the field scrolls with it.
  const sync = () => {
    if (mirror.current && input.current) mirror.current.scrollLeft = input.current.scrollLeft;
  };

  const chip = "rounded-full px-2.5 py-0.5 font-semibold text-[0.75rem] leading-5";
  return (
    <Demo
      caption="Edit the line, or try the three below. Each one looks like a date, and only one of them is."
      height={360}
      label="Zephyr's quick add turning a typed line into a task with a due day, priority and tags"
      live={`${parsed.title}${due ? `, due ${due}` : ""}${priority ? `, ${priority} priority` : ""}${parsed.tags.map((t) => `, #${t}`).join("")}.`}
      phoneHeight={392}
    >
      <Frame
        bottom={EXAMPLES.map((e) => (
          <Action key={e} onClick={() => setText(e)}>
            {e}
          </Action>
        ))}
      >
        <div className="zephyr-app absolute inset-0 flex flex-col justify-center gap-4 overflow-hidden rounded-xl px-4 sm:px-6" style={{ background: Z.stone, color: Z.ink }}>
          {/* The field, with the words Zephyr read lit in apricot behind the text. */}
          <div className="relative h-12 rounded-2xl" style={{ background: Z.card, boxShadow: "0 1px 2px hsl(var(--z-ink) / 0.04)" }}>
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 overflow-hidden whitespace-pre px-4 font-medium text-[1rem] leading-[3rem]"
              ref={mirror}
            >
              {words.map((w, i) =>
                w.taken ? (
                  <span className="rounded-md" key={i} style={{ background: Z.primaryTint, color: Z.primaryStrong }}>
                    {w.part}
                  </span>
                ) : (
                  <span key={i}>{w.part}</span>
                ),
              )}
            </div>
            <input
              aria-label="Add a task"
              className="relative h-12 w-full bg-transparent px-4 font-medium text-[1rem] text-transparent"
              onChange={(e) => setText(e.target.value)}
              onKeyUp={sync}
              onScroll={sync}
              onSelect={sync}
              ref={input}
              spellCheck={false}
              style={{ caretColor: Z.ink, borderRadius: "1rem" }}
              value={text}
            />
          </div>

          {/* The task it adds, as Zephyr's list shows it. */}
          <div className="flex items-start gap-3.5 rounded-2xl px-3 py-3" style={{ background: Z.card }}>
            <span className="mt-0.5 h-6 w-6 shrink-0 rounded-[9px]" style={{ background: Z.accent, boxShadow: "inset 0 0 0 1.5px hsl(var(--z-ink) / 0.14)" }} />
            <div className="min-w-0 flex-1">
              <p className="m-0 font-medium text-[0.96875rem] leading-6 [overflow-wrap:anywhere]">{parsed.title || " "}</p>
              {parsed.tags.length ? (
                <p className="m-0 mt-1.5 flex flex-wrap gap-1.5">
                  {parsed.tags.map((t) => (
                    <span className="rounded-full px-2 py-0.5 font-semibold text-[0.75rem]" key={t} style={{ background: Z.accent, color: Z.muted }}>
                      #{t}
                    </span>
                  ))}
                </p>
              ) : null}
            </div>
            <span className="flex max-w-[44%] shrink-0 flex-wrap justify-end gap-1.5 tabular-nums sm:max-w-none">
              {priority ? (
                <span className={chip} style={priority === "high" ? { background: Z.primaryTint, color: Z.primaryStrong } : { background: Z.accent, color: Z.muted }}>
                  {priority}
                </span>
              ) : null}
              {due ? (
                <span className={chip} style={{ background: Z.accent, color: Z.ink }}>
                  {due}
                </span>
              ) : null}
            </span>
          </div>
        </div>
      </Frame>
    </Demo>
  );
}

/* ------------------------------------------------------------------ */
/* The timer: a sun crossing the sky                                   */
/* ------------------------------------------------------------------ */

/** Zephyr's SunDial: the body rides one rotating group, so a second is one transform. */
function SunDial({ progress, isBreak, still, children }: { progress: number; isBreak: boolean; still: boolean; children: ReactNode }) {
  const id = useId();
  const glide = still ? "none" : undefined;
  const p = Math.min(100, Math.max(0, progress));
  const angle = (p / 100) * 180;
  const body = isBreak ? Z.heroText : Z.sun;
  return (
    <div className="relative w-full max-w-[26rem]">
      <svg aria-hidden className="block w-full overflow-visible" viewBox="0 0 400 226">
        <defs>
          <mask id={`${id}-crescent`}>
            <rect fill="white" height="226" width="400" x="0" y="0" />
            <circle cx="37" cy="194" fill="black" r="11" />
          </mask>
          <radialGradient id={`${id}-glow`}>
            <stop offset="0" stopColor={body} stopOpacity="0.55" />
            <stop offset="1" stopColor={body} stopOpacity="0" />
          </radialGradient>
        </defs>
        <path d="M 30 200 A 170 170 0 0 1 370 200" fill="none" stroke={Z.heroText} strokeDasharray="2 9" strokeLinecap="round" strokeOpacity="0.16" strokeWidth="2" />
        <path
          d="M 30 200 A 170 170 0 0 1 370 200"
          fill="none"
          pathLength="100"
          stroke={body}
          strokeDasharray={`${p} 100`}
          strokeLinecap="round"
          strokeWidth="3"
          style={{ transition: glide ?? "stroke-dasharray 1s linear" }}
        />
        <path d="M 8 200 H 392" stroke={Z.heroText} strokeLinecap="round" strokeOpacity="0.45" strokeWidth="2" />
        <path d="M 120 216 H 280" stroke={Z.heroText} strokeLinecap="round" strokeOpacity="0.18" strokeWidth="2" />
        <g style={{ transform: `rotate(${angle}deg)`, transformOrigin: "200px 200px", transformBox: "view-box", transition: glide ?? "transform 1s linear" }}>
          <circle cx="30" cy="200" fill={`url(#${id}-glow)`} r="34" />
          <circle cx="30" cy="200" fill={body} mask={isBreak ? `url(#${id}-crescent)` : undefined} r="13" />
        </g>
      </svg>
      <div className="pointer-events-none absolute inset-x-0 bottom-[16%] flex flex-col items-center">{children}</div>
    </div>
  );
}

const LENGTH = { focus: 25 * 60, break: 5 * 60 };
/** The demo runs the session sixty times faster: one real second is a minute. */
const SPEED = 60;

/** A session as a day: the sun rises, crosses and sets as the minutes run out. */
export function TimerDemo() {
  const { reduced } = useMotionSafe();
  const [phase, setPhase] = useState<"focus" | "break">("focus");
  const [left, setLeft] = useState(LENGTH.focus);
  const [running, setRunning] = useState(false);
  const [box, seen] = useSeenOnce<HTMLDivElement>();
  // Starts once, the first time it is half in view; under reduced motion it waits for Start.
  const started = useRef(false);
  useEffect(() => {
    if (!seen || reduced || started.current) return;
    started.current = true;
    const t = window.setTimeout(() => setRunning(true), 500);
    return () => window.clearTimeout(t);
  }, [seen, reduced]);
  // The clock stops by itself at zero.
  const active = running && left > 0;

  // One tick a second, as in Zephyr, each worth a minute here.
  useEffect(() => {
    if (!active) return;
    const t = window.setInterval(() => setLeft((l) => Math.max(0, l - SPEED)), 1000);
    return () => window.clearInterval(t);
  }, [active]);

  const total = LENGTH[phase];
  const progress = ((total - left) / total) * 100;
  const mm = String(Math.floor(left / 60)).padStart(2, "0");
  const ss = String(left % 60).padStart(2, "0");
  const switchTo = (next: "focus" | "break") => {
    setPhase(next);
    setLeft(LENGTH[next]);
    setRunning(false);
  };
  const status = left === 0 ? (phase === "focus" ? "The sun has set: the session is over." : "The moon has set: the break is over.") : `Played sixty times faster: each second here is a minute.`;

  return (
    <Demo
      caption="Switch to Break for the moon. The arc behind the sun is the part of the session already spent."
      height={360}
      label="Zephyr's focus timer drawn as a sun crossing the sky"
      live={left === 0 ? status : ""}
      phoneHeight={420}
    >
      <div className="absolute inset-0" ref={box}>
        <Frame
          bottom={
            <>
              <BarText>{status}</BarText>
              <Action
                onClick={() => {
                  started.current = true;
                  if (left === 0) {
                    setLeft(total);
                    setRunning(true);
                  } else setRunning(!active);
                }}
                primary={!active}
                width="min-w-[5.5rem]"
              >
                {active ? "Pause" : left === 0 ? "Again" : left === total ? "Start" : "Resume"}
              </Action>
            </>
          }
          top={
            <Pills
              label="Session"
              onChange={(v) => switchTo(v)}
              options={[
                { value: "focus" as const, label: "Focus, 25 min" },
                { value: "break" as const, label: "Break, 5 min" },
              ]}
              value={phase}
            />
          }
        >
          <div
            className="zephyr-app absolute inset-0 flex items-end justify-center overflow-hidden rounded-xl px-6 pb-4"
            style={{ background: `linear-gradient(180deg, ${Z.heroFrom}, ${Z.heroTo})` }}
          >
            <SunDial isBreak={phase === "break"} progress={progress} still={reduced}>
              <span className="font-semibold text-[2.75rem] leading-none tracking-[-0.03em] tabular-nums" style={{ color: Z.heroText }}>
                {mm}:{ss}
              </span>
            </SunDial>
          </div>
        </Frame>
      </div>
    </Demo>
  );
}
