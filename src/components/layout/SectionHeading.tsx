import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  className?: string;
}

export function SectionHeading({
  title,
  subtitle,
  className,
}: SectionHeadingProps) {
  return (
    <motion.div
      className={cn("mb-16 text-center", className)}
      initial={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      viewport={{ once: true }}
      whileInView={{ opacity: 1, y: 0 }}
    >
      <h2 className="mb-4 font-bold text-3xl tracking-tight md:text-4xl lg:text-5xl">
        <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          {title}
        </span>
      </h2>

      {subtitle && (
        <p className="mx-auto mt-3 max-w-2xl text-balance text-lg text-muted-foreground">
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}

export default SectionHeading;
