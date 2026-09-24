import { useTheme } from "@/hooks/use-theme";
import Aurora from "./Aurora";

/**
 * The site's background: one soft ribbon across the top of the viewport,
 * drifting slowly, in the three colours of the illustration: violet into sage
 * into blush. The stops are the tokens a step richer than their surface
 * versions and are kept at their true colour (`flat`), because the point is
 * to actually see them; the opacity is what keeps the ribbon a sky and not a
 * banner. The cream shows through everywhere the ribbon isn't.
 */
const STOPS: [string, string, string] = ["#7b5f9e", "#86ad78", "#c68c99"];

/**
 * The same ribbon at night: her hair violet, the acid green of her eyes and
 * the pink of her face, as light over the dark page instead of colour on
 * paper. Deeper than the text tokens, so the ribbon glows without turning
 * into a neon sign, and a little more present, because on a dark page an
 * opacity that reads as a sky on cream reads as nothing.
 */
const NIGHT_STOPS: [string, string, string] = ["#6a3cc4", "#7fae36", "#c4608a"];

function pixelDensity(): number {
  if (typeof window === "undefined") {
    return 1;
  }
  return Math.min(window.devicePixelRatio || 1, 1.5);
}

export default function AuroraBackground() {
  const night = useTheme() === "dark";
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 select-none"
      style={{ opacity: night ? 0.8 : 0.65 }}
    >
      <Aurora
        amplitude={1}
        blend={0.6}
        colorStops={night ? NIGHT_STOPS : STOPS}
        dpr={pixelDensity()}
        flat
        speed={0.45}
      />
    </div>
  );
}
