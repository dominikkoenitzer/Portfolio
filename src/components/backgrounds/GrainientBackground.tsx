import Grainient from "./Grainient";

/**
 * Full-viewport grainy-gradient background in the bloom palette: deep violet,
 * sage and blush, the site's only colour stops now that the theme switcher is
 * gone. Rendered under `multiply` at a reduced opacity so it sits as a wash
 * over the light page base and dark text stays readable.
 */
const COLOR_STOPS = ["#453161", "#B6D088", "#FFE8EA"] as const;
// The veil intensity was tuned for a localized band; this field fills the
// whole viewport, so it is dialed down further to keep dark text readable.
const OPACITY = 0.5 * 0.55;
const SATURATION = 1.05;

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
