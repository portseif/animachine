import React, { useState, useCallback, memo } from 'react';
import PropTypes from 'prop-types';
import { useDrag } from 'react-dnd';
import { getTheme } from 'react-matterkit';
import styles from './Navigator.module.css';

const useNavigatorDrag = (dragMode, timeline, onDrag) => {
  return useDrag({
    type: `NAVIGATOR_${dragMode.toUpperCase()}`,
    item: { type: `NAVIGATOR_${dragMode.toUpperCase()}`, timeline },
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    }),
    begin: (monitor) => {
      const { start, visibleTime, pxpms } = timeline;
      return { start, visibleTime, pxpms };
    },
    drag: (item, monitor) => {
      const { x: xInit } = monitor.getInitialClientOffset();
      const { x: xNow } = monitor.getClientOffset();
      const scale = timeline.width / timeline.length;
      const move = (xNow - xInit) / scale;
      const initial = monitor.getItem();

      onDrag(dragMode, move, initial);
    },
  });
};

const Navigator = ({ timeline }) => {
  const [hover, setHover] = useState(false);
  const colors = getTheme().getStyle('colors');

  const handleDrag = useCallback((dragMode, move, initial) => {
    const start = initial.start - move;

    if (dragMode === 'move') {
      timeline.start = start;
    } else if (dragMode === 'start') {
      const visibleTime = initial.visibleTime - move;
      timeline.start = start;
      timeline.pxpms = timeline.width / visibleTime;
    } else if (dragMode === 'end') {
      const { currentTime, pxpms } = timeline;
      const visibleTime = initial.visibleTime + move;
      timeline.pxpms = timeline.width / visibleTime;

      const mdPos = (initial.start + currentTime) * initial.pxpms;
      timeline.start = -((currentTime * pxpms) - mdPos) / pxpms;
    }
  }, [timeline]);

  const [, moveDragRef] = useNavigatorDrag('move', timeline, handleDrag);
  const [, startDragRef] = useNavigatorDrag('start', timeline, handleDrag);
  const [, endDragRef] = useNavigatorDrag('end', timeline, handleDrag);

  const { start, length, width, startMargin } = timeline;
  const scale = width / length;

  const containerStyle = {
    left: `${(-start * scale) + startMargin}px`,
    width: `${timeline.visibleTime * scale}px`,
    transform: `scaleY(${hover ? 1 : 0.56})`,
    backgroundColor: hover ? colors.grey2 : colors.grey3,
  };

  const pointerStyle = {
    backgroundColor: hover === 'move' ? colors.blue : 'transparent',
  };

  const renderHandler = (side, ref) => (
    <div
      ref={ref}
      className={side === 'start' ? styles.handlerStart : styles.handlerEnd}
      style={{
        backgroundColor: hover === side ? colors.blue : 'transparent',
      }}
      onMouseEnter={() => setHover(side)}
      onMouseLeave={() => setHover(false)}
    />
  );

  return (
    <div
      className={styles.container}
      style={containerStyle}
      onMouseEnter={() => setHover('move')}
      onMouseLeave={() => setHover(false)}
    >
      <div ref={moveDragRef} className={styles.pointer} style={pointerStyle} />
      {renderHandler('start', startDragRef)}
      {renderHandler('end', endDragRef)}
    </div>
  );
};

Navigator.propTypes = {
  timeline: PropTypes.shape({
    start: PropTypes.number.isRequired,
    pxpms: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
    length: PropTypes.number.isRequired,
    startMargin: PropTypes.number.isRequired,
    visibleTime: PropTypes.number.isRequired,
    currentTime: PropTypes.number.isRequired,
  }).isRequired,
};

export default memo(Navigator);
