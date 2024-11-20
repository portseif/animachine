import { useCallback } from 'react';
import { useTimelineState } from './useTimelineState';

export const useKeylines = (timeline) => {
  const config = BETON.require('config');
  
  const handleDeleteSelectedKeys = useCallback(() => {
    timeline.removeSelectedKeys();
  }, [timeline]);

  const getMenuItems = useCallback(() => {
    return [
      {
        label: 'delete selected keys',
        onClick: handleDeleteSelectedKeys,
      },
    ];
  }, [handleDeleteSelectedKeys]);

  const calculateKeylinePositions = useCallback((tracks) => {
    const height = config.size;
    const positions = [];
    let currentPosition = 0;

    const processKeyHolder = (keyHolder) => {
      positions.push({
        keyHolder,
        top: currentPosition,
        height,
      });
      currentPosition += height;
    };

    tracks.forEach(track => {
      processKeyHolder(track);
      if (track.openInTimeline) {
        track.params.forEach(param => processKeyHolder(param));
      }
    });

    return positions;
  }, [config.size]);

  return {
    getMenuItems,
    calculateKeylinePositions,
  };
};
