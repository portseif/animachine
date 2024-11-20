import { useAfflatus } from 'afflatus';

export const useTimelineState = () => {
  const timelineState = useAfflatus();

  if (!timelineState) {
    throw new Error('useTimelineState must be used within a timeline context');
  }

  return timelineState;
};
