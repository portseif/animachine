import React, { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useTheme } from '../../workspace/ThemeContext';
import { useTimelineState } from '../hooks/useTimelineState';
import { useKeyline } from '../hooks/useKeyline';
import Key from './Key';
import Ease from './Ease';
import TranslateKeylines from './TranslateKeylines';
import styles from './Keyline.module.css';

const Keyline = ({ keyHolder, top, height }) => {
  const theme = useTheme();
  const timeline = useTimelineState();
  const { dragRef, isSelected, handleClick } = useKeyline(keyHolder, timeline);
  const isGroup = Boolean(keyHolder.params);

  const renderParam = useCallback((param) => {
    const elements = [];

    // Render keys
    param.keys.forEach((key) => {
      elements.push(
        <Key
          key={key.uid}
          _key={key}
          isGroup={isGroup}
          isSelected={isSelected}
          height={height}
        />
      );
    });

    // Render eases between keys
    param.keys.forEach((key, index) => {
      if (index < param.keys.length - 1) {
        const nextKey = param.keys[index + 1];
        elements.push(
          <Ease
            key={`${key.uid}-ease`}
            height={height}
            ease={key.ease}
            startKey={key}
            endKey={nextKey}
          />
        );
      }
    });

    return elements;
  }, [height, isGroup, isSelected]);

  const renderBottomLine = useCallback(() => (
    <line
      x1={0}
      y1={height}
      x2={timeline.width}
      y2={height}
      className={styles.bottomLine}
    />
  ), [height, timeline.width]);

  const keylineClassName = useMemo(() => 
    classNames(styles.keyline, {
      [styles.selected]: isSelected,
    })
  , [isSelected]);

  return (
    <svg
      ref={dragRef}
      className={keylineClassName}
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
  keyHolder: PropTypes.shape({
    params: PropTypes.array,
    keys: PropTypes.array,
  }).isRequired,
  top: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
};

export default React.memo(Keyline);
