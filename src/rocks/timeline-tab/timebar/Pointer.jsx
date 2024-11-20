import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { getVisibleTime } from '../utils';
import styles from './Pointer.module.css';

const Pointer = ({ radius = 5, timeline }) => {
  const { start, currentTime, width } = timeline;
  const visibleTime = getVisibleTime(timeline);
  const position = ((start + currentTime) / visibleTime) * width;

  return (
    <div 
      className={styles.container}
      style={{
        bottom: `${2 * radius}px`,
        transform: `translate(${position}px)`,
      }}
    >
      <div 
        className={styles.pointer}
        style={{
          left: `${-radius}px`,
          width: `${2 * radius}px`,
          height: `${2 * radius}px`,
          borderRadius: `${radius}px`,
        }}
      />
    </div>
  );
};

Pointer.propTypes = {
  timeline: PropTypes.shape({
    start: PropTypes.number.isRequired,
    pxpms: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
    currentTime: PropTypes.number.isRequired,
  }).isRequired,
  radius: PropTypes.number,
};

export default memo(Pointer);
