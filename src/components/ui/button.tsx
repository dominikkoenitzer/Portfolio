import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  // `rounded-lg` is the card radius token (14px), so a button matches the rest
  // of the site without every call site remembering to pass it.
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg font-medium text-sm ring-offset-background transition-colors duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        // The site's secondary action, as the hero paints it: a violet
        // hairline on the page itself, no fill.
        outline:
          "border border-primary/25 bg-transparent hover:border-primary/45 hover:bg-primary/[0.04]",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        // Primary call to action: the one place a control wears the sage.
        cta: "bg-sage text-sage-foreground hover:bg-sage-bright",
        // Primary-tinted secondary action (in-card links, the footer mail button).
        soft: "bg-primary/10 text-primary hover:bg-primary/15",
      },
      size: {
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
