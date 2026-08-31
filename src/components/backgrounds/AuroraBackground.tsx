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

function pixelDensity(): number {
  if (typeof window === "undefined") {
    return 1;
  }
  return Math.min(window.devicePixelRatio || 1, 1.5);
}

export default function AuroraBackground() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 select-none"
      style={{ opacity: 0.65 }}
    >
      <Aurora
        amplitude={1}
        blend={0.6}
        colorStops={STOPS}
        dpr={pixelDensity()}
        flat
        speed={0.45}
      />
    </div>
  );
}
