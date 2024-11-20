import React, { useCallback, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useTheme } from '../workspace/ThemeContext';
import { TimelineProvider } from './TimelineContext';
import { useTimelineControls } from './hooks/useTimelineControls';
import { useTimelineZoom } from './hooks/useTimelineZoom';
import { useTimelineDrag } from './hooks/useTimelineDrag';
import TimelineHeader from './TimelineHeader';
import TimelineRuler from './TimelineRuler';
import TimelineContent from './TimelineContent';
import TimelineControls from './TimelineControls';
import styles from './Timeline.module.css';

const Timeline = ({ 
  tracks, 
  currentTime, 
  duration, 
  onTimeChange, 
  onTrackSelect,
  onKeyframeAdd,
  onKeyframeUpdate,
  onKeyframeDelete 
}) => {
  const theme = useTheme();
  const [selectedTrack, setSelectedTrack] = useState(null);
  
  // Timeline state management
  const {
    isPlaying,
    playbackSpeed,
    togglePlay,
    setSpeed,
    jumpToTime,
  } = useTimelineControls({ currentTime, duration, onTimeChange });

  const {
    zoom,
    pxPerMs,
    visibleTimeStart,
    visibleTimeEnd,
    handleZoomIn,
    handleZoomOut,
    handleZoomReset,
  } = useTimelineZoom({ duration });

  const {
    isDragging,
    dragStartPos,
    handleDragStart,
    handleDragMove,
    handleDragEnd,
  } = useTimelineDrag();

  // Memoized timeline context value
  const timelineContext = useMemo(() => ({
    currentTime,
    duration,
    zoom,
    pxPerMs,
    visibleTimeStart,
    visibleTimeEnd,
    isPlaying,
    playbackSpeed,
    selectedTrack,
    tracks,
  }), [
    currentTime,
    duration,
    zoom,
    pxPerMs,
    visibleTimeStart,
    visibleTimeEnd,
    isPlaying,
    playbackSpeed,
    selectedTrack,
    tracks,
  ]);

  // Event handlers
  const handleTrackSelect = useCallback((trackId) => {
    setSelectedTrack(trackId);
    onTrackSelect?.(trackId);
  }, [onTrackSelect]);

  const handleKeyframeAdd = useCallback((trackId, time, value) => {
    onKeyframeAdd?.(trackId, time, value);
  }, [onKeyframeAdd]);

  const handleKeyframeUpdate = useCallback((trackId, keyframeId, updates) => {
    onKeyframeUpdate?.(trackId, keyframeId, updates);
  }, [onKeyframeUpdate]);

  const handleKeyframeDelete = useCallback((trackId, keyframeId) => {
    onKeyframeDelete?.(trackId, keyframeId);
  }, [onKeyframeDelete]);

  return (
    <TimelineProvider value={timelineContext}>
      <div 
        className={classNames(styles.timeline, {
          [styles.dragging]: isDragging,
        })}
        style={{
          '--timeline-height': '300px',
          '--timeline-header-height': '40px',
          '--timeline-ruler-height': '24px',
          '--timeline-track-height': '32px',
          ...theme.getTimelineStyles(),
        }}
      >
        <TimelineHeader
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onZoomReset={handleZoomReset}
        />
        
        <TimelineRuler
          visibleTimeStart={visibleTimeStart}
          visibleTimeEnd={visibleTimeEnd}
          pxPerMs={pxPerMs}
        />
        
        <TimelineContent
          tracks={tracks}
          selectedTrack={selectedTrack}
          onTrackSelect={handleTrackSelect}
          onKeyframeAdd={handleKeyframeAdd}
          onKeyframeUpdate={handleKeyframeUpdate}
          onKeyframeDelete={handleKeyframeDelete}
          onDragStart={handleDragStart}
          onDragMove={handleDragMove}
          onDragEnd={handleDragEnd}
          dragStartPos={dragStartPos}
        />
        
        <TimelineControls
          isPlaying={isPlaying}
          playbackSpeed={playbackSpeed}
          onPlayPause={togglePlay}
          onSpeedChange={setSpeed}
          onTimeJump={jumpToTime}
        />
      </div>
    </TimelineProvider>
  );
};

Timeline.propTypes = {
  tracks: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    keyframes: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string.isRequired,
      time: PropTypes.number.isRequired,
      value: PropTypes.any.isRequired,
    })).isRequired,
  })).isRequired,
  currentTime: PropTypes.number.isRequired,
  duration: PropTypes.number.isRequired,
  onTimeChange: PropTypes.func.isRequired,
  onTrackSelect: PropTypes.func,
  onKeyframeAdd: PropTypes.func,
  onKeyframeUpdate: PropTypes.func,
  onKeyframeDelete: PropTypes.func,
};

export default React.memo(Timeline);
