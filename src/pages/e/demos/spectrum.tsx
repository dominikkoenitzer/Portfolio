import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { BarText, Demo, Frame, Pills } from "../kit";
import { useMotionSafe } from "../motion";

/*
 * Spectrum, told through two of its tools. The interface uses Spectrum's own
 * tokens (src/app/globals.css: greige paper, near-black ink, no colour but
 * the colour being worked on); the vision matrices are the ones Spectrum
 * runs (src/lib/colorBlindness.ts), from Machado, Oliveira and Fernandes
 * (2009), on linear sRGB; contrast flattens translucent colours first, as
 * src/lib/contrastUtils.ts does.
 */

const UI = {
  paper: "#e8e6e2",
  surface: "#efedea",
  ink: "#1b1b1d",
  muted: "#605e59",
  line: "rgb(27 27 29 / 0.1)",
  positive: "#146127",
  negative: "#a01818",
};

const hex2 = (n: number) => n.toString(16).padStart(2, "0");
const toHex = (r: number, g: number, b: number) => `#${hex2(r)}${hex2(g)}${hex2(b)}`;

/* ------------------------------------------------------------------ */
/* Vision: the eight simulations, as Spectrum computes them            */
/* ------------------------------------------------------------------ */

type Vision =
  | "normal"
  | "protanopia"
  | "protanomaly"
  | "deuteranopia"
  | "deuteranomaly"
  | "tritanopia"
  | "tritanomaly"
  | "achromatopsia"
  | "achromatomaly";

const MATRICES: Partial<Record<Vision, number[]>> = {
  protanopia: [0.152286, 1.052583, -0.204868, 0.114503, 0.786281, 0.099216, -0.003882, -0.048116, 1.051998],
  protanomaly: [0.38545, 0.769005, -0.154455, 0.100526, 0.829802, 0.069673, -0.007442, -0.02219, 1.029632],
  deuteranopia: [0.367322, 0.860646, -0.227968, 0.280085, 0.672501, 0.047413, -0.01182, 0.04294, 0.968881],
  deuteranomaly: [0.498864, 0.674741, -0.173604, 0.205199, 0.754872, 0.039929, -0.011131, 0.030969, 0.980162],
  tritanopia: [1.255528, -0.076749, -0.178779, -0.078411, 0.930809, 0.147602, 0.004733, 0.691367, 0.3039],
  tritanomaly: [1.104996, -0.046633, -0.058363, -0.032137, 0.971635, 0.060503, 0.001336, 0.317922, 0.680742],
};

const lin = (c: number) => {
  const v = c / 255;
  return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
};
const enc = (l: number) => {
  const c = Math.min(1, Math.max(0, l));
  return Math.round((c <= 0.0031308 ? c * 12.92 : 1.055 * c ** (1 / 2.4) - 0.055) * 255);
};

function simulate(hex: string, type: Vision): string {
  if (type === "normal") return hex;
  const r = lin(Number.parseInt(hex.slice(1, 3), 16));
  const g = lin(Number.parseInt(hex.slice(3, 5), 16));
  const b = lin(Number.parseInt(hex.slice(5, 7), 16));
  if (type === "achromatopsia" || type === "achromatomaly") {
    const y = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    const k = type === "achromatopsia" ? 1 : 0.6;
    return toHex(enc(r + (y - r) * k), enc(g + (y - g) * k), enc(b + (y - b) * k));
  }
  const m = MATRICES[type] as number[];
  return toHex(enc(m[0] * r + m[1] * g + m[2] * b), enc(m[3] * r + m[4] * g + m[5] * b), enc(m[6] * r + m[7] * g + m[8] * b));
}

const STATUS = [
  { label: "Passed", color: "#2f9e5b", value: 0.82 },
  { label: "Failed", color: "#d6453d", value: 0.46 },
  { label: "Flaky", color: "#e3a12f", value: 0.28 },
  { label: "Skipped", color: "#3f7fd6", value: 0.6 },
];

type Cone = "none" | "red" | "green" | "blue" | "all";

/** Which simulation a cone and a strength select, and what it is called. */
const KINDS: Record<Exclude<Cone, "none">, { missing: Vision; weak: Vision; what: string }> = {
  red: { missing: "protanopia", weak: "protanomaly", what: "red cones" },
  green: { missing: "deuteranopia", weak: "deuteranomaly", what: "green cones" },
  blue: { missing: "tritanopia", weak: "tritanomaly", what: "blue cones" },
  all: { missing: "achromatopsia", weak: "achromatomaly", what: "colour cones" },
};

const CONES: ReadonlyArray<{ value: Cone; label: string }> = [
  { value: "none", label: "Typical" },
  { value: "red", label: "Red" },
  { value: "green", label: "Green" },
  { value: "blue", label: "Blue" },
  { value: "all", label: "All" },
];

const cap = (s: string) => s[0].toUpperCase() + s.slice(1);

/** A colour in OKLab, where Spectrum measures how far apart two colours look. */
function oklab(hex: string) {
  const r = lin(Number.parseInt(hex.slice(1, 3), 16));
  const g = lin(Number.parseInt(hex.slice(3, 5), 16));
  const b = lin(Number.parseInt(hex.slice(5, 7), 16));
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  return [0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s, 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s, 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s];
}

/** Spectrum's palette check: closer than 0.05 in OKLab, two and a half just-noticeable steps, is a look-alike. */
const LOOK_ALIKE = 0.05;

/** The swatches that collide, joined into groups: [[0, 1]] or [[1, 2, 3]]. */
function lookAlikes(colors: string[]): number[][] {
  const group = colors.map((_, i) => i);
  const root = (i: number): number => (group[i] === i ? i : root(group[i]));
  for (let i = 0; i < colors.length; i += 1) {
    for (let j = i + 1; j < colors.length; j += 1) {
      const [x, y] = [oklab(colors[i]), oklab(colors[j])];
      if (Math.hypot(x[0] - y[0], x[1] - y[1], x[2] - y[2]) < LOOK_ALIKE) group[root(j)] = root(i);
    }
  }
  const byRoot = new Map<number, number[]>();
  colors.forEach((_, i) => byRoot.set(root(i), [...(byRoot.get(root(i)) ?? []), i]));
  return [...byRoot.values()].filter((g) => g.length > 1);
}

const and = (words: string[]) => (words.length < 3 ? words.join(" and ") : `${words.slice(0, -1).join(", ")} and ${words[words.length - 1]}`);

/** A status chart that leans on hue, seen through each of the eight simulations. */
export function VisionDemo() {
  const [cone, setCone] = useState<Cone>("none");
  const [weak, setWeak] = useState(false);
  const { spring } = useMotionSafe();
  const kind = cone === "none" ? null : KINDS[cone];
  const type: Vision = kind ? (weak ? kind.weak : kind.missing) : "normal";
  const colors = useMemo(() => STATUS.map((s) => simulate(s.color, type)), [type]);
  const groups = useMemo(() => lookAlikes(colors), [colors]);
  const colliding = new Set(groups.flat());
  const verdict = groups.length
    ? `${groups.map((g) => and(g.map((i) => STATUS[i].label))).join("; ")} look alike.`
    : "All four stay apart.";
  const seenAs = kind ? `${cap(type)}, ${weak ? "weak" : "no"} ${kind.what}` : "Typical colour vision";
  return (
    <Demo
      caption="Take away the green cones and find Passed and Failed. The chart only ever told them apart by hue."
      height={360}
      label="A status chart simulated for eight kinds of colour blindness"
      live={`${seenAs}. ${verdict}`}
      phoneHeight={470}
    >
      <Frame
        bottom={
          <>
            <BarText>{verdict}</BarText>
            {kind ? (
              // On a phone the strength gets a row of its own, below the verdict.
              <div className="w-full sm:w-auto">
                <Pills
                  label="Strength"
                  onChange={(v) => setWeak(v === "weak")}
                  options={[
                    { value: "missing", label: "Missing" },
                    { value: "weak", label: "Weak" },
                  ]}
                  value={weak ? "weak" : "missing"}
                />
              </div>
            ) : null}
          </>
        }
        top={
          // Five pills fit one row on a 390px phone only a little closer together.
          <div className="max-sm:[&_[role=radio]]:px-3 max-sm:[&_[role=radiogroup]]:gap-1">
            <Pills<Cone> label="Cone" onChange={setCone} options={CONES} value={cone} />
          </div>
        }
      >
        <div className="absolute inset-0 flex flex-col justify-center gap-3 rounded-xl px-5 py-4" style={{ background: UI.paper, color: UI.ink }}>
          <p className="m-0 mb-1 text-[0.6875rem]" style={{ color: UI.muted }}>
            Test results by status, seen with {seenAs.toLowerCase()}
          </p>
          {STATUS.map((s, i) => (
            <div className="grid grid-cols-[4.75rem_minmax(0,1fr)] items-center gap-3" key={s.label}>
              <span className="flex items-center gap-1.5 text-[0.75rem]" style={{ fontWeight: colliding.has(i) ? 600 : 400 }}>
                <motion.span animate={{ backgroundColor: colors[i] }} className="h-2.5 w-2.5 shrink-0 rounded-sm" transition={spring} />
                {s.label}
              </span>
              <span className="h-4 overflow-hidden rounded-[4px]" style={{ background: UI.line }}>
                <motion.span animate={{ backgroundColor: colors[i] }} className="block h-full rounded-[4px]" style={{ width: `${s.value * 100}%` }} transition={spring} />
              </span>
            </div>
          ))}
        </div>
      </Frame>
    </Demo>
  );
}

/* ------------------------------------------------------------------ */
/* Contrast: the pair a reader actually sees, then the ratio           */
/* ------------------------------------------------------------------ */

type Rgba = { r: number; g: number; b: number; a: number };
const flatten = (top: Rgba, bottom: Rgba): Rgba => ({
  r: top.r * top.a + bottom.r * (1 - top.a),
  g: top.g * top.a + bottom.g * (1 - top.a),
  b: top.b * top.a + bottom.b * (1 - top.a),
  a: 1,
});
const luminance = (c: Rgba) => 0.2126 * lin(c.r) + 0.7152 * lin(c.g) + 0.0722 * lin(c.b);
const ratioOf = (a: Rgba, b: Rgba) => {
  const [x, y] = [luminance(a), luminance(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
};

const PAIRS = {
  glass: { label: "White at 50%", fg: { r: 255, g: 255, b: 255, a: 0.5 }, bg: { r: 37, g: 150, b: 190, a: 1 } },
  veil: { label: "Tint at 40%", fg: { r: 27, g: 27, b: 29, a: 1 }, bg: { r: 37, g: 150, b: 190, a: 0.4 } },
  ink: { label: "Opaque", fg: { r: 27, g: 27, b: 29, a: 1 }, bg: { r: 232, g: 230, b: 226, a: 1 } },
} as const;
type PairKey = keyof typeof PAIRS;

const css = (c: Rgba) => `rgb(${Math.round(c.r)} ${Math.round(c.g)} ${Math.round(c.b)})`;
const GRADES = [
  { label: "AA", need: 4.5 },
  { label: "AA large", need: 3 },
  { label: "AAA", need: 7 },
];

/** A contrast checker that measures what is on screen, translucency included. */
export function ContrastDemo() {
  const [pick, setPick] = useState<PairKey>("glass");
  const pair = PAIRS[pick];
  // A translucent background sits on white; the foreground is painted over it.
  const bg = flatten(pair.bg, { r: 255, g: 255, b: 255, a: 1 });
  const fg = flatten(pair.fg, bg);
  const ratio = ratioOf(fg, bg);
  // What a checker that drops the alpha channel would report for the same pair.
  const naive = ratioOf(pair.fg, pair.bg);
  const translucent = pair.fg.a < 1 || pair.bg.a < 1;
  return (
    <Demo
      caption="Compare white at 50% with the 40% tint. A checker that drops the alpha gets both wrong, in opposite directions."
      height={280}
      label="Contrast ratios for pairs of colours, with translucent colours flattened first"
      live={`${pair.label}: ${ratio.toFixed(2)} to 1.`}
      phoneHeight={380}
    >
      <Frame
        top={<Pills<PairKey> label="Pair" onChange={setPick} options={(Object.keys(PAIRS) as PairKey[]).map((k) => ({ value: k, label: PAIRS[k].label }))} value={pick} />}
      >
        <div className="absolute inset-0 grid grid-cols-1 grid-rows-[minmax(0,1fr)_auto] gap-3 rounded-xl p-3 sm:grid-cols-[minmax(0,1fr)_12.5rem] sm:grid-rows-1" style={{ background: UI.paper, color: UI.ink }}>
          <div className="flex min-h-0 items-center justify-center rounded-lg px-4" style={{ background: css(bg) }}>
            <p className="m-0 text-center text-[1.0625rem] leading-snug" style={{ color: css(fg) }}>
              Text on this background
            </p>
          </div>
          <div className="flex flex-col justify-center gap-2 rounded-lg px-4 py-3" style={{ background: UI.surface }}>
            <span className="font-semibold text-[1.75rem] leading-none tabular-nums">{ratio.toFixed(2)}:1</span>
            <span className="text-[0.6875rem] leading-snug" style={{ color: UI.muted }}>
              {translucent ? `${naive.toFixed(2)}:1 if the alpha were dropped` : "Both colours opaque, nothing to flatten"}
            </span>
            <span className="flex flex-wrap gap-1.5">
              {GRADES.map((g) => {
                const pass = ratio >= g.need;
                return (
                  <span
                    className="rounded px-1.5 py-0.5 font-medium text-[0.6875rem]"
                    key={g.label}
                    style={{ background: pass ? "rgb(20 97 39 / 0.1)" : "rgb(160 24 24 / 0.08)", color: pass ? UI.positive : UI.negative }}
                  >
                    {g.label} {pass ? "pass" : "fail"}
                  </span>
                );
              })}
            </span>
          </div>
        </div>
      </Frame>
    </Demo>
  );
}
