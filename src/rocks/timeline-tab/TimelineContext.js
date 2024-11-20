import React, { createContext, useContext } from 'react';

const TimelineContext = createContext(null);

export const useTimelineState = () => {
  const context = useContext(TimelineContext);
  if (!context) {
    throw new Error('useTimelineState must be used within a TimelineProvider');
  }
  return context;
};

export const TimelineProvider = ({ children, value }) => {
  return (
    <TimelineContext.Provider value={value}>
      {children}
    </TimelineContext.Provider>
  );
};

export default TimelineContext;
