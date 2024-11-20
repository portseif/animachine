import React, { createContext, useContext, useMemo } from 'react';
import { baseTheme } from './themes/baseTheme';
import { darkTheme } from './themes/darkTheme';

// Create the theme context with a default value
const ThemeContext = createContext(null);

// Define theme types
export const themeTypes = {
  LIGHT: 'light',
  DARK: 'dark',
};

// Define themes
const themes = {
  [themeTypes.LIGHT]: baseTheme,
  [themeTypes.DARK]: darkTheme,
};

/**
 * Custom hook that provides access to the theme
 * Combines both CSS variables and matterkit theme values
 */
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

/**
 * Theme provider component that wraps the app and provides the theme context
 */
export const ThemeProvider = ({ children, initialTheme = themeTypes.LIGHT }) => {
  const theme = useMemo(() => {
    const selectedTheme = themes[initialTheme];
    
    // Apply CSS variables to :root
    Object.entries(selectedTheme.variables).forEach(([key, value]) => {
      document.documentElement.style.setProperty(`--${key}`, value);
    });
    
    return {
      ...selectedTheme,
      // Theme utilities
      spacing: (multiplier = 1) => `${multiplier * 8}px`,
      fontSize: (size) => selectedTheme.typography[size] || size,
      color: (colorName) => selectedTheme.colors[colorName] || colorName,
      
      // Animation utilities
      transition: (properties, duration = 'normal') => {
        const durationValue = selectedTheme.transitions.durations[duration] || duration;
        return properties
          .split(',')
          .map(prop => `${prop.trim()} ${durationValue} ${selectedTheme.transitions.easing}`)
          .join(', ');
      },
      
      // Shadow utilities
      shadow: (level) => selectedTheme.shadows[level] || 'none',
      
      // Breakpoint utilities
      mediaQuery: (breakpoint) => `@media (min-width: ${selectedTheme.breakpoints[breakpoint]}px)`,
      
      // Component-specific theme getters
      getTimelineStyles: () => ({
        background: selectedTheme.colors.background,
        color: selectedTheme.colors.text,
        borderColor: selectedTheme.colors.border,
      }),
      
      getKeylineStyles: () => ({
        background: selectedTheme.colors.surface,
        borderColor: selectedTheme.colors.border,
        selectedColor: selectedTheme.colors.primary,
        hoverColor: selectedTheme.colors.hover,
      }),
    };
  }, [initialTheme]);

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;
