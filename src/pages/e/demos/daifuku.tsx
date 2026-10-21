import { AnimatePresence, motion } from "framer-motion";
import { type ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { Action, BarText, Demo, Frame, Pills } from "../kit";
import { useMotionSafe, useSeenOnce, wait } from "../motion";
import { RING } from "../style";

/*
 * Daifuku, told through its key moments. The grid is Daifuku's own planner,
 * ported line for line, on a 1366 by 768 monitor. Each terminal is drawn the
 * way it really looks: a terminal window per agent, its tab titled
 * "Administrator: demo N", running one of Daifuku's scripted demo agents,
 * with the border Daifuku draws for its state.
 */

const TERM = {
  desk: "#0d0d14",
  bg: "#1e1e2b",
  bar: "#181824",
  text: "#cdd6f4",
  sub: "#a6adc8",
  dim: "#8f95ad",
  tab: "#f5c2e7",
  /** The tab of a window without the focus: the same pink, darker. */
  tabDim: "#a98aa5",
  tabText: "#1e1e2e",
};

type State = "working" | "waiting" | "done" | "failed";

/**
 * Each state's colour and width. Daifuku draws 2, 4, 6 and 8 pixels at its
 * default width of 4; the demo's monitor is small, so these are the same
 * steps at three quarters, which keeps each state readable without colour.
 */
const STATE: Record<State, { color: string; width: number; label: string }> = {
  done: { color: "#a6e3a1", width: 1.5, label: "done" },
  working: { color: "#89b4fa", width: 3, label: "working" },
  failed: { color: "#f38ba8", width: 4.5, label: "failed" },
  waiting: { color: "#f9e2af", width: 6, label: "waiting for you" },
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

/** Daifuku's scripted demo agents: what each is asked, and the steps it prints. */
const AGENTS: Array<{ task: string; steps: string[]; end: Partial<Record<State, string>> }> = [
  { task: "Add a dark mode toggle", steps: ["Reading src/theme.rs", "Planning 3 edits", "Running tests"], end: {} },
  { task: "Fix the flaky login test", steps: ["Found a race on the session cookie", "20 of 20 passed"], end: { done: "Done." } },
  { task: "Document the config file", steps: ["Listing 14 keys", "Checking every example parses"], end: { failed: "API error: rate limited.| Retrying in a few seconds." } },
  { task: "Speed up the image loader", steps: ["Moving it to a worker", "Benchmark: 180 ms to 40 ms"], end: { waiting: "Allow the edit?| Press Enter to approve." } },
  { task: "Refactor the grid planner", steps: ["Splitting shape and placement", "Running tests"], end: {} },
  { task: "Update the dependencies", steps: ["4 have new versions", "Updating Cargo.lock"], end: { waiting: "Allow the edit?| Press Enter to approve." } },
  { task: "Tidy the error messages", steps: ["Rewording 9 messages"], end: {} },
  { task: "Add a --json flag", steps: ["Adding the flag"], end: {} },
  { task: "Write the release notes", steps: ["Drafting 0.4.0"], end: {} },
];

/**
 * One agent's terminal. The tab is bright in the window that has the focus
 * and dimmed in the others, as the terminal draws it; the border is drawn
 * inside the cell, so two thick ones never meet across the gap. A small cell
 * leaves lines out rather than shrinking them below 11px: the step goes
 * first, then the tab's "Administrator:".
 */
function Terminal({ index, state, focused, flash = 0 }: { index: number; state: State; focused: boolean; flash?: number }) {
  const { reduced } = useMotionSafe();
  const s = STATE[state];
  const agent = AGENTS[index % AGENTS.length];
  const last = state === "working" ? agent.steps[agent.steps.length - 1] : (agent.end[state] ?? agent.steps[agent.steps.length - 1]);
  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden rounded-[4px] [container-type:inline-size]" style={{ background: TERM.bg }}>
      <div className="flex h-[22px] shrink-0 items-end gap-1 px-1.5" style={{ background: TERM.bar }}>
        <span
          className="flex h-[18px] min-w-0 items-center rounded-t-[4px] px-1.5 font-sans text-[0.6875rem] leading-none transition-colors duration-200"
          style={{ background: focused ? TERM.tab : TERM.tabDim, color: TERM.tabText }}
        >
          <span className="hidden whitespace-nowrap @min-[150px]:inline">Administrator:&nbsp;</span>
          <span className="whitespace-nowrap">demo {index + 1}</span>
        </span>
        <span className="mb-[3px] ml-auto hidden gap-2 text-[0.6875rem] leading-none @min-[210px]:flex" style={{ color: focused ? TERM.text : TERM.dim }}>
          <span>–</span>
          <span>□</span>
          <span>×</span>
        </span>
      </div>
      {/* What does not fit runs on below the window's edge, as in a small terminal, and fades there. */}
      <div className="min-h-0 flex-1 overflow-hidden px-2 py-1.5 font-mono text-[0.6875rem] leading-[1.35] [mask-image:linear-gradient(to_bottom,black_calc(100%-12px),transparent)]">
        {/* In a narrow cell a state's own line matters more than the task. */}
        <p className={`m-0 ${agent.end[state] ? "hidden @min-[140px]:block" : ""}`} style={{ color: TERM.text }}>
          &gt; {agent.task}
        </p>
        {state === "working" || last === agent.steps[agent.steps.length - 1] ? null : (
          <p className="m-0 hidden pl-[1ch] @min-[150px]:block" style={{ color: TERM.sub }}>
            {agent.steps[agent.steps.length - 1]}
          </p>
        )}
        {/* A state's line in full where it fits; in a narrow cell, its first sentence. */}
        <p className="m-0 pl-[1ch]" style={{ color: state === "working" ? TERM.sub : s.color }}>
          {last.split("|")[0]}
          {last.includes("|") ? <span className="hidden @min-[130px]:inline">{last.split("|")[1]}</span> : null}
        </p>
        <span className="mt-0.5 ml-[1ch] block h-[1.1em] w-[2px]" style={{ background: focused ? TERM.text : "transparent" }} />
      </div>
      <motion.span
        animate={state === "waiting" && !reduced ? { opacity: [1, 0.7, 1] } : { opacity: 1 }}
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[4px] transition-[box-shadow] duration-300 ease-bloom"
        style={{ boxShadow: `inset 0 0 0 ${s.width}px ${s.color}` }}
        transition={state === "waiting" && !reduced ? { duration: 2.4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" } : { duration: 0.2 }}
      />
      {/* Where Jump landed: a white ring that flashes and fades. The demo's mark, not Daifuku's. */}
      {flash && !reduced ? (
        <motion.span
          animate={{ opacity: [0, 1, 1, 0] }}
          aria-hidden
          className="pointer-events-none absolute -inset-[3px] rounded-[6px]"
          key={flash}
          style={{ boxShadow: "0 0 0 2px #ffffff" }}
          transition={{ duration: 1.1, times: [0, 0.12, 0.55, 1] }}
        />
      ) : null}
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
        className="relative rounded-lg ring-1 ring-black/40 transition-[filter] duration-300 ease-bloom dark:ring-white/25"
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
  const terminals = `${count} ${count === 1 ? "terminal" : "terminals"}`;
  const status = opened ? `${terminals}, ${grid}.` : `Ctrl+Alt+Enter opens ${terminals}, ${grid}, in the dashed cells.`;

  return (
    <Demo
      caption="Open the fleet, then change the count or turn the monitor."
      height={440}
      label="Daifuku opening a fleet of terminals in a grid"
      live={opened ? status : ""}
      phoneHeight={420}
    >
      <Frame
        bottom={
          <>
            <BarText>{status}</BarText>
            <Action onClick={() => setOpened((o) => o + 1)} primary width="min-w-[7.5rem]">
              {opened ? "Open again" : "Open"}
            </Action>
          </>
        }
        top={
          <>
            <label className="flex min-w-[12rem] flex-1 items-center gap-3 text-[0.8125rem]">
              <span className="w-[6.5rem] shrink-0 font-medium tabular-nums">{terminals}</span>
              <input
                aria-valuetext={terminals}
                className={`h-11 min-w-0 flex-1 rounded-full accent-foreground sm:h-8 ${RING}`}
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
          {/* Before the fleet opens: the cells the planner has chosen, following the controls. */}
          {cells.map((rect, i) => (
            <motion.div
              className="absolute rounded-[4px] border border-white/25 border-dashed"
              key={`c${i}`}
              layout
              style={{ ...box(rect), opacity: opened ? 0 : 1 }}
              transition={{ layout: spring }}
            />
          ))}
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
  const [miss, setMiss] = useState(false);
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
    if (!order.length) {
      setMiss(true);
      return;
    }
    setMiss(false);
    setFocus(order[visit % order.length]);
    setVisit((v) => v + 1);
  };

  const waiting = states.filter((s) => s === "waiting").length;
  const status = miss
    ? "Nobody needs you yet, so the focus stays where it is."
    : visit
      ? `On demo ${focus + 1}: ${STATE[states[focus]].label}.`
      : waiting
        ? `${waiting} waiting. Ctrl+Alt+N goes to the one that has waited longest.`
        : "Six agents at work. Ctrl+Alt+N waits for one to need you.";

  return (
    <Demo
      caption="When borders turn yellow, press Jump until it comes back around. Then take the colour away."
      height={440}
      label="Six agents whose borders show their state, and a key that jumps to the one that needs you"
      live={visit || miss ? status : ""}
      phoneHeight={420}
    >
      <div className="absolute inset-0" ref={ref}>
        <Frame
          bottom={
            <>
              <BarText>{status}</BarText>
              <Action onClick={jump} primary width="min-w-[5.5rem]">
                Jump
              </Action>
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
                <Terminal flash={focus === i ? visit : 0} focused={focus === i} index={i} state={states[i]} />
              </div>
            ))}
          </Monitor>
        </Frame>
      </div>
    </Demo>
  );
}
