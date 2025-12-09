import { AnimatePresence, motion } from "framer-motion";
import {
  Check,
  Cloud,
  Coffee,
  Gem,
  Leaf,
  Moon,
  Radio,
  Sun,
  TreePine,
  Zap,
} from "lucide-react";
import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/context/ThemeContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { themes } from "@/lib/themes";

// Icon mapping for theme icons
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Sun,
  Moon,
  Leaf,
  Zap,
  Cloud,
  TreePine,
  Gem,
  Radio,
  Coffee,
};

export function ThemeToggle() {
  const { setTheme, theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredTheme, setHoveredTheme] = useState<string | null>(null);
  const [dropdownTop, setDropdownTop] = useState<number>(80);
  const [windowWidth, setWindowWidth] = useState<number>(0);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const isMobile = useIsMobile();

  const themeEntries = Object.entries(themes);

  // Track window width for responsive calculations
  useEffect(() => {
    const updateWindowWidth = () => {
      setWindowWidth(window.innerWidth);
    };

    updateWindowWidth();
    window.addEventListener("resize", updateWindowWidth);
    return () => window.removeEventListener("resize", updateWindowWidth);
  }, []);

  // Calculate responsive dimensions based on viewport
  const getButtonSize = () => {
    const width =
      windowWidth || (typeof window !== "undefined" ? window.innerWidth : 0);

    // Scale based on viewport width
    if (width === 0) return "h-10 w-10 sm:h-11 sm:w-11 md:h-12 md:w-12";
    if (width < 640) {
      // Mobile: optimized for all mobile devices
      return "h-10 w-10";
    }
    if (width < 1024) {
      // Tablet
      return "h-11 w-11";
    }
    // Desktop: can be slightly larger
    return "h-12 w-12";
  };

  const getIconSize = () => {
    const width =
      windowWidth || (typeof window !== "undefined" ? window.innerWidth : 0);
    if (width === 0) return "h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5";
    if (width < 640) return "h-3.5 w-3.5";
    if (width < 1024) return "h-4 w-4";
    return "h-5 w-5";
  };

  const getDropdownWidth = () => {
    // Use Tailwind responsive classes instead of JS calculations
    return "w-[calc(100vw-1.5rem)] sm:w-[350px] md:w-[380px] lg:w-[400px] max-w-[340px] sm:max-w-none";
  };

  // Get dropdown position for mobile devices
  const getDropdownPosition = () => {
    // On mobile, we'll use fixed positioning via inline styles (no classes)
    // On desktop, use absolute positioning relative to button
    return "sm:absolute sm:top-full sm:mt-4 md:sm:mt-8 sm:-right-16 sm:right-4";
  };

  // Calculate dropdown position for mobile (centered better on all mobile devices)
  const getDropdownStyle = () => {
    const width =
      windowWidth || (typeof window !== "undefined" ? window.innerWidth : 0);
    const isMobileView = width > 0 && width < 768;

    if (!isMobileView) {
      // Desktop: no inline styles needed, use Tailwind classes
      return {};
    }

    // For mobile, use fixed positioning centered on screen
    // Calculate exact center position
    const dropdownWidth =
      width <= 375 ? Math.min(340, width - 24) : Math.min(350, width - 24);
    const leftPosition = (width - dropdownWidth) / 2;

    return {
      position: "fixed",
      left: `${leftPosition}px`,
      top: `${dropdownTop}px`,
      width: `${dropdownWidth}px`,
      right: "auto",
      margin: "0",
      transform: "none", // Remove transform since we're calculating exact left position
    };
  };

  // Update dropdown position when opened or window resized
  useEffect(() => {
    const updatePosition = () => {
      if (isOpen && buttonRef.current) {
        const width =
          windowWidth ||
          (typeof window !== "undefined" ? window.innerWidth : 0);
        const isMobileView = width < 768 || (isMobile && width > 0);

        if (isMobileView) {
          const buttonRect = buttonRef.current.getBoundingClientRect();
          // Position dropdown below button with some spacing
          setDropdownTop(buttonRect.bottom + 8);
        }
      }
    };

    if (isOpen) {
      // Small delay to ensure button is rendered
      const timeoutId = setTimeout(updatePosition, 0);
      updatePosition();
      window.addEventListener("resize", updatePosition);
      window.addEventListener("scroll", updatePosition, { passive: true });

      return () => {
        clearTimeout(timeoutId);
        window.removeEventListener("resize", updatePosition);
        window.removeEventListener("scroll", updatePosition);
      };
    }
  }, [isOpen, isMobile, windowWidth]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const handleThemeSelect = (themeName: string) => {
    setTheme(themeName as "light" | "dark" | "system");
    setIsOpen(false);
  };

  const currentTheme =
    themes[theme === "system" ? "light" : theme] || themes.light;

  // Dynamic classes based on viewport - calculate once per render
  const buttonSizeClass = getButtonSize();
  const iconSizeClass = getIconSize();
  const dropdownWidthClass = getDropdownWidth();
  const dropdownPositionClass = getDropdownPosition();
  const dropdownStyle = getDropdownStyle();

  return (
    <div className="relative" ref={dropdownRef}>
      <motion.div
        className="touch-manipulation"
        whileHover={{ scale: isMobile ? 1 : 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Button
          aria-expanded={isOpen}
          aria-label="Select theme"
          className={`${buttonSizeClass} flex-shrink-0 rounded-xl border transition-all duration-300 sm:rounded-2xl ${
            isOpen
              ? "border-primary/20 bg-primary/10 shadow-lg shadow-primary/10"
              : "border-border/20 hover:border-primary/15 hover:bg-primary/5 hover:shadow-md active:scale-95"
          }`}
          onClick={() => setIsOpen(!isOpen)}
          ref={buttonRef}
          size="icon"
          style={{
            minWidth: isMobile ? "40px" : "44px", // Slightly smaller on mobile for better fit
            minHeight: isMobile ? "40px" : "44px",
          }}
          variant="ghost"
        >
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            className="relative flex items-center justify-center"
            transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
          >
            <div className="flex items-center justify-center">
              {React.createElement(iconMap[currentTheme.icon] || Sun, {
                className: `${iconSizeClass} text-primary`,
              })}
            </div>
          </motion.div>
        </Button>
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              animate={{ opacity: 1 }}
              className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm sm:hidden"
              exit={{ opacity: 0 }}
              initial={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />

            {/* Theme Selector Dropdown */}
            <motion.div
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
                transition: {
                  duration: 0.2,
                  ease: [0.25, 0.46, 0.45, 0.94],
                },
              }}
              className={`${dropdownPositionClass} ${windowWidth > 0 && windowWidth < 768 ? "" : dropdownWidthClass} z-50 max-h-[calc(100vh-8rem)] overflow-hidden overflow-y-auto rounded-xl border border-border bg-background shadow-lg sm:rounded-2xl`}
              exit={{
                opacity: 0,
                scale: 0.95,
                y: -10,
                transition: { duration: 0.15 },
              }}
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              style={dropdownStyle}
            >
              {/* Header */}
              <div className="border-border border-b p-3 sm:p-4">
                <h3 className="font-semibold text-sm sm:text-base">
                  Choose Theme
                </h3>
                <p className="mt-0.5 text-muted-foreground text-xs sm:mt-1 sm:text-sm">
                  Select your preferred visual style
                </p>
              </div>

              {/* Theme Grid */}
              <div className="p-3 sm:p-4">
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-3">
                  {themeEntries.map(([themeName, themeData], index) => {
                    const isSelected = theme === themeName;

                    return (
                      <motion.button
                        animate={{
                          opacity: 1,
                          y: 0,
                          transition: {
                            delay: index * 0.03,
                            duration: 0.25,
                          },
                        }}
                        className={`relative touch-manipulation rounded-lg border p-2.5 text-left transition-all duration-200 sm:p-3 ${
                          isSelected
                            ? "border-primary bg-primary/10 ring-1 ring-primary/20"
                            : "border-border hover:border-primary/40 hover:bg-primary/5 active:scale-95"
                        }`}
                        initial={{ opacity: 0, y: 10 }}
                        key={themeName}
                        onClick={() => handleThemeSelect(themeName)}
                        style={{
                          minHeight: "44px", // Minimum touch target
                        }}
                        whileHover={isMobile ? {} : { scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {/* Theme Content */}
                        <div className="mb-2 flex items-center gap-2 sm:mb-3 sm:gap-3">
                          <div
                            className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg sm:h-10 sm:w-10"
                            style={{
                              background: `hsl(${themeData.primary})`,
                              color: `hsl(${themeData.primaryForeground})`,
                            }}
                          >
                            {React.createElement(
                              iconMap[themeData.icon] || Sun,
                              {
                                className: "h-4 w-4 sm:h-5 sm:w-5",
                              }
                            )}
                          </div>

                          <div className="min-w-0 flex-1">
                            <h4 className="mb-0.5 font-semibold text-xs sm:mb-1 sm:text-sm">
                              {themeData.displayName}
                            </h4>
                            <p className="line-clamp-2 text-[10px] text-muted-foreground sm:text-xs">
                              {themeData.description}
                            </p>
                          </div>

                          {isSelected && (
                            <motion.div
                              animate={{ scale: 1, rotate: 0 }}
                              className="flex-shrink-0 text-primary"
                              initial={{ scale: 0, rotate: -180 }}
                            >
                              <Check className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                            </motion.div>
                          )}
                        </div>

                        {/* Color Preview */}
                        <div className="flex gap-1">
                          <div
                            className="h-3 w-3 rounded-full border-2 border-white/30 sm:h-4 sm:w-4"
                            style={{
                              background: `hsl(${themeData.background})`,
                            }}
                            title="Background"
                          />
                          <div
                            className="h-3 w-3 rounded-full border-2 border-white/30 sm:h-4 sm:w-4"
                            style={{
                              background: `hsl(${themeData.secondary})`,
                            }}
                            title="Secondary"
                          />
                          <div
                            className="h-3 w-3 rounded-full border-2 border-white/30 sm:h-4 sm:w-4"
                            style={{ background: `hsl(${themeData.primary})` }}
                            title="Primary"
                          />
                          <div
                            className="h-3 w-3 rounded-full border-2 border-white/30 sm:h-4 sm:w-4"
                            style={{
                              background: `hsl(${themeData.foreground})`,
                            }}
                            title="Foreground"
                          />
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* Footer */}
              <div className="border-border border-t bg-muted/20 px-3 py-2 sm:px-4 sm:py-3">
                <p className="text-center text-[10px] text-muted-foreground sm:text-xs">
                  Theme changes are saved automatically
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default ThemeToggle;
