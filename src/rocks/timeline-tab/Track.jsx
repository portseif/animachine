import React, { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useTheme } from '../workspace/ThemeContext';
import Keyframe from './Keyframe';
import styles from './Timeline.module.css';

const Track = ({
  track,
  isSelected,
  timeRange,
  pxPerMs,
  onClick,
  onKeyframeUpdate,
  onKeyframeDelete,
}) => {
  const theme = useTheme();

  // Filter visible keyframes for performance
  const visibleKeyframes = useMemo(() => {
    return track.keyframes.filter(keyframe => 
      keyframe.time >= timeRange.start - 1000 && // Add 1s buffer on each side
      keyframe.time <= timeRange.end + 1000
    );
  }, [track.keyframes, timeRange]);

  // Handle keyframe drag
  const handleKeyframeDrag = useCallback((keyframeId, deltaX) => {
    const deltaTime = deltaX / pxPerMs;
    onKeyframeUpdate?.(keyframeId, { time: deltaTime });
  }, [pxPerMs, onKeyframeUpdate]);

  // Handle keyframe click
  const handleKeyframeClick = useCallback((event, keyframe) => {
    event.stopPropagation(); // Prevent track selection
    // Handle keyframe selection logic here
  }, []);

  // Handle keyframe double click
  const handleKeyframeDoubleClick = useCallback((event, keyframe) => {
    event.stopPropagation();
    // Handle keyframe value editing here
  }, []);

  // Handle keyframe context menu
  const handleKeyframeContextMenu = useCallback((event, keyframe) => {
    event.preventDefault();
    event.stopPropagation();
    // Show context menu with options like delete, copy, etc.
  }, []);

  return (
    <div
      className={classNames(styles.track, {
        [styles.selected]: isSelected,
      })}
      onClick={onClick}
      style={{
        '--track-color': theme.color(isSelected ? 'primary' : 'border'),
      }}
    >
      <div className={styles.trackHeader}>
        <span className={styles.trackName}>{track.name}</span>
        <div className={styles.trackControls}>
          <button
            className={styles.trackButton}
            onClick={(e) => {
              e.stopPropagation();
              // Toggle track visibility
            }}
            title="Toggle visibility"
          >
            <span className={styles.icon}>visibility</span>
          </button>
          <button
            className={styles.trackButton}
            onClick={(e) => {
              e.stopPropagation();
              // Toggle track lock
            }}
            title="Toggle lock"
          >
            <span className={styles.icon}>lock_open</span>
          </button>
        </div>
      </div>

      <div className={styles.trackContent}>
        {visibleKeyframes.map((keyframe) => (
          <Keyframe
            key={keyframe.id}
            keyframe={keyframe}
            pxPerMs={pxPerMs}
            timeRange={timeRange}
            isSelected={false} // Add keyframe selection state
            onClick={(e) => handleKeyframeClick(e, keyframe)}
            onDoubleClick={(e) => handleKeyframeDoubleClick(e, keyframe)}
            onContextMenu={(e) => handleKeyframeContextMenu(e, keyframe)}
            onDrag={handleKeyframeDrag}
            onDelete={() => onKeyframeDelete?.(keyframe.id)}
          />
        ))}
      </div>
    </div>
  );
};

Track.propTypes = {
  track: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    keyframes: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string.isRequired,
      time: PropTypes.number.isRequired,
      value: PropTypes.any.isRequired,
    })).isRequired,
  }).isRequired,
  isSelected: PropTypes.bool,
  timeRange: PropTypes.shape({
    start: PropTypes.number.isRequired,
    end: PropTypes.number.isRequired,
    duration: PropTypes.number.isRequired,
  }).isRequired,
  pxPerMs: PropTypes.number.isRequired,
  onClick: PropTypes.func,
  onKeyframeUpdate: PropTypes.func,
  onKeyframeDelete: PropTypes.func,
};

export default React.memo(Track);
