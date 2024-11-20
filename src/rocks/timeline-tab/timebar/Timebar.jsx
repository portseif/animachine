import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { useTimelineState } from '../hooks/useTimelineState';
import Pointer from './Pointer';
import Timetape from './Timetape';
import Navigator from './Navigator';
import styles from './Timebar.module.css';

const Timebar = ({ height }) => {
  const timeline = useTimelineState();

  return (
    <div className={styles.timebarContainer}>
      <div className={styles.timebarContent}>
        <Timetape height={height} timeline={timeline} />
        <Navigator timeline={timeline} />
        <Pointer timeline={timeline} />
      </div>
    </div>
  );
};

Timebar.propTypes = {
  height: PropTypes.number.isRequired,
};

export default memo(Timebar);
