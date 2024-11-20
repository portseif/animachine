import React from 'react';
import { useDrag } from 'react-dnd';
import { Button } from 'react-matterkit';
import { useAfflatus } from 'afflatus';
import { useTheme } from './ThemeContext';
import state from './state';
import * as actions from './actions';
import styles from './LaunchButton.module.css';

const LaunchButton = () => {
  const { launchButtonX: x, launchButtonY: y } = state;
  const theme = useTheme();
  useAfflatus();

  const [{ isDragging }, dragRef] = useDrag({
    type: 'LAUNCH_BUTTON',
    item: { type: 'LAUNCH_BUTTON', x, y },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    end: (item, monitor) => {
      const { x: deltaX, y: deltaY } = monitor.getDifferenceFromInitialOffset() || { x: 0, y: 0 };
      actions.move({
        x: item.x + deltaX,
        y: item.y + deltaY,
      });
    },
  });

  const handleClick = () => {
    actions.uncollapse();
  };

  return (
    <Button
      ref={dragRef}
      className={styles.launchButton}
      tooltip="show animachine or drag this button away"
      label={
        <div className={styles.icon}>
          <span>🎬</span>
          <span>animachine</span>
        </div>
      }
      onClick={handleClick}
      style={{
        transform: `translate(${x}px, ${y}px)`,
        opacity: isDragging ? 0.5 : 1,
        cursor: isDragging ? 'grabbing' : 'grab',
      }}
    />
  );
};

export default LaunchButton;
