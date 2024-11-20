import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { ContextMenu } from 'react-matterkit';
import { useTimelineState } from '../hooks/useTimelineState';
import { useKeylines } from '../hooks/useKeylines';
import Keyline from './Keyline';
import PointerLine from './PointerLine';
import styles from './Keylines.module.css';

const Keylines = ({ style }) => {
  const timeline = useTimelineState();
  const { getMenuItems, calculateKeylinePositions } = useKeylines(timeline);
  const keylinePositions = calculateKeylinePositions(timeline.tracks);

  return (
    <ContextMenu items={getMenuItems()}>
      <div className={styles.container} style={style}>
        {keylinePositions.map(({ keyHolder, top, height }) => (
          <div key={keyHolder.uid} className={styles.keylineWrapper}>
            <Keyline
              keyHolder={keyHolder}
              top={top}
              height={height}
            />
          </div>
        ))}
        <div className={styles.pointerLineContainer}>
          <PointerLine timeline={timeline} />
        </div>
      </div>
    </ContextMenu>
  );
};

Keylines.propTypes = {
  style: PropTypes.object,
};

export default memo(Keylines);
