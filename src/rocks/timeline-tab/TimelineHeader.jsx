import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '../workspace/ThemeContext';
import { useTimelineState } from './TimelineContext';
import IconButton from '../common/IconButton';
import styles from './Timeline.module.css';

const TimelineHeader = ({
  onZoomIn,
  onZoomOut,
  onZoomReset,
}) => {
  const theme = useTheme();
  const { 
    isPlaying,
    playbackSpeed,
    duration,
    currentTime,
  } = useTimelineState();

  const formatTime = useCallback((ms) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    const pad = (num) => num.toString().padStart(2, '0');
    
    if (hours > 0) {
      return `${hours}:${pad(minutes % 60)}:${pad(seconds % 60)}`;
    }
    return `${minutes}:${pad(seconds % 60)}.${pad(Math.floor((ms % 1000) / 10))}`;
  }, []);

  return (
    <div className={styles.header}>
      <div className={styles.headerLeft}>
        <IconButton
          icon="zoom_in"
          onClick={onZoomIn}
          tooltip="Zoom In (Ctrl +)"
          className={styles.controlButton}
        />
        <IconButton
          icon="zoom_out"
          onClick={onZoomOut}
          tooltip="Zoom Out (Ctrl -)"
          className={styles.controlButton}
        />
        <IconButton
          icon="restart_alt"
          onClick={onZoomReset}
          tooltip="Reset Zoom (Ctrl 0)"
          className={styles.controlButton}
        />
      </div>

      <div className={styles.headerCenter}>
        <div className={styles.timeDisplay}>
          <span className={styles.timeLabel}>Current:</span>
          <span className={styles.timeValue}>{formatTime(currentTime)}</span>
        </div>
        <div className={styles.timeSeparator}>/</div>
        <div className={styles.timeDisplay}>
          <span className={styles.timeLabel}>Duration:</span>
          <span className={styles.timeValue}>{formatTime(duration)}</span>
        </div>
      </div>

      <div className={styles.headerRight}>
        <div className={styles.playbackInfo}>
          {isPlaying && (
            <>
              <span className={styles.playbackLabel}>Speed:</span>
              <span className={styles.playbackValue}>{playbackSpeed}x</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

TimelineHeader.propTypes = {
  onZoomIn: PropTypes.func.isRequired,
  onZoomOut: PropTypes.func.isRequired,
  onZoomReset: PropTypes.func.isRequired,
};

export default React.memo(TimelineHeader);
