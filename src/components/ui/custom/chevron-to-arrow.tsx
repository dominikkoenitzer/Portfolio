import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function ChevronToArrowIcon({ className }: { className?: string }) {
  return (
    <ArrowRight
      className={cn(
        "size-4",
        "[&>path:first-child]:origin-left [&>path:first-child]:scale-x-0 [&>path:first-child]:opacity-0 [&>path:first-child]:transition-all [&>path:first-child]:duration-300 group-hover:[&>path:first-child]:scale-x-100 group-hover:[&>path:first-child]:opacity-100",
        "[&>path:last-child]:-translate-x-1 [&>path:last-child]:transition-transform [&>path:last-child]:duration-300 group-hover:[&>path:last-child]:translate-x-0",
        className
      )}
    />
  );
}
