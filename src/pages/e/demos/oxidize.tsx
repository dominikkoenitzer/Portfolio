import { AnimatePresence, LayoutGroup, animate, motion, useMotionValue, useMotionValueEvent } from "framer-motion";
import { Check } from "lucide-react";
import { type ReactNode, useCallback, useEffect, useRef, useState } from "react";
import { Action, BarText, Demo, Frame, Pills } from "../kit";
import { useMotionSafe, wait } from "../motion";

/*
 * Oxidize, told through its key moments. The window is the app's own dark
 * theme with its copper accent; every control a reader presses sits outside
 * it, on the demo's bar. The programs and publishers are made up, as in the
 * app's own screenshots.
 */

const APP = {
  bg: "#1f1d1b",
  bar: "#191716",
  line: "#34302d",
  text: "#ece6df",
  muted: "#a8a097",
  copper: "#e2803f",
  copperText: "#f0a274",
  teal: "#5fb3a5",
};

type Grade = "High" | "Medium" | "Low";

/** What a scan of a removed program typically turns up, with its confidence. */
const LEFTOVERS: Array<{ path: string; kind: string; grade: Grade; why: string }> = [
  { path: "HKCU\\Software\\Example Labs\\Quillmark", kind: "Registry key", grade: "High", why: "exact name" },
  { path: "%AppData%\\Quillmark", kind: "Folder, 18 MB", grade: "High", why: "exact name" },
  { path: "%LocalAppData%\\Quillmark-Updater", kind: "Folder, 4 MB", grade: "Medium", why: "part of the name" },
  { path: "C:\\ProgramData\\QMCache", kind: "Folder, 120 KB", grade: "Low", why: "claimed by no program" },
];

const GRADE_STYLE: Record<Grade, string> = {
  High: "bg-[#e2803f]/15 text-[#f0a274]",
  Medium: "bg-[#d9b25f]/12 text-[#e2c37e]",
  Low: "bg-white/[0.07] text-[#b3aca4]",
};

const PROGRAMS = [
  { name: "Corvid Notes", by: "Corvid Labs", size: "640 MB", tint: "#7b8fd6" },
  { name: "Quillmark", by: "Example Labs", size: "312 MB", tint: APP.copper },
  { name: "Fernhollow Photo", by: "Fernhollow", size: "3.1 GB", tint: "#6cb38f" },
  { name: "Larkspur Audio", by: "Larkspur Media", size: "1.2 GB", tint: "#c98ad6" },
  { name: "Tidewater Sync", by: "Tidewater", size: "88 MB", tint: "#5fa8c9" },
];

/** The Oxidize window. Its title says which view is open; it holds no demo controls. */
function Window({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div
      aria-hidden
      className="absolute inset-0 flex flex-col overflow-hidden rounded-xl shadow-[0_1px_2px_rgb(0_0_0/0.2),0_20px_40px_-24px_rgb(0_0_0/0.5)] ring-1 ring-black/30 dark:ring-white/[0.12]"
      style={{ background: APP.bg, color: APP.text }}
    >
      <div className="flex h-9 shrink-0 items-center gap-2 px-3.5 text-[0.75rem]" style={{ background: APP.bar }}>
        <span className="font-semibold">Oxidize</span>
        <span style={{ color: APP.muted }}>/</span>
        <AnimatePresence initial={false} mode="wait">
          <motion.span animate={{ opacity: 1 }} exit={{ opacity: 0 }} initial={{ opacity: 0 }} key={title} style={{ color: APP.muted }} transition={{ duration: 0.18 }}>
            {title}
          </motion.span>
        </AnimatePresence>
      </div>
      <div className="relative min-h-0 flex-1 overflow-hidden">{children}</div>
    </div>
  );
}

/** A path that may wrap only after a separator, never inside a name. */
function PathText({ path }: { path: string }) {
  const parts = path.split(/(?<=[\\/])/);
  return (
    <>
      {parts.map((part, i) => (
        <span key={`${i}-${part}`}>
          {part}
          {i < parts.length - 1 ? <wbr /> : null}
        </span>
      ))}
    </>
  );
}

function Badge({ grade }: { grade: Grade }) {
  return <span className={`inline-flex h-5 shrink-0 items-center rounded px-1.5 font-medium text-[0.6875rem] ${GRADE_STYLE[grade]}`}>{grade}</span>;
}

/** Ticked means selected for removal; Oxidize ticks only the High finds. */
function Tick({ on }: { on: boolean }) {
  return (
    <span
      className="mt-0.5 inline-flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-[3px] border"
      style={{ borderColor: on ? APP.copper : "#6a635c", background: on ? APP.copper : "transparent" }}
    >
      {on ? <Check className="h-2.5 w-2.5 text-[#1f1d1b]" strokeWidth={3} /> : null}
    </span>
  );
}

function LeftoverBody({ item }: { item: (typeof LEFTOVERS)[number] }) {
  return (
    <>
      <Tick on={item.grade === "High"} />
      <span className="min-w-0 flex-1">
        <span className="block font-mono text-[0.71875rem] leading-snug">
          <PathText path={item.path} />
        </span>
        <span className="block text-[0.6875rem] leading-snug" style={{ color: APP.muted }}>
          {item.kind}, {item.why}
        </span>
      </span>
      <Badge grade={item.grade} />
    </>
  );
}

function ProgramIcon({ row }: { row: (typeof PROGRAMS)[number] }) {
  return (
    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md font-semibold text-[0.6875rem]" style={{ background: row.tint, color: "#1f1d1b" }}>
      {row.name[0]}
    </span>
  );
}

function ProgramRow({ row, picked, right }: { row: (typeof PROGRAMS)[number]; picked: boolean; right?: ReactNode }) {
  const { spring, reduced } = useMotionSafe();
  return (
    <motion.li
      className="relative mx-2 flex items-center gap-2.5 overflow-hidden rounded-lg px-2"
      exit={reduced ? { opacity: 0 } : { opacity: 0, height: 0 }}
      initial={false}
      layout
      style={{ background: picked ? "rgb(255 255 255 / 0.07)" : "transparent", height: 42 }}
      transition={{ layout: spring, duration: reduced ? 0 : 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <ProgramIcon row={row} />
      <span className="min-w-0 flex-1">
        <span className="block text-[0.75rem] leading-tight">{row.name}</span>
        <span className="block text-[0.6875rem] leading-tight" style={{ color: APP.muted }}>
          {row.by}
        </span>
      </span>
      {right ?? (
        <span className="text-[0.6875rem] tabular-nums" style={{ color: APP.muted }}>
          {row.size}
        </span>
      )}
    </motion.li>
  );
}

/* ------------------------------------------------------------------ */
/* Uninstall, then the leftovers                                       */
/* ------------------------------------------------------------------ */

type UninstallPhase = "idle" | "running" | "scanning" | "found" | "done";

/** The key moment: uninstall, then the leftovers come in, graded. */
export function UninstallDemo() {
  const { reduced, spring, fade } = useMotionSafe();
  const [phase, setPhase] = useState<UninstallPhase>("idle");
  const [shown, setShown] = useState(0);
  const run = useRef(0);
  useEffect(() => () => void run.current++, []);

  const start = useCallback(async () => {
    const id = ++run.current;
    const alive = () => run.current === id;
    if (reduced) {
      setShown(LEFTOVERS.length);
      setPhase("done");
      return;
    }
    setShown(0);
    setPhase("running");
    await wait(1200);
    if (!alive()) return;
    setPhase("scanning");
    await wait(1100);
    if (!alive()) return;
    setPhase("found");
    for (let i = 1; i <= LEFTOVERS.length; i += 1) {
      await wait(i === 1 ? 120 : 260);
      if (!alive()) return;
      setShown(i);
    }
    await wait(450);
    if (alive()) setPhase("done");
  }, [reduced]);

  const status = {
    idle: "Quillmark is selected.",
    running: "Quillmark's own uninstaller is running.",
    scanning: "Quillmark is gone. Searching the registry and the disk for what it left.",
    found: `Found ${shown}.`,
    done: "Four leftovers. Only the two High ones are ticked.",
  }[phase];
  const leftovers = phase === "found" || phase === "done";

  return (
    <Demo
      caption="Press Uninstall. Its uninstaller goes first; what Oxidize finds afterwards is graded by how sure it is."
      height={360}
      label="Oxidize uninstalling a program and finding its leftovers"
      live={phase === "done" ? "Four leftovers found: two High, one Medium, one Low. The two High ones are ticked." : ""}
      phoneHeight={400}
    >
      <Frame
        bottom={
          <>
            <BarText>{status}</BarText>
            {phase === "idle" || phase === "done" ? (
              <Action onClick={() => void start()} primary>
                {phase === "idle" ? "Uninstall" : "Uninstall again"}
              </Action>
            ) : null}
          </>
        }
      >
        <Window title={leftovers ? "Leftovers of Quillmark" : "Programs"}>
          <AnimatePresence initial={false}>
            {leftovers ? (
              <motion.ul animate={{ opacity: 1 }} className="absolute inset-x-0 top-0 m-0 list-none p-0 pt-1" initial={{ opacity: 0 }} key="found" transition={fade}>
                {LEFTOVERS.slice(0, shown).map((item) => (
                  <motion.li
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-start gap-2.5 border-b px-3.5 py-2"
                    initial={reduced ? false : { opacity: 0, y: 8 }}
                    key={item.path}
                    style={{ borderColor: APP.line }}
                    transition={spring}
                  >
                    <LeftoverBody item={item} />
                  </motion.li>
                ))}
              </motion.ul>
            ) : (
              <motion.div animate={{ opacity: 1 }} className="absolute inset-0" exit={{ opacity: 0 }} initial={{ opacity: 0 }} key="programs" transition={fade}>
                <ul className="m-0 list-none p-0 pt-1.5">
                  <AnimatePresence initial={false}>
                    {PROGRAMS.map((row) =>
                      row.name === "Quillmark" && phase === "scanning" ? null : (
                        <ProgramRow
                          key={row.name}
                          picked={row.name === "Quillmark"}
                          right={
                            row.name === "Quillmark" && phase === "running" ? (
                              <span className="text-[0.6875rem]" style={{ color: APP.copperText }}>
                                Uninstalling
                              </span>
                            ) : undefined
                          }
                          row={row}
                        />
                      ),
                    )}
                  </AnimatePresence>
                </ul>
                {phase === "scanning" && !reduced ? (
                  // The scan: one sweep down the window while the search runs.
                  <motion.span
                    animate={{ top: "100%" }}
                    className="absolute inset-x-0 h-px"
                    initial={{ top: "0%" }}
                    style={{ background: `linear-gradient(90deg, transparent, ${APP.copper}, transparent)` }}
                    transition={{ duration: 1.1, ease: "linear" }}
                  />
                ) : null}
              </motion.div>
            )}
          </AnimatePresence>
        </Window>
      </Frame>
    </Demo>
  );
}

/* ------------------------------------------------------------------ */
/* Remove into a backup, and Undo                                      */
/* ------------------------------------------------------------------ */

/** Remove, then Undo: the backup puts every removed leftover back. */
export function BackupDemo() {
  const { reduced, spring } = useMotionSafe();
  const [removed, setRemoved] = useState(false);
  const [moves, setMoves] = useState(0);
  const high = LEFTOVERS.filter((l) => l.grade === "High");
  const status = removed ? "Both moved into the backup, with their original paths." : moves ? "Both back in place, from the backup." : "Two ticked. Neither is deleted before it is backed up.";
  const flip = () => {
    setRemoved((r) => !r);
    setMoves((m) => m + 1);
  };
  const stagger = (i: number) => ({ ...spring, delay: reduced ? 0 : i * 0.05 });

  return (
    <Demo
      caption="Remove the two ticked finds, then Undo. Each one travels into the backup and back to its own row."
      height={360}
      label="Oxidize removing two leftovers into a backup and restoring them"
      live={moves ? status : ""}
      phoneHeight={440}
    >
      <Frame
        bottom={
          <>
            <BarText>{status}</BarText>
            <Action onClick={flip} primary>
              {removed ? "Undo" : "Remove 2"}
            </Action>
          </>
        }
      >
        <Window title="Leftovers of Quillmark">
          <LayoutGroup>
            {/* Each removed find travels into the backup and back to its own row. */}
            <ul className="m-0 list-none p-0 pt-1">
              {LEFTOVERS.map((item, i) =>
                removed && item.grade === "High" ? null : (
                  <motion.li
                    className="flex items-start gap-2.5 border-b px-3.5 py-2"
                    key={item.path}
                    layout="position"
                    layoutId={`ox-item-${i}`}
                    style={{ borderColor: APP.line }}
                    transition={stagger(i)}
                  >
                    <LeftoverBody item={item} />
                  </motion.li>
                ),
              )}
            </ul>
            <AnimatePresence>
              {removed ? (
                <motion.div
                  animate={{ opacity: 1 }}
                  className="mx-3.5 mt-3 rounded-lg px-3 py-2.5"
                  exit={{ opacity: 0, transition: { duration: reduced ? 0 : 0.18, delay: reduced ? 0 : 0.12 } }}
                  initial={{ opacity: 0 }}
                  key="backup"
                  layout
                  style={{ background: "rgb(95 179 165 / 0.1)", boxShadow: "inset 0 0 0 1px rgb(95 179 165 / 0.25)" }}
                  transition={{ duration: reduced ? 0 : 0.2 }}
                >
                  <p className="m-0 flex items-baseline justify-between gap-3 text-[0.6875rem]">
                    <span className="font-mono" style={{ color: "#bfe3dc" }}>
                      Backup 2026-10-16 171306 Quillmark
                    </span>
                    <span className="shrink-0 tabular-nums" style={{ color: APP.muted }}>
                      2 items
                    </span>
                  </p>
                  <ul className="m-0 mt-1.5 flex list-none flex-col gap-1 p-0">
                    {high.map((item) => {
                      const i = LEFTOVERS.indexOf(item);
                      return (
                        <motion.li className="font-mono text-[0.6875rem] leading-snug" key={item.path} layout="position" layoutId={`ox-item-${i}`} style={{ color: APP.text }} transition={stagger(i)}>
                          <PathText path={item.path} />
                        </motion.li>
                      );
                    })}
                  </ul>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </LayoutGroup>
        </Window>
      </Frame>
    </Demo>
  );
}

/* ------------------------------------------------------------------ */
/* The exit code is only a hint                                        */
/* ------------------------------------------------------------------ */

/**
 * One uninstall, in real seconds. The process Oxidize starts copies itself
 * to the temp folder, starts the copy and exits with 0 at 0.4 s. The copy
 * does the work, removes the uninstall entry at 2.5 s and exits at 2.6 s.
 * Oxidize keeps waiting while the entry exists and an uninstaller is running,
 * so it moves on at 2.5 s.
 */
const END = 2.6;
const LANES: Array<{ name: string; from: number; to: number; result: string; oxidize?: boolean }> = [
  { name: "Started process", from: 0, to: 0.4, result: "exited with 0 at 0.4 s" },
  { name: "Its copy in Temp", from: 0.3, to: 2.6, result: "finished at 2.6 s" },
  { name: "Uninstall entry", from: 0, to: 2.5, result: "removed at 2.5 s" },
  { name: "Oxidize", from: 0, to: 2.5, result: "moves on at 2.5 s", oxidize: true },
];
const TICKS = [0, 1, 2, 2.6];
const pct = (t: number) => `${(t / END) * 100}%`;

function Lane({ lane, t }: { lane: (typeof LANES)[number]; t: number }) {
  const end = Math.min(t, lane.to);
  const started = t >= lane.from;
  const over = t >= lane.to;
  const tone = lane.oxidize ? "text-[#9a4a1b] dark:text-[#f0a274]" : "text-muted-foreground";
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-1.5 sm:grid-cols-[7.5rem_minmax(0,1fr)_9.5rem]">
      <span className={`text-[0.8125rem] ${lane.oxidize ? `font-medium ${tone}` : "text-foreground"}`}>{lane.name}</span>
      {/* The result sits beyond the axis, where the playhead never goes. */}
      <span className={`text-right text-[0.75rem] tabular-nums transition-opacity duration-200 sm:order-3 sm:text-left ${tone}`} style={{ opacity: over ? 1 : 0 }}>
        {lane.result}
      </span>
      <span className="relative col-span-2 h-2.5 sm:order-2 sm:col-span-1">
        <span className="absolute inset-y-[4px] right-0 left-0 rounded-full bg-foreground/[0.06]" />
        {started ? (
          lane.oxidize ? (
            // Waiting is drawn dashed: Oxidize is watching, not working.
            <span
              className={`absolute inset-y-[3px] rounded-full ${tone}`}
              style={{
                left: pct(lane.from),
                width: `calc(${pct(end)} - ${pct(lane.from)})`,
                backgroundImage: "repeating-linear-gradient(90deg, currentColor 0 6px, transparent 6px 10px)",
              }}
            />
          ) : (
            <span className="absolute inset-y-[3px] rounded-full bg-foreground/45" style={{ left: pct(lane.from), width: `calc(${pct(end)} - ${pct(lane.from)})` }} />
          )
        ) : null}
        {lane.oxidize && over ? (
          <span className="absolute top-1/2 flex h-4 w-4 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#9a4a1b] dark:bg-[#f0a274]" style={{ left: pct(lane.to) }}>
            <Check className="h-2.5 w-2.5 text-card" strokeWidth={3.5} />
          </span>
        ) : null}
      </span>
    </div>
  );
}

/** The exit code says done at 0.4 s; Oxidize waits for the evidence until 2.5 s. */
export function WaitDemo() {
  const { reduced } = useMotionSafe();
  const time = useMotionValue(0);
  const [t, setT] = useState(0);
  const [state, setState] = useState<"idle" | "running" | "done">("idle");
  const clock = useRef<ReturnType<typeof animate> | null>(null);
  useMotionValueEvent(time, "change", setT);
  useEffect(() => () => clock.current?.stop(), []);

  const start = () => {
    clock.current?.stop();
    if (reduced) {
      time.set(END);
      setState("done");
      return;
    }
    time.set(0);
    setState("running");
    clock.current = animate(time, END, { duration: END, ease: "linear", onComplete: () => setState("done") });
  };

  const status =
    state === "idle"
      ? "Nothing has started."
      : state === "done"
        ? "The exit code came 2.1 seconds before the uninstall was over."
        : t < 0.4
          ? "Oxidize started Quillmark's uninstaller."
          : t < 2.5
            ? "The process exited with 0. The entry is still there, so Oxidize waits."
            : "The entry is gone.";

  return (
    <Demo
      caption="Press Uninstall and watch which lane Oxidize follows."
      height={360}
      label="A timeline of one uninstall: the started process, its copy, the uninstall entry and Oxidize"
      live={state === "done" ? "The started process exited with 0 at 0.4 seconds. Its copy finished at 2.6 seconds and removed the entry at 2.5. Oxidize moved on at 2.5 seconds." : ""}
      phoneHeight={440}
    >
      <Frame
        bottom={
          <>
            <BarText>{status}</BarText>
            {state === "running" ? null : (
              <Action onClick={start} primary>
                {state === "idle" ? "Uninstall" : "Run again"}
              </Action>
            )}
          </>
        }
      >
        <div aria-hidden className="absolute inset-0 flex flex-col justify-center gap-5 sm:gap-6">
          {/* The clock, riding the playhead along the track column. Labels shift by
              their own share of the axis, so 0 starts at the line and 2.6 s ends on it. */}
          <div className="relative h-4 sm:ml-[8.25rem] sm:mr-[10.25rem]">
            <span className="absolute whitespace-nowrap text-[0.75rem] text-foreground tabular-nums" style={{ left: pct(t), transform: `translateX(-${pct(t)})`, opacity: state === "idle" ? 0 : 1 }}>
              {t.toFixed(1)} s
            </span>
          </div>
          <div className="relative flex flex-col gap-5 sm:gap-6">
            {LANES.map((lane) => (
              <Lane key={lane.name} lane={lane} t={t} />
            ))}
            {/* The playhead crosses the tracks only, never the names or the results */}
            {state === "idle" ? null : (
              <span className="pointer-events-none absolute inset-y-0 hidden w-px bg-foreground/50 sm:block" style={{ left: `calc(8.25rem + (100% - 18.5rem) * ${t / END})` }} />
            )}
          </div>
          <div className="relative h-4 sm:ml-[8.25rem] sm:mr-[10.25rem]">
            {TICKS.map((tick) => (
              <span className="absolute whitespace-nowrap text-[0.75rem] text-muted-foreground tabular-nums" key={tick} style={{ left: pct(tick), transform: `translateX(-${pct(tick)})` }}>
                {tick === 0 ? "0" : `${tick} s`}
              </span>
            ))}
          </div>
        </div>
      </Frame>
    </Demo>
  );
}

/* ------------------------------------------------------------------ */
/* One folder, many spellings                                          */
/* ------------------------------------------------------------------ */

type Spelling = "slash" | "short" | "dot" | "leftover";

const SPELLINGS: Record<Spelling, { typed: string; rule: string; resolved: string; verdict: string; refused: boolean }> = {
  slash: { typed: "C:/Windows", rule: "Forward slashes turned around", resolved: "C:\\Windows", verdict: "Refused: the Windows folder", refused: true },
  short: { typed: "C:\\PROGRA~1", rule: "Short name expanded", resolved: "C:\\Program Files", verdict: "Refused: where programs are installed", refused: true },
  dot: { typed: "C:\\Windows.", rule: "Trailing dot dropped, as Windows does", resolved: "C:\\Windows", verdict: "Refused: the Windows folder", refused: true },
  leftover: { typed: "%AppData%\\Quillmark", rule: "Variable expanded", resolved: "C:\\Users\\you\\AppData\\Roaming\\Quillmark", verdict: "Allowed: a leftover of Quillmark", refused: false },
};

/** One folder, many spellings: each is resolved before it is compared. */
export function PathDemo() {
  const { fade, delay } = useMotionSafe();
  const [pick, setPick] = useState<Spelling>("slash");
  const s = SPELLINGS[pick];
  const rows: Array<[string, ReactNode]> = [
    ["Typed", <span className="font-mono" key="t"><PathText path={s.typed} /></span>],
    ["Rule", <span className="text-muted-foreground" key="s">{s.rule}</span>],
    ["Resolved", <span className="font-mono" key="r"><PathText path={s.resolved} /></span>],
    [
      "Verdict",
      <span
        className={`inline-flex rounded-md px-2 py-0.5 font-medium text-[0.8125rem] ${
          s.refused ? "bg-[#c8692f]/12 text-[#9a4a1b] dark:bg-[#e2803f]/15 dark:text-[#f0a274]" : "bg-[#3f8f84]/12 text-[#2d6d64] dark:bg-[#5fb3a5]/15 dark:text-[#8fd3c7]"
        }`}
        key="v"
      >
        {s.verdict}
      </span>,
    ],
  ];
  return (
    <Demo
      caption="Three spellings of protected folders and one real leftover. Only the leftover gets through."
      height={280}
      label="Paths resolved to their real names, and protected folders refused"
      live={`${s.typed} resolves to ${s.resolved}. ${s.verdict}.`}
      phoneHeight={380}
    >
      <Frame
        top={
          <Pills<Spelling>
            label="Path"
            onChange={setPick}
            options={(Object.keys(SPELLINGS) as Spelling[]).map((k) => ({ value: k, label: SPELLINGS[k].typed }))}
            value={pick}
          />
        }
      >
        <motion.dl className="absolute inset-0 m-0 flex flex-col justify-center gap-3 px-1 text-[0.875rem] sm:px-3" key={pick}>
          {rows.map(([term, value], i) => (
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-[5rem_minmax(0,1fr)] items-baseline gap-x-4 sm:grid-cols-[5.5rem_minmax(0,1fr)]"
              initial={{ opacity: 0, y: 4 }}
              key={term}
              transition={{ ...fade, delay: delay(i * 0.07) }}
            >
              <dt className="text-muted-foreground">{term}</dt>
              <dd className="m-0 min-w-0">{value}</dd>
            </motion.div>
          ))}
        </motion.dl>
      </Frame>
    </Demo>
  );
}
