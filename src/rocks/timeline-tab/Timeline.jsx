import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useDrag } from 'react-dnd';
import { useHotkeys } from 'react-hotkeys-hook';
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
  scrollPosition: 0
};

export function Timeline({ timeline, headHeight = 21 }) {
  const [state, setState] = useState(INITIAL_STATE);
  const containerRef = useRef(null);

  const updateSize = () => {
    if (!containerRef.current) return;

    const { width: nodeWidth } = containerRef.current.getBoundingClientRect();
    const { dividerPos, fullWidth } = state;
    const { state: pmState, actions } = BETON.get('project-manager');
    const currentTimeline = pmState.currentTimeline;

    if (nodeWidth !== fullWidth) {
      setState(prev => ({ ...prev, fullWidth: nodeWidth }));
    }

    const timelineWidth = nodeWidth - dividerPos;
    if (currentTimeline && currentTimeline.width !== timelineWidth) {
      actions.set(currentTimeline, 'width', timelineWidth);
    }
  };

  useEffect(() => {
    window.addEventListener('resize', updateSize);
    const interval = setInterval(updateSize, 300);

    return () => {
      window.removeEventListener('resize', updateSize);
      clearInterval(interval);
    };
  }, []);

  // Hotkey handlers
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
    <div ref={containerRef} className={styles['timeline-container']}>
      <div className={styles['timeline-content']}>
        <div className={styles['timeline-head']} style={{ height: headHeight }}>
          <Toolbar />
        </div>
        <div className={styles['timeline-body']} style={{ top: headHeight }}>
          <div className={styles['left-panel']} style={{ width: dividerPos }}>
            <Controls />
          </div>
          <div ref={dragRef} className={styles.divider}>
            <DividerLine />
          </div>
          <div className={styles['right-panel']} style={{ left: dividerPos }}>
            <Timebar />
            <Keylines scrollPosition={scrollPosition} />
          </div>
        </div>
        <InlineEaseEditor />
      </div>
    </div>
  );
}

Timeline.propTypes = {
  timeline: PropTypes.object,
  headHeight: PropTypes.number
};
