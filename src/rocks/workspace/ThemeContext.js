import { createContext, useContext } from 'react';

// Create the theme context with a default value
export const ThemeContext = createContext(null);

/**
 * Custom hook that provides access to the theme
 * Combines both CSS variables and matterkit theme values
 */
export const useTheme = () => {
  const theme = useContext(ThemeContext);
  if (!theme) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  // Enhanced theme object that combines CSS variables and matterkit theme
  return {
    // Direct access to the matterkit theme
    matterkit: theme,

    // Convenient getters for commonly used values
    colors: {
      primary: 'var(--primary-color)',
      secondary: 'var(--secondary-color)',
      background: 'var(--background-color)',
      surface: 'var(--surface-color)',
      error: 'var(--error-color)',
      textPrimary: 'var(--text-primary)',
      textSecondary: 'var(--text-secondary)',
    },

    spacing: {
      unit: 8,
      small: 8,
      medium: 16,
      large: 24,
      xlarge: 32,
    },

    typography: {
      fontFamily: `-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
        'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif`,
      fontSize: {
        small: '0.875rem',
        medium: '1rem',
        large: '1.25rem',
        xlarge: '1.5rem',
      },
      fontWeight: {
        regular: 400,
        medium: 500,
        bold: 700,
      },
      lineHeight: {
        small: 1.2,
        medium: 1.5,
        large: 1.8,
      },
    },

    // Helper functions
    getColor: (colorName) => theme.getStyle('colors')[colorName],
    getSpacing: (size) => theme.getStyle('spacing')[size],
    getFontSize: (size) => theme.getStyle('typography').fontSize[size],
  };
};
