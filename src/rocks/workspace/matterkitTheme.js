import { createTheme, defaultTheme } from 'react-matterkit';

const matterkitTheme = createTheme();
export default matterkitTheme;

defaultTheme.set(matterkitTheme);

// Use CSS variables for colors to maintain consistency
matterkitTheme.extendSource('colors', () => ({
  primary: 'var(--primary-color)',
  secondary: 'var(--secondary-color)',
  background: 'var(--background-color)',
  surface: 'var(--surface-color)',
  error: 'var(--error-color)',
  textPrimary: 'var(--text-primary)',
  textSecondary: 'var(--text-secondary)',
  
  // Additional colors for specific use cases
  selected: 'var(--primary-color)',
  hover: 'var(--secondary-color)',
  divider: 'var(--secondary-color)',
  
  // Keep some of the existing color palette for backward compatibility
  blue: 'var(--primary-color)',
  green: '#2ECC40',
  red: 'var(--error-color)',
  gray: 'var(--secondary-color)',
  white: 'var(--background-color)',
  black: 'var(--text-primary)',
}));

matterkitTheme.extendSource('spacing', () => ({
  unit: 8,
  small: 8,
  medium: 16,
  large: 24,
  xlarge: 32,
}));

matterkitTheme.extendSource('typography', () => ({
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
}));

matterkitTheme.extendSource('config', () => ({
  lineHeight: 21,
  borderRadius: '4px',
  transition: '0.2s ease-in-out',
}));
