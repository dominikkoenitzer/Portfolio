/**
 * Tiny haptic-feedback helper. Safe on every platform — no-ops where the
 * Vibration API is unavailable (iOS Safari, some desktops).
 *
 * Intensities map to short, medium, and long vibration patterns that feel
 * appropriate for taps, transitions, and emphasized confirmations.
 */

type HapticIntensity = "light" | "medium" | "heavy" | "success" | "warning";

const PATTERNS: Record<HapticIntensity, number | number[]> = {
  light: 10,
  medium: 20,
  heavy: 40,
  success: [10, 40, 10],
  warning: [30, 60, 30],
};

export const haptic = (intensity: HapticIntensity = "light") => {
  if (typeof navigator === "undefined") return;
  if (typeof navigator.vibrate !== "function") return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  try {
    navigator.vibrate(PATTERNS[intensity]);
  } catch {
    /* ignore — some browsers throw on cross-origin frames */
  }
};

export const useHaptic = () => haptic;
