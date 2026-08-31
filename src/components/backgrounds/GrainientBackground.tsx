import Grainient from "./Grainient";

/**
 * Full-viewport grainy-gradient background in the bloom palette. The three
 * stops are the illustration's three colours at their dusty strength: the
 * violet backdrop (#5a4276), the sage of her eyes lifted to a wash (#a9c39a)
 * and the lilac-pink of the tiled floor (#d2bfd6), so the wash is the picture
 * itself moving behind the page. Rendered under `multiply` at a reduced
 * opacity so it sits as a haze over the cream base and dark text stays
 * readable.
 */
const COLOR_STOPS = ["#5a4276", "#a9c39a", "#d2bfd6"] as const;
// The veil intensity was tuned for a localized band; this field fills the
// whole viewport, so it is dialed down to keep dark text readable: the
// darkest corner lands around #cbbfc4 under the ink (about 7:1) and the
// primary violet still reads at 4:1 on it.
const OPACITY = 0.28;
// Neutral: the stops are muted on purpose, and pushing them back up would
// undo that. The multiply pass greys them slightly, which is the haze.
const SATURATION = 1.0;

export default function GrainientBackground() {
  const [color1, color2, color3] = COLOR_STOPS;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 select-none"
      style={{
        opacity: OPACITY,
        mixBlendMode: "multiply",
      }}
    >
      <Grainient
        color1={color1}
        color2={color2}
        color3={color3}
        contrast={1.2}
        grainAmount={0.13}
        saturation={SATURATION}
        timeSpeed={0.2}
        zoom={1.05}
      />
    </div>
  );
}
