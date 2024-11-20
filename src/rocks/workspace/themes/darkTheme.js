import { baseTheme } from './baseTheme';

export const darkTheme = {
  ...baseTheme,
  colors: {
    ...baseTheme.colors,
    primary: '#90caf9',
    primaryLight: '#a6d4fa',
    primaryDark: '#648dae',
    secondary: '#f48fb1',
    secondaryLight: '#f6a5c0',
    secondaryDark: '#aa647b',
    background: '#121212',
    surface: '#1e1e1e',
    text: '#ffffff',
    textSecondary: 'rgba(255, 255, 255, 0.7)',
    disabled: 'rgba(255, 255, 255, 0.38)',
    border: 'rgba(255, 255, 255, 0.12)',
    hover: 'rgba(255, 255, 255, 0.04)',
  },

  shadows: {
    ...baseTheme.shadows,
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.25)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.26)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.25)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.24)',
  },

  // CSS variables that will be applied to :root
  variables: {
    ...baseTheme.variables,
    'color-primary': '#90caf9',
    'color-primary-light': '#a6d4fa',
    'color-primary-dark': '#648dae',
    'color-secondary': '#f48fb1',
    'color-secondary-light': '#f6a5c0',
    'color-secondary-dark': '#aa647b',
    'color-background': '#121212',
    'color-surface': '#1e1e1e',
    'color-text': '#ffffff',
    'color-text-secondary': 'rgba(255, 255, 255, 0.7)',
    'color-disabled': 'rgba(255, 255, 255, 0.38)',
    'color-border': 'rgba(255, 255, 255, 0.12)',
    'color-hover': 'rgba(255, 255, 255, 0.04)',
  },
};
