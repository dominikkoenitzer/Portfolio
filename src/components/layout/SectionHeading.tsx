
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  className?: string;
}

export function SectionHeading({ 
  title, 
  subtitle,
  className 
}: SectionHeadingProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      viewport={{ once: true }}
      className={cn("text-center mb-16", className)}
    >
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">{title}</span>
      </h2>
      
      {subtitle && (
        <p className="text-muted-foreground max-w-2xl mx-auto mt-3 text-balance text-lg">
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}

export default SectionHeading;
