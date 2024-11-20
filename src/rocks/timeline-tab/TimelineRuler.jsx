import React, { useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useTheme } from '../workspace/ThemeContext';
import styles from './Timeline.module.css';

const TimelineRuler = ({
  visibleTimeStart,
  visibleTimeEnd,
  pxPerMs,
  height = 24,
}) => {
  const theme = useTheme();

  const getTimeMarkers = useCallback(() => {
    const markers = [];
    const duration = visibleTimeEnd - visibleTimeStart;
    
    // Calculate appropriate interval based on zoom level
    let interval;
    if (pxPerMs >= 1) { // Very zoomed in - show 100ms intervals
      interval = 100;
    } else if (pxPerMs >= 0.1) { // Show 1s intervals
      interval = 1000;
    } else if (pxPerMs >= 0.01) { // Show 5s intervals
      interval = 5000;
    } else { // Show 10s intervals
      interval = 10000;
    }

    // Calculate start and end times aligned to intervals
    const startTime = Math.floor(visibleTimeStart / interval) * interval;
    const endTime = Math.ceil(visibleTimeEnd / interval) * interval;

    for (let time = startTime; time <= endTime; time += interval) {
      const isMajor = time % (interval * 5) === 0;
      const position = (time - visibleTimeStart) * pxPerMs;

      markers.push({
        time,
        position,
        isMajor,
      });
    }

    return markers;
  }, [visibleTimeStart, visibleTimeEnd, pxPerMs]);

  const formatTime = useCallback((ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const milliseconds = ms % 1000;

    if (pxPerMs >= 1) {
      // Show detailed time when very zoomed in
      return `${seconds}.${milliseconds.toString().padStart(3, '0')}`;
    } else if (pxPerMs >= 0.1) {
      // Show seconds when moderately zoomed
      return `${seconds}s`;
    } else {
      // Show minutes:seconds when zoomed out
      return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
  }, [pxPerMs]);

  const markers = useMemo(() => getTimeMarkers(), [getTimeMarkers]);

  return (
    <div 
      className={styles.ruler}
      style={{ 
        height,
        '--ruler-color': theme.color('border'),
        '--ruler-text-color': theme.color('textSecondary'),
      }}
    >
      <div className={styles.rulerMarks}>
        {markers.map(({ time, position, isMajor }) => (
          <div
            key={time}
            className={classNames(styles.rulerMark, {
              [styles.major]: isMajor,
            })}
            style={{
              left: `${position}px`,
              height: isMajor ? '100%' : '50%',
            }}
          >
            {isMajor && (
              <div 
                className={styles.rulerLabel}
                style={{ transform: `translateX(-50%)` }}
              >
                {formatTime(time)}
              </div>
            )}
          </div>
        ))}
      </div>
      
      {/* Current time indicator */}
      <div
        className={styles.currentTimeIndicator}
        style={{
          left: `${(0 - visibleTimeStart) * pxPerMs}px`,
        }}
      />
    </div>
  );
};

TimelineRuler.propTypes = {
  visibleTimeStart: PropTypes.number.isRequired,
  visibleTimeEnd: PropTypes.number.isRequired,
  pxPerMs: PropTypes.number.isRequired,
  height: PropTypes.number,
};

export default React.memo(TimelineRuler);
