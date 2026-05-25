import { Check } from "lucide-react";
import { useEffect, useState } from "react";
import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { type Theme, THEMES } from "@/config/themes";

export function ThemeToggle({
  open,
  onOpenChange,
}: {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <DropdownMenu onOpenChange={onOpenChange} open={open}>
      <DropdownMenuTrigger asChild>
        <Button
          className="relative h-9 w-9 rounded-full transition-colors hover:bg-muted"
          size="icon"
          variant="ghost"
        >
          {THEMES.map((t) => {
            const IconComponent = t.icon;
            const isVisible = theme === t.value;
            return (
              <IconComponent
                className={`absolute h-4 w-4 transition-all ${
                  isVisible ? "rotate-0 scale-100" : "rotate-90 scale-0"
                }`}
                key={t.value}
              />
            );
          })}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[180px]">
        <DropdownMenuLabel>Themes</DropdownMenuLabel>
        {THEMES.map((option) => {
          const isSelected = theme === option.value;
          return (
            <DropdownMenuItem
              className="flex justify-between"
              key={option.value}
              onClick={(e) => setTheme(option.value as Theme, e)}
            >
              <span className={isSelected ? "text-muted-foreground" : ""}>
                {option.label}
              </span>
              {isSelected && (
                <Check className="ml-2 h-4 w-4 text-muted-foreground" />
              )}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default ThemeToggle;
