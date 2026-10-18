import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus } from "lucide-react";
import { type ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { Action, Demo, Pills } from "../kit";
import { useMotionSafe, useSeenOnce, wait } from "../motion";

/*
 * Daifuku, told through its key moments. The grid is Daifuku's own planner,
 * ported line for line; the states, their colours and their border widths are
 * the ones it draws.
 */

const TERM = {
  desk: "#0f0f17",
  bg: "#1c1c28",
  bar: "#15151f",
  text: "#cdd6f4",
  muted: "#6c7086",
  tab: "#f5c2e7",
};

type State = "working" | "waiting" | "done" | "failed";

/** Each state's colour and its own border width, so it reads without colour too. */
const STATE: Record<State, { color: string; width: number; label: string }> = {
  done: { color: "#a6e3a1", width: 1, label: "done" },
  working: { color: "#89b4fa", width: 2, label: "working" },
  failed: { color: "#f38ba8", width: 3, label: "failed" },
  waiting: { color: "#f9e2af", width: 4, label: "waiting for you" },
};

/* ------------------------------------------------------------------ */
/* The planner, as in daifuku-core's grid.rs                           */
/* ------------------------------------------------------------------ */

const TARGET_ASPECT = 1.3;
const EMPTY_CELL_COST = 0.25;
const OUTER = 24;
const INNER = 20;

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

/** One rectangle per terminal, row by row; a short last row shares the full width. */
function plan(count: number, width: number, height: number) {
  const shape = shapeFor(count, width, height);
  const rows = Math.min(Math.ceil(count / shape.columns), shape.rows);
  const cells: Array<{ x: number; y: number; w: number; h: number }> = [];
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

const WORK: string[][] = [
  ["> Add a dark mode toggle", "  Reading src/theme.rs", "  Planning 3 edits"],
  ["> Fix the flaky login test", "  Running tests 20 times", "  20 of 20 passed"],
  ["> Document the config file", "  Listing 14 keys", "  Writing docs/config.md"],
  ["> Speed up the image loader", "  Profiling src/images.rs", "  Moving it to a worker"],
  ["> Refactor the grid planner", "  Reading src/grid.rs", "  Editing src/grid.rs"],
  ["> Update the dependencies", "  Checking 31 crates", "  4 have new versions"],
  ["> Tidy the error messages", "  Reading src/error.rs", "  Rewording 9 messages"],
  ["> Add a --json flag", "  Reading src/cli.rs", "  Adding the flag"],
  ["> Write the release notes", "  Reading the changelog", "  Drafting 0.4.0"],
];

const LAST_LINE: Record<State, string> = {
  working: "  Running tests",
  waiting: "  Allow the edit? Press Enter",
  done: "  Done.",
  failed: "  API error: rate limited",
};

/** A terminal with its agent's work and a border for its state. */
function Terminal({ index, state, dim = false, small = false }: { index: number; state: State; dim?: boolean; small?: boolean }) {
  const s = STATE[state];
  const lines = [...WORK[index % WORK.length], LAST_LINE[state]];
  return (
    <div
      className="flex h-full w-full flex-col overflow-hidden rounded-[4px] transition-[box-shadow,opacity] duration-300 ease-bloom"
      style={{ background: TERM.bg, boxShadow: `0 0 0 ${s.width}px ${s.color}`, opacity: dim ? 0.4 : 1 }}
    >
      <div className="flex h-[13px] shrink-0 items-center px-1 sm:h-4" style={{ background: TERM.bar }}>
        <span className="truncate rounded-[2px] px-1 text-[0.5rem] leading-[11px] sm:text-[0.5625rem]" style={{ background: "rgb(245 194 231 / 0.85)", color: "#1e1e2e" }}>
          demo {index + 1}
        </span>
      </div>
      <div className={`min-h-0 flex-1 overflow-hidden px-1.5 py-1 font-mono leading-[1.45] ${small ? "text-[0.4375rem]" : "text-[0.5rem] sm:text-[0.5625rem]"}`} style={{ color: TERM.muted }}>
        {lines.map((line, i) => (
          <div className="truncate" key={i} style={{ color: i === lines.length - 1 && state !== "working" ? s.color : i === 0 ? TERM.text : undefined }}>
            {line}
          </div>
        ))}
      </div>
    </div>
  );
}

/** A monitor of the given orientation, as large as the space allows. */
function Monitor({ portrait, children }: { portrait: boolean; children: ReactNode }) {
  const { spring } = useMotionSafe();
  return (
    <div className="absolute inset-0 flex items-center justify-center [container-type:size]">
      <motion.div
        className="relative overflow-hidden rounded-lg ring-1 ring-black/40"
        layout
        style={{
          background: TERM.desk,
          aspectRatio: portrait ? "9 / 16" : "16 / 9",
          width: portrait ? "min(100cqw, calc(100cqh * 9 / 16))" : "min(100cqw, calc(100cqh * 16 / 9))",
        }}
        transition={{ layout: spring }}
      >
        {children}
      </motion.div>
    </div>
  );
}

function Cell({ rect, children, order }: { rect: { x: number; y: number; w: number; h: number }; children: ReactNode; order: number }) {
  const { reduced, spring, delay } = useMotionSafe();
  return (
    <motion.div
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className="absolute"
      exit={{ opacity: 0, scale: 0.9 }}
      initial={reduced ? false : { opacity: 0, y: "60%", scale: 0.8 }}
      layout
      style={{ left: `${rect.x * 100}%`, top: `${rect.y * 100}%`, width: `${rect.w * 100}%`, height: `${rect.h * 100}%` }}
      transition={{ ...spring, delay: delay(order * 0.05), layout: spring }}
    >
      {children}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* Demos                                                               */
/* ------------------------------------------------------------------ */

/** The key moment: one key, and a fleet snaps into the grid. */
export function FleetDemo() {
  const [ref, seen] = useSeenOnce<HTMLDivElement>();
  const { reduced } = useMotionSafe();
  const [count, setCount] = useState(6);
  const [portrait, setPortrait] = useState(false);
  const open = reduced || seen;
  const [fly, setFly] = useState(0);
  const { shape, cells } = useMemo(() => plan(count, portrait ? 1080 : 1920, portrait ? 1920 : 1080), [count, portrait]);

  return (
    <Demo
      caption="Change the count or turn the monitor: the grid picks its shape the way Daifuku does."
      height={380}
      label="Daifuku opening a fleet of terminals in a grid"
      live={`${count} terminals in ${shape.columns} by ${shape.rows}.`}
      phoneHeight={portrait ? 460 : 330}
    >
      <div className="absolute inset-0 flex flex-col" ref={ref}>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 px-4 pt-4 sm:px-5">
          <div className="flex items-center gap-1">
            <Action disabled={count <= 1} onClick={() => setCount((c) => Math.max(1, c - 1))}>
              <Minus aria-label="One agent fewer" className="h-3.5 w-3.5" />
            </Action>
            <span className="w-[4.75rem] text-center font-medium text-[0.8125rem] tabular-nums">
              {count} {count === 1 ? "agent" : "agents"}
            </span>
            <Action disabled={count >= 9} onClick={() => setCount((c) => Math.min(9, c + 1))}>
              <Plus aria-label="One agent more" className="h-3.5 w-3.5" />
            </Action>
          </div>
          <Pills
            label="Monitor"
            onChange={(v) => setPortrait(v === "portrait")}
            options={[
              { value: "landscape", label: "Landscape" },
              { value: "portrait", label: "Portrait" },
            ]}
            value={portrait ? "portrait" : "landscape"}
          />
          <span className="ml-auto flex items-center gap-3">
            <span className="text-[0.75rem] text-muted-foreground tabular-nums">
              {shape.columns} by {shape.rows}
            </span>
            <Action onClick={() => setFly((f) => f + 1)}>Replay</Action>
          </span>
        </div>
        <div className="relative m-4 min-h-0 flex-1 sm:mx-5 sm:mb-5">
          <Monitor portrait={portrait}>
            <AnimatePresence>
              {open
                ? cells.map((rect, i) => (
                    <Cell key={`t${i}-${fly}`} order={i} rect={rect}>
                      <Terminal index={i} small={portrait || count > 6} state="working" />
                    </Cell>
                  ))
                : null}
            </AnimatePresence>
          </Monitor>
        </div>
      </div>
    </Demo>
  );
}

const SCRIPT: Array<[number, number, State]> = [
  [700, 3, "waiting"],
  [1400, 1, "done"],
  [2200, 2, "failed"],
  [3000, 5, "waiting"],
];

/** Borders say who needs you; Jump goes to the one that has waited longest. */
export function JumpDemo() {
  const [ref, seen] = useSeenOnce<HTMLDivElement>();
  const { reduced } = useMotionSafe();
  const settled: State[] = ["working", "done", "failed", "waiting", "working", "waiting"];
  const [states, setStates] = useState<State[]>(reduced ? settled : Array(6).fill("working"));
  const [since, setSince] = useState<number[]>(reduced ? [0, 0, 0, 1, 0, 2] : Array(6).fill(0));
  const [focus, setFocus] = useState<number | null>(null);
  const [visit, setVisit] = useState(0);
  const run = useRef(0);
  const { cells } = useMemo(() => plan(6, 1920, 1080), []);

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
    ...states.map((s, i) => ({ s, i })).filter((x) => x.s === "waiting").sort((a, b) => since[a.i] - since[b.i]).map((x) => x.i),
    ...states.map((s, i) => ({ s, i })).filter((x) => x.s === "failed").map((x) => x.i),
  ];

  const jump = () => {
    if (!order.length) return;
    setFocus(order[visit % order.length]);
    setVisit((v) => v + 1);
  };

  return (
    <Demo
      caption="Yellow is waiting for you. Jump goes to the one that has waited longest, then to the ones that failed."
      height={360}
      label="Six agents whose borders show their state, and a key that jumps to the one that needs you"
      live={focus === null ? "" : `demo ${focus + 1}, ${STATE[states[focus]].label}.`}
      phoneHeight={290}
    >
      <div className="absolute inset-0 flex flex-col" ref={ref}>
        <div className="flex items-center gap-2 px-4 pt-4 sm:px-5">
          <Action disabled={!order.length} onClick={jump} primary>
            Jump
          </Action>
          <Action
            onClick={() => {
              setFocus(null);
              setVisit(0);
            }}
          >
            Show all
          </Action>
          <span className="ml-auto hidden text-[0.75rem] text-muted-foreground sm:inline">
            {focus === null ? "Daifuku binds Jump to one key" : `demo ${focus + 1}: ${STATE[states[focus]].label}`}
          </span>
        </div>
        <div className="relative m-4 min-h-0 flex-1 sm:mx-5 sm:mb-5">
          <Monitor portrait={false}>
            {cells.map((rect, i) => (
              <div
                className="absolute"
                key={`j${i}`}
                style={{ left: `${rect.x * 100}%`, top: `${rect.y * 100}%`, width: `${rect.w * 100}%`, height: `${rect.h * 100}%` }}
              >
                <Terminal dim={focus !== null && focus !== i} index={i} state={states[i]} />
              </div>
            ))}
          </Monitor>
        </div>
      </div>
    </Demo>
  );
}

/** The four states read without colour: each has its own border width. */
export function GreyscaleDemo() {
  const [grey, setGrey] = useState(false);
  const { cells } = useMemo(() => plan(4, 1920, 1080), []);
  const states: State[] = ["done", "working", "failed", "waiting"];
  return (
    <Demo
      caption="Switch to greyscale: done is thin, working normal, failed thicker and waiting thickest."
      height={340}
      label="The four border states in colour and in greyscale"
      live={grey ? "Greyscale." : "Colour."}
      phoneHeight={290}
    >
      <div className="absolute inset-0 flex flex-col">
        <div className="px-4 pt-4 sm:px-5">
          <Pills
            label="Colour"
            onChange={(v) => setGrey(v === "grey")}
            options={[
              { value: "colour", label: "Colour" },
              { value: "grey", label: "Greyscale" },
            ]}
            value={grey ? "grey" : "colour"}
          />
        </div>
        <div className="relative m-4 min-h-0 flex-1 transition-[filter] duration-300 ease-bloom sm:mx-5 sm:mb-5" style={{ filter: grey ? "grayscale(1)" : "none" }}>
          <Monitor portrait={false}>
            {cells.map((rect, i) => (
              <div
                className="absolute"
                key={`g${i}`}
                style={{ left: `${rect.x * 100}%`, top: `${rect.y * 100}%`, width: `${rect.w * 100}%`, height: `${rect.h * 100}%` }}
              >
                <Terminal index={i} state={states[i]} />
                <span className="absolute right-1.5 bottom-1 text-[0.5625rem] sm:text-[0.625rem]" style={{ color: TERM.muted }}>
                  {STATE[states[i]].label}
                </span>
              </div>
            ))}
          </Monitor>
        </div>
      </div>
    </Demo>
  );
}
