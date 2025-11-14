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
import { useIsMobile } from "@/hooks/use-mobile"

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
  const isMobile = useIsMobile()

  const themeEntries = Object.entries(themes)
  
  // Calculate responsive dimensions based on viewport
  const getButtonSize = () => {
    if (typeof window === 'undefined') return 'h-10 w-10'
    const width = window.innerWidth
    const dpr = window.devicePixelRatio || 1
    
    // Scale based on viewport width and device pixel ratio
    if (width < 640) {
      // Mobile: optimized for iPhone X (375px) and similar devices
      // Use consistent size for better alignment
      return 'h-10 w-10'
    } else if (width < 1024) {
      // Tablet
      return 'h-11 w-11'
    } else {
      // Desktop: can be slightly larger
      return 'h-12 w-12'
    }
  }
  
  const getIconSize = () => {
    if (typeof window === 'undefined') return 'h-4 w-4'
    const width = window.innerWidth
    if (width < 640) return 'h-3.5 w-3.5 sm:h-4 sm:w-4'
    if (width < 1024) return 'h-4 w-4'
    return 'h-5 w-5'
  }
  
  const getDropdownWidth = () => {
    if (typeof window === 'undefined') return 'w-[calc(100vw-2rem)] sm:w-[350px] md:w-[400px]'
    const width = window.innerWidth
    if (width < 640) {
      // Mobile: optimized for iPhone X (375px) - use safe area aware width
      // iPhone X width is 375px, so we want ~340px with padding
      return 'w-[calc(100vw-1.5rem)] max-w-[340px]'
    } else if (width < 768) {
      return 'w-[350px]'
    } else if (width < 1024) {
      return 'w-[380px]'
    } else {
      return 'w-[400px]'
    }
  }
  
  // Get dropdown position for mobile devices
  const getDropdownPosition = () => {
    if (!isMobile) return '-right-16 sm:right-4'
    
    // On mobile, we'll use fixed positioning via inline styles
    return 'right-0'
  }
  
  // Calculate dropdown position for mobile (centered better on iPhone X)
  const getDropdownStyle = () => {
    if (!isMobile) {
      return {
        maxWidth: 'calc(100vw - 2rem)',
      }
    }
    
    if (typeof window === 'undefined') {
      return {
        maxWidth: 'calc(100vw - 1.5rem)',
        right: '0.75rem',
        left: 'auto',
      }
    }
    
    const width = window.innerWidth
    // For iPhone X (375px), center the dropdown better
    if (width <= 375) {
      // iPhone X: position from right with safe margin, but ensure it's visible
      return {
        maxWidth: 'calc(100vw - 1.5rem)',
        right: '0.75rem',
        left: 'auto',
      }
    } else if (width < 640) {
      return {
        maxWidth: 'calc(100vw - 1.5rem)',
        right: '0.75rem',
        left: 'auto',
      }
    }
    
    return {
      maxWidth: 'calc(100vw - 1.5rem)',
      right: '0.75rem',
      left: 'auto',
    }
  }

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

  // Dynamic classes based on viewport
  const buttonSizeClass = getButtonSize()
  const iconSizeClass = getIconSize()
  const dropdownWidthClass = getDropdownWidth()
  const dropdownPositionClass = getDropdownPosition()
  const dropdownStyle = getDropdownStyle()

  return (
    <div className="relative" ref={dropdownRef}>
      <motion.div 
        whileHover={{ scale: isMobile ? 1 : 1.02 }} 
        whileTap={{ scale: 0.98 }}
        className="touch-manipulation"
      >
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsOpen(!isOpen)}
          className={`${buttonSizeClass} rounded-xl sm:rounded-2xl border transition-all duration-300 flex-shrink-0 ${
            isOpen 
              ? 'bg-primary/10 border-primary/20 shadow-lg shadow-primary/10' 
              : 'border-border/20 hover:bg-primary/5 hover:border-primary/15 hover:shadow-md active:scale-95'
          }`}
          aria-label="Select theme"
          aria-expanded={isOpen}
          style={{
            minWidth: isMobile ? '40px' : '44px', // Slightly smaller on mobile for better fit
            minHeight: isMobile ? '40px' : '44px',
          }}
        >
          <motion.div
            className="relative flex items-center justify-center"
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
          >
            {isTransitioning ? (
              <Sparkles className={`${iconSizeClass} animate-spin text-primary`} />
            ) : (
              <div className="flex items-center justify-center">
                {React.createElement(iconMap[currentTheme.icon] || Sun, { 
                  className: `${iconSizeClass} text-primary` 
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
              className={`absolute top-full mt-2 sm:mt-4 md:mt-8 ${
                isMobile 
                  ? dropdownPositionClass
                  : '-right-16 sm:right-4'
              } ${dropdownWidthClass} bg-background border border-border shadow-lg rounded-xl sm:rounded-2xl z-50 overflow-hidden max-h-[calc(100vh-8rem)] overflow-y-auto`}
              style={dropdownStyle}
            >
              {/* Header */}
              <div className="p-3 sm:p-4 border-b border-border">
                <h3 className="font-semibold text-sm sm:text-base">Choose Theme</h3>
                <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1">
                  Select your preferred visual style
                </p>
              </div>

              {/* Theme Grid */}
              <div className="p-3 sm:p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                  {themeEntries.map(([themeName, themeData], index) => {
                    const isSelected = theme === themeName
                    
                    return (
                      <motion.button
                        key={themeName}
                        onClick={() => handleThemeSelect(themeName)}
                        className={`relative p-2.5 sm:p-3 rounded-lg border text-left transition-all duration-200 touch-manipulation ${
                          isSelected 
                            ? 'border-primary bg-primary/10 ring-1 ring-primary/20' 
                            : 'border-border hover:border-primary/40 hover:bg-primary/5 active:scale-95'
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
                        whileHover={isMobile ? {} : { scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        style={{
                          minHeight: '44px', // Minimum touch target
                        }}
                      >
                        {/* Theme Content */}
                        <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                          <div 
                            className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                            style={{ 
                              background: `hsl(${themeData.primary})`,
                              color: `hsl(${themeData.primaryForeground})`
                            }}
                          >
                            {React.createElement(iconMap[themeData.icon] || Sun, { 
                              className: "h-4 w-4 sm:h-5 sm:w-5" 
                            })}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-xs sm:text-sm mb-0.5 sm:mb-1">
                              {themeData.displayName}
                            </h4>
                            <p className="text-[10px] sm:text-xs text-muted-foreground line-clamp-2">
                              {themeData.description}
                            </p>
                          </div>
                          
                          {isSelected && (
                            <motion.div
                              initial={{ scale: 0, rotate: -180 }}
                              animate={{ scale: 1, rotate: 0 }}
                              className="text-primary flex-shrink-0"
                            >
                              <Check className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                            </motion.div>
                          )}
                        </div>

                        {/* Color Preview */}
                        <div className="flex gap-1">
                          <div 
                            className="w-3 h-3 sm:w-4 sm:h-4 rounded-full border-2 border-white/30"
                            style={{ background: `hsl(${themeData.background})` }}
                            title="Background"
                          />
                          <div 
                            className="w-3 h-3 sm:w-4 sm:h-4 rounded-full border-2 border-white/30"
                            style={{ background: `hsl(${themeData.secondary})` }}
                            title="Secondary"
                          />
                          <div 
                            className="w-3 h-3 sm:w-4 sm:h-4 rounded-full border-2 border-white/30"
                            style={{ background: `hsl(${themeData.primary})` }}
                            title="Primary"
                          />
                          <div 
                            className="w-3 h-3 sm:w-4 sm:h-4 rounded-full border-2 border-white/30"
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
              <div className="px-3 sm:px-4 py-2 sm:py-3 border-t border-border bg-muted/20">
                <p className="text-[10px] sm:text-xs text-center text-muted-foreground">
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
