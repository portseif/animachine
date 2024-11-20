import { useMemo } from 'react';

export const useEase = (ease, timeline, height) => {
  return useMemo(() => {
    const easer = ease.easer;
    const keyTimes = ease.parent('Param').keyTimes;
    const endTime = ease.parent('Key').time;

    // Check if it's the first key (no previous key)
    if (endTime === keyTimes[0]) {
      return { isHidden: true };
    }

    const startTime = keyTimes[keyTimes.indexOf(endTime) - 1];
    const startPosition = timeline.pxpms * startTime;
    const endPosition = timeline.pxpms * endTime;
    const width = endPosition - startPosition;

    // Check if there's no width
    if (width === 0) {
      return { isHidden: true };
    }

    // Generate points for the ease curve
    let points = '';
    for (let i = 0; i < width; ++i) {
      const x = startPosition + i;
      const y = height - height * easer.getRatio(i/width);
      points += `${x},${y} `;
    }

    return {
      isHidden: false,
      points,
    };
  }, [ease, timeline.pxpms, height]);
};
