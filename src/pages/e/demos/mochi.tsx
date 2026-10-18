import { AnimatePresence, motion } from "framer-motion";
import { type KeyboardEvent, type ReactNode, useCallback, useEffect, useRef, useState } from "react";
import { Action, Demo, Pills } from "../kit";
import { useMotionSafe, useSeenOnce, wait } from "../motion";

/*
 * Mochi, told through its key moments. The desktop uses the dark palette of
 * the setup it runs on, with the pink focus border; the layouts are Mochi's
 * own arithmetic, ported from its core.
 */

const DESK = {
  bg: "#11111b",
  window: "#1e1e2e",
  bar: "#181825",
  text: "#cdd6f4",
  muted: "#7f849c",
  line: "#313244",
  pink: "#f5c2e7",
};

/** A rectangle as fractions of the area. */
type Rect = { x: number; y: number; w: number; h: number };

type Layout = "bsp" | "columns" | "rows" | "vstack" | "hstack" | "ultrawide" | "grid";

const FULL: Rect = { x: 0, y: 0, w: 1, h: 1 };

/**
 * Mochi's layouts as pure functions of a window count, the same way its core
 * computes them (with no resize offsets and no minimum sizes).
 */
function tile(layout: Layout, n: number): Rect[] {
  if (n <= 0) return [];
  if (n === 1) return [FULL];
  switch (layout) {
    case "bsp": {
      // Every new window halves what the previous one left: left and right
      // first, then top and bottom, alternating.
      const out: Rect[] = [];
      let rest = FULL;
      for (let i = 0; i < n; i += 1) {
        if (i === n - 1) {
          out.push(rest);
          break;
        }
        if (i % 2 === 0) {
          out.push({ ...rest, w: rest.w / 2 });
          rest = { ...rest, x: rest.x + rest.w / 2, w: rest.w / 2 };
        } else {
          out.push({ ...rest, h: rest.h / 2 });
          rest = { ...rest, y: rest.y + rest.h / 2, h: rest.h / 2 };
        }
      }
      return out;
    }
    case "columns":
      return Array.from({ length: n }, (_, i) => ({ x: i / n, y: 0, w: 1 / n, h: 1 }));
    case "rows":
      return Array.from({ length: n }, (_, i) => ({ x: 0, y: i / n, w: 1, h: 1 / n }));
    case "vstack":
      return [
        { x: 0, y: 0, w: 0.5, h: 1 },
        ...Array.from({ length: n - 1 }, (_, i) => ({ x: 0.5, y: i / (n - 1), w: 0.5, h: 1 / (n - 1) })),
      ];
    case "hstack":
      return [
        { x: 0, y: 0, w: 1, h: 0.5 },
        ...Array.from({ length: n - 1 }, (_, i) => ({ x: i / (n - 1), y: 0.5, w: 1 / (n - 1), h: 0.5 })),
      ];
    case "ultrawide": {
      if (n === 2) return [{ x: 0.5, y: 0, w: 0.5, h: 1 }, { x: 0, y: 0, w: 0.5, h: 1 }];
      const stack = n - 2;
      return [
        { x: 0.25, y: 0, w: 0.5, h: 1 },
        { x: 0, y: 0, w: 0.25, h: 1 },
        ...Array.from({ length: stack }, (_, i) => ({ x: 0.75, y: i / stack, w: 0.25, h: 1 / stack })),
      ];
    }
    case "grid": {
      // Roughly square: columns until columns squared covers the count; the
      // extra rows go to the rightmost columns, filled top to bottom.
      let columns = 1;
      while (columns * columns < n) columns += 1;
      const base = Math.floor(n / columns);
      const extra = n % columns;
      const out: Rect[] = [];
      for (let c = 0; c < columns; c += 1) {
        const rows = base + (c >= columns - extra ? 1 : 0);
        for (let r = 0; r < rows; r += 1) out.push({ x: c / columns, y: r / rows, w: 1 / columns, h: 1 / rows });
      }
      return out;
    }
  }
}

/** The windows on the demo desktop: a few of his own apps and a terminal. */
const APPS = [
  { name: "Remnants", kind: "code" },
  { name: "Jester", kind: "text" },
  { name: "Terminal", kind: "term" },
  { name: "Inkling", kind: "text" },
  { name: "Terminal", kind: "term" },
] as const;

const LINES: Record<(typeof APPS)[number]["kind"], Array<[number, string]>> = {
  code: [[38, "#cba6f7"], [62, "#89b4fa"], [48, "#a6e3a1"], [70, "#7f849c"], [30, "#f9e2af"], [55, "#89b4fa"]],
  text: [[70, "#bac2de"], [86, "#7f849c"], [64, "#7f849c"], [78, "#7f849c"], [40, "#7f849c"]],
  term: [[24, "#a6e3a1"], [56, "#7f849c"], [44, "#7f849c"], [62, "#7f849c"], [20, "#f5c2e7"]],
};

/** One window: a title bar and a few lines that hint at what it shows. */
function Window({ app, focused, dim = false }: { app: (typeof APPS)[number]; focused: boolean; dim?: boolean }) {
  return (
    <div
      className="flex h-full w-full flex-col overflow-hidden rounded-[5px] transition-[box-shadow,opacity] duration-200 ease-bloom"
      style={{
        background: DESK.window,
        boxShadow: focused ? `0 0 0 2px ${DESK.pink}` : `0 0 0 1px ${DESK.line}`,
        opacity: dim ? 0.55 : 1,
      }}
    >
      <div className="flex h-[14px] shrink-0 items-center gap-1 px-1.5 sm:h-[18px]" style={{ background: DESK.bar }}>
        <span className="truncate text-[0.5625rem] sm:text-[0.625rem]" style={{ color: focused ? DESK.text : DESK.muted }}>
          {app.name}
        </span>
        <span className="ml-auto flex gap-[3px]">
          {[0, 1, 2].map((i) => (
            <span className="h-[3px] w-[5px] rounded-full" key={i} style={{ background: DESK.line }} />
          ))}
        </span>
      </div>
      <div className="flex min-h-0 flex-1 flex-col gap-[5px] overflow-hidden p-1.5 sm:gap-1.5 sm:p-2">
        {LINES[app.kind].map(([w, c], i) => (
          <span className="h-[3px] shrink-0 rounded-full sm:h-1" key={i} style={{ width: `${w}%`, background: c, opacity: 0.55 }} />
        ))}
      </div>
    </div>
  );
}

/** Where windows sit before Mochi starts: floating, overlapping, on top of each other. */
const FLOATING: Rect[] = [
  { x: 0.06, y: 0.08, w: 0.52, h: 0.56 },
  { x: 0.34, y: 0.2, w: 0.5, h: 0.52 },
  { x: 0.18, y: 0.38, w: 0.46, h: 0.5 },
  { x: 0.48, y: 0.06, w: 0.44, h: 0.46 },
  { x: 0.4, y: 0.44, w: 0.5, h: 0.48 },
];

/** A window placed at a rectangle of the desktop, with Mochi's gap around it. */
function Placed({
  rect,
  children,
  index,
  onClick,
}: {
  rect: Rect;
  children: ReactNode;
  index: number;
  onClick?: () => void;
}) {
  const { spring, fade } = useMotionSafe();
  return (
    <motion.div
      animate={{ opacity: 1, scale: 1 }}
      className="absolute p-[3px] sm:p-1"
      exit={{ opacity: 0, scale: 0.96 }}
      initial={{ opacity: 0, scale: 0.96 }}
      layout
      onClick={onClick}
      style={{
        left: `${rect.x * 100}%`,
        top: `${rect.y * 100}%`,
        width: `${rect.w * 100}%`,
        height: `${rect.h * 100}%`,
        zIndex: index,
      }}
      transition={{ layout: spring, ...fade }}
    >
      {children}
    </motion.div>
  );
}

/** The direction keys move focus to the nearest window that way. */
function neighbour(rects: Rect[], from: number, key: string): number {
  const dir = { h: [-1, 0], arrowleft: [-1, 0], l: [1, 0], arrowright: [1, 0], k: [0, -1], arrowup: [0, -1], j: [0, 1], arrowdown: [0, 1] }[key];
  if (!dir) return from;
  const c = (r: Rect) => [r.x + r.w / 2, r.y + r.h / 2];
  const [fx, fy] = c(rects[from]);
  let best = from;
  let bestScore = Number.POSITIVE_INFINITY;
  rects.forEach((r, i) => {
    if (i === from) return;
    const [x, y] = c(r);
    const along = (x - fx) * dir[0] + (y - fy) * dir[1];
    if (along <= 0.01) return;
    const across = Math.abs((x - fx) * dir[1]) + Math.abs((y - fy) * dir[0]);
    const score = along + across * 2;
    if (score < bestScore) {
      bestScore = score;
      best = i;
    }
  });
  return best;
}

/** The desktop surface every Mochi demo draws on. */
function Desk({ children, label }: { children: ReactNode; label?: ReactNode }) {
  return (
    <div className="absolute inset-3 flex flex-col overflow-hidden rounded-xl sm:inset-5" style={{ background: DESK.bg }}>
      <div className="relative min-h-0 flex-1 m-2 sm:m-3">{children}</div>
      {label ? (
        <div className="flex h-10 shrink-0 items-center gap-2 px-3 text-[0.6875rem] sm:px-4" style={{ color: DESK.muted }}>
          {label}
        </div>
      ) : null}
    </div>
  );
}

function Key({ children }: { children: ReactNode }) {
  return (
    <kbd className="inline-flex h-5 min-w-5 items-center justify-center rounded border px-1 font-sans text-[0.625rem]" style={{ borderColor: DESK.line, color: DESK.text }}>
      {children}
    </kbd>
  );
}

/** The key moment: floating windows snap into tiles, and focus follows the keys. */
export function TilingDemo() {
  const [ref, seen] = useSeenOnce<HTMLDivElement>();
  const { reduced } = useMotionSafe();
  const [tiled, setTiled] = useState(false);
  const [count, setCount] = useState(3);
  const [focus, setFocus] = useState(0);
  const run = useRef(0);
  const rects = tiled ? tile("bsp", count) : FLOATING.slice(0, count);

  useEffect(() => {
    if (!seen || reduced) return;
    const id = ++run.current;
    void (async () => {
      await wait(600);
      if (run.current !== id) return;
      setTiled(true);
      await wait(1100);
      if (run.current !== id) return;
      setFocus(1);
    })();
  }, [seen, reduced]);

  const onKey = (event: KeyboardEvent) => {
    const key = event.key.toLowerCase();
    if (!tiled || !["h", "j", "k", "l", "arrowleft", "arrowright", "arrowup", "arrowdown"].includes(key)) return;
    event.preventDefault();
    run.current++;
    setFocus((f) => neighbour(rects, f, key));
  };

  return (
    <Demo
      caption="Press Start, then H, J, K and L to move the pink focus. In Mochi those are Alt with the same letters."
      height={380}
      label="Mochi tiling floating windows and moving focus between them"
      live={tiled ? `${count} windows tiled. ${APPS[focus]?.name ?? ""} has focus.` : ""}
      phoneHeight={340}
    >
      <div className="absolute inset-0" ref={ref}>
        <Desk
          label={
            <>
              <span className="hidden items-center gap-1 sm:inline-flex">
                Focus <Key>H</Key>
                <Key>J</Key>
                <Key>K</Key>
                <Key>L</Key>
              </span>
              <span className="ml-auto flex gap-1.5">
                <Action dark disabled={!tiled || count >= 5} onClick={() => setCount((c) => Math.min(5, c + 1))}>
                  Add window
                </Action>
                {tiled ? (
                  <Action
                    dark
                    onClick={() => {
                      run.current++;
                      setTiled(false);
                      setCount(3);
                      setFocus(0);
                    }}
                  >
                    Reset
                  </Action>
                ) : (
                  <Action dark onClick={() => setTiled(true)} primary>
                    Start
                  </Action>
                )}
              </span>
            </>
          }
        >
          {/* The desktop takes the keys while it has focus, like Mochi does. */}
          <div
            aria-label="Desktop. Use H, J, K and L to move focus once the windows are tiled."
            className="absolute inset-0 rounded-md outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:[outline-color:#f5c2e7]"
            onKeyDown={onKey}
            role="application"
            tabIndex={0}
          >
            <AnimatePresence>
              {rects.map((rect, i) => (
                <Placed index={tiled ? 1 : i + 1} key={`w${i}`} onClick={() => setFocus(i)} rect={rect}>
                  <Window app={APPS[i]} focused={tiled && i === focus} />
                </Placed>
              ))}
            </AnimatePresence>
          </div>
        </Desk>
      </div>
    </Demo>
  );
}

const LAYOUTS: Array<{ value: Layout; label: string }> = [
  { value: "bsp", label: "BSP" },
  { value: "columns", label: "Columns" },
  { value: "rows", label: "Rows" },
  { value: "vstack", label: "Vertical stack" },
  { value: "hstack", label: "Horizontal stack" },
  { value: "ultrawide", label: "Ultrawide" },
  { value: "grid", label: "Grid" },
];

/** Seven layouts, the same four windows. */
export function LayoutsDemo() {
  const [ref, seen] = useSeenOnce<HTMLDivElement>();
  const { reduced } = useMotionSafe();
  const [layout, setLayout] = useState<Layout>("bsp");
  const run = useRef(0);

  useEffect(() => {
    if (!seen || reduced) return;
    const id = ++run.current;
    void (async () => {
      for (const next of ["columns", "grid", "vstack", "bsp"] as Layout[]) {
        await wait(1000);
        if (run.current !== id) return;
        setLayout(next);
      }
    })();
  }, [seen, reduced]);

  const pick = useCallback((next: Layout) => {
    run.current++;
    setLayout(next);
  }, []);

  return (
    <Demo
      caption="Pick a layout and the same four windows re-tile. In Mochi, Alt+Shift+V cycles through them."
      height={380}
      label="Mochi's seven layouts applied to four windows"
      live={`${LAYOUTS.find((l) => l.value === layout)?.label} layout.`}
      phoneHeight={420}
    >
      <div className="absolute inset-0 flex flex-col" ref={ref}>
        <div className="px-4 pt-4 sm:px-5 sm:pt-4">
          <Pills label="Layout" onChange={pick} options={LAYOUTS} value={layout} />
        </div>
        <div className="relative min-h-0 flex-1">
          <div className="absolute inset-3 rounded-xl sm:inset-x-5 sm:top-3 sm:bottom-5" style={{ background: DESK.bg }}>
            <div className="absolute inset-2 sm:inset-3">
              {tile(layout, 4).map((rect, i) => (
                <Placed index={1} key={`l${i}`} rect={rect}>
                  <Window app={APPS[i]} focused={i === 0} />
                </Placed>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Demo>
  );
}

/** Stop Mochi and every window it was hiding comes back. */
export function StopDemo() {
  const [ref, seen] = useSeenOnce<HTMLDivElement>();
  const { reduced, fade } = useMotionSafe();
  const [stopped, setStopped] = useState(false);
  const played = useRef(false);

  useEffect(() => {
    if (!seen || played.current || reduced) return;
    played.current = true;
    const t = window.setTimeout(() => setStopped(true), 1200);
    return () => window.clearTimeout(t);
  }, [seen, reduced]);

  const shown = tile("bsp", 2);
  const hidden: Rect[] = [
    { x: 0.14, y: 0.12, w: 0.5, h: 0.6 },
    { x: 0.4, y: 0.3, w: 0.5, h: 0.6 },
  ];

  return (
    <Demo
      caption="Workspace 2 holds two hidden windows. Stop Mochi and they come back, with the borders gone."
      height={330}
      label="Mochi stopping and bringing back every window it was hiding"
      live={stopped ? "Mochi stopped. All four windows are back." : "Mochi is tiling workspace 1. Two windows are hidden on workspace 2."}
      phoneHeight={320}
    >
      <div className="absolute inset-0" ref={ref}>
        <Desk
          label={
            <>
              <span className="flex items-center gap-1">
                {[1, 2].map((n) => (
                  <span
                    className="inline-flex h-5 w-5 items-center justify-center rounded text-[0.625rem] transition-colors duration-200"
                    key={n}
                    style={{
                      background: !stopped && n === 1 ? "rgb(245 194 231 / 0.18)" : "transparent",
                      color: stopped ? DESK.line : n === 1 ? DESK.pink : DESK.muted,
                    }}
                  >
                    {n}
                  </span>
                ))}
              </span>
              <span className="hidden sm:inline">{stopped ? "Mochi stopped" : "Tiling workspace 1"}</span>
              <span className="ml-auto">
                {stopped ? (
                  <Action dark onClick={() => setStopped(false)}>
                    Start again
                  </Action>
                ) : (
                  <Action dark onClick={() => setStopped(true)} primary>
                    Stop Mochi
                  </Action>
                )}
              </span>
            </>
          }
        >
          {shown.map((rect, i) => (
            <Placed index={2} key={`s${i}`} rect={stopped ? { ...rect, x: rect.x + 0.02, y: rect.y + 0.03, w: rect.w - 0.04, h: rect.h - 0.06 } : rect}>
              <Window app={APPS[i]} focused={!stopped && i === 0} />
            </Placed>
          ))}
          <AnimatePresence>
            {stopped
              ? hidden.map((rect, i) => (
                  <motion.div
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute p-[3px] sm:p-1"
                    exit={{ opacity: 0 }}
                    initial={{ opacity: 0, y: 8 }}
                    key={`h${i}`}
                    style={{ left: `${rect.x * 100}%`, top: `${rect.y * 100}%`, width: `${rect.w * 100}%`, height: `${rect.h * 100}%`, zIndex: 3 + i }}
                    transition={{ ...fade, delay: reduced ? 0 : 0.12 + i * 0.08 }}
                  >
                    <Window app={APPS[i + 2]} focused={false} />
                  </motion.div>
                ))
              : null}
          </AnimatePresence>
        </Desk>
      </div>
    </Demo>
  );
}
