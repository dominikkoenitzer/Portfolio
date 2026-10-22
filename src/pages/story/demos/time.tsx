import { motion } from "framer-motion";
import { type ReactNode, type RefObject, useCallback, useEffect, useRef, useState } from "react";
import { Action, BarText, Demo, Frame, Pills } from "../kit";
import { useMotionSafe, wait } from "../motion";
import "./time.css";

/*
 * Time, told through its two moments. The maths is Time's own (lib/clock-sync.ts):
 * an offset per round trip of serverNow - (start + rtt/2), the fastest trip
 * wins, and it is wrong by half that trip at most. The face is Time's own
 * (components/clock.tsx): its typeface, its greys, the red that only the colons
 * wear, and the colons going dark for the last 100 ms of every second.
 *
 * Both demos run from the moment of the page's own captures, 28 October 2026
 * at 17:13:06 in Zurich, and tick on in real time from there.
 */

const FACE = { bg: "#0a0a0a", text: "#fafafa", muted: "#a1a1a1", caption: "#a1a1a1", mark: "#e5302b", line: "#262626" };

/** 28 October 2026, 17:13:06 in Zurich, the moment in the captures. */
const CAPTURED = Date.UTC(2026, 9, 28, 16, 13, 6);

/** When the first Time demo on the page started; both run on the same moment. */
let startedAt: number | null = null;
const trueNow = () => {
  startedAt ??= Date.now();
  return CAPTURED + (Date.now() - startedAt);
};

/** As in Time's clock-sync.ts. */
const sampleOffsetMs = (serverNowMs: number, startWallMs: number, rttMs: number) => serverNowMs - (startWallMs + rttMs / 2);

/** As in Time's lib/time.ts: two decimals while they mean something. */
function formatSeconds(ms: number) {
  const s = ms / 1000;
  if (s < 10) return `${s.toFixed(2)} s`;
  if (s < 60) return `${s.toFixed(1)} s`;
  return `${Math.round(s)} s`;
}

/** As in Time's lib/time.ts: the line under the zone once a measurement has landed. */
function formatDeviceOffset(offsetMs: number, errorMs: number) {
  const margin = `±${formatSeconds(Math.ceil(errorMs / 10) * 10 || 10)}`;
  if (Math.abs(offsetMs) <= errorMs) return `Device exact ${margin}`;
  return `Device ${formatSeconds(Math.abs(offsetMs))} ${offsetMs > 0 ? "behind" : "ahead"} ${margin}`;
}

const two = (n: number) => String(n).padStart(2, "0");

/** The wall clock of an instant at a fixed UTC offset (the moment never leaves October, so no zone changes its clocks). */
function wallAt(ms: number, offsetMin: number) {
  const d = new Date(ms + offsetMin * 60_000);
  return { d, h: d.getUTCHours(), m: d.getUTCMinutes(), s: d.getUTCSeconds() };
}

/** True while the element is on screen: an off-screen clock does nothing. */
function useOnScreen(ref: RefObject<HTMLElement | null>) {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => setOn(entries.some((e) => e.isIntersecting)));
    io.observe(el);
    return () => io.disconnect();
  }, [ref]);
  return on;
}

/**
 * A clock running `offsetMs` from the true moment: it re-renders exactly on its
 * own seconds, and (unless motion is reduced) says when the colons are dark,
 * the last 100 ms of each of those seconds.
 */
function useClock(offsetMs: number, running: boolean, dwell: boolean) {
  const [now, setNow] = useState(() => trueNow() + offsetMs);
  const [dark, setDark] = useState(false);
  useEffect(() => {
    if (!running) return;
    let tick = 0;
    let dim = 0;
    const loop = () => {
      const at = trueNow() + offsetMs;
      const into = ((at % 1000) + 1000) % 1000;
      setNow(at);
      setDark(false);
      if (dwell) dim = window.setTimeout(() => setDark(true), Math.max(0, 900 - into));
      tick = window.setTimeout(loop, 1000 - into + 2);
    };
    loop();
    return () => {
      window.clearTimeout(tick);
      window.clearTimeout(dim);
    };
  }, [offsetMs, running, dwell]);
  return { now, dark: dwell && dark };
}

/**
 * The colon as Time draws it: the typed colon kept as an invisible box (so the
 * face still copies as 17:13:06) with two squares over it, centred on the
 * digits. `typed` shows the font's own colon instead, which sits on the
 * lowercase letters and hangs low between digits.
 */
function Colon({ dark, typed }: { dark: boolean; typed: boolean }) {
  const opacity = dark ? 0 : 1;
  if (typed) return <span style={{ color: FACE.mark, opacity }}>:</span>;
  return (
    <span className="relative inline-block text-transparent">
      :
      <span aria-hidden className="pointer-events-none absolute inset-y-0 left-0 flex w-[0.6em] flex-col items-center justify-center gap-[0.244em]" style={{ opacity }}>
        <span className="size-[0.133em]" style={{ background: FACE.mark }} />
        <span className="size-[0.133em]" style={{ background: FACE.mark }} />
      </span>
    </span>
  );
}

function Digits({ h, m, s, dark, typed = false, className }: { h: number; m: number; s: number; dark: boolean; typed?: boolean; className: string }) {
  return (
    <span className={`block whitespace-nowrap font-medium leading-none tracking-[-0.03em] ${className}`} style={{ color: FACE.text }}>
      {two(h)}
      <Colon dark={dark} typed={typed} />
      {two(m)}
      <Colon dark={dark} typed={typed} />
      <span style={{ color: FACE.muted }}>{two(s)}</span>
    </span>
  );
}

/** Time's caption type: every caption the same, the hierarchy carried by position. */
const CAPTION = "m-0 text-[0.625rem] uppercase leading-none tracking-[0.2em] sm:text-[0.6875rem]";

/** Time's own surface inside the demo box. */
function Face({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`time-face absolute inset-0 flex flex-col [container-type:inline-size] items-center justify-center overflow-hidden rounded-xl ${className}`} style={{ background: FACE.bg, boxShadow: `0 0 0 1px ${FACE.line}` }}>
      {children}
    </div>
  );
}

/**
 * Five trips with the latencies of an ordinary connection. `toServer` is the
 * share of each trip spent on the way there: an answer stamped away from the
 * halfway point is what makes a slow trip's offset wrong.
 */
const TRIPS = [
  { rtt: 86, toServer: 0.7 },
  { rtt: 41, toServer: 0.42 },
  { rtt: 132, toServer: 0.25 },
  { rtt: 24, toServer: 0.55 },
  { rtt: 63, toServer: 0.62 },
];

const signed = (ms: number) => `${ms < 0 ? "−" : ms > 0 ? "+" : ""}${Math.abs(Math.round(ms)).toLocaleString("en-US")} ms`;
const skewWords = (ms: number) => (ms === 0 ? "exact" : `${formatSeconds(Math.abs(ms))} ${ms > 0 ? "ahead" : "behind"}`);

type SyncPhase = "off" | "measuring" | "synced";

/** The key moment: a device clock that is wrong, five round trips, and the true time. */
export function SyncDemo() {
  const { reduced, spring, fade } = useMotionSafe();
  const box = useRef<HTMLDivElement>(null);
  const onScreen = useOnScreen(box);
  const [skew, setSkew] = useState(2340);
  const [phase, setPhase] = useState<SyncPhase>("off");
  const [done, setDone] = useState(0);
  const run = useRef(0);
  const started = useRef(false);

  // Each trip measured the way Time measures it: the device reads `skew` ms
  // ahead of the true start (0), the server stamps the true time on arrival.
  const samples = TRIPS.map((trip) => ({ rtt: trip.rtt, offset: sampleOffsetMs(trip.rtt * trip.toServer, skew, trip.rtt) }));
  const best = samples.reduce((a, b) => (b.rtt < a.rtt ? b : a));
  const bestIndex = samples.indexOf(best);

  const corrected = phase === "synced";
  const { now, dark } = useClock(corrected ? skew + best.offset : skew, onScreen, !reduced);
  const { h, m, s } = wallAt(now, 60);

  const sync = useCallback(async () => {
    const id = ++run.current;
    if (reduced) {
      setDone(TRIPS.length);
      setPhase("synced");
      return;
    }
    setDone(0);
    setPhase("measuring");
    for (let i = 1; i <= TRIPS.length; i += 1) {
      await wait(240 + TRIPS[i - 1].rtt * 2);
      if (run.current !== id) return;
      setDone(i);
    }
    await wait(380);
    if (run.current === id) setPhase("synced");
  }, [reduced]);

  // Plays its moment once, the first time it is on screen; then it is the reader's.
  useEffect(() => {
    if (!onScreen || started.current || reduced) return;
    started.current = true;
    const t = window.setTimeout(() => void sync(), 700);
    return () => window.clearTimeout(t);
  }, [onScreen, reduced, sync]);

  const status =
    phase === "off"
      ? `The device is ${skewWords(skew)}, and so is the clock.`
      : phase === "measuring"
        ? `Round trip ${Math.min(done + 1, TRIPS.length)} of ${TRIPS.length}`
        : `The ${best.rtt} ms trip won. Its answer can be off by ${best.rtt / 2} ms at most.`;
  const line = phase === "synced" ? formatDeviceOffset(best.offset, best.rtt / 2) : phase === "measuring" ? `Measuring ${Math.min(done + 1, 5)} of 5` : "Device clock, uncorrected";

  return (
    <Demo
      caption="Set how wrong the device is, then Sync. The fastest of five trips sets the clock."
      height={384}
      label="Time correcting a wrong device clock with five round trips to its server"
      live={phase === "synced" ? `${status} ${line}` : ""}
      phoneHeight={472}
    >
      <div className="absolute inset-0" ref={box}>
        <Frame
          bottom={
            <>
              <BarText>{status}</BarText>
              <Action onClick={() => void sync()} primary={phase === "off"} width="min-w-[6.5rem]">
                {phase === "off" ? "Sync" : "Sync again"}
              </Action>
            </>
          }
          top={
            <label className="flex w-full items-center gap-3 text-[0.8125rem]">
              <span className="shrink-0 text-muted-foreground">Device</span>
              <input
                aria-label="How far the device clock is off"
                aria-valuetext={skewWords(skew)}
                className="h-11 min-w-0 flex-1 cursor-pointer accent-foreground sm:h-8"
                max={5000}
                min={-5000}
                onChange={(e) => {
                  run.current++;
                  setSkew(Number(e.target.value));
                  setPhase("off");
                  setDone(0);
                }}
                step={10}
                type="range"
                value={skew}
              />
              <span className="w-[6.5rem] shrink-0 text-right font-medium tabular-nums">{skewWords(skew)}</span>
            </label>
          }
        >
          <Face>
            <div aria-hidden className="flex w-full flex-col items-center">
              {/* The line sits under the clock's left edge, where Time pins it under the zone. */}
              <div className="w-fit">
                <Digits className="text-[clamp(2.5rem,12.5cqw,4.25rem)]" dark={dark} h={h} m={m} s={s} />
                <p className={`${CAPTION} mt-3.5`} style={{ color: FACE.caption }}>
                  {line}
                </p>
              </div>
              {/* The five trips: each lands with its round trip and the offset it implies. */}
              <ol className="m-0 mt-5 grid w-full max-w-[32rem] list-none gap-1 px-4 text-[0.6875rem] tabular-nums sm:mt-6 sm:grid-cols-5 sm:gap-1.5">
                {samples.map((sample, i) => {
                  const landed = i < done;
                  const winner = corrected && i === bestIndex;
                  return (
                    <motion.li
                      animate={{
                        background: winner ? "rgb(255 255 255 / 0.08)" : "rgb(255 255 255 / 0)",
                        boxShadow: `inset 0 0 0 1px ${winner ? "rgb(255 255 255 / 0.35)" : landed ? FACE.line : "rgb(255 255 255 / 0)"}`,
                      }}
                      className="flex items-center justify-between rounded-md px-2.5 py-1.5 sm:flex-col sm:gap-1 sm:px-1 sm:py-2"
                      key={sample.rtt}
                      style={{ color: winner ? FACE.text : FACE.caption }}
                      transition={fade}
                    >
                      <span>{sample.rtt} ms</span>
                      <motion.span animate={{ opacity: landed ? 1 : 0, y: landed ? 0 : 3 }} initial={false} transition={spring}>
                        {signed(sample.offset)}
                      </motion.span>
                    </motion.li>
                  );
                })}
              </ol>
            </div>
          </Face>
        </Frame>
      </div>
    </Demo>
  );
}

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

/** As in Time's lib/time.ts. */
function isoWeek(d: Date) {
  const date = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  date.setUTCDate(date.getUTCDate() + 4 - (date.getUTCDay() || 7));
  return Math.ceil(((date.getTime() - Date.UTC(date.getUTCFullYear(), 0, 1)) / 86_400_000 + 1) / 7);
}

const GUIDE = "rgb(255 255 255 / 0.5)";

const utcOffset = (min: number) => `UTC${min < 0 ? "-" : "+"}${two(Math.floor(Math.abs(min) / 60))}:${two(Math.abs(min) % 60)}`;

/** The face as Time sets it: four captions on the corners of a rectangle that is never drawn, and the colons keeping time. */
export function FaceDemo() {
  const { reduced } = useMotionSafe();
  const box = useRef<HTMLDivElement>(null);
  const onScreen = useOnScreen(box);
  const [colon, setColon] = useState<"drawn" | "typed">("drawn");
  const { now, dark } = useClock(0, onScreen, !reduced);
  const { d, h, m, s } = wallAt(now, 60);
  const typed = colon === "typed";

  return (
    <Demo
      caption="Watch the colons go dark just before each second and light on it. Then switch to the font's own colon."
      height={360}
      label="Time's clock face, with its drawn colons or the font's own"
      live={typed ? "The font's own colon, hanging below the digits' centre" : "The drawn colon, centred on the digits"}
      phoneHeight={380}
    >
      <div className="absolute inset-0" ref={box}>
        <Frame
          bottom={
            <>
              <BarText>{typed ? "The font's colon, set for lowercase, hangs low." : "Two squares, centred on the digits."}</BarText>
              <Pills<"drawn" | "typed">
                label="Colon"
                onChange={setColon}
                options={[
                  { value: "drawn", label: "Drawn" },
                  { value: "typed", label: "Typed" },
                ]}
                value={colon}
              />
            </>
          }
        >
          <Face>
            <div aria-hidden className="w-fit max-w-full px-4">
              <div className="mb-4 flex flex-col gap-y-1.5 sm:mb-5 sm:flex-row sm:justify-between sm:gap-4" style={{ color: FACE.caption }}>
                <p className={CAPTION}>{`${DAYS[d.getUTCDay()]}, ${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`}</p>
                <p className={CAPTION}>W{isoWeek(d)}</p>
              </div>
              <span className="relative block">
                {/* Two ticks at the digits' own centre, which the drawn colon sits on and the typed one misses. */}
                <span className="absolute top-1/2 -left-3 h-px w-2 sm:-left-4 sm:w-2.5" style={{ background: GUIDE, opacity: typed ? 1 : 0, transition: "opacity 200ms" }} />
                <span className="absolute top-1/2 -right-3 h-px w-2 sm:-right-4 sm:w-2.5" style={{ background: GUIDE, opacity: typed ? 1 : 0, transition: "opacity 200ms" }} />
                <Digits className="text-[clamp(3rem,14.5cqw,5.5rem)]" dark={dark} h={h} m={m} s={s} typed={typed} />
              </span>
              <div className="mt-4 flex flex-col gap-y-1.5 sm:mt-5 sm:flex-row sm:justify-between sm:gap-4" style={{ color: FACE.caption }}>
                <p className={CAPTION}>Central European Standard Time</p>
                <p className={CAPTION}>{utcOffset(60)}</p>
              </div>
            </div>
          </Face>
        </Frame>
      </div>
    </Demo>
  );
}
