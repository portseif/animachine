import { useMemo } from 'react';
import { convertTimeToPosition } from '../utils';

export const useKey = (key, timeline) => {
  const position = useMemo(() => {
    const pos = parseInt(timeline.pxpms * key.time) + 0.5;
    return isNaN(pos) ? 0 : pos;
  }, [timeline.pxpms, key.time]);

  const color = useMemo(() => {
    return key.selected ? 'selected' : 'normal';
  }, [key.selected]);

  return {
    position,
    color,
  };
};
