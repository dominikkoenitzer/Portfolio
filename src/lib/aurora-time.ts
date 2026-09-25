/**
 * The aurora's colours through the day, as keyframes on the visitor's own
 * clock. Daytime is the site's palette as it always was; the evening warms
 * towards the festival dusk, the night cools and deepens, and the morning
 * eases back into the day. Between two keyframes the colours blend linearly,
 * so the sky never switches, it drifts.
 *
 * Every other keyframe sits only half a step from the day palette, so the
 * change reads as the light moving, never as a new colour scheme.
 *
 * Light stays dusty on purpose (see the token table in index.css): every
 * keyframe keeps the low saturation of the day palette. Dark lets her green
 * come up at night, because on the night page it is light, not ink.
 */

export type Stops = [string, string, string];

interface Keyframe {
  hour: number;
  light: Stops;
  dark: Stops;
}

/** The palette of the day, the one the site has always shown. */
const DAY_LIGHT: Stops = ["#7b5f9e", "#86ad78", "#c68c99"];
const DAY_DARK: Stops = ["#6a3cc4", "#7fae36", "#c4608a"];

const NIGHT_LIGHT: Stops = ["#705796", "#7ca47f", "#ba8b9c"];
const NIGHT_DARK: Stops = ["#6038bc", "#84bb39", "#bb5d8b"];

const EVENING_LIGHT: Stops = ["#775a98", "#8faa78", "#ca8d96"];
const EVENING_DARK: Stops = ["#6c3cbe", "#84ab38", "#ca6384"];

const MORNING_LIGHT: Stops = ["#8068a3", "#8ab07d", "#c893a0"];
const MORNING_DARK: Stops = ["#6b41c2", "#80b040", "#c5658f"];

/** Hours on a 24h clock, in order, wrapping from the last back to the first. */
const KEYFRAMES: Keyframe[] = [
  { hour: 0, light: NIGHT_LIGHT, dark: NIGHT_DARK },
  { hour: 5, light: NIGHT_LIGHT, dark: NIGHT_DARK },
  { hour: 7, light: MORNING_LIGHT, dark: MORNING_DARK },
  { hour: 10, light: DAY_LIGHT, dark: DAY_DARK },
  { hour: 17, light: DAY_LIGHT, dark: DAY_DARK },
  { hour: 19.5, light: EVENING_LIGHT, dark: EVENING_DARK },
  { hour: 22, light: NIGHT_LIGHT, dark: NIGHT_DARK },
  { hour: 24, light: NIGHT_LIGHT, dark: NIGHT_DARK },
];

const channels = (hex: string) => [1, 3, 5].map((i) => Number.parseInt(hex.slice(i, i + 2), 16));

const toHex = (value: number) => Math.round(value).toString(16).padStart(2, "0");

function mix(from: string, to: string, t: number): string {
  const a = channels(from);
  const b = channels(to);
  return `#${a.map((value, i) => toHex(value + (b[i] - value) * t)).join("")}`;
}

/**
 * The three stops for a time of day. `hour` is fractional (19.75 is 19:45)
 * and is taken modulo 24, so any clock reading is valid.
 */
export function auroraStops(hour: number, night: boolean): Stops {
  const h = ((hour % 24) + 24) % 24;
  const next = KEYFRAMES.findIndex((frame) => frame.hour > h);
  const b = KEYFRAMES[next === -1 ? KEYFRAMES.length - 1 : next];
  const a = KEYFRAMES[Math.max(0, (next === -1 ? KEYFRAMES.length : next) - 1)];
  const span = b.hour - a.hour;
  const t = span > 0 ? (h - a.hour) / span : 0;
  const from = night ? a.dark : a.light;
  const to = night ? b.dark : b.light;
  return [mix(from[0], to[0], t), mix(from[1], to[1], t), mix(from[2], to[2], t)];
}

/** The local time as a fractional hour. */
export function localHour(now: Date = new Date()): number {
  return now.getHours() + now.getMinutes() / 60;
}
