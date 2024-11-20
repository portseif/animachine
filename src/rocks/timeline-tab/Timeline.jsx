import React, { useEffect, useRef, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useDrag } from 'react-dnd';
import { useHotkeys } from 'react-hotkeys-hook';
import { useTheme } from '../workspace/ThemeContext';
import BETON from '../../core/Beton';
import Controls from './controls/Controls';
import Keylines from './keylines/Keylines';
import Timebar from './timebar/Timebar';
import Toolbar from './toolbar/Toolbar';
import DividerLine from './DividerLine';
import InlineEaseEditor from './inline-ease-editor/InlineEaseEditor';
import styles from './Timeline.module.css';

const INITIAL_STATE = {
  dividerPos: 300,
  fullWidth: 2000,
  scrollPosition: 0,
};

const Timeline = ({ timeline, headHeight = 21 }) => {
  const theme = useTheme();
  const [state, setState] = useState(INITIAL_STATE);
  const timelineRef = useRef(null);
  const isDraggingDivider = useRef(false);

  const handleDividerDrag = useCallback((e) => {
    if (!isDraggingDivider.current) return;

    const newDividerPos = Math.max(200, Math.min(e.clientX, window.innerWidth - 200));
    setState(prev => ({ ...prev, dividerPos: newDividerPos }));
  }, []);

  const handleDividerMouseDown = useCallback(() => {
    isDraggingDivider.current = true;
    document.body.style.cursor = 'col-resize';
  }, []);

  const handleDividerMouseUp = useCallback(() => {
    isDraggingDivider.current = false;
    document.body.style.cursor = '';
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleDividerDrag);
    window.addEventListener('mouseup', handleDividerMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleDividerDrag);
      window.removeEventListener('mouseup', handleDividerMouseUp);
    };
  }, [handleDividerDrag, handleDividerMouseUp]);

  // Keyboard shortcuts
  useHotkeys('space', (e) => {
    e.preventDefault();
    BETON.require('project-manager').togglePlayback();
  });

  useHotkeys('shift+space', (e) => {
    e.preventDefault();
    BETON.require('project-manager').playFromStart();
  });

  useHotkeys('backspace,del', (event) => {
    if (event.target.tagName !== 'INPUT') {
      BETON.get('project-manager').actions.deleteSelectedKeys();
    }
  });

  useHotkeys('ctrl+z,cmd+z', (event) => {
    if (event.target.tagName !== 'INPUT') {
      BETON.get('project-manager').actions.undo();
    }
  });

  useHotkeys('ctrl+shift+z,cmd+shift+z', (event) => {
    if (event.target.tagName !== 'INPUT') {
      BETON.get('project-manager').actions.redo();
    }
  });

  const handleScroll = (scroll) => {
    setState(prev => ({ ...prev, scrollPosition: scroll }));
  };

  const [, dragRef] = useDrag({
    type: 'divider',
    item: { type: 'divider' },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    end: (item, monitor) => {
      const offset = monitor.getDifferenceFromInitialOffset().x;
      setState(prev => ({
        ...prev,
        dividerPos: Math.max(100, Math.min(prev.dividerPos + offset, prev.fullWidth - 100))
      }));
    },
  });

  const { dividerPos, scrollPosition, fullWidth } = state;

  return (
    <div className={styles['timeline-container']} ref={timelineRef}>
      <div className={styles['timeline-content']}>
        <div className={styles['timeline-head']} style={{ height: headHeight }}>
          <Toolbar />
        </div>
        <div className={styles['timeline-body']} style={{ top: headHeight }}>
          <div 
            className={styles['left-panel']} 
            style={{ width: state.dividerPos }}
          >
            <Controls />
          </div>
          <div 
            className={styles.divider}
            style={{ left: state.dividerPos }}
            onMouseDown={handleDividerMouseDown}
          />
          <div 
            className={styles['right-panel']}
            style={{ left: state.dividerPos + 4 }}
          >
            <Timebar />
            <Keylines scrollPosition={scrollPosition} />
            <InlineEaseEditor />
          </div>
        </div>
      </div>
    </div>
  );
};

Timeline.propTypes = {
  timeline: PropTypes.object,
  headHeight: PropTypes.number
};

export default Timeline;
