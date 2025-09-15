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
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsOpen(!isOpen)}
          className={`h-10 w-10 rounded-xl border border-border/30 transition-all duration-300 ${
            isOpen ? 'bg-primary/10 border-primary/30' : 'hover:bg-primary/5'
          }`}
          aria-label="Select theme"
          aria-expanded={isOpen}
        >
          <motion.div
            className="relative flex items-center justify-center"
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            {isTransitioning ? (
              <Sparkles className="h-5 w-5 animate-spin" />
            ) : (
              <div className="flex items-center">
                {React.createElement(iconMap[currentTheme.icon] || Sun, { 
                  className: "h-4 w-4 mr-1" 
                })}
                <ChevronDown className="h-3 w-3 opacity-60" />
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
              className="fixed inset-0 z-40 md:hidden"
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
                  ease: [0.22, 1, 0.36, 1]
                }
              }}
              exit={{ 
                opacity: 0, 
                scale: 0.95, 
                y: -10,
                transition: { duration: 0.15 }
              }}
              className="absolute right-0 top-full mt-2 w-80 md:w-96 bg-background/95 backdrop-blur-2xl rounded-2xl border border-border/50 shadow-2xl shadow-primary/10 z-50 overflow-hidden"
            >
              {/* Header */}
              <div className="p-4 border-b border-border/30">
                <div className="flex items-center gap-2 mb-2">
                  <Palette className="h-4 w-4 text-primary" />
                  <h3 className="font-semibold text-sm">Choose Theme</h3>
                </div>
                <p className="text-xs text-muted-foreground">
                  Select your preferred visual style
                </p>
              </div>

              {/* Theme Grid */}
              <div className="p-3">
                <div className="grid grid-cols-2 gap-2">
                  {themeEntries.map(([themeName, themeData], index) => {
                    const isSelected = theme === themeName
                    const isHovered = hoveredTheme === themeName
                    
                    return (
                      <motion.button
                        key={themeName}
                        onClick={() => handleThemeSelect(themeName)}
                        onMouseEnter={() => setHoveredTheme(themeName)}
                        onMouseLeave={() => setHoveredTheme(null)}
                        className={`relative p-3 rounded-xl border transition-all duration-200 text-left group ${
                          isSelected 
                            ? 'border-primary/50 bg-primary/5' 
                            : 'border-border/30 hover:border-primary/30 hover:bg-primary/5'
                        }`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ 
                          opacity: 1, 
                          y: 0,
                          transition: { delay: index * 0.03 }
                        }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {/* Theme Preview */}
                        <div className="flex items-start gap-3 mb-2">
                          <div className="flex-shrink-0">
                            <div 
                              className="w-8 h-8 rounded-lg border-2 border-white/20 shadow-sm flex items-center justify-center"
                              style={{ 
                                background: `hsl(${themeData.primary})`,
                                color: `hsl(${themeData.primaryForeground})`
                              }}
                            >
                              {React.createElement(iconMap[themeData.icon] || Sun, { 
                                className: "h-4 w-4" 
                              })}
                            </div>
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="font-medium text-sm truncate">
                                {themeData.displayName}
                              </h4>
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
                            <p className="text-xs text-muted-foreground line-clamp-2">
                              {themeData.description}
                            </p>
                          </div>
                        </div>

                        {/* Color Preview Bar */}
                        <div className="flex gap-1 mb-2">
                          <div 
                            className="w-3 h-3 rounded-full border border-white/20 shadow-sm"
                            style={{ background: `hsl(${themeData.background})` }}
                            title="Background (lightest)"
                          />
                          <div 
                            className="w-3 h-3 rounded-full border border-white/20 shadow-sm"
                            style={{ background: `hsl(${themeData.secondary})` }}
                            title="Secondary"
                          />
                          <div 
                            className="w-3 h-3 rounded-full border border-white/20 shadow-sm"
                            style={{ background: `hsl(${themeData.primary})` }}
                            title="Primary"
                          />
                          <div 
                            className="w-3 h-3 rounded-full border border-white/20 shadow-sm"
                            style={{ background: `hsl(${themeData.foreground})` }}
                            title="Foreground (darkest)"
                          />
                        </div>

                        {/* Hover Gradient Effect */}
                        <motion.div 
                          className="absolute inset-0 rounded-xl"
                          style={{ 
                            background: `linear-gradient(135deg, hsl(${themeData.primary}/0.1) 0%, transparent 100%)`
                          }}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: isHovered ? 1 : 0 }}
                          transition={{ duration: 0.2 }}
                        />
                      </motion.button>
                    )
                  })}
                </div>
              </div>

              {/* Footer */}
              <div className="p-3 border-t border-border/30 bg-muted/20">
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
