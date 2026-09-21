import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/language-context";
import { translations } from "@/lib/translations";
import { cn } from "@/lib/utils";

interface SearchTriggerProps {
  onOpen: () => void;
  /**
   * Fetches the dialog's chunk before it is needed. Hovering or tabbing to the
   * button is a good enough signal, and the chunk is the same module the lazy
   * import asks for, so the click finds it already parsed.
   */
  onPreload?: () => void;
  className?: string;
}

/**
 * The header's search button: one icon, at every width. There was an
 * input-shaped variant with a keyboard-shortcut chip next to it; both are gone
 * on the owner's instruction, along with the shortcut itself. What is left
 * borrows the language button's box exactly, so the two read as one pair of
 * utilities rather than as two controls that happen to sit together.
 */
export function SearchTrigger({ className, onOpen, onPreload }: SearchTriggerProps) {
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <Button
      aria-label={t.search.open}
      className={cn(
        "h-11 w-11 rounded-full border border-primary/15 bg-primary/6 transition-colors hover:bg-primary/12 hover:text-primary",
        className,
      )}
      data-search-trigger
      onClick={onOpen}
      onFocus={onPreload}
      onPointerEnter={onPreload}
      size="icon"
      variant="ghost"
    >
      <Search className="size-5!" />
    </Button>
  );
}
