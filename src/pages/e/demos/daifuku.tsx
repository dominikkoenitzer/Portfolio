import { AnimatePresence, motion } from "framer-motion";
import { type ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { Action, BarText, Demo, Frame, Keycap, Pills } from "../kit";
import { useMotionSafe, useSeenOnce, wait } from "../motion";

/*
 * Daifuku, told through its key moments. The grid is Daifuku's own planner,
 * ported line for line, on a 1366 by 768 monitor; the states and their
 * colours are the ones it draws, and their widths keep its proportions.
 */

const TERM = {
  desk: "#0f0f17",
  bg: "#1c1c28",
  tab: "#2a2a3c",
  text: "#cdd6f4",
  sub: "#a6adc8",
};

type State = "working" | "waiting" | "done" | "failed";

/**
 * Each state's colour and width. Daifuku draws 2, 4, 6 and 8 pixels at its
 * default width of 4; the demo's monitor is small, so these are the same
 * steps at three quarters, which keeps each state readable without colour.
 */
const STATE: Record<State, { color: string; width: number; label: string; line: string }> = {
  done: { color: "#a6e3a1", width: 1.5, label: "done", line: "Done." },
  working: { color: "#89b4fa", width: 3, label: "working", line: "Working" },
  failed: { color: "#f38ba8", width: 4.5, label: "failed", line: "API error: rate limited" },
  waiting: { color: "#f9e2af", width: 6, label: "waiting for you", line: "Allow the edit? Press Enter" },
};

/* ------------------------------------------------------------------ */
/* The planner, as in daifuku-core's grid.rs                           */
/* ------------------------------------------------------------------ */

const TARGET_ASPECT = 1.3;
const EMPTY_CELL_COST = 0.25;
const OUTER = 24;
const INNER = 20;
const SCREEN = { w: 1366, h: 768 };

/** The shape closest to a terminal's 1.3 aspect, preferring no empty cells. */
function shapeFor(count: number, width: number, height: number) {
  if (count <= 1) return { columns: 1, rows: 1 };
  const w = width - 2 * OUTER;
  const h = height - 2 * OUTER;
  let best = { columns: 1, rows: count };
  let bestCost = Number.POSITIVE_INFINITY;
  for (let columns = 1; columns <= count; columns += 1) {
    const rows = Math.ceil(count / columns);
    const cellW = (w - (columns - 1) * INNER) / columns;
    const cellH = (h - (rows - 1) * INNER) / rows;
    if (cellW <= 0 || cellH <= 0) continue;
    const cost = Math.abs(Math.log(cellW / cellH / TARGET_ASPECT)) + (columns * rows - count) * EMPTY_CELL_COST;
    if (cost < bestCost) {
      bestCost = cost;
      best = { columns, rows };
    }
  }
  return best;
}

/** Splits start..end into parts separated by gap, leftover pixels one per span from the front. */
function spans(start: number, end: number, parts: number, gap: number): Array<[number, number]> {
  const usable = Math.max(0, end - start - (parts - 1) * gap);
  return Array.from({ length: parts }, (_, i) => [
    start + i * gap + Math.floor((i * usable) / parts),
    start + i * gap + Math.floor(((i + 1) * usable) / parts),
  ]);
}

type Rect = { x: number; y: number; w: number; h: number };

/** One rectangle per terminal, row by row; a short last row shares the full width. */
function plan(count: number, width: number, height: number) {
  const shape = shapeFor(count, width, height);
  const rows = Math.min(Math.ceil(count / shape.columns), shape.rows);
  const cells: Rect[] = [];
  let left = count;
  for (const [top, bottom] of spans(OUTER, height - OUTER, rows, INNER)) {
    const inRow = Math.min(left, shape.columns);
    for (const [l, r] of spans(OUTER, width - OUTER, inRow, INNER)) {
      cells.push({ x: l / width, y: top / height, w: (r - l) / width, h: (bottom - top) / height });
    }
    left -= inRow;
  }
  return { shape, cells };
}

/* ------------------------------------------------------------------ */
/* Drawing                                                             */
/* ------------------------------------------------------------------ */

const AGENTS = [
  { tab: "theme", task: "Add a dark mode toggle" },
  { tab: "login-test", task: "Fix the flaky login test" },
  { tab: "docs", task: "Document the config file" },
  { tab: "images", task: "Speed up image loading" },
  { tab: "planner", task: "Refactor the grid planner" },
  { tab: "deps", task: "Update the dependencies" },
  { tab: "errors", task: "Tidy the error messages" },
  { tab: "cli", task: "Add a --json flag" },
  { tab: "release", task: "Write the release notes" },
];

/**
 * A terminal with its agent's task, its state and its cursor: solid in the
 * window that has the focus, hollow in the others, as terminals draw it. The
 * border is drawn inside the cell, so two thick ones never meet across the gap.
 * What does not fit a small cell is left out, never shrunk below 11px.
 */
function Terminal({ index, state, focused }: { index: number; state: State; focused: boolean }) {
  const { reduced } = useMotionSafe();
  const s = STATE[state];
  const agent = AGENTS[index % AGENTS.length];
  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden rounded-[4px] [container-type:inline-size]" style={{ background: TERM.bg }}>
      <div className="flex h-5 shrink-0 items-end px-1.5">
        {/* The tab's name where it fits whole; an empty tab where it would be cut. */}
        <span className="h-[18px] min-w-6 rounded-t-[3px] px-1.5 font-mono text-[0.6875rem] leading-[18px]" style={{ background: TERM.tab, color: TERM.text }}>
          <span className="hidden @min-[100px]:inline">{agent.tab}</span>
        </span>
      </div>
      <div className="min-h-0 flex-1 overflow-hidden px-2 py-1.5 font-mono text-[0.6875rem] leading-[1.4]">
        <p className="m-0 hidden @min-[150px]:block" style={{ color: TERM.text }}>
          {agent.task}
        </p>
        <p className="m-0 hidden @min-[84px]:block @min-[150px]:mt-1" style={{ color: state === "working" ? TERM.sub : s.color }}>
          {s.line}
        </p>
        <p className="m-0 mt-1 flex items-center gap-1" style={{ color: TERM.sub }}>
          &gt;
          <span className="inline-block h-[1.05em] w-[0.6em]" style={focused ? { background: TERM.text } : { boxShadow: `inset 0 0 0 1px ${TERM.sub}` }} />
        </p>
      </div>
      <motion.span
        animate={state === "waiting" && !reduced ? { opacity: [1, 0.7, 1] } : { opacity: 1 }}
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[4px] transition-[box-shadow] duration-300 ease-bloom"
        style={{ boxShadow: `inset 0 0 0 ${s.width}px ${s.color}` }}
        transition={state === "waiting" && !reduced ? { duration: 2.4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" } : { duration: 0.2 }}
      />
    </div>
  );
}

/** A monitor of the given orientation, as large as the space allows. */
function Monitor({ portrait, children, grey = false }: { portrait: boolean; children: ReactNode; grey?: boolean }) {
  const { spring } = useMotionSafe();
  const ratio = portrait ? `${SCREEN.h} / ${SCREEN.w}` : `${SCREEN.w} / ${SCREEN.h}`;
  return (
    <div aria-hidden className="absolute inset-0 flex items-center justify-center [container-type:size]">
      <motion.div
        className="relative overflow-hidden rounded-lg ring-1 ring-black/40 transition-[filter] duration-300 ease-bloom dark:ring-white/[0.14]"
        layout
        style={{
          background: TERM.desk,
          aspectRatio: ratio,
          width: portrait ? `min(100cqw, calc(100cqh * ${SCREEN.h / SCREEN.w}))` : `min(100cqw, calc(100cqh * ${SCREEN.w / SCREEN.h}))`,
          filter: grey ? "grayscale(1)" : "none",
        }}
        transition={{ layout: spring }}
      >
        {children}
      </motion.div>
    </div>
  );
}

const box = (rect: Rect) => ({ left: `${rect.x * 100}%`, top: `${rect.y * 100}%`, width: `${rect.w * 100}%`, height: `${rect.h * 100}%` });

/* ------------------------------------------------------------------ */
/* Demos                                                               */
/* ------------------------------------------------------------------ */

/** The key moment: one key, and a fleet snaps into the grid. */
export function FleetDemo() {
  const { reduced, spring, delay } = useMotionSafe();
  const [count, setCount] = useState(6);
  const [portrait, setPortrait] = useState(false);
  const [opened, setOpened] = useState(0);
  const { shape, cells } = useMemo(() => plan(count, portrait ? SCREEN.h : SCREEN.w, portrait ? SCREEN.w : SCREEN.h), [count, portrait]);
  const grid = `${shape.columns} by ${Math.ceil(count / shape.columns)}`;
  const status = opened ? `${count} ${count === 1 ? "terminal" : "terminals"}, ${grid}.` : `Ctrl+Alt+Enter opens the fleet: ${count} ${count === 1 ? "terminal" : "terminals"}, ${grid}.`;

  return (
    <Demo
      caption="Open the fleet, then change the count or turn the monitor. The grid takes the shape Daifuku itself would choose."
      height={440}
      label="Daifuku opening a fleet of terminals in a grid"
      live={opened ? status : ""}
      phoneHeight={500}
    >
      <Frame
        bottom={
          <>
            <BarText>{status}</BarText>
            <span className="hidden items-center gap-1 sm:inline-flex">
              <Keycap>Ctrl</Keycap>
              <Keycap>Alt</Keycap>
              <Keycap>Enter</Keycap>
            </span>
            <Action onClick={() => setOpened((o) => o + 1)} primary>
              {opened ? "Open again" : "Open"}
            </Action>
          </>
        }
        top={
          <>
            <label className="flex min-w-[12rem] flex-1 items-center gap-3 text-[0.8125rem]">
              <span className="w-[6.5rem] shrink-0 font-medium tabular-nums">
                {count} {count === 1 ? "terminal" : "terminals"}
              </span>
              <input
                aria-valuetext={`${count} terminals`}
                className="h-11 min-w-0 flex-1 accent-foreground sm:h-8"
                max={9}
                min={1}
                onChange={(e) => setCount(Number(e.target.value))}
                type="range"
                value={count}
              />
            </label>
            <Pills
              label="Monitor"
              onChange={(v) => setPortrait(v === "portrait")}
              options={[
                { value: "landscape", label: "Landscape" },
                { value: "portrait", label: "Portrait" },
              ]}
              value={portrait ? "portrait" : "landscape"}
            />
          </>
        }
      >
        <Monitor portrait={portrait}>
          <AnimatePresence>
            {opened
              ? cells.map((rect, i) => (
                  <motion.div
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className="absolute"
                    exit={{ opacity: 0 }}
                    initial={reduced ? false : { opacity: 0, y: "40%", scale: 0.85 }}
                    key={`t${i}-${opened}`}
                    layout
                    style={box(rect)}
                    transition={{ ...spring, delay: delay(i * 0.06), layout: spring }}
                  >
                    <Terminal focused={i === 0} index={i} state="working" />
                  </motion.div>
                ))
              : null}
          </AnimatePresence>
        </Monitor>
      </Frame>
    </Demo>
  );
}

/** When each agent changes state, in ms after the demo comes into view. */
const SCRIPT: Array<[number, number, State]> = [
  [900, 3, "waiting"],
  [1700, 1, "done"],
  [2600, 2, "failed"],
  [3500, 5, "waiting"],
];

/** Borders say who needs you; Ctrl+Alt+N goes to the one that has waited longest. */
export function JumpDemo() {
  const [ref, seen] = useSeenOnce<HTMLDivElement>();
  const { reduced } = useMotionSafe();
  const settled: State[] = ["working", "done", "failed", "waiting", "working", "waiting"];
  const [states, setStates] = useState<State[]>(reduced ? settled : Array(6).fill("working"));
  const [since, setSince] = useState<number[]>(reduced ? [0, 0, 0, 1, 0, 2] : Array(6).fill(0));
  const [focus, setFocus] = useState(0);
  const [visit, setVisit] = useState(0);
  const [grey, setGrey] = useState(false);
  const run = useRef(0);
  const { cells } = useMemo(() => plan(6, SCREEN.w, SCREEN.h), []);

  // The agents get on with their work once the fleet is in view.
  useEffect(() => {
    if (!seen || reduced) return;
    const id = ++run.current;
    void (async () => {
      let elapsed = 0;
      for (const [at, index, state] of SCRIPT) {
        await wait(at - elapsed);
        elapsed = at;
        if (run.current !== id) return;
        setStates((s) => s.map((v, i) => (i === index ? state : v)));
        if (state === "waiting") setSince((s) => s.map((v, i) => (i === index ? at : v)));
      }
    })();
  }, [seen, reduced]);

  // Waiting ones, longest first, then the failed ones.
  const order = [
    ...states
      .map((s, i) => ({ s, i }))
      .filter((x) => x.s === "waiting")
      .sort((a, b) => since[a.i] - since[b.i])
      .map((x) => x.i),
    ...states
      .map((s, i) => ({ s, i }))
      .filter((x) => x.s === "failed")
      .map((x) => x.i),
  ];

  const jump = () => {
    setFocus(order[visit % order.length]);
    setVisit((v) => v + 1);
  };

  const waiting = states.filter((s) => s === "waiting").length;
  const status = visit
    ? `On ${AGENTS[focus].tab}: ${STATE[states[focus]].label}.`
    : waiting
      ? `${waiting} waiting for you.`
      : "Six agents at work.";

  return (
    <Demo
      caption="When borders turn yellow, press Jump until it comes back around. Then take the colour away."
      height={440}
      label="Six agents whose borders show their state, and a key that jumps to the one that needs you"
      live={visit ? status : ""}
      phoneHeight={500}
    >
      <div className="absolute inset-0" ref={ref}>
        <Frame
          bottom={
            <>
              <BarText>{status}</BarText>
              <span className="hidden items-center gap-1 sm:inline-flex">
                <Keycap>Ctrl</Keycap>
                <Keycap>Alt</Keycap>
                <Keycap>N</Keycap>
              </span>
              {order.length ? (
                <Action onClick={jump} primary>
                  Jump
                </Action>
              ) : null}
            </>
          }
          top={
            <Pills
              label="Borders"
              onChange={(v) => setGrey(v === "grey")}
              options={[
                { value: "colour", label: "In colour" },
                { value: "grey", label: "Without colour" },
              ]}
              value={grey ? "grey" : "colour"}
            />
          }
        >
          <Monitor grey={grey} portrait={false}>
            {cells.map((rect, i) => (
              <div className="absolute" key={`j${i}`} style={box(rect)}>
                <Terminal focused={focus === i} index={i} state={states[i]} />
              </div>
            ))}
          </Monitor>
        </Frame>
      </div>
    </Demo>
  );
}
