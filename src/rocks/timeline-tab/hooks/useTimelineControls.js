import { useState, useCallback, useEffect } from 'react';

export const useTimelineControls = ({ currentTime, duration, onTimeChange }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  
  const togglePlay = useCallback(() => {
    setIsPlaying(prev => !prev);
  }, []);

  const setSpeed = useCallback((speed) => {
    setPlaybackSpeed(speed);
  }, []);

  const jumpToTime = useCallback((time) => {
    const clampedTime = Math.max(0, Math.min(time, duration));
    onTimeChange(clampedTime);
  }, [duration, onTimeChange]);

  // Handle playback animation
  useEffect(() => {
    if (!isPlaying) return;

    let lastTime = performance.now();
    let animationFrameId;

    const animate = (currentTime) => {
      const deltaTime = currentTime - lastTime;
      lastTime = currentTime;

      onTimeChange((prevTime) => {
        const newTime = prevTime + (deltaTime * playbackSpeed);
        return newTime >= duration ? 0 : newTime;
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [isPlaying, playbackSpeed, duration, onTimeChange]);

  return {
    isPlaying,
    playbackSpeed,
    togglePlay,
    setSpeed,
    jumpToTime,
  };
};
