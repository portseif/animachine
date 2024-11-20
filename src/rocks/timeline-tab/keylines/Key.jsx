import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { useTimelineState } from '../hooks/useTimelineState';
import { useKey } from '../hooks/useKey';
import styles from './Key.module.css';

const Key = ({ _key: key, height, colors, isGroup }) => {
  const timeline = useTimelineState();
  const { position, color } = useKey(key, timeline);
  const selectedColor = colors[color];

  if (isGroup) {
    return (
      <circle
        className={styles.keyCircle}
        fill={selectedColor}
        cx={position}
        cy={height / 2}
        r={2}
      />
    );
  }

  return (
    <line
      className={styles.keyLine}
      x1={position}
      y1={0}
      x2={position}
      y2={height}
      stroke={selectedColor}
    />
  );
};

Key.propTypes = {
  _key: PropTypes.shape({
    time: PropTypes.number.isRequired,
    selected: PropTypes.bool.isRequired,
    parent: PropTypes.func.isRequired,
  }).isRequired,
  height: PropTypes.number.isRequired,
  colors: PropTypes.shape({
    selected: PropTypes.string.isRequired,
    normal: PropTypes.string.isRequired,
  }).isRequired,
  isGroup: PropTypes.bool,
};

export default memo(Key);
