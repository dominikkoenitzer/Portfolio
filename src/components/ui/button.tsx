import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  // Press feedback is CSS-only (a 2% scale on :active) so every Button, plain
  // or `asChild`, cushions the same way without becoming a motion component.
  // The shine sweep and the hover lift are opted into per variant below, and
  // the lift rides `translate` (see index.css), which is why the transition
  // list carries it alongside `transform`.
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium text-sm ring-offset-background transition-[color,background-color,border-color,box-shadow,transform,translate] duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        // The filled variants carry the depth: a 1px inset white top edge that
        // reads as a lit bevel, and the sweep, which only shows up on a dark
        // fill. Both shadow states repeat the inset because box-shadow is one
        // property, so a hover value that omitted it would put the light out.
        // These stay Tailwind arbitrary values rather than moving to index.css
        // so they compose through `--tw-shadow` with the focus ring above.
        default:
          "btn-shine btn-raise bg-primary text-primary-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.18)] hover:bg-primary/90 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_8px_24px_-8px_hsl(var(--primary)/0.35)]",
        // Same treatment, but the drop shadow is neutral black: a
        // primary-tinted glow under a red fill reads as a colour clash.
        destructive:
          "btn-shine btn-raise bg-destructive text-destructive-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.18)] hover:bg-destructive/90 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_8px_24px_-8px_rgba(0,0,0,0.28)]",
        // The light-surfaced variants take the lift only. A white sweep over a
        // near-white background is invisible, and an inset white top edge has
        // nothing to catch, so neither would buy anything here.
        outline:
          "btn-raise border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "btn-raise bg-secondary text-secondary-foreground hover:bg-secondary/80",
        // Ghost and link stay flat on purpose: ghost is the navbar/toggle
        // chrome, where a lift would jitter against the header's own motion,
        // and a link that moves is a link that looks broken.
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        // Primary call-to-action: filled with the canonical shadow-glow hover
        // used site-wide (Hero, Services, ContactForm, ProjectDetails) instead
        // of each surface hand-rolling its own glow magnitude. That glow is
        // kept at its exact magnitude and only gains the inset top edge; it is
        // already deeper than the one the other filled variants grow on hover.
        cta: "btn-shine btn-raise bg-primary text-primary-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_2px_16px_hsl(var(--primary)/0.25)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_4px_24px_hsl(var(--primary)/0.38)]",
        // Soft, primary-tinted secondary action (e.g. in-card "Live" links).
        soft: "btn-raise bg-primary/10 text-primary hover:bg-primary/15",
      },
      size: {
        // `btn-icon-nudge` (index.css) leans a trailing icon 2px on hover. It
        // hangs off the text sizes rather than the base so the icon size, whose
        // glyph is the whole button and is centred, never drifts.
        default: "btn-icon-nudge h-10 px-4 py-2",
        sm: "btn-icon-nudge h-9 rounded-md px-3",
        lg: "btn-icon-nudge h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button };
