import React, { useState, useCallback, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '../workspace/ThemeContext';
import styles from './Timeline.module.css';

const KeyframeEditor = ({
  keyframe,
  onUpdate,
  onClose,
  position,
}) => {
  const theme = useTheme();
  const [value, setValue] = useState(keyframe.value);
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
    inputRef.current?.select();
  }, []);

  const handleSubmit = useCallback((event) => {
    event.preventDefault();
    let parsedValue = value;

    // Try to parse as number if possible
    if (!isNaN(value) && value !== '') {
      parsedValue = Number(value);
    }

    onUpdate(keyframe.id, { value: parsedValue });
    onClose();
  }, [keyframe.id, value, onUpdate, onClose]);

  const handleKeyDown = useCallback((event) => {
    if (event.key === 'Escape') {
      onClose();
    }
  }, [onClose]);

  const handleChange = useCallback((event) => {
    setValue(event.target.value);
  }, []);

  const handleBlur = useCallback(() => {
    onClose();
  }, [onClose]);

  return (
    <div
      className={styles.keyframeEditor}
      style={{
        left: position.x,
        top: position.y,
        '--editor-background': theme.color('background'),
        '--editor-border': theme.color('border'),
      }}
    >
      <form onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          className={styles.keyframeEditorInput}
        />
      </form>
    </div>
  );
};

KeyframeEditor.propTypes = {
  keyframe: PropTypes.shape({
    id: PropTypes.string.isRequired,
    value: PropTypes.any.isRequired,
  }).isRequired,
  onUpdate: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  position: PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
  }).isRequired,
};

export default KeyframeEditor;

export function useKeyframeEditor() {
  const [editor, setEditor] = useState(null);

  const showEditor = useCallback((keyframe, position) => {
    setEditor({ keyframe, position });
  }, []);

  const hideEditor = useCallback(() => {
    setEditor(null);
  }, []);

  return {
    editor,
    showEditor,
    hideEditor,
  };
}
