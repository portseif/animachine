import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { useTimelineState } from '../hooks/useTimelineState';
import { useKeyline } from '../hooks/useKeyline';
import Key from './Key';
import Ease from './Ease';
import styles from './Keyline.module.css';

const TranslateKeylines = memo(({ timeline, children }) => {
  const style = {
    transform: `translateX(${timeline.start * timeline.pxpms}px)`,
  };
  
  return (
    <g className={styles.translateContainer} style={style}>
      {children}
    </g>
  );
});

TranslateKeylines.propTypes = {
  timeline: PropTypes.object.isRequired,
  children: PropTypes.node,
};

const Keyline = ({ keyHolder, top, height }) => {
  const timeline = useTimelineState();
  const { dragRef, themeColors, handleClick } = useKeyline(keyHolder, timeline);
  const isGroup = Boolean(keyHolder.params);

  const renderParam = (param) => {
    const elements = [];

    // Render keys
    param.keys.forEach((key) => {
      elements.push(
        <Key
          key={key.uid}
          _key={key}
          isGroup={isGroup}
          colors={themeColors}
          height={height}
        />
      );
    });

    // Render eases
    param.keys.forEach((key) => {
      elements.push(
        <Ease
          key={key.ease.uid}
          height={height}
          colors={themeColors}
          ease={key.ease}
        />
      );
    });

    return elements;
  };

  const renderBottomLine = () => (
    <line
      x1={0}
      y1={height}
      x2={timeline.width}
      y2={height}
      className={styles.bottomLine}
    />
  );

  return (
    <svg
      ref={dragRef}
      className={styles.keyline}
      style={{
        position: 'absolute',
        left: 0,
        top,
        width: timeline.width,
        height,
      }}
      onClick={handleClick}
    >
      {renderBottomLine()}
      <TranslateKeylines timeline={timeline}>
        {isGroup
          ? keyHolder.params.map((param) => renderParam(param))
          : renderParam(keyHolder)
        }
      </TranslateKeylines>
    </svg>
  );
};

Keyline.propTypes = {
  keyHolder: PropTypes.object.isRequired,
  top: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
};

export default memo(Keyline);
