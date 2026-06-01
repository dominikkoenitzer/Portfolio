import { useEffect, useState } from "react";
import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { getVeilPreset, THEMES } from "@/config/themes";
import { useLanguage } from "@/lib/language-provider";
import { translations } from "@/lib/translations";
import { cn } from "@/lib/utils";

export function ThemeToggle({
  open,
  onOpenChange,
}: {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const { theme, setTheme } = useTheme();
  const { language } = useLanguage();
  const t = translations[language];
  const [mounted, setMounted] = useState(false);
  const [internalOpen, setInternalOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  // Support both controlled (Navbar may drive it) and standalone use.
  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : internalOpen;
  const setOpen = (next: boolean) => {
    if (!isControlled) {
      setInternalOpen(next);
    }
    onOpenChange?.(next);
  };

  const ActiveIcon = THEMES.find((option) => option.value === theme)?.icon;

  return (
    <Popover onOpenChange={setOpen} open={isOpen}>
      <PopoverTrigger asChild>
        <Button
          aria-label={t.toggles.theme}
          className="h-9 w-9 rounded-full transition-colors hover:bg-muted"
          size="icon"
          variant="ghost"
        >
          {ActiveIcon ? <ActiveIcon className="h-4 w-4" /> : null}
          <span className="sr-only">{t.toggles.theme}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-60 p-2">
        <p className="px-1 pb-2 font-medium text-muted-foreground text-xs">
          {t.toggles.themes}
        </p>
        <div className="grid grid-cols-2 gap-2">
          {THEMES.map((option) => {
            const Icon = option.icon;
            const isActive = theme === option.value;
            const [c0, c1, c2] = getVeilPreset(option.value).colorStops;
            return (
              <button
                aria-pressed={isActive}
                className={cn(
                  "flex flex-col gap-2 rounded-xl border p-2 transition-colors",
                  isActive
                    ? "border-primary/60 bg-primary/5"
                    : "border-border/60 hover:bg-muted"
                )}
                key={option.value}
                onClick={(e) => {
                  setTheme(option.value, e);
                  setOpen(false);
                }}
                type="button"
              >
                <span
                  aria-hidden
                  className="h-10 w-full rounded-lg ring-1 ring-black/5"
                  style={{
                    backgroundImage: `linear-gradient(135deg, ${c0}, ${c1}, ${c2})`,
                  }}
                />
                <span className="flex items-center justify-center gap-1.5 text-sm">
                  <Icon className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                  <span className="truncate">{option.label}</span>
                </span>
              </button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}
