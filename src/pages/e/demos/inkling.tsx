import { AnimatePresence, motion } from "framer-motion";
import { type KeyboardEvent, useEffect, useRef, useState } from "react";
import { Action, BarText, Demo, Frame } from "../kit";
import { useMotionSafe, useSeenOnce } from "../motion";
import { RING } from "../style";

/*
 * Inkling, told through its key moments. Inkling has a light and a dark
 * theme, so these demos follow the page's, in its own tokens
 * (src/renderer/src/styles/index.css). Today is TodayView's layout and words;
 * the scheduler is Inkling's FSRS-6 (src/shared/fsrs.ts) with its default
 * parameters and its fixed 90% retention.
 */

/** Inkling's two themes as variables, switched with the page. */
const THEME =
  "[--ik-bg:#fbfaf8] [--ik-panel:#f4f2ee] [--ik-raised:#ffffff] [--ik-text:#1f1d1a] [--ik-muted:#625d56] [--ik-faint:#736d65] [--ik-accent:#4155b9] [--ik-accent-text:#3a4daa] [--ik-soft:rgba(65,85,185,0.1)] [--ik-border:#e8e4dd] [--ik-hover:rgba(40,36,30,0.05)] [--ik-danger:#c2412f] dark:[--ik-danger:#e2685a] dark:[--ik-bg:#1a1918] dark:[--ik-panel:#1f1e1c] dark:[--ik-raised:#252421] dark:[--ik-text:#ece9e3] dark:[--ik-muted:#aeaaa2] dark:[--ik-faint:#948f87] dark:[--ik-accent:#8b9bf0] dark:[--ik-accent-text:#a5b2f5] dark:[--ik-soft:rgba(139,155,240,0.14)] dark:[--ik-border:#2c2a27] dark:[--ik-hover:rgba(255,250,240,0.05)]";

const v = (name: string) => `var(--ik-${name})`;

/* ------------------------------------------------------------------ */
/* A note feeds Today                                                  */
/* ------------------------------------------------------------------ */

type Line = { id: number; todo?: boolean; text: string };

const NOTE = "Biology: The cell";
const LINES: Line[] = [
  { id: 1, todo: true, text: "Read chapter 4" },
  { id: 2, todo: true, text: "Make flashcards from the terms" },
  { id: 3, text: "Mitochondria :: Makes the energy the cell runs on" },
  { id: 4, text: "Proteins are built by the {{c1::ribosomes}}." },
  { id: 5, text: "Ask whether the test covers osmosis." },
];

/** A line as typed. The card markup stays plain text, as in Inkling's editor, only a step quieter. */
function Markup({ text }: { text: string }) {
  return (
    <>
      {text.split(/(\{\{c\d+::|\}\}|\s::\s)/).map((part, i) =>
        i % 2 ? (
          <span key={i} style={{ color: v("faint") }}>
            {part}
          </span>
        ) : (
          part
        ),
      )}
    </>
  );
}

/** Inkling's checkbox: a rounded square, filled with the accent once ticked. 44px to touch on a phone. */
function Box({ checked, onClick, label }: { checked: boolean; onClick: () => void; label: string }) {
  return (
    <button
      aria-checked={checked}
      aria-label={label}
      className={`-m-3.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-lg sm:-m-1.5 sm:h-7 sm:w-7 ${RING}`}
      onClick={onClick}
      role="checkbox"
      type="button"
    >
      <span
        className="flex h-4 w-4 items-center justify-center rounded-[4px]"
        style={{ background: checked ? v("accent") : v("raised"), boxShadow: checked ? "none" : `inset 0 0 0 1.5px ${v("faint")}` }}
      >
        {checked ? (
          <svg aria-hidden className="h-2.5 w-2.5" fill="none" viewBox="0 0 12 12">
            <path d="M2.5 6.2 5 8.6l4.5-5.2" stroke={v("raised")} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        ) : null}
      </span>
    </button>
  );
}

/** Today's section heading: a quiet label, its count, and a hairline. */
function SectionHead({ title, count }: { title: string; count: number }) {
  return (
    <p className="m-0 flex items-baseline gap-2 pb-1.5 font-medium text-[0.75rem]" style={{ color: v("muted"), boxShadow: `inset 0 -1px 0 ${v("border")}` }}>
      {title}
      {count > 0 ? (
        <span className="text-[0.6875rem] tabular-nums" style={{ color: v("faint") }}>
          {count}
        </span>
      ) : null}
    </p>
  );
}

const without = (set: Set<number>, id: number) => new Set([...set].filter((x) => x !== id));
const toggled = (set: Set<number>, id: number) => (set.has(id) ? without(set, id) : new Set([...set, id]));

/** The key moment: write a note once, and Today and the flashcards come out of it. */
export function NoteDemo() {
  const [ref, seen] = useSeenOnce<HTMLDivElement>();
  const { reduced, spring } = useMotionSafe();
  const [done, setDone] = useState<Set<number>>(new Set());
  // Ticked on Today, a row stays there struck through until the next visit, as in Inkling.
  const [tickedOnToday, setTickedOnToday] = useState<Set<number>>(new Set());
  const [deck, setDeck] = useState(false);
  const touched = useRef(false);

  const tickInNote = (id: number) => {
    touched.current = true;
    setDone(toggled(done, id));
    setTickedOnToday(without(tickedOnToday, id));
  };
  const tickOnToday = (id: number) => {
    touched.current = true;
    setDone(toggled(done, id));
    setTickedOnToday(done.has(id) ? without(tickedOnToday, id) : new Set([...tickedOnToday, id]));
  };

  // Played once when it first comes into view: a to-do ticked on Today, ticked in the note.
  useEffect(() => {
    if (!seen || reduced) return;
    const t = window.setTimeout(() => {
      if (touched.current) return;
      touched.current = true;
      setDone(new Set([1]));
      setTickedOnToday(new Set([1]));
    }, 900);
    return () => window.clearTimeout(t);
  }, [seen, reduced]);

  const todos = LINES.filter((l) => l.todo);
  const onToday = todos.filter((l) => !done.has(l.id) || tickedOnToday.has(l.id));
  const open = todos.filter((l) => !done.has(l.id)).length;
  const cards = LINES.filter((l) => !l.todo && (l.text.includes(" :: ") || /\{\{c\d+::/.test(l.text))).length;
  const status = deck
    ? `${cards} lines became cards in the deck ${NOTE}. The rest stay notes.`
    : open
      ? `${open} to-do${open === 1 ? "" : "s"} open. A tick on Today is a tick in the note.`
      : "Nothing open. Press Flashcards to make the deck.";

  const reset = () => {
    touched.current = true;
    setDone(new Set());
    setTickedOnToday(new Set());
    setDeck(false);
  };

  return (
    <div ref={ref}>
      <Demo
        caption="Tick a to-do on either side and watch the other. Then press Flashcards."
        height={340}
        label="An Inkling note whose to-dos appear on Today and whose card lines become flashcards"
        live={status}
        phoneHeight={600}
      >
        <Frame
          bottom={
            <>
              <BarText>{status}</BarText>
              {deck ? (
                <Action onClick={reset}>Reset</Action>
              ) : (
                <Action onClick={() => setDeck(true)} primary>
                  Flashcards
                </Action>
              )}
            </>
          }
        >
          <div
            className={`absolute inset-0 grid grid-rows-[auto_minmax(0,1fr)] overflow-hidden rounded-xl sm:grid-cols-[minmax(0,1fr)_15rem] sm:grid-rows-1 ${THEME}`}
            style={{ background: v("bg"), color: v("text"), boxShadow: `inset 0 0 0 1px ${v("border")}` }}
          >
            {/* The note, as the editor shows it */}
            <div className="min-h-0 overflow-hidden px-5 pt-4 pb-4 sm:px-6 sm:pt-6">
              <p className="m-0 font-semibold text-[1.25rem] leading-tight tracking-[-0.01em] sm:text-[1.375rem]">{NOTE}</p>
              <ul className="m-0 mt-3 flex list-none flex-col gap-2 p-0 text-[0.8125rem] leading-[1.45] sm:mt-4">
                {LINES.map((l) => (
                  <li className="flex items-start gap-2.5" key={l.id}>
                    {l.todo ? <Box checked={done.has(l.id)} label={`${l.text}, in the note`} onClick={() => tickInNote(l.id)} /> : null}
                    <span className="min-w-0" style={done.has(l.id) ? { color: v("faint"), textDecoration: "line-through" } : undefined}>
                      <Markup text={l.text} />
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Today, as Inkling lists it */}
            <div
              className="min-h-0 overflow-hidden px-5 pt-4 pb-4 sm:pt-6"
              style={{ background: v("panel"), boxShadow: `inset 0 1px 0 ${v("border")}, inset 1px 0 0 ${v("border")}` }}
            >
              <p className="m-0 font-semibold text-[1.125rem] leading-tight">Today</p>
              {onToday.length ? (
                <div className="mt-3">
                  <SectionHead count={open} title="To-do" />
                  <ul className="m-0 list-none p-0">
                    <AnimatePresence initial={false}>
                      {onToday.map((l) => {
                        const ticked = done.has(l.id);
                        return (
                          <motion.li
                            animate={{ opacity: 1, height: "auto" }}
                            className="overflow-hidden"
                            exit={{ opacity: 0, height: 0 }}
                            initial={{ opacity: 0, height: 0 }}
                            key={l.id}
                            transition={spring}
                          >
                            <span className="flex items-start gap-2.5 py-2 text-[0.75rem] leading-snug" style={{ boxShadow: `inset 0 -1px 0 ${v("border")}` }}>
                              <Box checked={ticked} label={`${l.text}, on Today`} onClick={() => tickOnToday(l.id)} />
                              <span className="min-w-0 flex-1">
                                <span className="block" style={ticked ? { color: v("faint"), textDecoration: "line-through" } : undefined}>
                                  {l.text}
                                </span>
                                <span className="block text-[0.6875rem]" style={{ color: v("faint") }}>
                                  {NOTE}
                                </span>
                              </span>
                            </span>
                          </motion.li>
                        );
                      })}
                    </AnimatePresence>
                  </ul>
                </div>
              ) : null}
              <AnimatePresence initial={false}>
                {deck ? (
                  <motion.div animate={{ opacity: 1, y: 0 }} className="mt-4" initial={{ opacity: 0, y: 6 }} transition={spring}>
                    <SectionHead count={cards} title="Study" />
                    <span className="flex items-baseline gap-2 py-2 text-[0.75rem]" style={{ boxShadow: `inset 0 -1px 0 ${v("border")}` }}>
                      <span className="min-w-0 flex-1 truncate">{NOTE}</span>
                      <span className="shrink-0 text-[0.6875rem]" style={{ color: v("faint") }}>
                        {cards} cards due
                      </span>
                      <span className="shrink-0 font-medium" style={{ color: v("accent-text") }}>
                        Review
                      </span>
                    </span>
                  </motion.div>
                ) : null}
              </AnimatePresence>
              {!onToday.length && !deck ? (
                <p className="m-0 mt-6 text-center text-[0.75rem]" style={{ color: v("muted") }}>
                  Nothing open. Enjoy the calm.
                </p>
              ) : null}
            </div>
          </div>
        </Frame>
      </Demo>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Review: FSRS-6, as Inkling runs it                                  */
/* ------------------------------------------------------------------ */

type Rating = 1 | 2 | 3 | 4;
type CardState = "new" | "learning" | "review" | "relearning";
type Card = { state: CardState; stability: number | null; difficulty: number | null; lastReview: number | null };

const W = [
  0.212, 1.2931, 2.3065, 8.2956, 6.4133, 0.8334, 3.0194, 0.001, 1.8722, 0.1666, 0.796, 1.4835, 0.0614, 0.2629, 1.6483, 0.6014, 1.8729, 0.5425,
  0.0912, 0.0658, 0.1542,
];
const MIN_S = 0.001;
const MAX_DAYS = 36500;
const RELEARN_MINUTES = 10;
const RETENTION = 0.9;
const clamp = (x: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, x));
const DECAY = -W[20];
const FACTOR = 0.9 ** (1 / DECAY) - 1;
const recall = (t: number, s: number) => (s <= 0 ? 0 : (1 + (FACTOR * Math.max(0, t)) / s) ** DECAY);
const intervalFor = (s: number) => (s / FACTOR) * (RETENTION ** (1 / DECAY) - 1);
const rawD0 = (g: Rating) => W[4] - Math.exp(W[5] * (g - 1)) + 1;
const nextD = (d: number, g: Rating) => {
  const next = d + (-W[6] * (g - 3) * (10 - d)) / 9;
  return clamp(W[7] * rawD0(4) + (1 - W[7]) * next, 1, 10);
};
const recallS = (d: number, s: number, r: number, g: Rating) =>
  clamp(
    s * (1 + Math.exp(W[8]) * (11 - d) * s ** -W[9] * (Math.exp((1 - r) * W[10]) - 1) * (g === 2 ? W[15] : 1) * (g === 4 ? W[16] : 1)),
    MIN_S,
    MAX_DAYS,
  );
const forgetS = (d: number, s: number, r: number) =>
  clamp(Math.min(W[11] * d ** -W[12] * ((s + 1) ** W[13] - 1) * Math.exp((1 - r) * W[14]), s / Math.exp(W[17] * W[18])), MIN_S, MAX_DAYS);
const shortS = (s: number, g: Rating) => {
  const inc = s ** -W[19] * Math.exp(W[17] * (g - 3 + W[18]));
  return clamp(s * (g >= 2 ? Math.max(inc, 1) : inc), MIN_S, MAX_DAYS);
};

/** Inkling's schedule(): the next state, and the days until the card is due (0 means ten minutes). */
function schedule(card: Card, g: Rating, nowDays: number) {
  const isNew = card.state === "new" || card.stability === null || card.difficulty === null;
  const elapsed = isNew || card.lastReview === null ? 0 : Math.max(0, nowDays - card.lastReview);
  let stability: number;
  let difficulty: number;
  let r = 1;
  if (isNew) {
    stability = clamp(W[g - 1], MIN_S, MAX_DAYS);
    difficulty = clamp(rawD0(g), 1, 10);
  } else {
    const s = card.stability as number;
    const d = card.difficulty as number;
    r = recall(elapsed, s);
    stability = elapsed < 1 ? shortS(s, g) : g === 1 ? forgetS(d, s, r) : recallS(d, s, r, g);
    difficulty = nextD(d, g);
  }
  if (g === 1) {
    const state: CardState = isNew || card.state === "learning" ? "learning" : "relearning";
    return { state, stability, difficulty, days: 0, r };
  }
  return { state: "review" as CardState, stability, difficulty, days: clamp(Math.round(intervalFor(stability)), 1, MAX_DAYS), r };
}

const formatInterval = (days: number) => {
  if (days === 0) return `${RELEARN_MINUTES}m`;
  if (days < 30) return `${Math.round(days)}d`;
  if (days < 365) return `${(days / 30).toFixed(days < 90 ? 1 : 0)}mo`;
  return `${(days / 365).toFixed(1)}y`;
};

const GRADES: Array<{ rating: Rating; label: string }> = [
  { rating: 1, label: "Again" },
  { rating: 2, label: "Hard" },
  { rating: 3, label: "Good" },
  { rating: 4, label: "Easy" },
];

/** Again in the danger colour, Good and Easy in the accent, as Inkling's review buttons. */
const TONE: Record<Rating, string> = { 1: v("danger"), 2: v("text"), 3: v("accent-text"), 4: v("accent-text") };

const NEW: Card = { state: "new", stability: null, difficulty: null, lastReview: null };

/** A card reviewed on the day it comes due, again and again, as its gaps grow. */
export function ReviewDemo() {
  const { spring } = useMotionSafe();
  const [card, setCard] = useState<Card>(NEW);
  const [day, setDay] = useState(0);
  const [shown, setShown] = useState(false);
  const [log, setLog] = useState<Array<{ label: string; days: number }>>([]);

  const preview = GRADES.map((g) => schedule(card, g.rating, day).days);
  const rate = (g: Rating) => {
    const next = schedule(card, g, day);
    setCard({ state: next.state, stability: next.stability, difficulty: next.difficulty, lastReview: day });
    setLog((l) => [...l, { label: GRADES[g - 1].label, days: next.days }]);
    setDay((d) => d + (next.days === 0 ? RELEARN_MINUTES / 1440 : next.days));
    setShown(false);
  };
  const reset = () => {
    setCard(NEW);
    setDay(0);
    setShown(false);
    setLog([]);
  };
  // Inkling's own keys: Space shows the answer, 1 to 4 answer once it shows.
  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === " " && !shown) {
      e.preventDefault();
      setShown(true);
    } else if (shown && ["1", "2", "3", "4"].includes(e.key)) {
      e.preventDefault();
      rate(Number(e.key) as Rating);
    }
  };
  const whole = Math.floor(day);
  const status =
    card.stability === null
      ? "A new card. Every answer shows the gap it would buy."
      : `Day ${whole}, due again. Recall chance ${Math.round(recall(day - (card.lastReview ?? day), card.stability) * 100)}%, stability ${card.stability < 10 ? card.stability.toFixed(1) : Math.round(card.stability)} days.`;

  return (
    <Demo
      caption="Show the answer and pick one, a few times over. Each review lands on the day the card is due, and the gaps grow."
      height={340}
      label="An Inkling flashcard scheduled by FSRS-6, review by review"
      live={status}
      phoneHeight={420}
    >
      <Frame
        bottom={
          <>
            <BarText>{status}</BarText>
            {log.length ? <Action onClick={reset}>Reset</Action> : null}
          </>
        }
      >
        <div
          className={`absolute inset-0 flex flex-col items-center justify-center gap-3 overflow-hidden rounded-xl px-4 ${THEME}`}
          onKeyDown={onKey}
          role="presentation"
          style={{ background: v("bg"), color: v("text"), boxShadow: `inset 0 0 0 1px ${v("border")}` }}
        >
          {/* The reviews so far, each with the gap it bought */}
          <ol aria-label="Reviews so far" className="m-0 flex min-h-6 max-w-full list-none flex-wrap justify-center gap-1.5 p-0">
            <AnimatePresence initial={false}>
              {log.slice(-5).map((e, i) => (
                <motion.li
                  animate={{ opacity: 1, scale: 1 }}
                  className="rounded-full px-2 py-0.5 text-[0.6875rem] tabular-nums"
                  initial={{ opacity: 0, scale: 0.9 }}
                  key={log.length - Math.min(5, log.length) + i}
                  style={{ background: v("soft"), color: v("accent-text") }}
                  transition={spring}
                >
                  {e.label} · {formatInterval(e.days)}
                </motion.li>
              ))}
            </AnimatePresence>
            {log.length === 0 ? (
              <li className="text-[0.6875rem]" style={{ color: v("faint") }}>
                {NOTE}
              </li>
            ) : null}
          </ol>

          <button
            className={`flex min-h-[8rem] w-full max-w-[26rem] flex-col items-center justify-center gap-3 rounded-lg px-6 py-5 text-center ${RING}`}
            onClick={() => setShown(true)}
            style={{ background: v("raised"), boxShadow: `inset 0 0 0 1px ${v("border")}` }}
            type="button"
          >
            <span className="font-medium text-[1.0625rem] leading-snug sm:text-[1.125rem]">
              Proteins are built by the{" "}
              {shown ? (
                <span style={{ color: v("accent-text") }}>ribosomes</span>
              ) : (
                <span style={{ color: v("faint") }}>[…]</span>
              )}
              .
            </span>
            <span className="text-[0.6875rem]" style={{ color: v("faint"), visibility: shown ? "hidden" : "visible" }}>
              Click or press Space to see the answer
            </span>
          </button>

          {/* Hidden in Inkling until the answer shows; here they wait dimmed, so the gaps read from the start. */}
          <div className="grid w-full max-w-[26rem] grid-cols-4 gap-2" style={{ opacity: shown ? 1 : 0.45, transition: "opacity 200ms" }}>
            {GRADES.map((g, i) => (
              <button
                className={`flex min-h-12 flex-col items-center justify-center rounded-md px-1 py-1.5 font-medium text-[0.8125rem] ${RING}`}
                key={g.rating}
                disabled={!shown}
                onClick={() => rate(g.rating)}
                style={{ background: v("raised"), boxShadow: `inset 0 0 0 1px ${v("border")}`, color: TONE[g.rating] }}
                type="button"
              >
                {g.label}
                <span className="block font-normal text-[0.6875rem] tabular-nums" style={{ color: v("faint") }}>
                  {formatInterval(preview[i])}
                  <span className="ml-1">{g.rating}</span>
                </span>
              </button>
            ))}
          </div>
        </div>
      </Frame>
    </Demo>
  );
}
