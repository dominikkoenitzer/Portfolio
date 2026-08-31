import { motion, type Variants } from "framer-motion";
import { DUR, EASE_OUT } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * Per-character entrance, in the React Bits idiom: the line assembles letter by
 * letter instead of arriving as one block.
 *
 * Three things shape this:
 *
 * - **It inherits, it does not self-start.** The characters carry `variants`
 *   and no `initial`/`animate` of their own, so they resolve against whatever
 *   variant the nearest motion ancestor is in. Framer propagates variants
 *   through plain DOM elements, so the wrapper below does not break the chain.
 *   Give the parent a `stagger(delay, perChar)` and the line writes itself in
 *   at that parent's slot in the cascade. Self-starting characters would run
 *   their whole animation while an ancestor still sat at `opacity: 0`.
 * - **Accessibility.** A screen reader walking twenty sibling spans reads the
 *   line out letter by letter. The real string is therefore carried once in an
 *   `sr-only` span and the visible characters are `aria-hidden`, the same
 *   split the hero already uses for its cycling name. (`role="text"` would be
 *   the tidier fix but it is a Safari-only invention, not in the ARIA spec.)
 * - **Crispness.** Characters rest at `y: 0`, which framer resolves to
 *   `transform: none`, so settled text is rasterized by the text pipeline
 *   rather than through the compositor. That is also why this is only used on
 *   flat-coloured text: `background-clip: text` clips a gradient to the glyphs
 *   of *one* element, so splitting a gradient headline into transformed
 *   children would render every character transparent.
 */
const CHAR: Variants = {
  hidden: { opacity: 0, y: "0.45em" },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: DUR.base, ease: EASE_OUT },
  },
};

interface SplitTextProps {
  /** The line to animate. Also what assistive tech is given, verbatim. */
  text: string;
  className?: string;
  /** Render the settled line with no animation (reduced motion). */
  static?: boolean;
}

export function SplitText({
  text,
  className,
  static: isStatic = false,
}: SplitTextProps) {
  if (isStatic) {
    return <span className={className}>{text}</span>;
  }

  return (
    <span className={cn("inline-block", className)}>
      <span className="sr-only">{text}</span>
      {[...text].map((char, i) => (
        <motion.span
          aria-hidden
          className="inline-block whitespace-pre"
          // The string is fixed for the life of the element. A language switch
          // remounts the tree through the provider, so the index is stable.
          key={`${i}-${char}`}
          variants={CHAR}
        >
          {char}
        </motion.span>
      ))}
    </span>
  );
}
