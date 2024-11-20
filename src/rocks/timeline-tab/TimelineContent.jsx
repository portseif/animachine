import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TimelineSelectionProvider } from './TimelineSelectionContext';
import { TimelineHistoryProvider } from './TimelineHistory';
import { TimelineClipboardProvider } from './TimelineClipboard';
import { useTimelineShortcuts } from './TimelineShortcuts';
import TimelineContextMenu from './TimelineContextMenu';
import TrackDragLayer from './TrackDragLayer';
import Track from './Track';
import styles from './Timeline.module.css';
import classNames from 'classnames';
import { useTheme } from '../workspace/ThemeContext';
import { useTimelineState } from './TimelineContext';

const TimelineContent = ({
  tracks,
  selectedTrack,
  onTrackSelect,
  onKeyframeAdd,
  onKeyframeUpdate,
  onKeyframeDelete,
  onTrackVisibilityChange,
  onTrackLockChange,
  onTrackMove,
  onCopy,
  onCut,
  onPaste,
  onUndo,
  onRedo,
  onDragStart,
  onDragMove,
  onDragEnd,
}) => {
  const theme = useTheme();
  const { pxPerMs, visibleTimeStart, visibleTimeEnd } = useTimelineState();
  const [contextMenu, setContextMenu] = useState(null);

  // Calculate visible time range for optimization
  const timeRange = {
    start: visibleTimeStart,
    end: visibleTimeEnd,
    duration: visibleTimeEnd - visibleTimeStart,
  };

  // Setup keyboard shortcuts
  useTimelineShortcuts({
    onCopy,
    onCut,
    onPaste,
    onUndo,
    onRedo,
    onDeleteKeyframe: onKeyframeDelete,
  });

  // Handle context menu close
  const handleContextMenuClose = useCallback(() => {
    setContextMenu(null);
  }, []);

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

  // Handle track move
  const handleTrackMove = useCallback((dragIndex, hoverIndex) => {
    onTrackMove?.(dragIndex, hoverIndex);
  }, [onTrackMove]);

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
    <DndProvider backend={HTML5Backend}>
      <TimelineHistoryProvider initialTimeline={{ tracks }}>
        <TimelineClipboardProvider>
          <TimelineSelectionProvider>
            <div 
              className={classNames(styles.content, styles.timelineContent)}
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
                {tracks.map((track, index) => (
                  <Track
                    key={track.id}
                    track={track}
                    index={index}
                    timeRange={timeRange}
                    pxPerMs={pxPerMs}
                    isSelected={selectedTrack === track.id}
                    onClick={(event) => handleTrackClick(track.id, event)}
                    onKeyframeUpdate={(keyframeId, updates) => 
                      onKeyframeUpdate?.(track.id, keyframeId, updates)
                    }
                    onKeyframeDelete={(keyframeId) => 
                      onKeyframeDelete?.(track.id, keyframeId)
                    }
                    onTrackVisibilityChange={onTrackVisibilityChange}
                    onTrackLockChange={onTrackLockChange}
                    onTrackMove={handleTrackMove}
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
              {contextMenu && (
                <TimelineContextMenu
                  x={contextMenu.x}
                  y={contextMenu.y}
                  items={contextMenu.items}
                  onClose={handleContextMenuClose}
                />
              )}
              <TrackDragLayer />
            </div>
          </TimelineSelectionProvider>
        </TimelineClipboardProvider>
      </TimelineHistoryProvider>
    </DndProvider>
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
  onTrackVisibilityChange: PropTypes.func,
  onTrackLockChange: PropTypes.func,
  onTrackMove: PropTypes.func,
  onCopy: PropTypes.func,
  onCut: PropTypes.func,
  onPaste: PropTypes.func,
  onUndo: PropTypes.func,
  onRedo: PropTypes.func,
  onDragStart: PropTypes.func,
  onDragMove: PropTypes.func,
  onDragEnd: PropTypes.func,
};

export default React.memo(TimelineContent);
