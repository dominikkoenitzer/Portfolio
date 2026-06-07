import { Languages, Monitor } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { LANGUAGES } from "@/config/languages";
import { useLanguage } from "@/lib/language-provider";
import { translations } from "@/lib/translations";
import { cn } from "@/lib/utils";

export function LanguageToggle() {
  const { language, setLanguage, detectedLanguage } = useLanguage();
  const t = translations[language];
  const [open, setOpen] = useState(false);

  const systemLanguage = LANGUAGES.find(
    ({ code }) => code === detectedLanguage,
  );

  return (
    <Popover onOpenChange={setOpen} open={open}>
      <PopoverTrigger asChild>
        <Button
          aria-label={t.toggles.language}
          className="h-9 w-9 rounded-full transition-colors hover:bg-muted"
          size="icon"
          variant="ghost"
        >
          <Languages className="h-4 w-4" />
          <span className="sr-only">{t.toggles.language}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-52 p-2">
        <div className="grid gap-1">
          {LANGUAGES.map(({ code, label }) => {
            const isActive = language === code;
            return (
              <button
                aria-pressed={isActive}
                className={cn(
                  "flex items-center gap-2.5 rounded-lg p-1.5 text-left text-sm transition-colors",
                  isActive ? "bg-primary/5" : "hover:bg-muted",
                )}
                key={code}
                onClick={() => {
                  setLanguage(code);
                  setOpen(false);
                }}
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
              </button>
            );
          })}
        </div>

        {/* Offer to match the browser language, but only when it differs from
            the current pick — an action, not a passive readout. */}
        {systemLanguage && detectedLanguage !== language ? (
          <div className="mt-1.5 border-border/60 border-t pt-1.5">
            <button
              className="flex w-full items-center gap-2.5 rounded-lg p-1.5 text-left transition-colors hover:bg-muted"
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
                <span className="text-[11px] text-muted-foreground/70">
                  {systemLanguage.label}
                </span>
              </span>
            </button>
          </div>
        ) : null}
      </PopoverContent>
    </Popover>
  );
}
