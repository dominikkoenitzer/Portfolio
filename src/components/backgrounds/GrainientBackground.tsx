import { useTheme } from "@/components/theme-provider";
import { getVeilPreset } from "@/config/themes";
import Grainient from "./Grainient";

/**
 * Full-viewport grainy-gradient background. A sibling variant to the water
 * caustic veil: it renders the *same* per-theme colour stops, and borrows the
 * preset's `intensity` (as opacity) and `blendMode` so it sits as a wash over
 * the page base — keeping text readable on the light palettes (bloom/forest)
 * instead of painting an opaque field over them.
 */
export default function GrainientBackground() {
  const { theme } = useTheme();
  const preset = getVeilPreset(theme);
  const [color1, color2, color3] = preset.colorStops;

  // The veil's `intensity` was tuned for a localized band; this field fills the
  // whole viewport, so on the light palettes (multiply) we dial it down further
  // to keep dark text readable. Dark palettes (screen) lighten the page and stay
  // at full preset intensity.
  const opacity =
    preset.blendMode === "screen" ? preset.intensity : preset.intensity * 0.55;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 select-none"
      style={{
        opacity,
        mixBlendMode: preset.blendMode,
      }}
    >
      <Grainient
        color1={color1}
        color2={color2}
        color3={color3}
        contrast={1.2}
        grainAmount={0.13}
        saturation={preset.saturation}
        timeSpeed={0.2}
        zoom={1.05}
      />
    </div>
  );
}
