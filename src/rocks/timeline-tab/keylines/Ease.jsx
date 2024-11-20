import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { useTimelineState } from '../hooks/useTimelineState';
import { useEase } from '../hooks/useEase';
import styles from './Ease.module.css';

const Ease = ({ ease, height, colors }) => {
  const timeline = useTimelineState();
  const { isHidden, points } = useEase(ease, timeline, height);

  if (isHidden) {
    return <g className={styles.hidden} />;
  }

  return (
    <polyline
      className={styles.ease}
      points={points}
      stroke={colors.ease}
    />
  );
};

Ease.propTypes = {
  ease: PropTypes.shape({
    easer: PropTypes.shape({
      getRatio: PropTypes.func.isRequired,
    }).isRequired,
    parent: PropTypes.func.isRequired,
  }).isRequired,
  height: PropTypes.number.isRequired,
  colors: PropTypes.shape({
    ease: PropTypes.string.isRequired,
  }).isRequired,
};

export default memo(Ease);
