import { useEffect, useMemo, useState } from "react";
import { useTheme } from "@/hooks/use-theme";
import { auroraStops, localHour } from "@/lib/aurora-time";
import Aurora from "./Aurora";

/**
 * The site's background: one soft ribbon across the top of the viewport,
 * drifting slowly, in the three colours of the illustration: violet into sage
 * into blush by day, and at night her hair violet, the green of her eyes and
 * the pink of her face as light over the dark page. The stops are kept at
 * their true colour (`flat`), because the point is to actually see them; the
 * opacity is what keeps the ribbon a sky and not a banner.
 *
 * The colours follow the visitor's own clock (`lib/aurora-time.ts`): the day
 * palette through the day, warmer towards the evening, cooler and deeper at
 * night. The clock is re-read every five minutes, which is far finer than the
 * colours can be told apart, and costs three uniform writes.
 */

/** How often the time of day is re-read. */
const CLOCK_MS = 5 * 60 * 1000;

function pixelDensity(): number {
  if (typeof window === "undefined") {
    return 1;
  }
  return Math.min(window.devicePixelRatio || 1, 1.5);
}

/**
 * Development only: `?hour=19.5` pins the clock, `?hour=cycle` runs the whole
 * day in 24 seconds with the simulated time in a corner. `import.meta.env.DEV`
 * is false in a production build, so none of this ships.
 */
function previewHour(): number | "cycle" | null {
  if (!import.meta.env.DEV || typeof window === "undefined") return null;
  const value = new URLSearchParams(window.location.search).get("hour");
  if (value === "cycle") return "cycle";
  const hour = value === null ? Number.NaN : Number(value);
  return Number.isFinite(hour) ? hour : null;
}

export default function AuroraBackground() {
  const night = useTheme() === "dark";
  const [preview] = useState(previewHour);
  const [hour, setHour] = useState(() =>
    typeof preview === "number" ? preview : preview === "cycle" ? 0 : localHour(),
  );

  useEffect(() => {
    if (typeof preview === "number") return;
    if (preview === "cycle") {
      const id = window.setInterval(
        () => setHour((current) => (current + 0.1) % 24),
        100,
      );
      return () => window.clearInterval(id);
    }
    const id = window.setInterval(() => setHour(localHour()), CLOCK_MS);
    return () => window.clearInterval(id);
  }, [preview]);

  const stops = useMemo(() => auroraStops(hour, night), [hour, night]);

  return (
    <>
    {preview !== null ? (
      <span className="pointer-events-none fixed bottom-4 left-4 z-50 rounded-full bg-card px-3 py-1 font-medium text-foreground text-sm tabular-nums shadow-sm">
        {`${String(Math.floor(hour)).padStart(2, "0")}:${String(Math.floor((hour % 1) * 60)).padStart(2, "0")}`}
      </span>
    ) : null}
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 select-none"
      style={{ opacity: night ? 0.8 : 0.65 }}
    >
      <Aurora
        amplitude={1}
        blend={0.6}
        colorStops={stops}
        dpr={pixelDensity()}
        flat
        speed={0.45}
      />
    </div>
    </>
  );
}
