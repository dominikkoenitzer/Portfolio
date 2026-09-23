import type { ReactElement } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useLanguage } from "@/lib/language-context";
import { translations } from "@/lib/translations";

/**
 * Stands in for a project's Source link when the repo is private. A link
 * would land the visitor on GitHub's 404, so the control opens a short note
 * above itself instead. The caller passes the button, styled like the link it
 * replaces, so it keeps its place in the row.
 */
export function PrivateSource({ children }: { children: ReactElement }) {
  const t = translations[useLanguage().language].projects;
  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent
        className="w-auto max-w-64 border-border/60 px-3 py-2 text-sm"
        side="top"
      >
        {t.sourcePrivate}
      </PopoverContent>
    </Popover>
  );
}
