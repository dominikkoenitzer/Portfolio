import { motion, useReducedMotion } from "framer-motion";
import { revealOnScroll } from "@/lib/framer-animations";
import { DUR, EASE_OUT, REVEAL, stagger } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * The title's own reveal: the line rises out of the mask around it rather than
 * fading in place, which is the one "expensive" text move on the site. Purely a
 * transform; the mask does the hiding, so nothing repaints per frame.
 */
const TITLE_LINE = {
  hidden: { y: "110%" },
  show: { y: 0, transition: { duration: DUR.slow, ease: EASE_OUT } },
} as const;

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  /** Optional mono-uppercase label rendered above the title. */
  eyebrow?: string;
  /**
   * Heading level. Defaults to `h1` so a page's primary title is a real `<h1>`
   * (every routed page should have exactly one). Use `h2` for a secondary
   * section heading within a page that already has an `<h1>`.
   */
  as?: "h1" | "h2";
  /** Title alignment. Overview pages are centered; editorial pages pass "left". */
  align?: "center" | "left";
  className?: string;
}

/**
 * The shared page/section title. Fixes the element (h1 by default), font
 * (Kaisei Decol via `.title-serif`), weight, responsive size scale,
 * and alignment so every page's title is typographically identical.
 *
 * Overview pages pass all three parts (eyebrow, title, subtitle) and no margin
 * override, so the block is the same height on each of them and the titles line
 * up across routes. The bottom gap belongs to this component.
 */
export function SectionHeading({
  title,
  subtitle,
  eyebrow,
  as: Tag = "h1",
  align = "center",
  className,
}: SectionHeadingProps) {
  const centered = align === "center";
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={cn("mb-12", centered ? "text-center" : "text-left", className)}
      {...revealOnScroll(reduceMotion, stagger())}
    >
      {eyebrow && (
        <motion.p className="eyebrow mb-3" variants={REVEAL}>
          {eyebrow}
        </motion.p>
      )}

      {/* The gap under the title lives on the subtitle alone. With it on both
          elements the two margins collapsed into one anyway, and a page that
          passes no subtitle was left carrying the leftover. */}
      <Tag className="title-serif font-bold text-3xl md:text-4xl">
        {/* The mask carries the descender room it clips (a "y" or a "g" reaches
            below the line box) and takes the same amount back off the margin,
            so the title sits exactly where it did and nothing below it moves. */}
        <span className="mb-[-0.15em] block overflow-hidden pb-[0.15em]">
          <motion.span className="block" variants={TITLE_LINE}>
            {title}
          </motion.span>
        </span>
      </Tag>

      {subtitle && (
        <motion.p
          className={cn(
            "mt-3 max-w-xl text-balance text-base text-muted-foreground",
            centered && "mx-auto",
          )}
          variants={REVEAL}
        >
          {subtitle}
        </motion.p>
      )}
    </motion.div>
  );
}
