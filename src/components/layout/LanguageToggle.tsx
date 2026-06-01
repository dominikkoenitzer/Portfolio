import { Check, Languages } from "lucide-react";
import { LANGUAGES } from "@/config/languages";
import { useLanguage } from "@/lib/language-provider";
import { translations } from "@/lib/translations";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function LanguageToggle() {
  const { language, setLanguage, detectedLanguageCode } = useLanguage();
  const t = translations[language];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className="relative h-9 w-9 rounded-full transition-colors hover:bg-muted"
          size="icon"
          variant="ghost"
        >
          <Languages className="h-4 w-4" />
          <span className="sr-only">{t.toggles.language}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[180px]">
        {LANGUAGES.map(({ code, label }) => (
          <DropdownMenuItem
            className="flex items-center justify-between"
            key={code}
            onClick={() => setLanguage(code)}
          >
            <span className={language === code ? "text-muted-foreground" : ""}>
              {label}
            </span>
            {language === code && (
              <Check className="ml-2 h-4 w-4 text-muted-foreground" />
            )}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <div className="px-2 py-1.5 text-[11px] text-muted-foreground/60">
          {t.toggles.detected}: {detectedLanguageCode ?? "—"}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

