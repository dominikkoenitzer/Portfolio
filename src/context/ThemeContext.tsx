
import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react'
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
}

const initialState: ThemeProviderState = {
  theme: 'system',
  setTheme: () => null,
  themeColors: themes.light,
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
  const [themeColors, setThemeColors] = useState<ThemeColors>(themes.light)

  const getSystemTheme = (): 'light' | 'dark' => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }

  const resolveTheme = useCallback((currentTheme: Theme): keyof typeof themes => {
    if (currentTheme === 'system') {
      return getSystemTheme()
    }
    return currentTheme
  }, [])

  // Helper function to apply background color to all elements
  const applyBackgroundColor = (bgColor: string, themeBackground: string) => {
    const root = window.document.documentElement
    const body = window.document.body
    const rootElement = document.getElementById('root')
    const mainElement = document.querySelector('main')
    const allSections = document.querySelectorAll('section')
    const overscrollElement = document.getElementById('overscroll-background')
    
    root.style.backgroundColor = bgColor
    body.style.backgroundColor = bgColor
    if (rootElement) rootElement.style.backgroundColor = bgColor
    if (mainElement) (mainElement as HTMLElement).style.backgroundColor = bgColor
    
    // Update all sections
    allSections.forEach(section => {
      (section as HTMLElement).style.backgroundColor = bgColor
    })
    
    // Update overscroll background element directly (both layers)
    if (overscrollElement) {
      overscrollElement.style.backgroundColor = bgColor
      // Also update any extended layers
      const extendedLayers = document.querySelectorAll('[id="overscroll-background"] + div')
      extendedLayers.forEach(layer => {
        (layer as HTMLElement).style.backgroundColor = bgColor
      })
    }
    
    // Update CSS variable for other uses
    root.style.setProperty('--background', themeBackground)
  }

  useEffect(() => {
    const root = window.document.documentElement
    const resolvedTheme = resolveTheme(theme)
    const selectedTheme = getTheme(resolvedTheme)
    const bgColor = `hsl(${selectedTheme.background})`
    
    // Apply theme immediately
    applyTheme(selectedTheme)
    setThemeColors(selectedTheme)
    applyBackgroundColor(bgColor, selectedTheme.background)
    
    // Remove old theme classes and add new one
    Object.keys(themes).forEach(themeName => {
      root.classList.remove(themeName)
    })
    root.classList.add(resolvedTheme)

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = () => {
      if (theme === 'system') {
        const newResolvedTheme = getSystemTheme()
        const newTheme = getTheme(newResolvedTheme)
        const bgColor = `hsl(${newTheme.background})`
        
        applyTheme(newTheme)
        setThemeColors(newTheme)
        applyBackgroundColor(bgColor, newTheme.background)
        
        const root = window.document.documentElement
        Object.keys(themes).forEach(themeName => {
          root.classList.remove(themeName)
        })
        root.classList.add(newResolvedTheme)
      }
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [theme, resolveTheme])

  const handleSetTheme = (newTheme: Theme) => {
    localStorage.setItem(storageKey, newTheme)
    setTheme(newTheme)
  }

  const value = {
    theme,
    setTheme: handleSetTheme,
    themeColors,
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
