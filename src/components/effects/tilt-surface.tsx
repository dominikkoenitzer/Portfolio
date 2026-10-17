import {
  motion,
  type MotionValue,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import {
  createContext,
  type FocusEvent,
  type PointerEvent,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

/**
 * A surface that answers the pointer the way a focused tile on a television
 * home screen does: it rises a little, grows a little, leans towards the
 * pointer and casts a soft shadow, and a faint sheen follows the tilt.
 * Keyboard focus gets the same rise and shadow, upright. Touch and reduced
 * motion get a still surface.
 *
 * Everything moves on transform and opacity: the shadow is painted once on
 * its own layer and only fades, the sheen is a gradient that is translated,
 * never repainted.
 */

/** Springs for the lean and the rise. Soft enough to read as weight. */
const LEAN = { stiffness: 180, damping: 22, mass: 0.6 } as const;
const RISE = { stiffness: 260, damping: 26, mass: 0.8 } as const;

type Pointer = { x: MotionValue<number>; y: MotionValue<number> };

/** Pointer position over the surface, -0.5 to 0.5 on each axis, sprung. */
const PointerContext = createContext<Pointer | null>(null);

/** Fine pointer with hover: the only case where the surface leans. */
function useFinePointer() {
  const [fine, setFine] = useState(false);
  useEffect(() => {
    const query = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setFine(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  return fine;
}

export function TiltSurface({
  children,
  className,
  tilt = 5,
  lift = 6,
  grow = 0.02,
  radius = "rounded-3xl",
  sheen = true,
  onActivate,
}: {
  children: ReactNode;
  className?: string;
  /** Largest lean in degrees, at the surface's edge. Wide cards want less. */
  tilt?: number;
  /** Rise in px when active. */
  lift?: number;
  /** Extra scale when active (0.02 is 102%). */
  grow?: number;
  /** Corner class shared by the shadow and sheen layers. */
  radius?: string;
  sheen?: boolean;
  /**
   * Called on click, after the surface has been put back at rest, so a
   * shared-layout flight that starts from it measures an upright box.
   */
  onActivate?: () => void;
}) {
  const reduceMotion = useReducedMotion();
  const fine = useFinePointer();
  const lively = fine && !reduceMotion;

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, LEAN);
  const y = useSpring(rawY, LEAN);
  const rawActive = useMotionValue(0);
  const active = useSpring(rawActive, RISE);
  const rawPress = useMotionValue(0);
  const press = useSpring(rawPress, { stiffness: 500, damping: 30 });

  const rotateX = useTransform(y, (v) => -v * tilt * 2);
  const rotateY = useTransform(x, (v) => v * tilt * 2);
  const translateY = useTransform(active, (v) => -v * lift);
  const scale = useTransform(
    [active, press],
    ([a, p]: number[]) => 1 + a * grow - p * 0.02,
  );
  const sheenX = useTransform(x, (v) => `${v * 60}%`);
  const sheenY = useTransform(y, (v) => `${v * 60}%`);
  const sheenOpacity = useTransform(active, (v) => v * 0.55);
  const sheenTransform = useMotionTemplate`translate3d(${sheenX}, ${sheenY}, 0)`;

  const rest = () => {
    rawX.set(0);
    rawY.set(0);
    rawActive.set(0);
  };

  if (reduceMotion) {
    return <div className={`relative ${radius} ${className ?? ""}`}>{children}</div>;
  }

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!lively || event.pointerType !== "mouse") return;
    const box = event.currentTarget.getBoundingClientRect();
    rawX.set((event.clientX - box.left) / box.width - 0.5);
    rawY.set((event.clientY - box.top) / box.height - 0.5);
    rawActive.set(1);
  };
  const onFocus = (event: FocusEvent<HTMLDivElement>) => {
    if (event.target.matches(":focus-visible")) rawActive.set(1);
  };
  const onBlur = (event: FocusEvent<HTMLDivElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) rest();
  };

  return (
    <motion.div
      className={`group/tilt relative ${radius} ${className ?? ""}`}
      onBlur={onBlur}
      onClickCapture={() => {
        // Put the surface back at once, so whatever opens from it measures an
        // upright, unscaled box, then hand over.
        for (const value of [rawX, rawY, rawActive, rawPress]) value.set(0);
        for (const value of [x, y, active, press]) value.jump(0);
        onActivate?.();
      }}
      onFocus={onFocus}
      onPointerCancel={() => rawPress.set(0)}
      onPointerDown={() => rawPress.set(1)}
      onPointerLeave={() => {
        rawPress.set(0);
        rest();
      }}
      onPointerMove={onPointerMove}
      onPointerUp={() => rawPress.set(0)}
      style={{
        rotateX: lively ? rotateX : 0,
        rotateY: lively ? rotateY : 0,
        y: translateY,
        scale,
        transformPerspective: 1100,
      }}
    >
      {/* The shadow is drawn once and only fades in. */}
      <motion.span
        aria-hidden
        className={`pointer-events-none absolute inset-0 -z-10 ${radius} shadow-[0_24px_48px_-20px_rgb(28_16_40/0.35),0_8px_18px_-10px_rgb(28_16_40/0.18)] dark:shadow-[0_24px_48px_-18px_rgb(0_0_0/0.7),0_8px_18px_-10px_rgb(0_0_0/0.45)]`}
        style={{ opacity: active }}
      />
      <PointerContext.Provider value={lively ? { x, y } : null}>
        {children}
      </PointerContext.Provider>
      {sheen && lively ? (
        <span
          aria-hidden
          className={`pointer-events-none absolute inset-0 overflow-hidden ${radius}`}
        >
          <motion.span
            className="absolute -inset-1/2 bg-[radial-gradient(circle_at_center,rgb(255_255_255/0.16),transparent_45%)]"
            style={{ opacity: sheenOpacity, transform: sheenTransform }}
          />
        </span>
      ) : null}
    </motion.div>
  );
}

/**
 * Moves its content a few pixels against the lean, so a picture inside a
 * tilted surface seems to sit a little behind its frame. Still everywhere the
 * surface is still.
 */
export function TiltDepth({
  children,
  className,
  depth = 8,
}: {
  children: ReactNode;
  className?: string;
  depth?: number;
}) {
  const pointer = useContext(PointerContext);
  const zero = useMotionValue(0);
  const x = useTransform(pointer?.x ?? zero, (v) => -v * depth);
  const y = useTransform(pointer?.y ?? zero, (v) => -v * depth);
  return (
    <motion.div className={className} style={pointer ? { x, y } : undefined}>
      {children}
    </motion.div>
  );
}
