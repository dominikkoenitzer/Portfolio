import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export function CustomCursor() {
  const [mounted, setMounted] = useState(false);

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);
  const dotScale = useMotionValue(1);
  const springDotScale = useSpring(dotScale, { stiffness: 400, damping: 32 });

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    setMounted(true);

    const onMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    const onOver = (e: MouseEvent) => {
      if (
        (e.target as HTMLElement).closest(
          'a, button, [role="button"], input, textarea, select',
        )
      ) {
        dotScale.set(1.8);
      }
    };

    const onOut = (e: MouseEvent) => {
      if (
        !(e.target as HTMLElement).closest(
          'a, button, [role="button"], input, textarea, select',
        )
      ) {
        dotScale.set(1);
      }
    };

    const onDown = () => dotScale.set(0.6);
    const onUp = () => dotScale.set(1);

    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseout", onOut);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onOut);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
    };
  }, [mouseX, mouseY, dotScale]);

  if (!mounted) return null;

  // Portal to <body> so the dot shares the same stacking context as Radix
  // popovers/dropdowns (which also portal to body). Its z-[9999] then wins
  // over their z-50, keeping the cursor visible on top of open menus.
  return createPortal(
    <div className="pointer-events-none select-none" aria-hidden="true">
      <motion.div
        className="fixed z-[9999] rounded-full bg-foreground"
        style={{
          width: 8,
          height: 8,
          top: 0,
          left: 0,
          translateX: "-50%",
          translateY: "-50%",
          x: mouseX,
          y: mouseY,
          scale: springDotScale,
        }}
      />
    </div>,
    document.body,
  );
}
