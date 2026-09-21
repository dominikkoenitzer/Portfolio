import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Radix defaults to a 700ms delay, which is long enough that a tooltip reads as
 * a hesitation rather than an answer. 200ms is close to instant without firing
 * on a pointer that is merely passing over. `skipDelayDuration` then lets a run
 * of adjacent triggers (the contribution grid) hand off with no delay at all.
 */
const TooltipProvider = ({
  delayDuration = 200,
  skipDelayDuration = 300,
  ...props
}: React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Provider>) => (
  <TooltipPrimitive.Provider
    delayDuration={delayDuration}
    skipDelayDuration={skipDelayDuration}
    {...props}
  />
);
TooltipProvider.displayName = "TooltipProvider";

const Tooltip = TooltipPrimitive.Root;

const TooltipTrigger = TooltipPrimitive.Trigger;

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 6, ...props }, ref) => (
  <TooltipPrimitive.Content
    className={cn(
      // Transform and opacity only, on the same clock as the rest of the
      // chrome. The scale grows from the edge nearest the trigger (Radix hands
      // us that origin) so the tip reads as coming out of what it describes
      // instead of appearing beside it.
      "fade-in-0 zoom-in-95 data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-1 data-[side=left]:slide-in-from-right-1 data-[side=right]:slide-in-from-left-1 data-[side=top]:slide-in-from-bottom-1 z-50 max-w-xs origin-(--radix-tooltip-content-transform-origin) animate-in overflow-hidden rounded-xl border px-3 py-1.5 text-sm shadow-lg duration-150 ease-out data-[state=closed]:animate-out",
      "bg-popover text-popover-foreground",
      className,
    )}
    ref={ref}
    sideOffset={sideOffset}
    {...props}
  />
));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger };
