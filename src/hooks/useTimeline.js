import { useEffect, useState } from 'react';
import BETON from '../core/Beton';

export function useTimeline() {
  const [timeline, setTimeline] = useState(null);

  useEffect(() => {
    const projectManager = BETON.get('project-manager');
    const currentTimeline = projectManager.state.currentTimeline;
    setTimeline(currentTimeline);

    // Subscribe to timeline changes
    const unsubscribe = projectManager.subscribe(() => {
      setTimeline(projectManager.state.currentTimeline);
    });

    return () => unsubscribe();
  }, []);

  const addTrack = (trackConfig) => {
    if (!timeline) return;
    
    const projectManager = BETON.get('project-manager');
    projectManager.actions.addTrack(timeline.id, trackConfig);
  };

  const deleteTrack = (trackId) => {
    if (!timeline) return;
    
    const projectManager = BETON.get('project-manager');
    projectManager.actions.deleteTrack(timeline.id, trackId);
  };

  const updateTrack = (trackId, updates) => {
    if (!timeline) return;
    
    const projectManager = BETON.get('project-manager');
    projectManager.actions.updateTrack(timeline.id, trackId, updates);
  };

  const addKeyframe = (trackId, time, value) => {
    if (!timeline) return;
    
    const projectManager = BETON.get('project-manager');
    projectManager.actions.addKeyframe(timeline.id, trackId, time, value);
  };

  const deleteKeyframe = (trackId, keyframeId) => {
    if (!timeline) return;
    
    const projectManager = BETON.get('project-manager');
    projectManager.actions.deleteKeyframe(timeline.id, trackId, keyframeId);
  };

  const updateKeyframe = (trackId, keyframeId, updates) => {
    if (!timeline) return;
    
    const projectManager = BETON.get('project-manager');
    projectManager.actions.updateKeyframe(timeline.id, trackId, keyframeId, updates);
  };

  return {
    timeline,
    addTrack,
    deleteTrack,
    updateTrack,
    addKeyframe,
    deleteKeyframe,
    updateKeyframe,
  };
}
