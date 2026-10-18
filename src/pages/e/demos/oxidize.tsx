import {
  AnimatePresence,
  animate,
  type MotionValue,
  motion,
  useMotionValue,
  useTransform,
} from "framer-motion";
import { Check } from "lucide-react";
import { type ReactNode, useCallback, useEffect, useRef, useState } from "react";
import { Action, Demo, Pills } from "../kit";
import { useMotionSafe, useSeenOnce, wait } from "../motion";

/*
 * Oxidize, told through its key moments. The window palette is the app's own
 * dark theme with its copper accent; the example program and its publisher
 * are the made-up ones its screenshots use.
 */

const APP = {
  bg: "#1f1d1b",
  bar: "#191716",
  row: "#262321",
  line: "#34302d",
  text: "#ece6df",
  muted: "#9c958d",
  copper: "#e2803f",
  teal: "#5fb3a5",
  amber: "#d9b25f",
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
  Low: "bg-white/[0.07] text-[#a9a29a]",
};

/** The Oxidize window frame, inset in the demo box so the card shows around it. */
function Window({ children, tab = "Programs" }: { children: ReactNode; tab?: string }) {
  return (
    <div
      aria-hidden
      className="absolute inset-3 flex flex-col overflow-hidden rounded-xl shadow-[0_1px_2px_rgb(0_0_0/0.2),0_20px_40px_-24px_rgb(0_0_0/0.5)] ring-1 ring-black/30 sm:inset-5"
      style={{ background: APP.bg, color: APP.text }}
    >
      <div className="flex h-9 shrink-0 items-center gap-3 px-3.5 text-[0.75rem]" style={{ background: APP.bar }}>
        <span className="font-semibold">Oxidize</span>
        <span className="rounded px-1.5 py-0.5 text-[0.6875rem]" style={{ background: "rgb(226 128 63 / 0.16)", color: "#f0a274" }}>
          {tab}
        </span>
        <span className="text-[0.6875rem]" style={{ color: APP.muted }}>
          Clean up
        </span>
        <span className="ml-auto hidden items-center gap-1 text-[0.6875rem] sm:inline-flex" style={{ color: APP.muted }}>
          <Check className="h-3 w-3" style={{ color: APP.teal }} />
          Backups
        </span>
      </div>
      {children}
    </div>
  );
}

function Badge({ grade }: { grade: Grade }) {
  return (
    <span className={`inline-flex h-5 shrink-0 items-center rounded px-1.5 font-medium text-[0.6875rem] ${GRADE_STYLE[grade]}`}>
      {grade}
    </span>
  );
}

function Tick({ on }: { on: boolean }) {
  return (
    <span
      className="mt-0.5 inline-flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-[3px] border"
      style={{ borderColor: on ? APP.copper : "#5a544e", background: on ? APP.copper : "transparent" }}
    >
      {on ? <Check className="h-2.5 w-2.5 text-[#1f1d1b]" strokeWidth={3} /> : null}
    </span>
  );
}

function LeftoverRow({ item, index, removed = false }: { item: (typeof LEFTOVERS)[number]; index: number; removed?: boolean }) {
  const { spring, fade, delay } = useMotionSafe();
  return (
    <motion.li
      animate={{ opacity: removed ? 0.35 : 1, y: 0 }}
      className="flex items-start gap-2.5 border-t px-3.5 py-2"
      initial={{ opacity: 0, y: 6 }}
      layout
      style={{ borderColor: APP.line }}
      transition={{ ...fade, delay: delay(index * 0.06), layout: spring }}
    >
      <Tick on={item.grade === "High" && !removed} />
      <span className="min-w-0 flex-1">
        <span
          className={`block break-all font-mono text-[0.71875rem] leading-snug ${removed ? "line-through decoration-[#9c958d]" : ""}`}
        >
          {item.path}
        </span>
        <span className="block text-[0.6875rem] leading-snug" style={{ color: APP.muted }}>
          {item.kind}, {item.why}
        </span>
      </span>
      <Badge grade={item.grade} />
    </motion.li>
  );
}

type UninstallPhase = "idle" | "running" | "scanning" | "found";

/** The key moment: uninstall, then the leftovers come in, graded. */
export function UninstallDemo() {
  const [ref, seen] = useSeenOnce<HTMLDivElement>();
  const { reduced, spring, fade } = useMotionSafe();
  const [phase, setPhase] = useState<UninstallPhase>("idle");
  const [shown, setShown] = useState(0);
  const run = useRef(0);

  const start = useCallback(async () => {
    const id = ++run.current;
    const alive = () => run.current === id;
    if (reduced) {
      setPhase("found");
      setShown(LEFTOVERS.length);
      return;
    }
    setShown(0);
    setPhase("running");
    await wait(950);
    if (!alive()) return;
    setPhase("scanning");
    await wait(650);
    if (!alive()) return;
    setPhase("found");
    for (let i = 1; i <= LEFTOVERS.length; i += 1) {
      await wait(170);
      if (!alive()) return;
      setShown(i);
    }
  }, [reduced]);

  // Play once when first seen; afterwards it is the reader's.
  const played = useRef(false);
  useEffect(() => {
    if (!seen || played.current || reduced) return;
    played.current = true;
    const t = window.setTimeout(() => void start(), 350);
    return () => window.clearTimeout(t);
  }, [seen, reduced, start]);
  useEffect(() => () => void run.current++, []);

  const reset = () => {
    run.current++;
    setShown(0);
    setPhase("idle");
  };

  const status =
    phase === "idle"
      ? "Quillmark is selected."
      : phase === "running"
        ? "Running Quillmark's own uninstaller"
        : phase === "scanning"
          ? "Scanning the registry and the disk"
          : `${shown} of 4 leftovers. Only High is ticked.`;

  return (
    <Demo
      caption="Press Uninstall and watch the leftovers come in, graded by how sure Oxidize is."
      height={360}
      label="Oxidize uninstalling a program and finding its leftovers"
      live={phase === "found" && shown === LEFTOVERS.length ? "Four leftovers found: two High, one Medium, one Low." : ""}
      phoneHeight={392}
    >
      <div className="absolute inset-0" ref={ref}>
        <Window>
          <AnimatePresence initial={false} mode="popLayout">
            {phase === "found" ? (
              <motion.div
                animate={{ opacity: 1 }}
                className="min-h-0 flex-1 overflow-hidden"
                exit={{ opacity: 0 }}
                initial={{ opacity: 0 }}
                key="found"
                transition={fade}
              >
                <p className="px-3.5 pt-2.5 pb-2 font-medium text-[0.75rem]">Leftovers of Quillmark</p>
                <ul className="m-0 list-none p-0">
                  {LEFTOVERS.slice(0, shown).map((item, i) => (
                    <LeftoverRow index={i} item={item} key={item.path} />
                  ))}
                </ul>
              </motion.div>
            ) : (
              <motion.ul
                animate={{ opacity: 1 }}
                className="m-0 min-h-0 flex-1 list-none p-0 pt-1.5"
                exit={{ opacity: 0 }}
                initial={{ opacity: 0 }}
                key="programs"
                transition={fade}
              >
                <AnimatePresence initial={false}>
                {[
                  { name: "Corvid Notes", by: "Corvid Labs", size: "640 MB", tint: "#7b8fd6" },
                  { name: "Quillmark", by: "Example Labs", size: "312 MB", tint: APP.copper, picked: true },
                  { name: "Fernhollow Photo", by: "Fernhollow", size: "3.1 GB", tint: "#6cb38f" },
                ].map((row) =>
                  row.picked && phase === "scanning" ? null : (
                    <motion.li
                      className="relative mx-2 flex items-center gap-2.5 rounded-lg px-2 py-2"
                      exit={{ opacity: 0, height: 0, paddingTop: 0, paddingBottom: 0 }}
                      key={row.name}
                      layout
                      style={{ background: row.picked ? "rgb(255 255 255 / 0.06)" : "transparent" }}
                      transition={{ layout: spring, ...fade }}
                    >
                      <span className="h-5 w-5 shrink-0 rounded-md" style={{ background: row.tint, opacity: 0.85 }} />
                      <span className="min-w-0 flex-1">
                        <span className="block text-[0.75rem] leading-tight">{row.name}</span>
                        <span className="block text-[0.6875rem] leading-tight" style={{ color: APP.muted }}>
                          {row.by}
                        </span>
                      </span>
                      <span className="text-[0.6875rem] tabular-nums" style={{ color: APP.muted }}>
                        {row.size}
                      </span>
                      {row.picked && phase === "running" ? (
                        <motion.span
                          animate={{ scaleX: 1 }}
                          className="absolute right-2 bottom-0 left-2 h-0.5 origin-left rounded-full"
                          initial={{ scaleX: 0 }}
                          style={{ background: APP.copper }}
                          transition={{ duration: 0.9, ease: "linear" }}
                        />
                      ) : null}
                    </motion.li>
                  ),
                )}
                </AnimatePresence>
              </motion.ul>
            )}
          </AnimatePresence>
          <div className="flex h-11 shrink-0 items-center gap-3 border-t px-3.5" style={{ borderColor: APP.line }}>
            <p className="min-w-0 flex-1 truncate text-[0.6875rem]" style={{ color: APP.muted }}>
              {status}
            </p>
          </div>
        </Window>
        <div className="absolute right-6 bottom-[22px] sm:right-8 sm:bottom-[30px]">
          {phase === "found" ? (
            <Action dark onClick={reset}>
              Replay
            </Action>
          ) : (
            <Action dark disabled={phase !== "idle"} onClick={() => void start()} primary>
              {phase === "idle" ? "Uninstall" : "Uninstalling"}
            </Action>
          )}
        </div>
      </div>
    </Demo>
  );
}

type BackupPhase = "list" | "removed" | "restored";

/** Remove, then Undo: the backup puts every removed leftover back. */
export function BackupDemo() {
  const [ref, seen] = useSeenOnce<HTMLDivElement>();
  const { reduced, spring, fade, delay } = useMotionSafe();
  const [phase, setPhase] = useState<BackupPhase>("list");
  const played = useRef(false);

  useEffect(() => {
    if (!seen || played.current || reduced) return;
    played.current = true;
    const t = window.setTimeout(() => setPhase("removed"), 700);
    return () => window.clearTimeout(t);
  }, [seen, reduced]);

  const removed = phase === "removed";
  return (
    <Demo
      caption="Remove, then Undo: both leftovers come back from the backup, to exactly where they were."
      height={340}
      label="Oxidize removing two leftovers into a backup and restoring them"
      live={phase === "removed" ? "Two leftovers moved into the backup." : phase === "restored" ? "Both leftovers restored." : ""}
      phoneHeight={392}
    >
      <div className="absolute inset-0" ref={ref}>
        <Window>
          <ul className="m-0 list-none overflow-hidden p-0 pt-1">
            {LEFTOVERS.map((item, i) =>
              removed && item.grade === "High" ? null : (
                <LeftoverRow index={i} item={item} key={item.path} />
              ),
            )}
          </ul>
          <AnimatePresence>
            {phase !== "list" ? (
              <motion.div
                animate={{ opacity: 1, y: 0 }}
                className="mx-3.5 mt-2.5 flex items-center gap-2.5 rounded-lg px-3 py-2"
                exit={{ opacity: 0, y: 6 }}
                initial={{ opacity: 0, y: 6 }}
                layout
                style={{ background: "rgb(95 179 165 / 0.12)" }}
                transition={{ ...fade, delay: delay(removed ? 0.18 : 0), layout: spring }}
              >
                <span className="h-2 w-2 shrink-0 rounded-sm" style={{ background: APP.teal }} />
                <span className="min-w-0 flex-1 text-[0.6875rem] leading-snug">
                  <span className="block font-mono" style={{ color: "#bfe3dc" }}>
                    Backup 2026-10-28 171306 Quillmark
                  </span>
                  <span style={{ color: APP.muted }}>
                    {removed ? "2 items, the key exported and checked, the folder moved" : "Restored, 2 of 2 back in place"}
                  </span>
                </span>
              </motion.div>
            ) : null}
          </AnimatePresence>
          <div className="min-h-0 flex-1" />
          <div className="h-11 shrink-0 border-t" style={{ borderColor: APP.line }} />
        </Window>
        <div className="absolute right-6 bottom-[22px] sm:right-8 sm:bottom-[30px]">
          {phase === "list" ? (
            <Action dark onClick={() => setPhase("removed")} primary>
              Remove 2
            </Action>
          ) : phase === "removed" ? (
            <Action dark onClick={() => setPhase("restored")} primary>
              Undo
            </Action>
          ) : (
            <Action dark onClick={() => setPhase("list")}>
              Reset
            </Action>
          )}
        </div>
      </div>
    </Demo>
  );
}

/** Seconds on the timeline, and the three things it tracks. */
const SPAN = 3.4;
const LANES = [
  { label: "uninstall.exe", from: 0, to: 0.4, end: "exits with 0", color: "var(--lane-muted)" },
  { label: "its copy in %TEMP%", from: 0.32, to: 2.45, end: "", color: "var(--lane-muted)" },
  { label: "the uninstall entry", from: 0, to: 2.6, end: "gone", color: "var(--lane-accent)" },
];

/** One lane: a bar that grows with the playhead. */
function Lane({ lane, t }: { lane: (typeof LANES)[number]; t: MotionValue<number> }) {
  const scale = useTransform(t, (v) => Math.max(0, Math.min(1, (v - lane.from) / (lane.to - lane.from))));
  const endOpacity = useTransform(t, (v) => (v >= lane.to ? 1 : 0));
  return (
    <div className="grid grid-cols-1 items-center gap-x-3 sm:grid-cols-[9rem_minmax(0,1fr)]">
      <span className="font-mono text-[0.71875rem] text-foreground/80">{lane.label}</span>
      <div className="relative h-6">
        <motion.span
          className="absolute top-1.5 h-3 origin-left rounded-full"
          style={{
            left: `${(lane.from / SPAN) * 100}%`,
            width: `${((lane.to - lane.from) / SPAN) * 100}%`,
            scaleX: scale,
            background: lane.color,
          }}
        />
        <motion.span
          className="absolute top-0.5 whitespace-nowrap pl-2 text-[0.6875rem] text-muted-foreground"
          style={{ left: `${(lane.to / SPAN) * 100}%`, opacity: endOpacity }}
        >
          {lane.end}
        </motion.span>
      </div>
    </div>
  );
}

/** Exit codes lie: the process says done long before the program is gone. */
export function TimelineDemo() {
  const [ref, seen] = useSeenOnce<HTMLDivElement>();
  const { reduced } = useMotionSafe();
  const t = useMotionValue(reduced ? SPAN : 0);
  const [playing, setPlaying] = useState(false);
  const playhead = useTransform(t, (v) => `${(v / SPAN) * 100}%`);
  const playheadOpacity = useTransform(t, (v) => (v > 0 && v < SPAN ? 1 : 0));
  const naive = useTransform(t, (v) => (v >= 0.4 ? 1 : 0));
  const done = useTransform(t, (v) => (v >= 2.6 ? 1 : 0));

  const play = useCallback(() => {
    if (reduced) {
      t.set(SPAN);
      return;
    }
    setPlaying(true);
    t.set(0);
    animate(t, SPAN, { duration: 2.6, ease: "linear", onComplete: () => setPlaying(false) });
  }, [reduced, t]);

  useEffect(() => {
    if (!seen || reduced) return;
    const t = window.setTimeout(play, 300);
    return () => window.clearTimeout(t);
  }, [seen, reduced, play]);

  return (
    <Demo
      caption="The first process says done at 0.4 s. Oxidize waits until the uninstall entry is gone."
      height={260}
      label="A timeline of an uninstall: the process exits early, the uninstall entry stays until later"
      phoneHeight={330}
    >
      <div
        className="absolute inset-0 flex flex-col justify-center gap-2.5 px-5 pt-10 sm:pt-0 [--lane-accent:#c8692f] [--lane-muted:hsl(var(--foreground)/0.22)] sm:px-8 dark:[--lane-accent:#e2803f]"
        ref={ref}
      >
        <div className="relative flex flex-col gap-2.5">
          {LANES.map((lane) => (
            <Lane key={lane.label} lane={lane} t={t} />
          ))}
          {/* The two moments that matter, across all lanes. */}
          <div className="pointer-events-none absolute inset-y-0 right-0 left-[9.75rem] hidden sm:block">
            <motion.span className="absolute inset-y-0 border-foreground/25 border-l border-dashed" style={{ left: `${(0.4 / SPAN) * 100}%`, opacity: naive }} />
            <motion.span className="absolute inset-y-0 border-[color:var(--lane-accent)] border-l" style={{ left: `${(2.6 / SPAN) * 100}%`, opacity: done }} />
            <motion.span className="absolute inset-y-[-6px] w-px bg-foreground/60" style={{ left: playhead, opacity: playheadOpacity }} />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-[9rem_minmax(0,1fr)]">
          <span className="hidden sm:block" />
          <div className="relative h-8 text-[0.6875rem] text-muted-foreground tabular-nums">
            {[0, 1, 2, 3].map((s) => (
              <span className="absolute top-0 -translate-x-1/2 whitespace-nowrap" key={s} style={{ left: `${(s / SPAN) * 100}%` }}>
                {s} s
              </span>
            ))}
            <motion.span
              className="absolute top-4 -translate-x-1/2 whitespace-nowrap font-medium text-[color:var(--lane-accent)]"
              style={{ left: `${(2.6 / SPAN) * 100}%`, opacity: done }}
            >
              Oxidize: done
            </motion.span>
          </div>
        </div>
        <div className="absolute top-4 right-4 sm:top-5 sm:right-6">
          <Action disabled={playing} onClick={play}>
            {playing ? "Playing" : "Replay"}
          </Action>
        </div>
      </div>
    </Demo>
  );
}

type Spelling = "slash" | "short" | "dot" | "leftover";

const SPELLINGS: Record<Spelling, { typed: string; step: string; resolved: string; verdict: string; refused: boolean }> = {
  slash: { typed: "C:/Windows", step: "Forward slashes turned around", resolved: "C:\\Windows", verdict: "Refused: Windows' own folder", refused: true },
  short: { typed: "C:\\PROGRA~1", step: "Short name expanded", resolved: "C:\\Program Files", verdict: "Refused: Windows' own folder", refused: true },
  dot: { typed: "C:\\Windows.", step: "Trailing dot dropped, as Windows does", resolved: "C:\\Windows", verdict: "Refused: Windows' own folder", refused: true },
  leftover: { typed: "%AppData%\\Quillmark", step: "Expanded to the full path", resolved: "C:\\Users\\you\\AppData\\Roaming\\Quillmark", verdict: "Allowed: a leftover of Quillmark", refused: false },
};

/** One folder, many spellings: each is resolved before it is compared. */
export function PathDemo() {
  const { fade, delay } = useMotionSafe();
  const [pick, setPick] = useState<Spelling>("slash");
  const s = SPELLINGS[pick];
  return (
    <Demo
      caption="Pick a spelling. Each is resolved to the real folder before anything is compared, let alone touched."
      height={250}
      label="Paths resolved to their real names, and protected folders refused"
      live={`${s.typed} resolves to ${s.resolved}. ${s.verdict}.`}
      phoneHeight={320}
    >
      <div className="absolute inset-0 flex flex-col gap-5 p-5 sm:p-7">
        <Pills<Spelling>
          label="Path"
          onChange={setPick}
          options={[
            { value: "slash", label: "C:/Windows" },
            { value: "short", label: "C:\\PROGRA~1" },
            { value: "dot", label: "C:\\Windows." },
            { value: "leftover", label: "%AppData%\\Quillmark" },
          ]}
          value={pick}
        />
        <AnimatePresence initial={false} mode="wait">
          <motion.dl
            animate={{ opacity: 1 }}
            className="m-0 flex flex-col gap-2.5 text-[0.8125rem]"
            exit={{ opacity: 0 }}
            initial={{ opacity: 1 }}
            key={pick}
            transition={fade}
          >
            {[
              ["Typed", <span className="font-mono" key="t">{s.typed}</span>],
              ["Then", <span className="text-muted-foreground" key="s">{s.step}</span>],
              ["Resolved", <span className="break-all font-mono" key="r">{s.resolved}</span>],
              [
                "Verdict",
                <span
                  className={`inline-flex rounded-md px-2 py-0.5 font-medium text-[0.75rem] ${
                    s.refused
                      ? "bg-[#c8692f]/12 text-[#9a4a1b] dark:bg-[#e2803f]/15 dark:text-[#f0a274]"
                      : "bg-[#3f8f84]/12 text-[#2d6d64] dark:bg-[#5fb3a5]/15 dark:text-[#8fd3c7]"
                  }`}
                  key="v"
                >
                  {s.verdict}
                </span>,
              ],
            ].map(([term, value], i) => (
              <motion.div
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-[5.5rem_minmax(0,1fr)] items-baseline gap-x-4"
                initial={{ opacity: 0, y: 4 }}
                key={term as string}
                transition={{ ...fade, delay: delay(i * 0.07) }}
              >
                <dt className="text-muted-foreground">{term}</dt>
                <dd className="m-0 min-w-0">{value}</dd>
              </motion.div>
            ))}
          </motion.dl>
        </AnimatePresence>
      </div>
    </Demo>
  );
}
