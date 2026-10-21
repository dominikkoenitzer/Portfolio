import { animate, motion, useMotionValue, useMotionValueEvent } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Action, BarText, Demo, Frame, Pills } from "../kit";
import { useMotionSafe, useSeenOnce } from "../motion";

/*
 * Entropy, told through its key moments, in the app's own palette: near-black
 * surfaces, acid green for what holds, magenta for what gives way.
 */

const E = { bg: "#0a0b08", surface: "#15160c", raised: "#1c1d11", acid: "#c6f000", mag: "#ff2e93", paper: "#ededed", dim: "#81886f" };

/* ------------------------------------------------------------------ */
/* Analyze: what the estimator finds inside a password                 */
/* ------------------------------------------------------------------ */

type Piece = { token: string; found: boolean; what: string };
type Sample = {
  password: string;
  /** Bits from length and character classes alone, as the first version scored it. */
  classes: number;
  /** Bits from the estimator's guess count. */
  bits: number;
  tier: string;
  /** The offline fast-hash attacker: a GPU at 10^11 guesses a second. */
  gpu: string;
  pieces: Piece[];
};

/*
 * Every number below is the output of Entropy's own analyzer (analyze() and
 * bitsRandom() in the app's source), run over these four made-up passwords.
 * The dictionaries behind it are too large to ship with this page.
 */
const SAMPLES: Sample[] = [
  {
    password: "P@ssw0rd!23",
    classes: 72,
    bits: 18,
    tier: "weak",
    gpu: "instantly",
    pieces: [
      { token: "P@ssw0rd", found: true, what: "Common password no. 2, with @ and 0 for a and o" },
      { token: "!23", found: true, what: "A walk along the top row of the keyboard" },
    ],
  },
  {
    password: "Sunflower2024!",
    classes: 92,
    bits: 33,
    tier: "weak",
    gpu: "in less than a second",
    pieces: [
      { token: "Sun", found: true, what: "English word no. 348" },
      { token: "flower2024", found: true, what: "Common password no. 19,752" },
      { token: "!", found: false, what: "Guessed character by character" },
    ],
  },
  {
    password: "drowssap1999",
    classes: 62,
    bits: 14,
    tier: "weak",
    gpu: "instantly",
    pieces: [
      { token: "drowssap", found: true, what: "Common password no. 2, backwards" },
      { token: "1999", found: true, what: "A recent year" },
    ],
  },
  {
    password: "Mxk!r7Lp2#vQ",
    classes: 79,
    bits: 79,
    tier: "strong",
    gpu: "in 1,712 centuries",
    pieces: [{ token: "Mxk!r7Lp2#vQ", found: false, what: "Nothing to find, so every character is guessed" }],
  },
];

/** The bit count, rolling from the class-based score down to the counted one. */
function Bits({ from, to, play }: { from: number; to: number; play: boolean }) {
  const { reduced } = useMotionSafe();
  const value = useMotionValue(reduced ? to : from);
  const [shown, setShown] = useState(reduced ? to : from);
  useMotionValueEvent(value, "change", (v) => setShown(Math.round(v)));
  useEffect(() => {
    if (reduced || from === to) {
      value.set(to);
      return;
    }
    value.set(from);
    // Until the demo is in view it holds the class-based score; the roll down is the moment.
    if (!play) return;
    const run = animate(value, to, { duration: 0.9, delay: 0.25, ease: [0.22, 1, 0.36, 1] });
    return () => run.stop();
  }, [from, to, play, reduced, value]);
  return <span className="tabular-nums">{shown}</span>;
}

/** The key moment: a password that looks strong, taken apart the way an attacker would. */
export function AnalyzeDemo() {
  const [at, setAt] = useState(SAMPLES[0].password);
  const { spring, fade } = useMotionSafe();
  const [box, seen] = useSeenOnce<HTMLDivElement>();
  const sample = SAMPLES.find((s) => s.password === at) ?? SAMPLES[0];
  const weak = sample.tier === "weak";
  const status = `A GPU at 100 billion guesses a second finds it ${sample.gpu}.`;
  return (
    <Demo
      caption="Pick a password. The small number is what counting character classes gives it; the big one is what is left once the patterns are found."
      height={360}
      label="Entropy's analyzer splitting four passwords into the patterns an attacker would try"
      live={`${sample.password}: ${sample.bits} bits, ${sample.tier}. ${status}`}
      phoneHeight={480}
    >
      <Frame
        bottom={<BarText>{status}</BarText>}
        top={<Pills label="Password" onChange={setAt} options={SAMPLES.map((s) => ({ value: s.password, label: s.password }))} value={at} />}
      >
        <div className="absolute inset-0 flex flex-col gap-4 overflow-hidden rounded-xl p-4 sm:p-5" ref={box} style={{ background: E.bg, color: E.paper }}>
          {/* The password, underlined piece by piece: magenta where a pattern was found. */}
          <p className="m-0 flex flex-wrap font-mono text-[1.375rem] leading-none tracking-[-0.01em] sm:text-[1.625rem]" key={sample.password}>
            {sample.pieces.map((p, i) => (
              <motion.span
                animate={{ opacity: 1 }}
                className="relative pb-2.5"
                initial={{ opacity: 0 }}
                key={`${p.token}-${i}`}
                transition={{ ...fade, delay: i * 0.06 }}
              >
                {p.token}
                <span className="absolute inset-x-[1px] bottom-0 h-[3px] rounded-full" style={{ background: p.found ? E.mag : E.acid }} />
              </motion.span>
            ))}
          </p>

          <ul className="m-0 flex min-h-0 flex-1 list-none flex-col gap-2 p-0">
            {sample.pieces.map((p, i) => (
              <motion.li
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-[minmax(0,auto)_minmax(0,1fr)] items-baseline gap-x-3 text-[0.75rem] leading-snug"
                initial={{ opacity: 0, y: 4 }}
                key={`${sample.password}-${i}`}
                transition={{ ...spring, delay: 0.1 + i * 0.06 }}
              >
                <span className="max-w-[9rem] truncate font-mono" style={{ color: p.found ? E.mag : E.acid }}>
                  {p.token}
                </span>
                <span style={{ color: E.dim }}>{p.what}</span>
              </motion.li>
            ))}
          </ul>

          <div className="flex items-end justify-between gap-4 border-t pt-4" style={{ borderColor: E.raised }}>
            <div>
              <span className="block font-semibold text-[2.5rem] leading-none tracking-[-0.03em]" style={{ color: weak ? E.mag : E.acid }}>
                <Bits from={sample.classes} play={seen} to={sample.bits} /> bits
              </span>
              <span className="mt-1.5 block text-[0.6875rem] uppercase tracking-[0.12em]" style={{ color: weak ? E.mag : E.acid }}>
                {sample.tier}, counted as guesses
              </span>
            </div>
            <div className="text-right">
              <span className="block font-medium text-[1.125rem] leading-none tabular-nums" style={{ color: E.dim }}>
                {sample.classes} bits
              </span>
              <span className="mt-1.5 block text-[0.6875rem] uppercase tracking-[0.12em]" style={{ color: E.dim }}>
                by length and classes
              </span>
            </div>
          </div>
        </div>
      </Frame>
    </Demo>
  );
}

/* ------------------------------------------------------------------ */
/* Random picks: modulo against the rejection Entropy uses              */
/* ------------------------------------------------------------------ */

/*
 * The real source is a number below 2^32 and the bias it leaves is tiny. Here
 * the source is a number from 0 to 7, so the same mistake is big enough to
 * see. The rejection rule is randInt's: values at or above the largest
 * multiple of the pool size are drawn again.
 */
const SOURCE = 8;
const POOL = ["a", "b", "c"];
const LIMIT = Math.floor((SOURCE - 1) / POOL.length) * POOL.length;
const DRAWS = 300;

const draw = () => {
  const b = new Uint8Array(1);
  crypto.getRandomValues(b);
  return b[0] % SOURCE; // 256 is a multiple of 8, so this one is fair.
};

type Tally = { modulo: number[]; entropy: number[]; draws: number; lastModulo: number; lastEntropy: number[] };
const EMPTY: Tally = { modulo: [0, 0, 0], entropy: [0, 0, 0], draws: 0, lastModulo: -1, lastEntropy: [] };

function Strip({ title, rejects, lit }: { title: string; rejects: boolean; lit: number[] }) {
  return (
    <div className="min-w-0">
      <p className="m-0 mb-2 text-[0.6875rem]" style={{ color: E.dim }}>
        {title}
      </p>
      <ol className="m-0 grid list-none grid-cols-8 gap-1 p-0">
        {Array.from({ length: SOURCE }, (_, v) => {
          const out = rejects && v >= LIMIT;
          const on = lit.includes(v);
          return (
            <li
              className="flex h-10 flex-col items-center justify-center rounded-md font-mono leading-none"
              key={v}
              style={{
                background: on ? (out ? E.raised : E.acid) : E.surface,
                color: on && !out ? E.bg : out ? E.dim : E.paper,
                transition: "background-color 90ms linear, color 90ms linear",
              }}
            >
              <span className="text-[0.6875rem] opacity-75">{v}</span>
              <span className="mt-1 text-[0.8125rem]">{out ? "again" : POOL[v % POOL.length]}</span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function Shares({ counts, draws }: { counts: number[]; draws: number }) {
  return (
    <div className="grid grid-cols-3 gap-3">
      {POOL.map((ch, i) => {
        const share = draws ? counts[i] / draws : 0;
        const short = draws > 30 && share < 0.3;
        return (
          <div className="min-w-0" key={ch}>
            <div className="relative h-1.5 overflow-hidden rounded-full" style={{ background: E.surface }}>
              <span className="absolute inset-y-0 left-0 rounded-full" style={{ width: `${Math.min(1, share * 2) * 100}%`, background: short ? E.mag : E.paper }} />
              {/* The fair share, a third, sits at two thirds of the track. */}
              <span className="absolute inset-y-0 w-px" style={{ left: "66.67%", background: E.dim }} />
            </div>
            <p className="m-0 mt-1.5 font-mono text-[0.6875rem] tabular-nums" style={{ color: short ? E.mag : E.dim }}>
              {ch} {draws ? `${Math.round(share * 100)}%` : "–"}
            </p>
          </div>
        );
      })}
    </div>
  );
}

/** Bias made visible: the same draws, mapped by modulo and by Entropy's rejection. */
export function RandomDemo() {
  const { reduced } = useMotionSafe();
  const [tally, setTally] = useState(EMPTY);
  const [running, setRunning] = useState(false);
  const frame = useRef(0);
  const [box, seen] = useSeenOnce<HTMLDivElement>();

  useEffect(() => () => cancelAnimationFrame(frame.current), []);

  const run = () => {
    cancelAnimationFrame(frame.current);
    let t: Tally = { ...EMPTY, modulo: [0, 0, 0], entropy: [0, 0, 0] };
    const one = () => {
      const v = draw();
      const tries = [v];
      let x = v;
      while (x >= LIMIT) {
        x = draw();
        tries.push(x);
      }
      t = {
        modulo: t.modulo.map((c, i) => c + (v % POOL.length === i ? 1 : 0)),
        entropy: t.entropy.map((c, i) => c + (x % POOL.length === i ? 1 : 0)),
        draws: t.draws + 1,
        lastModulo: v,
        lastEntropy: tries,
      };
    };
    if (reduced) {
      for (let i = 0; i < DRAWS; i += 1) one();
      setTally(t);
      return;
    }
    setRunning(true);
    const step = () => {
      for (let i = 0; i < 2 && t.draws < DRAWS; i += 1) one();
      setTally(t);
      if (t.draws < DRAWS) frame.current = requestAnimationFrame(step);
      else setRunning(false);
    };
    frame.current = requestAnimationFrame(step);
  };

  // Draws once by itself the first time it is half in view; under reduced motion it waits for the press.
  const started = useRef(false);
  useEffect(() => {
    if (!seen || reduced || started.current) return;
    started.current = true;
    const t = window.setTimeout(run, 500);
    return () => window.clearTimeout(t);
    // run is rebuilt every render; this only ever fires once.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seen, reduced]);

  const share = (counts: number[]) => Math.round((counts[2] / Math.max(1, tally.draws)) * 100);
  const status =
    tally.draws === 0
      ? "Each draw is a number from 0 to 7, standing in for one below 2³²."
      : running
        ? `${tally.draws} of ${DRAWS} draws`
        : `After ${DRAWS} draws, c came up ${share(tally.modulo)}% of the time by modulo and ${share(tally.entropy)}% with Entropy's rule.`;

  return (
    <Demo
      caption="Draw, then compare the c on both sides. The thin line marks a fair third."
      height={360}
      label="Random characters picked by modulo and by rejection sampling, side by side"
      live={running ? "" : status}
      phoneHeight={468}
    >
      <Frame
        bottom={
          <>
            <BarText>{status}</BarText>
            {running ? null : (
              <Action
                onClick={() => {
                  started.current = true;
                  run();
                }}
                primary={tally.draws === 0}
              >
                {tally.draws === 0 ? `Draw ${DRAWS}` : "Draw again"}
              </Action>
            )}
          </>
        }
      >
        <div className="absolute inset-0 flex flex-col justify-center gap-5 overflow-hidden rounded-xl p-4 sm:p-5" ref={box} style={{ background: E.bg, color: E.paper }}>
          <div className="flex flex-col gap-3">
            <Strip lit={tally.lastModulo >= 0 ? [tally.lastModulo] : []} rejects={false} title="Modulo: the value mod 3 picks the letter" />
            <Shares counts={tally.modulo} draws={tally.draws} />
          </div>
          <div className="flex flex-col gap-3">
            <Strip lit={tally.lastEntropy} rejects title="Entropy: 6 and 7 are thrown away and drawn again" />
            <Shares counts={tally.entropy} draws={tally.draws} />
          </div>
        </div>
      </Frame>
    </Demo>
  );
}
