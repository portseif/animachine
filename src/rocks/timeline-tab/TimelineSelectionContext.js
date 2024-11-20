import React, { createContext, useContext, useReducer, useCallback } from 'react';

const TimelineSelectionContext = createContext(null);

const initialState = {
  selectedTracks: new Set(),
  selectedKeyframes: new Set(),
};

const actionTypes = {
  SELECT_TRACK: 'SELECT_TRACK',
  DESELECT_TRACK: 'DESELECT_TRACK',
  TOGGLE_TRACK: 'TOGGLE_TRACK',
  SELECT_KEYFRAME: 'SELECT_KEYFRAME',
  DESELECT_KEYFRAME: 'DESELECT_KEYFRAME',
  TOGGLE_KEYFRAME: 'TOGGLE_KEYFRAME',
  CLEAR_ALL: 'CLEAR_ALL',
};

function selectionReducer(state, action) {
  switch (action.type) {
    case actionTypes.SELECT_TRACK: {
      const newTracks = new Set(state.selectedTracks);
      newTracks.add(action.trackId);
      return { ...state, selectedTracks: newTracks };
    }
    case actionTypes.DESELECT_TRACK: {
      const newTracks = new Set(state.selectedTracks);
      newTracks.delete(action.trackId);
      return { ...state, selectedTracks: newTracks };
    }
    case actionTypes.TOGGLE_TRACK: {
      const newTracks = new Set(state.selectedTracks);
      if (newTracks.has(action.trackId)) {
        newTracks.delete(action.trackId);
      } else {
        newTracks.add(action.trackId);
      }
      return { ...state, selectedTracks: newTracks };
    }
    case actionTypes.SELECT_KEYFRAME: {
      const newKeyframes = new Set(state.selectedKeyframes);
      newKeyframes.add(action.keyframeId);
      return { ...state, selectedKeyframes: newKeyframes };
    }
    case actionTypes.DESELECT_KEYFRAME: {
      const newKeyframes = new Set(state.selectedKeyframes);
      newKeyframes.delete(action.keyframeId);
      return { ...state, selectedKeyframes: newKeyframes };
    }
    case actionTypes.TOGGLE_KEYFRAME: {
      const newKeyframes = new Set(state.selectedKeyframes);
      if (newKeyframes.has(action.keyframeId)) {
        newKeyframes.delete(action.keyframeId);
      } else {
        newKeyframes.add(action.keyframeId);
      }
      return { ...state, selectedKeyframes: newKeyframes };
    }
    case actionTypes.CLEAR_ALL:
      return initialState;
    default:
      return state;
  }
}

export function TimelineSelectionProvider({ children }) {
  const [state, dispatch] = useReducer(selectionReducer, initialState);

  const selectTrack = useCallback((trackId) => {
    dispatch({ type: actionTypes.SELECT_TRACK, trackId });
  }, []);

  const deselectTrack = useCallback((trackId) => {
    dispatch({ type: actionTypes.DESELECT_TRACK, trackId });
  }, []);

  const toggleTrack = useCallback((trackId, event) => {
    if (event?.shiftKey) {
      dispatch({ type: actionTypes.SELECT_TRACK, trackId });
    } else if (event?.metaKey || event?.ctrlKey) {
      dispatch({ type: actionTypes.TOGGLE_TRACK, trackId });
    } else {
      dispatch({ type: actionTypes.CLEAR_ALL });
      dispatch({ type: actionTypes.SELECT_TRACK, trackId });
    }
  }, []);

  const selectKeyframe = useCallback((keyframeId) => {
    dispatch({ type: actionTypes.SELECT_KEYFRAME, keyframeId });
  }, []);

  const deselectKeyframe = useCallback((keyframeId) => {
    dispatch({ type: actionTypes.DESELECT_KEYFRAME, keyframeId });
  }, []);

  const toggleKeyframe = useCallback((keyframeId, event) => {
    if (event?.shiftKey) {
      dispatch({ type: actionTypes.SELECT_KEYFRAME, keyframeId });
    } else if (event?.metaKey || event?.ctrlKey) {
      dispatch({ type: actionTypes.TOGGLE_KEYFRAME, keyframeId });
    } else {
      dispatch({ type: actionTypes.CLEAR_ALL });
      dispatch({ type: actionTypes.SELECT_KEYFRAME, keyframeId });
    }
  }, []);

  const clearSelection = useCallback(() => {
    dispatch({ type: actionTypes.CLEAR_ALL });
  }, []);

  const value = {
    selectedTracks: state.selectedTracks,
    selectedKeyframes: state.selectedKeyframes,
    selectTrack,
    deselectTrack,
    toggleTrack,
    selectKeyframe,
    deselectKeyframe,
    toggleKeyframe,
    clearSelection,
  };

  return (
    <TimelineSelectionContext.Provider value={value}>
      {children}
    </TimelineSelectionContext.Provider>
  );
}

export function useTimelineSelection() {
  const context = useContext(TimelineSelectionContext);
  if (!context) {
    throw new Error('useTimelineSelection must be used within a TimelineSelectionProvider');
  }
  return context;
}
