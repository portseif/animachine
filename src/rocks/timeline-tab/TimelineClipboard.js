import { createContext, useContext, useState, useCallback } from 'react';
import { useTimelineSelection } from './TimelineSelectionContext';

const TimelineClipboardContext = createContext(null);

export function TimelineClipboardProvider({ children }) {
  const [clipboard, setClipboard] = useState(null);
  const { selectedKeyframes, selectedTracks } = useTimelineSelection();

  const copy = useCallback((timeline) => {
    const data = {
      keyframes: [],
      tracks: [],
      timestamp: Date.now(),
    };

    // Copy selected keyframes
    if (selectedKeyframes.size > 0) {
      timeline.tracks.forEach(track => {
        track.keyframes.forEach(keyframe => {
          if (selectedKeyframes.has(keyframe.id)) {
            data.keyframes.push({
              ...keyframe,
              trackId: track.id,
            });
          }
        });
      });
    }

    // Copy selected tracks
    if (selectedTracks.size > 0) {
      timeline.tracks.forEach(track => {
        if (selectedTracks.has(track.id)) {
          data.tracks.push({
            ...track,
            keyframes: track.keyframes.map(k => ({ ...k })),
          });
        }
      });
    }

    setClipboard(data);
    return data;
  }, [selectedKeyframes, selectedTracks]);

  const cut = useCallback((timeline) => {
    const data = copy(timeline);
    return {
      data,
      deleteKeyframes: Array.from(selectedKeyframes),
      deleteTracks: Array.from(selectedTracks),
    };
  }, [copy, selectedKeyframes, selectedTracks]);

  const paste = useCallback((timeline, targetTime = null) => {
    if (!clipboard) return null;

    const idMap = new Map();
    const generateNewId = (oldId) => {
      const newId = `${oldId}_${Date.now()}`;
      idMap.set(oldId, newId);
      return newId;
    };

    const timeOffset = targetTime !== null
      ? targetTime - Math.min(...clipboard.keyframes.map(k => k.time))
      : 0;

    const result = {
      tracks: [...timeline.tracks],
      newKeyframes: [],
      newTracks: [],
    };

    // Paste keyframes
    if (clipboard.keyframes.length > 0) {
      clipboard.keyframes.forEach(keyframe => {
        const newKeyframe = {
          ...keyframe,
          id: generateNewId(keyframe.id),
          time: keyframe.time + timeOffset,
        };
        result.newKeyframes.push(newKeyframe);

        const trackIndex = result.tracks.findIndex(t => t.id === keyframe.trackId);
        if (trackIndex !== -1) {
          result.tracks[trackIndex] = {
            ...result.tracks[trackIndex],
            keyframes: [...result.tracks[trackIndex].keyframes, newKeyframe],
          };
        }
      });
    }

    // Paste tracks
    if (clipboard.tracks.length > 0) {
      clipboard.tracks.forEach(track => {
        const newTrack = {
          ...track,
          id: generateNewId(track.id),
          keyframes: track.keyframes.map(keyframe => ({
            ...keyframe,
            id: generateNewId(keyframe.id),
            time: keyframe.time + timeOffset,
          })),
        };
        result.newTracks.push(newTrack);
        result.tracks.push(newTrack);
      });
    }

    return result;
  }, [clipboard]);

  const hasData = clipboard !== null;

  const value = {
    copy,
    cut,
    paste,
    hasData,
  };

  return (
    <TimelineClipboardContext.Provider value={value}>
      {children}
    </TimelineClipboardContext.Provider>
  );
}

export function useTimelineClipboard() {
  const context = useContext(TimelineClipboardContext);
  if (!context) {
    throw new Error('useTimelineClipboard must be used within a TimelineClipboardProvider');
  }
  return context;
}
