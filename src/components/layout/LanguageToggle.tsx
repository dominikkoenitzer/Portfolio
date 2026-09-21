import { Check, Languages, Monitor } from "lucide-react";
import { type KeyboardEvent as ReactKeyboardEvent, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { LANGUAGES } from "@/config/languages";
import { useLanguage } from "@/lib/language-context";
import { translations } from "@/lib/translations";
import { cn } from "@/lib/utils";

export function LanguageToggle() {
  const { language, setLanguage, detectedLanguage } = useLanguage();
  const t = translations[language];
  const [open, setOpen] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLButtonElement>(null);

  const systemLanguage = LANGUAGES.find(
    ({ code }) => code === detectedLanguage,
  );

  // Radix gives the popover focus but no roving movement: the rows are plain
  // buttons, so Tab was the only way through them. Arrows, Home and End walk
  // the whole sheet, the system row included, which is what a keyboard user
  // reaches for after the menu opens on the current language.
  const onListKeyDown = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(e.key)) return;
    const items = Array.from(
      listRef.current?.querySelectorAll<HTMLButtonElement>("button") ?? [],
    );
    if (items.length === 0) return;
    e.preventDefault();
    const from = items.indexOf(document.activeElement as HTMLButtonElement);
    const next =
      e.key === "Home"
        ? 0
        : e.key === "End"
          ? items.length - 1
          : e.key === "ArrowDown"
            ? (from + 1) % items.length
            : (from - 1 + items.length) % items.length;
    items[next]?.focus();
  };

  return (
    <Popover onOpenChange={setOpen} open={open}>
      <PopoverTrigger asChild>
        {/* Sized to the hamburger it stands next to on mobile: same 44px box,
            same corner. It used to be a 36px circle carrying a bare glyph
            beside a boxed control, so the pair read as two unrelated bits of
            chrome and the smaller one missed the tap-target floor. The corner
            is now the header's: everything in that row (island, nav pills,
            hamburger) is a pill, and a rounded square among them read as a
            leftover. On desktop this button stands alone at the page gutter
            rather than inside `<nav>`, because the nav row is centred on the
            page axis and a control in the row would push the links off it. */}
        <Button
          aria-label={t.toggles.language}
          className="h-11 w-11 rounded-full border border-primary/15 bg-primary/6 transition-colors hover:bg-primary/12 hover:text-primary"
          size="icon"
          variant="ghost"
        >
          <Languages className="size-5!" />
          <span className="sr-only">{t.toggles.language}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="w-56 rounded-2xl p-2 duration-200"
        onOpenAutoFocus={(e) => {
          // Land on the current language instead of the sheet itself, so the
          // first arrow press moves rather than merely entering the list.
          e.preventDefault();
          activeRef.current?.focus();
        }}
        sideOffset={8}
      >
        <div onKeyDown={onListKeyDown} ref={listRef}>
          <div className="grid gap-1">
            {LANGUAGES.map(({ code, label }) => {
              const isActive = language === code;
              return (
                <button
                  aria-pressed={isActive}
                  className={cn(
                    "flex items-center gap-2.5 rounded-lg p-2 text-left text-sm transition-colors",
                    isActive ? "bg-primary/5" : "hover:bg-muted",
                  )}
                  key={code}
                  onClick={() => {
                    setLanguage(code);
                    setOpen(false);
                  }}
                  ref={isActive ? activeRef : undefined}
                  type="button"
                >
                  <span
                    className={cn(
                      "flex h-7 w-7 shrink-0 items-center justify-center rounded-md font-semibold text-[11px] uppercase tracking-wide",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground",
                    )}
                  >
                    {code}
                  </span>
                  <span className={isActive ? "font-medium" : ""}>{label}</span>
                  {/* The selected row is carried by a tinted background alone,
                      which is faint at a glance. A tick states it outright and
                      inherits its colour from the row. */}
                  {isActive ? (
                    <Check aria-hidden="true" className="ml-auto size-4" />
                  ) : null}
                </button>
              );
            })}
          </div>

          {/* Offer to match the browser language, but only when it differs from
              the current pick, an action rather than a passive readout. */}
          {systemLanguage && detectedLanguage !== language ? (
            <div className="mt-1.5 border-border/60 border-t pt-1.5">
              <button
                className="flex w-full items-center gap-2.5 rounded-lg p-2 text-left transition-colors hover:bg-muted"
                onClick={() => {
                  setLanguage(detectedLanguage);
                  setOpen(false);
                }}
                type="button"
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
                  <Monitor className="h-3.5 w-3.5" />
                </span>
                <span className="flex flex-col leading-tight">
                  <span className="text-sm">{t.toggles.useSystem}</span>
                  <span className="text-[11px] text-muted-foreground">
                    {systemLanguage.label}
                  </span>
                </span>
              </button>
            </div>
          ) : null}
        </div>
      </PopoverContent>
    </Popover>
  );
}
