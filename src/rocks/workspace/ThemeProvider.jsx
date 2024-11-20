import React from 'react';
import PropTypes from 'prop-types';
import { ThemeContext } from './ThemeContext';
import matterkitTheme from './matterkitTheme';

export const ThemeProvider = ({ children }) => {
  // Here we could add theme switching logic if needed in the future
  return (
    <ThemeContext.Provider value={matterkitTheme}>
      {children}
    </ThemeContext.Provider>
  );
};

ThemeProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ThemeProvider;
