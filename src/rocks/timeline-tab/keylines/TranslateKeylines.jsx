import React from 'react';
import PropTypes from 'prop-types';
import styles from './Keyline.module.css';

const TranslateKeylines = ({ timeline, children }) => {
  const style = {
    transform: `translateX(${timeline.start * timeline.pxpms}px)`,
  };
  
  return (
    <g className={styles.translateContainer} style={style}>
      {children}
    </g>
  );
};

TranslateKeylines.propTypes = {
  timeline: PropTypes.shape({
    start: PropTypes.number.isRequired,
    pxpms: PropTypes.number.isRequired,
  }).isRequired,
  children: PropTypes.node,
};

export default React.memo(TranslateKeylines);
