
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

  const resolveTheme = useCallback((currentTheme: Theme): keyof typeof themes => {
    if (currentTheme === 'system') {
      return getSystemTheme()
    }
    return currentTheme
  }, [])

  useEffect(() => {
    const root = window.document.documentElement
    const body = window.document.body
    const rootElement = document.getElementById('root')
    const mainElement = document.querySelector('main')
    const resolvedTheme = resolveTheme(theme)
    const selectedTheme = getTheme(resolvedTheme)
    
    // Apply background color IMMEDIATELY to prevent any flash of wrong color
    const bgColor = `hsl(${selectedTheme.background})`
    root.style.backgroundColor = bgColor
    body.style.backgroundColor = bgColor
    if (rootElement) {
      rootElement.style.backgroundColor = bgColor
    }
    if (mainElement) {
      (mainElement as HTMLElement).style.backgroundColor = bgColor
    }
    
    // Add smooth transition class
    root.classList.add('theme-transitioning')
    setIsTransitioning(true)
    
    // Apply theme with a slight delay for smooth transition
    setTimeout(() => {
      applyTheme(selectedTheme)
      setThemeColors(selectedTheme)
      
      // Ensure background color is still set (in case theme application changed it)
      root.style.backgroundColor = bgColor
      body.style.backgroundColor = bgColor
      if (rootElement) {
        rootElement.style.backgroundColor = bgColor
      }
      if (mainElement) {
        (mainElement as HTMLElement).style.backgroundColor = bgColor
      }
      
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
        const root = window.document.documentElement
        const body = window.document.body
        const rootElement = document.getElementById('root')
        const mainElement = document.querySelector('main')
        const newResolvedTheme = getSystemTheme()
        const newTheme = getTheme(newResolvedTheme)
        applyTheme(newTheme)
        setThemeColors(newTheme)
        
        // Apply background color to html, body, root, and main
        const bgColor = `hsl(${newTheme.background})`
        root.style.backgroundColor = bgColor
        body.style.backgroundColor = bgColor
        if (rootElement) {
          rootElement.style.backgroundColor = bgColor
        }
        if (mainElement) {
          (mainElement as HTMLElement).style.backgroundColor = bgColor
        }
      }
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [theme, resolveTheme])

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
