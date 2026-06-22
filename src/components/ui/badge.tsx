import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Small pill used for tech tags, feature chips, and status labels. Replaces the
 * handful of ad-hoc `rounded-full border …` chips that had drifted apart across
 * the project/service cards (different border opacities, backgrounds, sizes).
 */
const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] transition-colors",
  {
    variants: {
      variant: {
        default: "border-border/40 bg-secondary/40 text-muted-foreground",
        primary: "border-primary/30 bg-primary/[0.08] text-primary",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { badgeVariants };
