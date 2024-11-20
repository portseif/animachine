import React from 'react';
import styles from './DividerLine.module.css';

export function DividerLine({ position = 0 }) {
  return (
    <div className={styles.divider} style={{ left: position }}>
      <div className={styles.handle} />
    </div>
  );
}
