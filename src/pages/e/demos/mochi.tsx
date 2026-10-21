import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { type KeyboardEvent, type ReactNode, useState } from "react";
import { Action, BarText, Demo, Frame, Pills } from "../kit";
import { useMotionSafe } from "../motion";

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

/** The windows on the demo desktop: a few of my own programs and a terminal. */
const APPS = [
  { name: "Remnants", kind: "code" },
  { name: "Jester", kind: "list" },
  { name: "Terminal", kind: "term" },
  { name: "Inkling", kind: "notes" },
  { name: "Spectrum", kind: "swatch" },
] as const;
type App = (typeof APPS)[number];

const C = { kw: "#cba6f7", fn: "#89b4fa", str: "#a6e3a1", num: "#fab387", dim: "#9399b2", text: "#cdd6f4", ok: "#a6e3a1" };

/**
 * What each window shows: a little real content, so a tile is recognisable at
 * a glance. Lines that do not fit a tile wrap into a column outside it and
 * are never cut in half.
 */
function Content({ kind }: { kind: App["kind"] }) {
  const line = "w-full whitespace-nowrap";
  switch (kind) {
    case "code":
      return (
        <>
          {[
            [["fn ", C.kw], ["tile", C.fn], ["(n: usize) {", C.text]],
            [["  let ", C.kw], ["half", C.text], [" = n / ", C.text], ["2", C.num], [";", C.text]],
            [["  split(", C.text], ["half", C.text], [")", C.text]],
            [["}", C.text]],
            [["// every new window halves the rest", C.dim]],
          ].map((parts, i) => (
            <span className={`${line} font-mono`} key={i}>
              <span style={{ color: C.dim }}>{i + 1} </span>
              {parts.map(([t, c], j) => (
                <span key={j} style={{ color: c }}>
                  {t}
                </span>
              ))}
            </span>
          ))}
        </>
      );
    case "list":
      return (
        <>
          <span className={`${line} font-semibold`} style={{ color: C.text }}>
            Groceries
          </span>
          {["oat milk", "rice", "lemons", "coffee"].map((t) => (
            <span className={line} key={t} style={{ color: C.dim }}>
              {t}
            </span>
          ))}
        </>
      );
    case "term":
      return (
        <>
          <span className={`${line} font-mono`} style={{ color: C.text }}>
            <span style={{ color: C.ok }}>❯ </span>cargo test
          </span>
          <span className={`${line} font-mono`} style={{ color: C.dim }}>
            Compiling mochi-core
          </span>
          <span className={`${line} font-mono`} style={{ color: C.ok }}>
            test result: ok
          </span>
          <span className={`${line} font-mono`} style={{ color: C.ok }}>
            ❯
          </span>
        </>
      );
    case "notes":
      return (
        <>
          <span className={`${line} font-semibold`} style={{ color: C.text }}>
            Biology, week 6
          </span>
          <span className={line} style={{ color: C.dim }}>
            ☐ Read chapter 6
          </span>
          <span className={line} style={{ color: C.dim }}>
            ☑ Lab report
          </span>
        </>
      );
    case "swatch":
      return (
        <>
          <span className={`${line} flex gap-1 py-0.5`}>
            {["#2596be", "#e2803f", "#a6e3a1", "#f5c2e7", "#f9e2af"].map((c) => (
              <span className="h-3 w-3 shrink-0 rounded-[2px]" key={c} style={{ background: c }} />
            ))}
          </span>
          <span className={`${line} font-mono`} style={{ color: C.text }}>
            #2596be
          </span>
          <span className={line} style={{ color: C.dim }}>
            a cool blue
          </span>
        </>
      );
  }
}

/** One window: the program's title bar with its caption buttons, and its content. */
function Window({ app, focused }: { app: App; focused: boolean }) {
  return (
    // A picture of a window, not text to read: the audit's type floor skips it.
    <div
      aria-hidden
      className="flex h-full w-full flex-col overflow-hidden rounded-[5px] transition-[box-shadow] duration-200 ease-bloom [container-type:inline-size]"
      data-texture
      style={{ background: DESK.window, boxShadow: focused ? `0 0 0 2px ${DESK.pink}` : `0 0 0 1px ${DESK.line}` }}
    >
      <div className="flex h-[22px] shrink-0 items-center gap-1 pr-1.5 pl-2" style={{ background: DESK.bar }}>
        <span className="min-w-0 overflow-hidden whitespace-nowrap text-[0.6875rem]" style={{ color: focused ? DESK.text : C.dim }}>
          {app.name}
        </span>
        {/* The caption buttons only where the title still fits beside them. */}
        <span className="ml-auto hidden shrink-0 gap-1.5 text-[0.6875rem] leading-none @min-[120px]:flex" style={{ color: DESK.muted }}>
          <span>–</span>
          <span>□</span>
          <span>×</span>
        </span>
      </div>
      <div className="flex min-h-0 flex-1 flex-col flex-wrap content-start gap-x-4 gap-y-[3px] overflow-hidden px-2 py-1.5 text-[0.6875rem] leading-[1.35]">
        <Content kind={app.kind} />
      </div>
    </div>
  );
}

/** Where windows sit before Mochi starts: floating, overlapping, on top of each other. */
const FLOATING: Rect[] = [
  { x: 0.04, y: 0.06, w: 0.5, h: 0.58 },
  { x: 0.36, y: 0.18, w: 0.5, h: 0.56 },
  { x: 0.16, y: 0.38, w: 0.46, h: 0.56 },
  { x: 0.5, y: 0.04, w: 0.46, h: 0.5 },
  { x: 0.42, y: 0.42, w: 0.52, h: 0.52 },
];

/** A window placed at a rectangle of the desktop, with Mochi's gap around it. */
function Placed({ rect, children, index, onClick, id }: { rect: Rect; children: ReactNode; index: number; onClick?: () => void; id?: string }) {
  const { spring, fade } = useMotionSafe();
  return (
    <motion.div
      animate={{ opacity: 1, scale: 1 }}
      className="absolute p-1"
      exit={{ opacity: 0, scale: 0.96 }}
      initial={{ opacity: 0, scale: 0.96 }}
      layout
      layoutId={id}
      onClick={onClick}
      style={{ left: `${rect.x * 100}%`, top: `${rect.y * 100}%`, width: `${rect.w * 100}%`, height: `${rect.h * 100}%`, zIndex: index }}
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

/** The desktop every Mochi demo draws on. Mochi itself draws nothing but borders. */
function Desk({ children, className = "absolute inset-0" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`overflow-hidden rounded-xl ring-1 ring-black/30 dark:ring-white/[0.12] ${className}`} style={{ background: DESK.bg }}>
      <div className="absolute inset-2 sm:inset-3">{children}</div>
    </div>
  );
}

/** The key moment: floating windows snap into tiles, and focus follows the keys. */
export function TilingDemo() {
  const [tiled, setTiled] = useState(false);
  const [count, setCount] = useState(3);
  const [focus, setFocus] = useState(0);
  const rects = tiled ? tile("bsp", count) : FLOATING.slice(0, count);

  const onKey = (event: KeyboardEvent) => {
    const key = event.key.toLowerCase();
    if (!tiled || !["h", "j", "k", "l", "arrowleft", "arrowright", "arrowup", "arrowdown"].includes(key)) return;
    event.preventDefault();
    setFocus((f) => neighbour(rects, f, key));
  };

  const status = tiled ? `${count} tiled. ${APPS[focus]?.name} has the focus.` : "Three windows, floating where they opened.";
  return (
    <Demo
      caption="Press Start, then move the pink focus with the arrow keys or by tapping a window. Mochi binds it to Alt with H, J, K and L."
      height={360}
      label="Mochi tiling floating windows and moving focus between them"
      live={tiled ? status : ""}
      phoneHeight={440}
    >
      <Frame
        bottom={
          <>
            <BarText>{status}</BarText>
            {tiled ? (
              <>
                {/* One place for both: it opens windows up to five, then closes the newest. */}
                <Action
                  onClick={() => {
                    if (count < APPS.length) {
                      setFocus(count);
                      setCount(count + 1);
                    } else {
                      setFocus(Math.min(focus, count - 2));
                      setCount(count - 1);
                    }
                  }}
                  width="min-w-[8.5rem]"
                >
                  {count < APPS.length ? "Open a window" : "Close a window"}
                </Action>
                <Action
                  onClick={() => {
                    setTiled(false);
                    setCount(3);
                    setFocus(0);
                  }}
                >
                  Reset
                </Action>
              </>
            ) : (
              <Action onClick={() => setTiled(true)} primary width="min-w-[5.5rem]">
                Start
              </Action>
            )}
          </>
        }
      >
        <Desk>
          {/* The desktop takes the keys while it has focus, like Mochi does. */}
          <div
            aria-label="Desktop. Once the windows are tiled, the arrow keys or H, J, K and L move the focus."
            className="absolute inset-0 rounded-md"
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
      </Frame>
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
  const [layout, setLayout] = useState<Layout>("bsp");
  return (
    <Demo
      caption="Pick a layout. The windows keep their order and the focus stays on Remnants through every change."
      height={360}
      label="Mochi's seven layouts applied to four windows"
      live={`${LAYOUTS.find((l) => l.value === layout)?.label} layout.`}
      phoneHeight={480}
    >
      <Frame top={<Pills<Layout> label="Layout" onChange={setLayout} options={LAYOUTS} value={layout} />}>
        <Desk>
          {tile(layout, 4).map((rect, i) => (
            <Placed index={1} key={`l${i}`} rect={rect}>
              <Window app={APPS[i]} focused={i === 0} />
            </Placed>
          ))}
        </Desk>
      </Frame>
    </Demo>
  );
}

/** Where the two hidden windows land when Mochi lets them go: plain floating windows. */
const RETURNED: Rect[] = [
  { x: 0.3, y: 0.08, w: 0.44, h: 0.62 },
  { x: 0.46, y: 0.3, w: 0.44, h: 0.62 },
];

/** Stop Mochi and every window it was hiding comes back. */
export function StopDemo() {
  const { spring, reduced } = useMotionSafe();
  const [stopped, setStopped] = useState(false);
  const shown = tile("bsp", 2);
  const status = stopped ? "Four windows on screen, none of them tiled." : "Two tiled, two hidden. Alt+Shift+E stops Mochi.";

  return (
    <Demo
      caption="Press Stop Mochi and follow the two windows from off screen."
      height={360}
      label="Mochi stopping and bringing back every window it was hiding"
      live={stopped ? status : ""}
      phoneHeight={440}
    >
      <Frame
        bottom={
          <>
            <BarText>{status}</BarText>
            <Action onClick={() => setStopped((s) => !s)} primary={!stopped} width="min-w-[7.5rem]">
              {stopped ? "Start Mochi" : "Stop Mochi"}
            </Action>
          </>
        }
      >
        <LayoutGroup>
          <div className="absolute inset-0 flex flex-col gap-3">
            <Desk className="relative min-h-0 flex-1">
              {shown.map((rect, i) => (
                <Placed index={1} key={`s${i}`} rect={rect}>
                  <Window app={APPS[i]} focused={!stopped && i === 0} />
                </Placed>
              ))}
              {stopped
                ? RETURNED.map((rect, i) => (
                    <motion.div
                      className="absolute p-1"
                      key={`h${i}`}
                      layoutId={`mochi-hidden-${i}`}
                      style={{ left: `${rect.x * 100}%`, top: `${rect.y * 100}%`, width: `${rect.w * 100}%`, height: `${rect.h * 100}%`, zIndex: 2 + i }}
                      transition={{ ...spring, delay: reduced ? 0 : i * 0.08 }}
                    >
                      <Window app={APPS[i + 2]} focused={false} />
                    </motion.div>
                  ))
                : null}
            </Desk>
            {/* Off the screen: where Mochi keeps another workspace's windows. Not part of Mochi's look. */}
            <div className="flex h-16 shrink-0 items-center gap-3 rounded-xl border border-border/80 border-dashed px-3">
              <span className="shrink-0 text-[0.75rem] text-muted-foreground leading-snug sm:w-[5.5rem]">Off screen</span>
              {stopped ? (
                <span className="text-[0.75rem] text-muted-foreground">Nothing left here.</span>
              ) : (
                APPS.slice(2, 4).map((app, i) => (
                  <motion.div className="h-12 w-24 shrink-0 sm:w-28" key={app.name} layoutId={`mochi-hidden-${i}`} transition={spring}>
                    <Window app={app} focused={false} />
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </LayoutGroup>
      </Frame>
    </Demo>
  );
}
