import {
  animate,
  motion,
  useMotionValue,
  useScroll,
  useTransform,
} from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { useTheme } from "@/hooks/use-theme";
import { auroraStops, localHour, warmStops } from "@/lib/aurora-time";
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
 *
 * Two quiet responses to the visitor: the sky dims while they are in another
 * tab and brightens slowly when they come back, and while they linger without
 * touching anything it leans a little warmer, as if the evening were settling.
 */

/** How often the time of day is re-read. */
const CLOCK_MS = 5 * 60 * 1000;

/** How long without input before the sky starts to warm. */
const LINGER_MS = 20_000;

/** How slowly the sky gathers on the first page of a visit. */
const ARRIVE_S = 2.2;
const ARRIVED_KEY = "aurora-arrived";

/** The ribbon's drift, and the slower drift of the late night. */
const SPEED = 0.38;
const LATE_SPEED = 0.26;

/** How far the sky dims while the visitor is away, and how slowly it returns. */
const AWAY_LEVEL = 0.5;
const LEAVE_S = 1.5;
const RETURN_S = 2.8;

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

  // Lingering warms the sky: after twenty seconds without input the warmth
  // climbs to 1 over about five seconds, and any input lets it settle back.
  const [warmth, setWarmth] = useState(0);
  useEffect(() => {
    let target = 0;
    let idleTimer = window.setTimeout(() => {
      target = 1;
    }, LINGER_MS);
    const wake = () => {
      target = 0;
      window.clearTimeout(idleTimer);
      idleTimer = window.setTimeout(() => {
        target = 1;
      }, LINGER_MS);
    };
    const events = ["pointermove", "pointerdown", "keydown", "wheel", "touchstart", "scroll"];
    for (const name of events) {
      window.addEventListener(name, wake, { passive: true });
    }
    const step = window.setInterval(() => {
      setWarmth((current) => {
        const next = current + Math.sign(target - current) * 0.03;
        return Math.abs(target - current) < 0.03 ? target : next;
      });
    }, 150);
    return () => {
      window.clearTimeout(idleTimer);
      window.clearInterval(step);
      for (const name of events) {
        window.removeEventListener(name, wake);
      }
    };
  }, []);

  const stops = useMemo(
    () => warmStops(auroraStops(hour, night), warmth, night),
    [hour, night, warmth],
  );

  // The evening arrives: on the first page of a visit the sky gathers from
  // nothing instead of already being there. Once per session, and never
  // under reduced motion.
  const [arriving] = useState(() => {
    if (typeof window === "undefined") return false;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
    try {
      return !sessionStorage.getItem(ARRIVED_KEY);
    } catch {
      return false;
    }
  });
  const presence = useMotionValue(arriving ? 0 : 1);
  useEffect(() => {
    if (!arriving) return;
    // Marked here, not in the initializer: StrictMode runs that twice, and the
    // second run would read the mark the first one left.
    try {
      sessionStorage.setItem(ARRIVED_KEY, "1");
    } catch {
      // Storage refused: the sky simply gathers again on the next page.
    }
    const controls = animate(presence, 1, { duration: ARRIVE_S, ease: "easeInOut" });
    return () => controls.stop();
  }, [arriving, presence]);

  // The sky waits: it dims while the visitor is elsewhere and brightens slowly
  // when they come back, a small welcome home. Another tab hides the page, so
  // the dimming is instant; another window or app leaves it on screen (a
  // second monitor), so it dims gently there. Any switch counts, however
  // short.
  useEffect(() => {
    const leave = (hidden: boolean) => {
      if (hidden) presence.set(AWAY_LEVEL);
      else animate(presence, AWAY_LEVEL, { duration: LEAVE_S, ease: "easeInOut" });
    };
    const come = () => {
      animate(presence, 1, { duration: RETURN_S, ease: "easeOut" });
    };
    const onVisibility = () => (document.hidden ? leave(true) : come());
    const onBlur = () => leave(document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("blur", onBlur);
    window.addEventListener("focus", come);
    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("blur", onBlur);
      window.removeEventListener("focus", come);
    };
  }, [presence]);

  // The sky stays behind: over the first two screens of scrolling the ribbon
  // eases down to 60% of itself, like evening light seen from a car driving
  // away, and it is all there again back at the top.
  const base = night ? 0.8 : 0.65;
  const { scrollY } = useScroll();
  const opacity = useTransform([scrollY, presence], ([y, here]) => {
    const screens =
      typeof window === "undefined" ? 0 : (y as number) / (window.innerHeight * 2);
    return base * (1 - 0.4 * Math.min(Math.max(screens, 0), 1)) * (here as number);
  });

  return (
    <>
    {preview !== null ? (
      <span className="pointer-events-none fixed bottom-4 left-4 z-50 rounded-full bg-card px-3 py-1 font-medium text-foreground text-sm tabular-nums shadow-sm">
        {`${String(Math.floor(hour)).padStart(2, "0")}:${String(Math.floor((hour % 1) * 60)).padStart(2, "0")}`}
      </span>
    ) : null}
    <motion.div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 select-none"
      style={{ opacity }}
    >
      <Aurora
        amplitude={1}
        blend={0.6}
        colorStops={stops}
        dpr={pixelDensity()}
        flat
        // The late night is quieter: from 23:00 to 05:00 the sky drifts
        // slower, as if the world had gone to sleep.
        speed={hour >= 23 || hour < 5 ? LATE_SPEED : SPEED}
      />
    </motion.div>
    </>
  );
}
