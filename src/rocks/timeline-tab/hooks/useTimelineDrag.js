import { useState, useCallback } from 'react';

export const useTimelineDrag = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartPos, setDragStartPos] = useState(null);

  const handleDragStart = useCallback((event) => {
    setIsDragging(true);
    setDragStartPos({
      x: event.clientX,
      y: event.clientY,
      timelineX: event.currentTarget.scrollLeft,
    });

    // Prevent text selection during drag
    document.body.style.userSelect = 'none';
  }, []);

  const handleDragMove = useCallback((event) => {
    if (!isDragging || !dragStartPos) return;

    const deltaX = event.clientX - dragStartPos.x;
    const newScrollLeft = dragStartPos.timelineX - deltaX;

    // Update timeline scroll position
    event.currentTarget.scrollLeft = newScrollLeft;
  }, [isDragging, dragStartPos]);

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
    setDragStartPos(null);

    // Restore text selection
    document.body.style.userSelect = '';
  }, []);

  return {
    isDragging,
    dragStartPos,
    handleDragStart,
    handleDragMove,
    handleDragEnd,
  };
};
