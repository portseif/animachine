import React, { useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useDrag } from 'react-dnd';
import { useTheme } from '../workspace/ThemeContext';
import styles from './Timeline.module.css';

const Keyframe = ({
  keyframe,
  pxPerMs,
  timeRange,
  isSelected,
  onClick,
  onDoubleClick,
  onContextMenu,
  onDrag,
  onDelete,
}) => {
  const theme = useTheme();
  const dragRef = useRef(null);

  // Calculate keyframe position
  const position = (keyframe.time - timeRange.start) * pxPerMs;

  // Setup drag and drop
  const [{ isDragging }, drag] = useDrag({
    type: 'KEYFRAME',
    item: { id: keyframe.id, type: 'KEYFRAME' },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult();
      if (dropResult) {
        const delta = monitor.getDifferenceFromInitialOffset();
        onDrag?.(keyframe.id, delta.x);
      }
    },
  });

  // Connect drag ref
  drag(dragRef);

  // Handle keyboard events
  const handleKeyDown = useCallback((event) => {
    if (event.key === 'Delete' || event.key === 'Backspace') {
      onDelete?.();
    }
  }, [onDelete]);

  return (
    <div
      ref={dragRef}
      className={classNames(styles.keyframe, {
        [styles.selected]: isSelected,
        [styles.dragging]: isDragging,
      })}
      style={{
        '--keyframe-color': theme.color(isSelected ? 'primary' : 'keyframe'),
        transform: `translateX(${position}px)`,
      }}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      onContextMenu={onContextMenu}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`Keyframe at ${keyframe.time}ms`}
    >
      <div className={styles.keyframeHandle} />
      {isSelected && (
        <div className={styles.keyframeValue}>
          {typeof keyframe.value === 'number' 
            ? keyframe.value.toFixed(2) 
            : String(keyframe.value)
          }
        </div>
      )}
    </div>
  );
};

Keyframe.propTypes = {
  keyframe: PropTypes.shape({
    id: PropTypes.string.isRequired,
    time: PropTypes.number.isRequired,
    value: PropTypes.any.isRequired,
  }).isRequired,
  pxPerMs: PropTypes.number.isRequired,
  timeRange: PropTypes.shape({
    start: PropTypes.number.isRequired,
    end: PropTypes.number.isRequired,
  }).isRequired,
  isSelected: PropTypes.bool,
  onClick: PropTypes.func,
  onDoubleClick: PropTypes.func,
  onContextMenu: PropTypes.func,
  onDrag: PropTypes.func,
  onDelete: PropTypes.func,
};

export default React.memo(Keyframe);
