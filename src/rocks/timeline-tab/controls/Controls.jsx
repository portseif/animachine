import React from 'react';
import { Button } from '@mui/material';
import styles from './Controls.module.css';
import { useTimeline } from '../../../hooks/useTimeline';
import { TrackList } from './TrackList';

export function Controls() {
  const { timeline, addTrack } = useTimeline();

  const handleCreateTrack = () => {
    addTrack({ name: 'New Track' });
  };

  if (!timeline?.tracks?.length) {
    return (
      <div className={styles.placeholder}>
        <p className={styles.message}>
          Hi, there is no track to animate yet!
        </p>
        <Button
          variant="contained"
          color="primary"
          onClick={handleCreateTrack}
          className={styles.button}
        >
          Create a new one!
        </Button>
      </div>
    );
  }

  return <TrackList tracks={timeline.tracks} />;
}
