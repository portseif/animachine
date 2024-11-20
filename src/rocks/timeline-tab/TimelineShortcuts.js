import { useEffect, useCallback } from 'react';
import { useTimelineSelection } from './TimelineSelectionContext';

export const shortcuts = {
  DELETE_KEYFRAME: ['Delete', 'Backspace'],
  COPY: ['Meta+c', 'Control+c'],
  CUT: ['Meta+x', 'Control+x'],
  PASTE: ['Meta+v', 'Control+v'],
  UNDO: ['Meta+z', 'Control+z'],
  REDO: ['Meta+Shift+z', 'Control+Shift+z', 'Control+y'],
  SELECT_ALL: ['Meta+a', 'Control+a'],
  DESELECT_ALL: ['Escape'],
  PLAY_PAUSE: [' '],
  NEXT_FRAME: ['ArrowRight'],
  PREV_FRAME: ['ArrowLeft'],
  NEXT_KEYFRAME: ['Meta+ArrowRight', 'Control+ArrowRight'],
  PREV_KEYFRAME: ['Meta+ArrowLeft', 'Control+ArrowLeft'],
  ZOOM_IN: ['Meta+=', 'Control+='],
  ZOOM_OUT: ['Meta+-', 'Control+-'],
  ZOOM_FIT: ['Meta+0', 'Control+0'],
};

function matchShortcut(event, shortcut) {
  const keys = shortcut.toLowerCase().split('+');
  const eventKey = event.key.toLowerCase();
  
  const modifiers = {
    meta: event.metaKey,
    control: event.ctrlKey,
    shift: event.shiftKey,
    alt: event.altKey,
  };

  return keys.every(key => {
    if (key in modifiers) {
      return modifiers[key];
    }
    return key === eventKey;
  });
}

function matchesAny(event, shortcuts) {
  return shortcuts.some(shortcut => matchShortcut(event, shortcut));
}

export function useTimelineShortcuts({
  onCopy,
  onCut,
  onPaste,
  onUndo,
  onRedo,
  onDeleteKeyframe,
  onPlayPause,
  onNextFrame,
  onPrevFrame,
  onNextKeyframe,
  onPrevKeyframe,
  onZoomIn,
  onZoomOut,
  onZoomFit,
} = {}) {
  const { selectedKeyframes, clearSelection } = useTimelineSelection();

  const handleKeyDown = useCallback((event) => {
    // Ignore if focus is in an input element
    if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
      return;
    }

    let handled = true;

    if (matchesAny(event, shortcuts.DELETE_KEYFRAME)) {
      onDeleteKeyframe?.();
    } else if (matchesAny(event, shortcuts.COPY)) {
      onCopy?.();
    } else if (matchesAny(event, shortcuts.CUT)) {
      onCut?.();
    } else if (matchesAny(event, shortcuts.PASTE)) {
      onPaste?.();
    } else if (matchesAny(event, shortcuts.UNDO)) {
      onUndo?.();
    } else if (matchesAny(event, shortcuts.REDO)) {
      onRedo?.();
    } else if (matchesAny(event, shortcuts.SELECT_ALL)) {
      // Implement select all logic
    } else if (matchesAny(event, shortcuts.DESELECT_ALL)) {
      clearSelection();
    } else if (matchesAny(event, shortcuts.PLAY_PAUSE)) {
      onPlayPause?.();
    } else if (matchesAny(event, shortcuts.NEXT_FRAME)) {
      onNextFrame?.();
    } else if (matchesAny(event, shortcuts.PREV_FRAME)) {
      onPrevFrame?.();
    } else if (matchesAny(event, shortcuts.NEXT_KEYFRAME)) {
      onNextKeyframe?.();
    } else if (matchesAny(event, shortcuts.PREV_KEYFRAME)) {
      onPrevKeyframe?.();
    } else if (matchesAny(event, shortcuts.ZOOM_IN)) {
      onZoomIn?.();
    } else if (matchesAny(event, shortcuts.ZOOM_OUT)) {
      onZoomOut?.();
    } else if (matchesAny(event, shortcuts.ZOOM_FIT)) {
      onZoomFit?.();
    } else {
      handled = false;
    }

    if (handled) {
      event.preventDefault();
      event.stopPropagation();
    }
  }, [
    onDeleteKeyframe,
    onCopy,
    onCut,
    onPaste,
    onUndo,
    onRedo,
    clearSelection,
    onPlayPause,
    onNextFrame,
    onPrevFrame,
    onNextKeyframe,
    onPrevKeyframe,
    onZoomIn,
    onZoomOut,
    onZoomFit,
  ]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}

// Helper function to format shortcut for display
export function formatShortcut(shortcut) {
  return shortcut
    .split('+')
    .map(key => {
      switch (key.toLowerCase()) {
        case 'meta':
          return '⌘';
        case 'control':
          return 'Ctrl';
        case 'shift':
          return '⇧';
        case 'alt':
          return '⌥';
        case 'arrowleft':
          return '←';
        case 'arrowright':
          return '→';
        case 'arrowup':
          return '↑';
        case 'arrowdown':
          return '↓';
        case ' ':
          return 'Space';
        default:
          return key.charAt(0).toUpperCase() + key.slice(1);
      }
    })
    .join('+');
}
