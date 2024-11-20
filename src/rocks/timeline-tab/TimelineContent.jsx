import React, { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useTheme } from '../workspace/ThemeContext';
import { useTimelineState } from './TimelineContext';
import Track from './Track';
import styles from './Timeline.module.css';

const TimelineContent = ({
  tracks,
  selectedTrack,
  onTrackSelect,
  onKeyframeAdd,
  onKeyframeUpdate,
  onKeyframeDelete,
  onDragStart,
  onDragMove,
  onDragEnd,
}) => {
  const theme = useTheme();
  const { pxPerMs, visibleTimeStart, visibleTimeEnd } = useTimelineState();

  // Calculate visible time range for optimization
  const timeRange = useMemo(() => ({
    start: visibleTimeStart,
    end: visibleTimeEnd,
    duration: visibleTimeEnd - visibleTimeStart,
  }), [visibleTimeStart, visibleTimeEnd]);

  // Handle track click
  const handleTrackClick = useCallback((trackId, event) => {
    // If clicking on empty space in the track, add a keyframe
    if (event.target === event.currentTarget) {
      const clickX = event.nativeEvent.offsetX;
      const time = (clickX / pxPerMs) + visibleTimeStart;
      onKeyframeAdd?.(trackId, time, null);
    }
    onTrackSelect?.(trackId);
  }, [pxPerMs, visibleTimeStart, onKeyframeAdd, onTrackSelect]);

  // Handle track drag
  const handleTrackDragStart = useCallback((event) => {
    event.preventDefault();
    onDragStart?.(event);
  }, [onDragStart]);

  const handleTrackDragMove = useCallback((event) => {
    event.preventDefault();
    onDragMove?.(event);
  }, [onDragMove]);

  const handleTrackDragEnd = useCallback((event) => {
    event.preventDefault();
    onDragEnd?.(event);
  }, [onDragEnd]);

  return (
    <div 
      className={styles.content}
      onMouseDown={handleTrackDragStart}
      onMouseMove={handleTrackDragMove}
      onMouseUp={handleTrackDragEnd}
      onMouseLeave={handleTrackDragEnd}
      style={{
        '--track-height': theme.spacing(4),
        '--track-padding': theme.spacing(1),
      }}
    >
      <div className={styles.tracksContainer}>
        {tracks.map((track) => (
          <Track
            key={track.id}
            track={track}
            isSelected={selectedTrack === track.id}
            timeRange={timeRange}
            pxPerMs={pxPerMs}
            onClick={(event) => handleTrackClick(track.id, event)}
            onKeyframeUpdate={(keyframeId, updates) => 
              onKeyframeUpdate?.(track.id, keyframeId, updates)
            }
            onKeyframeDelete={(keyframeId) => 
              onKeyframeDelete?.(track.id, keyframeId)
            }
          />
        ))}
      </div>

      {/* Current time indicator line */}
      <div 
        className={styles.currentTimeLine}
        style={{
          left: `${(0 - visibleTimeStart) * pxPerMs}px`,
        }}
      />

      {/* Empty state */}
      {tracks.length === 0 && (
        <div className={styles.emptyState}>
          <div className={styles.emptyStateIcon}>timeline</div>
          <h3 className={styles.emptyStateTitle}>No Tracks</h3>
          <p className={styles.emptyStateText}>
            Add tracks to start creating animations
          </p>
        </div>
      )}
    </div>
  );
};

TimelineContent.propTypes = {
  tracks: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    keyframes: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string.isRequired,
      time: PropTypes.number.isRequired,
      value: PropTypes.any.isRequired,
    })).isRequired,
  })).isRequired,
  selectedTrack: PropTypes.string,
  onTrackSelect: PropTypes.func,
  onKeyframeAdd: PropTypes.func,
  onKeyframeUpdate: PropTypes.func,
  onKeyframeDelete: PropTypes.func,
  onDragStart: PropTypes.func,
  onDragMove: PropTypes.func,
  onDragEnd: PropTypes.func,
};

export default React.memo(TimelineContent);
