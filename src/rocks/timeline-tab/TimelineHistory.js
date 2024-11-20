import { createContext, useContext, useReducer, useCallback } from 'react';

const MAX_HISTORY_SIZE = 100;

const actionTypes = {
  PUSH_STATE: 'PUSH_STATE',
  UNDO: 'UNDO',
  REDO: 'REDO',
  CLEAR: 'CLEAR',
};

const initialState = {
  past: [],
  present: null,
  future: [],
};

function historyReducer(state, action) {
  switch (action.type) {
    case actionTypes.PUSH_STATE: {
      const { past, present } = state;
      if (present === action.state) return state;

      return {
        past: [...past, present].slice(-MAX_HISTORY_SIZE),
        present: action.state,
        future: [],
      };
    }
    case actionTypes.UNDO: {
      const { past, present, future } = state;
      if (past.length === 0) return state;

      const previous = past[past.length - 1];
      const newPast = past.slice(0, past.length - 1);

      return {
        past: newPast,
        present: previous,
        future: [present, ...future],
      };
    }
    case actionTypes.REDO: {
      const { past, present, future } = state;
      if (future.length === 0) return state;

      const next = future[0];
      const newFuture = future.slice(1);

      return {
        past: [...past, present],
        present: next,
        future: newFuture,
      };
    }
    case actionTypes.CLEAR:
      return { ...initialState, present: action.state };
    default:
      return state;
  }
}

export const TimelineHistoryContext = createContext(null);

export function TimelineHistoryProvider({ children, initialTimeline }) {
  const [state, dispatch] = useReducer(historyReducer, {
    ...initialState,
    present: initialTimeline,
  });

  const pushState = useCallback((newState) => {
    dispatch({ type: actionTypes.PUSH_STATE, state: newState });
  }, []);

  const undo = useCallback(() => {
    dispatch({ type: actionTypes.UNDO });
  }, []);

  const redo = useCallback(() => {
    dispatch({ type: actionTypes.REDO });
  }, []);

  const clear = useCallback((newState) => {
    dispatch({ type: actionTypes.CLEAR, state: newState });
  }, []);

  const canUndo = state.past.length > 0;
  const canRedo = state.future.length > 0;

  const value = {
    timeline: state.present,
    pushState,
    undo,
    redo,
    clear,
    canUndo,
    canRedo,
  };

  return (
    <TimelineHistoryContext.Provider value={value}>
      {children}
    </TimelineHistoryContext.Provider>
  );
}

export function useTimelineHistory() {
  const context = useContext(TimelineHistoryContext);
  if (!context) {
    throw new Error('useTimelineHistory must be used within a TimelineHistoryProvider');
  }
  return context;
}
