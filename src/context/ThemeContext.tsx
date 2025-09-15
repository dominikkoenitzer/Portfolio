
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { themes, applyTheme, getTheme, type ThemeColors } from '@/lib/themes'

type Theme = 'light' | 'dark' | 'system' | 'solarpunk' | 'cyberpunk' | 'cloud' | 'forest' | 'amethyst' | 'vintage' | 'coffee'

type ThemeProviderProps = {
  children: ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
  themeColors: ThemeColors
  isTransitioning: boolean
}

const initialState: ThemeProviderState = {
  theme: 'system',
  setTheme: () => null,
  themeColors: themes.light,
  isTransitioning: false,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'portfolio-theme',
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  )
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [themeColors, setThemeColors] = useState<ThemeColors>(themes.light)

  const getSystemTheme = (): 'light' | 'dark' => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }

  const resolveTheme = (currentTheme: Theme): keyof typeof themes => {
    if (currentTheme === 'system') {
      return getSystemTheme()
    }
    return currentTheme
  }

  useEffect(() => {
    const root = window.document.documentElement
    const resolvedTheme = resolveTheme(theme)
    const selectedTheme = getTheme(resolvedTheme)
    
    // Add smooth transition class
    root.classList.add('theme-transitioning')
    setIsTransitioning(true)
    
    // Apply theme with a slight delay for smooth transition
    setTimeout(() => {
      applyTheme(selectedTheme)
      setThemeColors(selectedTheme)
      
      // Remove old theme classes
      Object.keys(themes).forEach(themeName => {
        root.classList.remove(themeName)
      })
      
      // Add new theme class
      root.classList.add(resolvedTheme)
      
      // Remove transition class after transition completes
      setTimeout(() => {
        root.classList.remove('theme-transitioning')
        setIsTransitioning(false)
      }, 300)
    }, 50)

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = () => {
      if (theme === 'system') {
        const newResolvedTheme = getSystemTheme()
        const newTheme = getTheme(newResolvedTheme)
        applyTheme(newTheme)
        setThemeColors(newTheme)
      }
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [theme])

  const handleSetTheme = (newTheme: Theme) => {
    setIsTransitioning(true)
    localStorage.setItem(storageKey, newTheme)
    setTheme(newTheme)
    
    // Dispatch custom event for theme change
    window.dispatchEvent(new CustomEvent('themeChange', { 
      detail: { 
        theme: newTheme, 
        colors: getTheme(resolveTheme(newTheme))
      } 
    }))
  }

  const value = {
    theme,
    setTheme: handleSetTheme,
    themeColors,
    isTransitioning,
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)

  if (context === undefined)
    throw new Error('useTheme must be used within a ThemeProvider')

  return context
}
