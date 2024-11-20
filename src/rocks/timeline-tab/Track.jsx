import React, { useCallback, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useTheme } from '../workspace/ThemeContext';
import { useTimelineSelection } from './TimelineSelectionContext';
import { useContextMenu } from './TimelineContextMenu';
import { formatShortcut, shortcuts } from './TimelineShortcuts';
import Keyframe from './Keyframe';
import styles from './Timeline.module.css';

const Track = ({
  track,
  timeRange,
  pxPerMs,
  onKeyframeUpdate,
  onKeyframeDelete,
  onTrackVisibilityChange,
  onTrackLockChange,
}) => {
  const theme = useTheme();
  const [isVisible, setIsVisible] = useState(true);
  const [isLocked, setIsLocked] = useState(false);
  const { selectedTracks, selectedKeyframes, toggleTrack, toggleKeyframe } = useTimelineSelection();
  const { showContextMenu } = useContextMenu();

  const isSelected = selectedTracks.has(track.id);

  // Filter visible keyframes for performance
  const visibleKeyframes = useMemo(() => {
    return track.keyframes.filter(keyframe => 
      keyframe.time >= timeRange.start - 1000 && // Add 1s buffer on each side
      keyframe.time <= timeRange.end + 1000
    );
  }, [track.keyframes, timeRange]);

  // Handle keyframe drag
  const handleKeyframeDrag = useCallback((keyframeId, deltaX) => {
    if (isLocked) return;
    const deltaTime = deltaX / pxPerMs;
    onKeyframeUpdate?.(keyframeId, { time: deltaTime });
  }, [isLocked, pxPerMs, onKeyframeUpdate]);

  // Handle track context menu
  const handleTrackContextMenu = useCallback((event) => {
    const items = [
      {
        label: isVisible ? 'Hide Track' : 'Show Track',
        icon: isVisible ? 'visibility_off' : 'visibility',
        onClick: () => {
          setIsVisible(!isVisible);
          onTrackVisibilityChange?.(track.id, !isVisible);
        },
      },
      {
        label: isLocked ? 'Unlock Track' : 'Lock Track',
        icon: isLocked ? 'lock_open' : 'lock',
        onClick: () => {
          setIsLocked(!isLocked);
          onTrackLockChange?.(track.id, !isLocked);
        },
      },
      { separator: true },
      {
        label: 'Delete Track',
        icon: 'delete',
        shortcut: formatShortcut(shortcuts.DELETE_KEYFRAME[0]),
        onClick: () => {
          // Implement delete track
        },
      },
    ];
    showContextMenu(event, items);
  }, [isVisible, isLocked, track.id, onTrackVisibilityChange, onTrackLockChange, showContextMenu]);

  // Handle keyframe context menu
  const handleKeyframeContextMenu = useCallback((event, keyframe) => {
    if (isLocked) return;
    
    const items = [
      {
        label: 'Copy',
        icon: 'content_copy',
        shortcut: formatShortcut(shortcuts.COPY[0]),
        onClick: () => {
          // Implement copy keyframe
        },
      },
      {
        label: 'Cut',
        icon: 'content_cut',
        shortcut: formatShortcut(shortcuts.CUT[0]),
        onClick: () => {
          // Implement cut keyframe
        },
      },
      { separator: true },
      {
        label: 'Delete',
        icon: 'delete',
        shortcut: formatShortcut(shortcuts.DELETE_KEYFRAME[0]),
        onClick: () => onKeyframeDelete?.(keyframe.id),
      },
    ];
    showContextMenu(event, items);
  }, [isLocked, onKeyframeDelete, showContextMenu]);

  return (
    <div
      className={classNames(styles.track, {
        [styles.selected]: isSelected,
        [styles.locked]: isLocked,
      })}
      onClick={(e) => toggleTrack(track.id, e)}
      onContextMenu={handleTrackContextMenu}
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
              setIsVisible(!isVisible);
              onTrackVisibilityChange?.(track.id, !isVisible);
            }}
            title={isVisible ? 'Hide track' : 'Show track'}
          >
            <span className={styles.icon}>
              {isVisible ? 'visibility' : 'visibility_off'}
            </span>
          </button>
          <button
            className={styles.trackButton}
            onClick={(e) => {
              e.stopPropagation();
              setIsLocked(!isLocked);
              onTrackLockChange?.(track.id, !isLocked);
            }}
            title={isLocked ? 'Unlock track' : 'Lock track'}
          >
            <span className={styles.icon}>
              {isLocked ? 'lock' : 'lock_open'}
            </span>
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
            isSelected={selectedKeyframes.has(keyframe.id)}
            onClick={(e) => toggleKeyframe(keyframe.id, e)}
            onDoubleClick={(e) => {
              e.stopPropagation();
              // Implement keyframe value editing
            }}
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
  timeRange: PropTypes.shape({
    start: PropTypes.number.isRequired,
    end: PropTypes.number.isRequired,
    duration: PropTypes.number.isRequired,
  }).isRequired,
  pxPerMs: PropTypes.number.isRequired,
  onKeyframeUpdate: PropTypes.func,
  onKeyframeDelete: PropTypes.func,
  onTrackVisibilityChange: PropTypes.func,
  onTrackLockChange: PropTypes.func,
};

export default React.memo(Track);
