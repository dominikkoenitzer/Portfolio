import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

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
 * (Space Grotesk via the global heading rule), weight, responsive size scale,
 * and alignment so every page's title is typographically identical.
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

  return (
    <motion.div
      className={cn("mb-16", centered ? "text-center" : "text-left", className)}
      initial={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      viewport={{ once: true }}
      whileInView={{ opacity: 1, y: 0 }}
    >
      {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}

      <Tag className="mb-3 font-bold text-3xl md:text-4xl">{title}</Tag>

      {subtitle && (
        <p
          className={cn(
            "mt-3 max-w-xl text-balance text-base text-muted-foreground",
            centered && "mx-auto",
          )}
        >
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
