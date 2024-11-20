import React from 'react';
import { useDrag } from 'react-dnd';
import { Button } from 'react-matterkit';
import { useAfflatus } from 'afflatus';
import state from './state';
import * as actions from './actions';

const LaunchButton = () => {
  const { launchButtonX: x, launchButtonY: y } = state;
  useAfflatus();

  const [, dragRef] = useDrag({
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
      tooltip="show animachine or drag this button away"
      label="animachine"
      onClick={handleClick}
      style={{
        pointerEvents: 'auto',
        transform: `translate(${x}px, ${y}px)`,
      }}
    />
  );
};

export default LaunchButton;
