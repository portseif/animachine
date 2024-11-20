import { useState, useCallback, useMemo } from 'react';

const MIN_ZOOM = 0.1;
const MAX_ZOOM = 10;
const ZOOM_STEP = 1.2;

export const useTimelineZoom = ({ duration }) => {
  const [zoom, setZoom] = useState(1);
  const [visibleTimeStart, setVisibleTimeStart] = useState(0);

  const pxPerMs = useMemo(() => {
    return zoom * (1 / 1000); // 1px per millisecond at zoom level 1
  }, [zoom]);

  const visibleTimeEnd = useMemo(() => {
    return visibleTimeStart + (window.innerWidth / pxPerMs);
  }, [visibleTimeStart, pxPerMs]);

  const handleZoomIn = useCallback(() => {
    setZoom(prev => {
      const newZoom = Math.min(prev * ZOOM_STEP, MAX_ZOOM);
      const centerTime = visibleTimeStart + ((visibleTimeEnd - visibleTimeStart) / 2);
      const newVisibleDuration = window.innerWidth / (newZoom * (1 / 1000));
      setVisibleTimeStart(Math.max(0, centerTime - (newVisibleDuration / 2)));
      return newZoom;
    });
  }, [visibleTimeStart, visibleTimeEnd]);

  const handleZoomOut = useCallback(() => {
    setZoom(prev => {
      const newZoom = Math.max(prev / ZOOM_STEP, MIN_ZOOM);
      const centerTime = visibleTimeStart + ((visibleTimeEnd - visibleTimeStart) / 2);
      const newVisibleDuration = window.innerWidth / (newZoom * (1 / 1000));
      setVisibleTimeStart(Math.max(0, centerTime - (newVisibleDuration / 2)));
      return newZoom;
    });
  }, [visibleTimeStart, visibleTimeEnd]);

  const handleZoomReset = useCallback(() => {
    setZoom(1);
    setVisibleTimeStart(0);
  }, []);

  const handleScroll = useCallback((scrollLeft) => {
    const newStart = Math.max(0, scrollLeft / pxPerMs);
    setVisibleTimeStart(newStart);
  }, [pxPerMs]);

  return {
    zoom,
    pxPerMs,
    visibleTimeStart,
    visibleTimeEnd,
    handleZoomIn,
    handleZoomOut,
    handleZoomReset,
    handleScroll,
  };
};
