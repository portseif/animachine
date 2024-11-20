import React from 'react';
import PropTypes from 'prop-types';
import { useDragLayer } from 'react-dnd';
import styles from './Timeline.module.css';

const TrackDragLayer = () => {
  const { isDragging, item, currentOffset } = useDragLayer((monitor) => ({
    item: monitor.getItem(),
    currentOffset: monitor.getSourceClientOffset(),
    isDragging: monitor.isDragging(),
  }));

  if (!isDragging || !currentOffset) {
    return null;
  }

  return (
    <div className={styles.trackDragLayer}>
      <div
        className={styles.trackDragPreview}
        style={{
          transform: `translate(0, ${currentOffset.y}px)`,
        }}
      >
        <div className={styles.trackHeader}>
          <span className={styles.trackName}>{item.name}</span>
        </div>
      </div>
    </div>
  );
};

export default TrackDragLayer;
