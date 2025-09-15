import * as React from "react"
import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Palette, 
  Check, 
  Sparkles, 
  ChevronDown, 
  Sun, 
  Moon, 
  Leaf, 
  Zap, 
  Cloud, 
  TreePine, 
  Gem, 
  Radio, 
  Coffee 
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/context/ThemeContext"
import { themes } from "@/lib/themes"

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
  Coffee
}

export function ThemeToggle() {
  const { setTheme, theme, isTransitioning } = useTheme()
  const [isOpen, setIsOpen] = useState(false)
  const [hoveredTheme, setHoveredTheme] = useState<string | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const themeEntries = Object.entries(themes)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [])

  const handleThemeSelect = (themeName: string) => {
    setTheme(themeName as any)
    setIsOpen(false)
  }

  const currentTheme = themes[theme === 'system' ? 'light' : theme] || themes.light

  return (
    <div className="relative" ref={dropdownRef}>
      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsOpen(!isOpen)}
          className={`h-11 w-11 rounded-2xl border transition-all duration-300 ${
            isOpen 
              ? 'bg-primary/10 border-primary/20 shadow-lg shadow-primary/10' 
              : 'border-border/20 hover:bg-primary/5 hover:border-primary/15 hover:shadow-md'
          }`}
          aria-label="Select theme"
          aria-expanded={isOpen}
        >
          <motion.div
            className="relative flex items-center justify-center"
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
          >
            {isTransitioning ? (
              <Sparkles className="h-4 w-4 animate-spin text-primary" />
            ) : (
              <div className="flex items-center justify-center">
                {React.createElement(iconMap[currentTheme.icon] || Sun, { 
                  className: "h-4 w-4 text-primary" 
                })}
              </div>
            )}
          </motion.div>
        </Button>
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm sm:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />
            
            {/* Theme Selector Dropdown */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ 
                opacity: 1, 
                scale: 1, 
                y: 0,
                transition: {
                  duration: 0.2,
                  ease: [0.25, 0.46, 0.45, 0.94]
                }
              }}
              exit={{ 
                opacity: 0, 
                scale: 0.95, 
                y: -10,
                transition: { duration: 0.15 }
              }}
              className="absolute top-full mt-8 -right-16 sm:right-4 w-[350px] sm:w-[400px] bg-background border border-border shadow-lg rounded-xl z-50 overflow-hidden"
            >
              {/* Header */}
              <div className="p-4 border-b border-border">
                <h3 className="font-semibold text-base">Choose Theme</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Select your preferred visual style
                </p>
              </div>

              {/* Theme Grid */}
              <div className="p-4">
                <div className="grid grid-cols-2 gap-3">
                  {themeEntries.map(([themeName, themeData], index) => {
                    const isSelected = theme === themeName
                    
                    return (
                      <motion.button
                        key={themeName}
                        onClick={() => handleThemeSelect(themeName)}
                        className={`relative p-3 rounded-lg border text-left transition-all duration-200 ${
                          isSelected 
                            ? 'border-primary bg-primary/10 ring-1 ring-primary/20' 
                            : 'border-border hover:border-primary/40 hover:bg-primary/5'
                        }`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ 
                          opacity: 1, 
                          y: 0,
                          transition: { 
                            delay: index * 0.03,
                            duration: 0.25
                          }
                        }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {/* Theme Content */}
                        <div className="flex items-center gap-3 mb-3">
                          <div 
                            className="w-10 h-10 rounded-lg flex items-center justify-center"
                            style={{ 
                              background: `hsl(${themeData.primary})`,
                              color: `hsl(${themeData.primaryForeground})`
                            }}
                          >
                            {React.createElement(iconMap[themeData.icon] || Sun, { 
                              className: "h-5 w-5" 
                            })}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-sm mb-1">
                              {themeData.displayName}
                            </h4>
                            <p className="text-xs text-muted-foreground line-clamp-2">
                              {themeData.description}
                            </p>
                          </div>
                          
                          {isSelected && (
                            <motion.div
                              initial={{ scale: 0, rotate: -180 }}
                              animate={{ scale: 1, rotate: 0 }}
                              className="text-primary"
                            >
                              <Check className="h-4 w-4" />
                            </motion.div>
                          )}
                        </div>

                        {/* Color Preview */}
                        <div className="flex gap-1">
                          <div 
                            className="w-4 h-4 rounded-full border-2 border-white/30"
                            style={{ background: `hsl(${themeData.background})` }}
                            title="Background"
                          />
                          <div 
                            className="w-4 h-4 rounded-full border-2 border-white/30"
                            style={{ background: `hsl(${themeData.secondary})` }}
                            title="Secondary"
                          />
                          <div 
                            className="w-4 h-4 rounded-full border-2 border-white/30"
                            style={{ background: `hsl(${themeData.primary})` }}
                            title="Primary"
                          />
                          <div 
                            className="w-4 h-4 rounded-full border-2 border-white/30"
                            style={{ background: `hsl(${themeData.foreground})` }}
                            title="Foreground"
                          />
                        </div>

                      </motion.button>
                    )
                  })}
                </div>
              </div>

              {/* Footer */}
              <div className="px-4 py-3 border-t border-border bg-muted/20">
                <p className="text-xs text-center text-muted-foreground">
                  Theme changes are saved automatically
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ThemeToggle;
