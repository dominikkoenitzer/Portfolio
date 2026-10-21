import { AnimatePresence, LayoutGroup, animate, motion, useMotionValue, useMotionValueEvent } from "framer-motion";
import { Check } from "lucide-react";
import { type ReactNode, useEffect, useRef, useState } from "react";
import { Action, BarText, Demo, Frame, Pills } from "../kit";
import { useMotionSafe, wait } from "../motion";
import "./oxidize.css";

/*
 * Oxidize, told through its key moments, in its own window: the colours of
 * its light and dark theme (Tint in oxidize-gui.rs), following the page's
 * theme the way the app follows Windows', its typeface, its layout and its
 * own words. The programs and the footprint are the made-up ones its
 * screenshots use. The reader's controls sit on the demo's bar, outside the
 * window; the window's own button lights up when the bar presses it.
 */

/** Oxidize's Tint, light and dark, as variables that follow the page. */
const OX =
  "[--ox-chrome:#f2efeb] [--ox-base:#faf9f7] [--ox-side:#ffffff] [--ox-text:#1f1c19] [--ox-weak:#6e6860] [--ox-line:#e4ded6] [--ox-strong:#cfc6bb] [--ox-button:#ffffff] [--ox-active:#ede7e0] [--ox-selected:#eae4dd] [--ox-copper:#b5521d] [--ox-on-copper:#ffffff] [--ox-verdigris:#217a6e] [--ox-amber:#946300] [--ox-red:#bd3a2a] dark:[--ox-chrome:#151312] dark:[--ox-base:#1b1918] dark:[--ox-side:#221f1d] dark:[--ox-text:#ebe6e1] dark:[--ox-weak:#9d968f] dark:[--ox-line:#332f2c] dark:[--ox-strong:#4a443e] dark:[--ox-button:#292624] dark:[--ox-active:#3b3632] dark:[--ox-selected:#2f2b28] dark:[--ox-copper:#e2793d] dark:[--ox-on-copper:#1b120c] dark:[--ox-verdigris:#5ec3b3] dark:[--ox-amber:#dba543] dark:[--ox-red:#ec7262]";
const v = (name: string) => `var(--ox-${name})`;

type Program = { name: string; by: string; size: string; tint: string };

/** The made-up programs, in the window's order, around the one the demos use. */
const PROGRAMS: Program[] = [
  { name: "Marrowby Browser", by: "Marrowby", size: "512.0 MB", tint: "#3f7fd6" },
  { name: "Oriel Backup", by: "Oriel Software GmbH", size: "2.3 GB", tint: "#5b5fc7" },
  { name: "Otterbrook Drive", by: "Otterbrook Cloud", size: "160.0 MB", tint: "#2f9e9a" },
  { name: "Pinegate Mail", by: "Pinegate", size: "410.0 MB", tint: "#d0477e" },
  { name: "Quillmark", by: "Example Labs", size: "312.0 MB", tint: "#1f5fd1" },
  { name: "Reedmoor Player", by: "Reedmoor Media", size: "186.0 MB", tint: "#d94040" },
  { name: "Sablewick Calendar", by: "Sablewick", size: "74.0 MB", tint: "#9a58c8" },
  { name: "Saltmarsh Launcher", by: "Saltmarsh Games", size: "2.3 GB", tint: "#c77a2b" },
  { name: "Tessel Terminal", by: "Tessel", size: "96.0 MB", tint: "#3a3a46" },
  { name: "Wrenfield Chat", by: "Wrenfield", size: "340.0 MB", tint: "#3aa357" },
];

type Grade = "high" | "medium" | "low";
type Item = { path: string; reason: string; grade: Grade; size?: string; leaf: string };
type Section = { title: string; meta: string; items: Item[] };

/** What a scan finds after Quillmark's own uninstaller has run. */
const LEFTOVERS: Section[] = [
  {
    title: "Files and folders",
    meta: "3 · 22.1 MB",
    items: [
      { path: "C:\\Users\\you\\AppData\\Roaming\\Quillmark", reason: "exact name, 18.0 MB", grade: "high", leaf: "" },
      { path: "C:\\Users\\you\\AppData\\Local\\Quillmark-Updater", reason: "part of the name, 4.0 MB", grade: "medium", leaf: "" },
      { path: "C:\\ProgramData\\QMCache", reason: "claimed by no program, 120.0 KB", grade: "low", leaf: "" },
    ],
  },
  {
    title: "Registry",
    meta: "1",
    items: [{ path: "HKCU\\Software\\Example Labs\\Quillmark", reason: "exact name, in vendor key Example Labs", grade: "high", leaf: "" }],
  },
];

/** Everything that makes up Quillmark while it is installed, as the scan lists it. */
const FOOTPRINT: Section[] = [
  {
    title: "Files and folders",
    meta: "2 · 8.1 MB",
    items: [
      { path: "C:\\Program Files\\Quillmark", reason: "install folder, in the vendor's folder, 6.1 MB", grade: "high", leaf: "Program Files\\Quillmark" },
      { path: "C:\\ProgramData\\Example Labs\\Quillmark", reason: "exact name, in vendor folder Example Labs, 2.0 MB", grade: "high", leaf: "ProgramData\\…\\Quillmark" },
    ],
  },
  {
    title: "Shortcuts",
    meta: "1 · 1008 B",
    items: [{ path: "C:\\ProgramData\\Microsoft\\Windows\\Start Menu\\Programs\\Quillmark.lnk", reason: "exact name", grade: "high", leaf: "Quillmark.lnk" }],
  },
  {
    title: "Registry",
    meta: "4",
    items: [
      { path: "HKLM\\SOFTWARE\\Example Labs\\Quillmark", reason: "exact name, in vendor key Example Labs", grade: "high", leaf: "HKLM …\\Example Labs\\Quillmark" },
      { path: "HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\App Paths\\quillmark.exe", reason: "App Paths entry for quillmark.exe", grade: "high", leaf: "App Paths\\quillmark.exe" },
      { path: "HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Run : Quillmark", reason: "autostart, exact name", grade: "high", leaf: "Run : Quillmark" },
      { path: "HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\Quillmark", reason: "the program's uninstall entry", grade: "high", leaf: "Uninstall\\Quillmark" },
    ],
  },
];
/** A complete removal also takes the settings in the user's own hive. */
const USER_SETTINGS: Item = { path: "HKCU\\Software\\Example Labs\\Quillmark", reason: "exact name, in vendor key Example Labs", grade: "high", leaf: "HKCU …\\Example Labs\\Quillmark" };
const BACKUP = "2026-10-16 171306 Quillmark";

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

function ProgramIcon({ program, size }: { program: Program; size: number }) {
  return (
    <span className="flex shrink-0 items-center justify-center rounded-[4px]" style={{ width: size, height: size, background: program.tint }}>
      {program.name === "Quillmark" ? (
        <svg aria-hidden fill="none" viewBox="0 0 16 16" width={size * 0.7}>
          <path d="M3.5 12.5 11.5 4.5M10 3l3 3" stroke="#fff" strokeLinecap="round" strokeWidth="1.6" />
        </svg>
      ) : null}
    </span>
  );
}

/** A button as the window draws it: copper for the main action, outlined for the rest. */
function AppButton({ children, kind = "plain", lit = false, wide = false }: { children: ReactNode; kind?: "copper" | "plain" | "danger"; lit?: boolean; wide?: boolean }) {
  const style =
    kind === "copper"
      ? { background: v("copper"), color: v("on-copper") }
      : kind === "danger"
        ? { background: v("button"), color: v("red"), boxShadow: `inset 0 0 0 1px ${v("red")}` }
        : { background: lit ? v("active") : v("button"), color: v("text"), boxShadow: `inset 0 0 0 1px ${v("line")}` };
  return (
    <span
      className={`flex h-7 items-center rounded-[4px] px-2.5 text-[0.75rem] transition-[filter,background-color] duration-150 ${wide ? "w-full" : "justify-center"}`}
      style={{ ...style, filter: lit && kind !== "plain" ? "brightness(0.9)" : undefined }}
    >
      {children}
    </span>
  );
}

function Grade({ grade }: { grade: Grade }) {
  const color = grade === "high" ? v("verdigris") : grade === "medium" ? v("amber") : v("weak");
  return <span style={{ color }}>{grade}</span>;
}

/** One found item: its tick, its confidence, its path and why it was matched. */
function ItemRow({ item, ticked, layoutId }: { item: Item; ticked: boolean; layoutId?: string }) {
  const { spring } = useMotionSafe();
  return (
    <motion.div className="grid grid-cols-[0.875rem_3.25rem_minmax(0,1fr)] gap-x-2 py-1" layout={layoutId ? "position" : undefined} layoutId={layoutId} transition={spring}>
      <span className="mt-[3px] flex h-3.5 w-3.5 items-center justify-center rounded-[3px]" style={{ boxShadow: `inset 0 0 0 1px ${v("strong")}`, background: v("side") }}>
        {ticked ? <Check className="h-2.5 w-2.5" strokeWidth={3} style={{ color: v("text") }} /> : null}
      </span>
      <Grade grade={item.grade} />
      <span className="min-w-0">
        <span className="block leading-snug" style={{ color: v("text") }}>
          <PathText path={item.path} />
        </span>
        <span className="block text-[0.6875rem] leading-snug" style={{ color: v("weak") }}>
          {item.reason}
        </span>
      </span>
    </motion.div>
  );
}

function SectionHead({ section }: { section: Section }) {
  return (
    <p className="m-0 mt-2 flex items-baseline gap-2" style={{ color: v("text") }}>
      <span aria-hidden className="text-[0.6875rem]">
        ▼
      </span>
      {section.title}
      <span style={{ color: v("weak") }}>{section.meta}</span>
    </p>
  );
}

/**
 * The Oxidize window: its title bar with the two tabs, the program list (left,
 * from `sm`), the details pane, and the status line at the foot.
 */
function OxWindow({ list, count, pane, status, overlay }: { list: Program[]; count: string; pane: ReactNode; status: string; overlay?: ReactNode }) {
  const { spring } = useMotionSafe();
  return (
    <div
      aria-hidden
      className={`absolute inset-0 flex flex-col overflow-hidden rounded-lg text-[0.75rem] shadow-[0_1px_2px_rgb(0_0_0/0.08),0_18px_36px_-24px_rgb(0_0_0/0.35)] ${OX}`}
      style={{ background: v("base"), color: v("text"), fontFamily: '"Oxidize UI", system-ui, sans-serif', boxShadow: `0 0 0 1px ${v("line")}` }}
    >
      <div className="flex h-9 shrink-0 items-center gap-4 border-b px-3.5" style={{ background: v("chrome"), borderColor: v("line") }}>
        <span className="text-[0.875rem]">Oxidize</span>
        <span className="relative py-1">
          Programs
          <span className="absolute inset-x-0 -bottom-[3px] h-[2px] rounded-full" style={{ background: v("text") }} />
        </span>
        <span style={{ color: v("weak") }}>Clean up</span>
        <span className="ml-auto hidden sm:inline" style={{ color: v("weak") }}>
          Administrator
        </span>
      </div>
      <div className="relative flex min-h-0 flex-1">
        <div className="hidden w-[42%] shrink-0 flex-col border-r sm:flex" style={{ borderColor: v("line") }}>
          <p className="m-0 px-3 pt-2.5 pb-1.5 text-right text-[0.6875rem] tabular-nums" style={{ color: v("weak") }}>
            {count}
          </p>
          <p className="m-0 flex justify-between border-b px-3 pb-1 text-[0.6875rem]" style={{ color: v("weak"), borderColor: v("line") }}>
            <span>Name</span>
            <span>Size</span>
          </p>
          <ul className="m-0 min-h-0 flex-1 list-none overflow-hidden p-0 pt-1">
            <AnimatePresence initial={false}>
              {list.map((p) => (
                <motion.li
                  animate={{ opacity: 1, height: 28 }}
                  className="mx-1 flex items-center gap-2 overflow-hidden rounded-[4px] px-2"
                  exit={{ opacity: 0, height: 0 }}
                  initial={{ opacity: 0, height: 0 }}
                  key={p.name}
                  style={{ background: p.name === "Quillmark" ? v("selected") : "transparent" }}
                  transition={{ ...spring, opacity: { duration: 0.2 } }}
                >
                  <ProgramIcon program={p} size={14} />
                  <span className="min-w-0 flex-1 whitespace-nowrap">{p.name}</span>
                  <span className="tabular-nums" style={{ color: p.name === "Quillmark" ? v("text") : v("weak") }}>
                    {p.size}
                  </span>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        </div>
        <div className="relative min-w-0 flex-1" style={{ background: v("side") }}>
          {pane}
        </div>
        {overlay}
      </div>
      <div className="flex h-7 shrink-0 items-center justify-between gap-3 border-t px-3.5 text-[0.6875rem]" style={{ color: v("weak"), borderColor: v("line") }}>
        <span className="min-w-0 truncate">{status}</span>
        <span>Log</span>
      </div>
    </div>
  );
}

/** The top of the details pane: who is selected, and the three ways to remove it. */
function PaneHead({ lit }: { lit?: "remove" | "uninstall" | "scan" }) {
  const quill = PROGRAMS[4];
  return (
    <>
      <div className="flex items-center gap-2.5">
        <ProgramIcon program={quill} size={28} />
        <span className="min-w-0">
          <span className="block text-[1rem] leading-tight">Quillmark</span>
          <span className="block leading-tight" style={{ color: v("weak") }}>
            Version 2.3.0 · Example Labs
          </span>
        </span>
      </div>
      <div className="mt-3 flex flex-col gap-1.5">
        <AppButton kind="copper" lit={lit === "remove"} wide>
          Remove completely
        </AppButton>
        <div className="grid grid-cols-2 gap-1.5">
          <AppButton lit={lit === "uninstall"}>Run uninstaller</AppButton>
          <AppButton lit={lit === "scan"}>Scan for leftovers</AppButton>
        </div>
      </div>
    </>
  );
}

function Facts() {
  return (
    <dl className="m-0 mt-3 grid grid-cols-[5.5rem_minmax(0,1fr)] gap-y-1">
      {[
        ["Size", "312.0 MB"],
        ["Installed", "2026-10-01"],
        ["Location", "C:\\Program Files\\Quillmark"],
      ].map(([k, value]) => (
        <div className="contents" key={k}>
          <dt style={{ color: v("weak") }}>{k}</dt>
          <dd className="m-0">{value}</dd>
        </div>
      ))}
    </dl>
  );
}

/** The pane's own scroll area, which moves to what just appeared. */
function Pane({ children, scrollTo, settle = 0 }: { children: ReactNode; scrollTo: string | null; settle?: number }) {
  const box = useRef<HTMLDivElement>(null);
  const { reduced } = useMotionSafe();
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const target = scrollTo ? el.querySelector<HTMLElement>(`[data-anchor="${scrollTo}"]`) : null;
    el.scrollTo({ top: target ? target.offsetTop - 12 : 0, behavior: reduced ? "auto" : "smooth" });
  }, [scrollTo, reduced, settle]);
  return (
    <div className="absolute inset-0 overflow-y-auto p-3.5 [scrollbar-width:thin]" ref={box}>
      {children}
    </div>
  );
}

const without = (name: string) => PROGRAMS.filter((p) => p.name !== name);

/* ------------------------------------------------------------------ */
/* Run the uninstaller, then scan                                      */
/* ------------------------------------------------------------------ */

type UninstallPhase = "idle" | "running" | "gone" | "scanning" | "found";

/** The key moment: the program's own uninstaller, then what it left, graded. */
export function UninstallDemo() {
  const { reduced } = useMotionSafe();
  const [phase, setPhase] = useState<UninstallPhase>("idle");
  const [shown, setShown] = useState(0);
  const run = useRef(0);
  useEffect(() => () => void run.current++, []);
  const all = LEFTOVERS.flatMap((s) => s.items);

  const uninstall = async () => {
    const id = ++run.current;
    setShown(0);
    if (reduced) {
      setPhase("gone");
      return;
    }
    setPhase("running");
    await wait(1400);
    if (run.current === id) setPhase("gone");
  };
  const scan = async () => {
    const id = ++run.current;
    if (reduced) {
      setShown(all.length);
      setPhase("found");
      return;
    }
    setPhase("scanning");
    await wait(1000);
    if (run.current !== id) return;
    setPhase("found");
    for (let i = 1; i <= all.length; i += 1) {
      await wait(i === 1 ? 150 : 240);
      if (run.current !== id) return;
      setShown(i);
    }
  };

  const status = {
    idle: "20 programs installed.",
    running: "Running the uninstaller for Quillmark...",
    gone: "Program removed from the installed list.",
    scanning: "Scanning for leftovers of Quillmark...",
    found: "4 leftovers of Quillmark.",
  }[phase];
  const told = {
    idle: "Quillmark is installed and selected.",
    running: "Its own uninstaller is running.",
    gone: "Gone from the list. Its leftovers are not.",
    scanning: "Searching the registry and the disk.",
    found: "Only the two High finds are ticked.",
  }[phase];
  const found = phase === "found";
  let index = 0;

  return (
    <Demo
      caption="Press both buttons in turn: Quillmark leaves the list first, and only then do its leftovers show up."
      height={440}
      label="Oxidize running a program's uninstaller and then scanning for its leftovers"
      live={found && shown === all.length ? "Four leftovers found: two high, one medium, one low. The two high ones are ticked." : ""}
      phoneHeight={420}
    >
      <Frame
        bottom={
          <>
            <BarText>{told}</BarText>
            <Action
              onClick={() => void (phase === "gone" ? scan() : uninstall())}
              primary={phase === "idle" || phase === "gone"}
              width="min-w-[10rem]"
            >
              {phase === "idle" ? "Run uninstaller" : phase === "gone" ? "Scan for leftovers" : "Run again"}
            </Action>
          </>
        }
      >
        <OxWindow
          count={phase === "idle" || phase === "running" ? "20 programs · 30.2 GB in total" : "19 programs · 29.9 GB in total"}
          list={phase === "idle" || phase === "running" ? PROGRAMS : without("Quillmark")}
          pane={
            <Pane scrollTo={found ? "results" : null} settle={shown}>
              <PaneHead lit={phase === "running" ? "uninstall" : phase === "scanning" ? "scan" : undefined} />
              <Facts />
              <div className="mt-3 border-t pt-3" data-anchor="results" style={{ borderColor: v("line") }}>
                {found ? (
                  <>
                    <p className="m-0 text-[0.875rem]">4 items, 22.1 MB in files</p>
                    <div className="mt-1.5 flex gap-1.5">
                      {["Check High", "Check all", "Uncheck all"].map((b) => (
                        <span className="rounded-[4px] px-1.5 text-[0.6875rem] leading-5" key={b} style={{ boxShadow: `inset 0 0 0 1px ${v("line")}`, background: v("button") }}>
                          {b}
                        </span>
                      ))}
                    </div>
                    <div className="mt-1.5">
                      <AppButton kind="danger" wide>
                        Remove 2 checked items
                      </AppButton>
                    </div>
                    {LEFTOVERS.map((section) => (
                      <div key={section.title}>
                        <SectionHead section={section} />
                        {section.items.map((item) => {
                          const n = index++;
                          return n < shown ? (
                            <motion.div animate={{ opacity: 1, y: 0 }} initial={reduced ? false : { opacity: 0, y: 6 }} key={item.path}>
                              <ItemRow item={item} ticked={item.grade === "high"} />
                            </motion.div>
                          ) : null;
                        })}
                      </div>
                    ))}
                  </>
                ) : (
                  <p className="m-0" style={{ color: v("weak") }}>
                    {phase === "scanning" ? "Scanning..." : "Scan for leftovers to list what it keeps in its folders."}
                  </p>
                )}
              </div>
            </Pane>
          }
          status={status}
        />
      </Frame>
    </Demo>
  );
}

/* ------------------------------------------------------------------ */
/* Remove completely, and Undo                                         */
/* ------------------------------------------------------------------ */

type RemovePhase = "footprint" | "confirm" | "removing" | "done" | "restoring";

/** Remove completely, then Undo: the backup puts all eight items back. */
export function BackupDemo() {
  const { reduced, spring } = useMotionSafe();
  const [phase, setPhase] = useState<RemovePhase>("footprint");
  const [restored, setRestored] = useState(false);
  const run = useRef(0);
  useEffect(() => () => void run.current++, []);
  const items = [...FOOTPRINT.flatMap((s) => s.items), USER_SETTINGS];
  const away = phase === "done" || phase === "restoring";

  const remove = async () => {
    const id = ++run.current;
    setRestored(false);
    setPhase("removing");
    await wait(reduced ? 0 : 600);
    if (run.current === id) setPhase("done");
  };
  const undo = async () => {
    const id = ++run.current;
    setPhase("restoring");
    await wait(reduced ? 0 : 500);
    if (run.current !== id) return;
    setRestored(true);
    setPhase("footprint");
  };

  const status = {
    footprint: restored ? `Restored 8 items from ${BACKUP}` : "7 items make up Quillmark. It is still installed.",
    confirm: "7 items make up Quillmark. It is still installed.",
    removing: "Removing Quillmark completely...",
    done: "Quillmark: nothing left.",
    restoring: `Restoring ${BACKUP}...`,
  }[phase];
  const told = {
    footprint: restored ? "All eight back, and Quillmark with them." : "Quillmark is installed.",
    confirm: "Oxidize asks first.",
    removing: "Each item is backed up, then deleted.",
    done: "Nothing left, eight items in the backup.",
    restoring: "Every item goes back to its place.",
  }[phase];
  let index = 0;

  return (
    <Demo
      caption="Remove Quillmark completely, then Undo. Watch the eight items travel into the backup and back."
      height={480}
      label="Oxidize removing a program completely into a backup, and Undo restoring it"
      live={phase === "done" ? "Quillmark removed, eight items in the backup." : restored && phase === "footprint" ? "Eight items restored." : ""}
      phoneHeight={600}
    >
      <Frame
        bottom={
          <>
            <BarText>{told}</BarText>
            {phase === "confirm" ? (
              <Action onClick={() => setPhase("footprint")} width="min-w-[5.5rem]">
                Cancel
              </Action>
            ) : null}
            <Action
              onClick={() => (phase === "footprint" ? setPhase("confirm") : phase === "confirm" ? void remove() : phase === "done" ? void undo() : undefined)}
              primary
              width="min-w-[10rem]"
            >
              {phase === "done" || phase === "restoring" ? "Undo" : "Remove completely"}
            </Action>
          </>
        }
      >
        <LayoutGroup>
          <div className="absolute inset-0 flex flex-col gap-3">
            <div className="relative min-h-0 flex-1">
              <OxWindow
                count={away ? "19 programs · 29.9 GB in total" : "20 programs · 30.2 GB in total"}
                list={away ? without("Quillmark") : PROGRAMS}
                overlay={
                  phase === "confirm" ? (
                    <motion.div animate={{ opacity: 1 }} className="absolute inset-0 flex items-center justify-center p-4" initial={{ opacity: 0 }} style={{ background: "rgb(0 0 0 / 0.28)" }}>
                      <div className="max-w-[22rem] rounded-[10px] p-4" style={{ background: v("side"), boxShadow: `0 0 0 1px ${v("line")}` }}>
                        <p className="m-0 leading-snug">
                          Remove Quillmark completely? Running copies are closed, everything found at high confidence is removed, a backup is kept.
                        </p>
                        <div className="mt-3 flex gap-2">
                          <AppButton kind="copper">Remove completely</AppButton>
                          <AppButton>Cancel</AppButton>
                        </div>
                      </div>
                    </motion.div>
                  ) : null
                }
                pane={
                  <Pane scrollTo={null}>
                    <PaneHead lit={phase === "removing" ? "remove" : undefined} />
                    <div className="mt-3 border-t pt-3" data-anchor="footprint" style={{ borderColor: v("line") }}>
                      {away ? (
                        <>
                          <p className="m-0 text-[1.125rem]" style={{ color: v("verdigris") }}>
                            Nothing left.
                          </p>
                          <p className="m-0 mt-0.5" style={{ color: v("weak") }}>
                            Removed 8 items in 0.6 s
                          </p>
                          <div className="mt-2.5 w-24">
                            <AppButton lit={phase === "restoring"}>Undo</AppButton>
                          </div>
                        </>
                      ) : (
                        <>
                          <p className="m-0 leading-snug" style={{ color: v("amber") }}>
                            Still installed. These items are its current footprint, not leftovers.
                          </p>
                          <p className="m-0 mt-1 text-[0.875rem]">7 items, 8.1 MB in files</p>
                          {FOOTPRINT.map((section) => (
                            <div key={section.title}>
                              <SectionHead section={section} />
                              {section.items.map((item) => {
                                const n = index++;
                                return <ItemRow item={item} key={item.path} layoutId={`ox-fp-${n}`} ticked={false} />;
                              })}
                            </div>
                          ))}
                        </>
                      )}
                    </div>
                  </Pane>
                }
                status={status}
              />
            </div>
            {/* The backup on disk: not part of the window, drawn to show where the items go. */}
            <div className="flex min-h-[4rem] shrink-0 flex-col justify-center gap-1.5 rounded-xl border border-border/80 border-dashed px-3 py-2">
              <p className="m-0 flex justify-between gap-3 text-[0.75rem] text-muted-foreground">
                <span>Backup {BACKUP}</span>
                <span className="tabular-nums">{away ? "8 items" : "empty"}</span>
              </p>
              <div className="flex min-h-5 flex-wrap gap-1">
                {away
                  ? items.map((item, n) => (
                      <motion.span
                        className="rounded-[4px] bg-foreground/[0.06] px-1.5 font-mono text-[0.6875rem] text-foreground/80 leading-5"
                        key={item.path}
                        layout="position"
                        layoutId={n < items.length - 1 ? `ox-fp-${n}` : undefined}
                        initial={n < items.length - 1 ? false : { opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ ...spring, delay: reduced ? 0 : n * 0.04 }}
                      >
                        {item.leaf}
                      </motion.span>
                    ))
                  : null}
              </div>
            </div>
          </div>
        </LayoutGroup>
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
  { name: "Oxidize", from: 0, to: 2.5, result: "moves on at 2.5 s, the entry is gone", oxidize: true },
];
const TICKS = [0, 1, 2];
/** Where the picture rests before it plays: the first process has just said done. */
const REST = 0.4;
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
  const time = useMotionValue(REST);
  const [t, setT] = useState(REST);
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
      ? "0.4 s in, the first process has already said done."
      : state === "done"
        ? "The exit code came 2.1 seconds before the uninstall was over."
        : t < 0.4
          ? "Oxidize started Quillmark's uninstaller."
          : t < 2.5
            ? "The process exited with 0. The entry is still there, so Oxidize waits."
            : "The entry is gone.";

  return (
    <Demo
      caption="Play the uninstall in real time and watch which lane Oxidize follows."
      height={360}
      label="A timeline of one uninstall: the started process, its copy, the uninstall entry and Oxidize"
      live={state === "done" ? "The started process exited with 0 at 0.4 seconds. Its copy finished at 2.6 seconds and removed the entry at 2.5. Oxidize moved on at 2.5 seconds." : ""}
      phoneHeight={400}
    >
      <Frame
        bottom={
          <>
            <BarText>{status}</BarText>
            <Action onClick={start} primary={state !== "running"} width="min-w-[8rem]">
              {state === "idle" ? "Play" : "Play again"}
            </Action>
          </>
        }
      >
        <div aria-hidden className="absolute inset-0 flex flex-col justify-center gap-5 sm:gap-6">
          {/* The clock, riding the playhead along the track column. Labels shift by
              their own share of the axis, so 0 starts at the line and 2.6 s ends on it. */}
          <div className="relative h-4 sm:ml-[8.25rem] sm:mr-[10.25rem]">
            <span className="absolute whitespace-nowrap text-[0.75rem] text-foreground tabular-nums" style={{ left: pct(t), transform: `translateX(-${pct(t)})` }}>
              {t.toFixed(1)} s
            </span>
          </div>
          <div className="relative flex flex-col gap-5 sm:gap-6">
            {LANES.map((lane) => (
              <Lane key={lane.name} lane={lane} t={t} />
            ))}
            {/* The playhead crosses the tracks only, never the names or the results */}
            <span className="pointer-events-none absolute inset-y-0 hidden w-px bg-foreground/50 sm:block" style={{ left: `calc(8.25rem + (100% - 18.5rem) * ${t / END})` }} />
          </div>
          <div className="relative h-4 sm:ml-[8.25rem] sm:mr-[10.25rem]">
            {TICKS.map((tick) => (
              <span className="absolute whitespace-nowrap text-[0.75rem] text-muted-foreground tabular-nums" key={tick} style={{ left: pct(tick), transform: `translateX(-${pct(tick)})` }}>
                {tick} s
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
      height={240}
      label="Paths resolved to their real names, and protected folders refused"
      live={`${s.typed} resolves to ${s.resolved}. ${s.verdict}.`}
      phoneHeight={340}
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
