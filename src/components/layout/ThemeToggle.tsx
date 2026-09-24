import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";
import { useLanguage } from "@/lib/language-context";
import { DUR, EASE_OUT } from "@/lib/motion";
import { setTheme } from "@/lib/theme";
import { translations } from "@/lib/translations";

/**
 * Light or dark, next to the language control and sized like it. The glyph
 * shows the theme a press switches to, and the label says so, so a screen
 * reader hears the action rather than the current state.
 */
export function ThemeToggle() {
  const theme = useTheme();
  const reduceMotion = useReducedMotion();
  const t = translations[useLanguage().language].toggles;
  const next = theme === "dark" ? "light" : "dark";
  const label = next === "dark" ? t.darkTheme : t.lightTheme;
  const Glyph = next === "dark" ? Moon : Sun;

  return (
    <Button
      aria-label={label}
      className="relative h-11 w-11 overflow-hidden rounded-full border border-primary/15 bg-primary/6 transition-colors hover:bg-primary/12 hover:text-primary"
      onClick={() => setTheme(next)}
      size="icon"
      title={label}
      variant="ghost"
    >
      <AnimatePresence initial={false} mode="wait">
        <motion.span
          animate={{ opacity: 1, rotate: 0 }}
          className="flex items-center justify-center"
          exit={reduceMotion ? { opacity: 0 } : { opacity: 0, rotate: 60 }}
          initial={reduceMotion ? { opacity: 0 } : { opacity: 0, rotate: -60 }}
          key={next}
          transition={{ duration: DUR.fast, ease: EASE_OUT }}
        >
          <Glyph aria-hidden className="size-5!" />
        </motion.span>
      </AnimatePresence>
    </Button>
  );
}
