import { useCallback } from 'react';
import { useDrag } from 'react-dnd';
import { getTheme } from 'react-matterkit';
import {
  convertPositionToTime,
  closestNumber
} from '../utils';

export const useKeyline = (keyHolder, timeline) => {
  const getMouseTime = useCallback((position) => {
    return convertPositionToTime(timeline, position);
  }, [timeline]);

  const colors = getTheme().getStyle('colors');
  const themeColors = {
    selected: colors.selected,
    normal: colors.grey2,
    border: colors.bg,
    red: colors.red,
    ease: 'rgba(225,225,225,.23)'
  };

  const [{ isDragging }, dragRef] = useDrag({
    type: 'KEYLINE',
    item: { type: 'KEYLINE', keyHolder },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    begin: (monitor) => {
      const mouseTime = getMouseTime(monitor.getClientOffset().x);
      const time = closestNumber(keyHolder.keyTimes, mouseTime);
      
      // prevent dragging if the mouse is not close enough to the closest key
      if ((Math.abs(mouseTime - time) * timeline.pxpms) > 4) {
        return;
      }

      const endFlag = timeline.history.startFlag();
      const shiftKey = monitor.getLastEvent().shiftKey;

      if (!shiftKey) {
        timeline.deselectAllKeys();
      }

      if (shiftKey) {
        keyHolder.toggleKeysSelectionAtTime(time);
      } else {
        keyHolder.selectKeysAtTime(time);
      }

      return {
        endFlag,
        lastMouseTime: mouseTime,
      };
    },
    drag: (item, monitor) => {
      const mouseTime = getMouseTime(monitor.getClientOffset().x);
      const offset = mouseTime - item.lastMouseTime;

      item.lastMouseTime = mouseTime;
      timeline.translateSelectedKeys(offset);
    },
    end: (item) => {
      if (item?.endFlag) {
        item.endFlag();
      }
    },
  });

  const handleClick = useCallback((event) => {
    const { state } = BETON.require('project-manager');
    const mouseTime = getMouseTime(event.clientX);
    const nextKeyTime = keyHolder.keyTimes.find(time => time > mouseTime);
    
    if (!nextKeyTime) return;

    timeline.history.wrap(() => {
      timeline.deselectAllKeys();
      keyHolder.selectKeysAtTime(nextKeyTime);

      timeline.inlineEaseEditor = {
        top: keyHolder.top,
        height: keyHolder.height,
        targetKey: state.selectedKeys[0],
        controlledEases: state.selectedKeys.map(key => key.ease),
      };
    });
  }, [keyHolder, timeline, getMouseTime]);

  return {
    dragRef,
    isDragging,
    themeColors,
    handleClick,
  };
};
