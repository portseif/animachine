import React, { useCallback, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '../workspace/ThemeContext';
import styles from './Timeline.module.css';

const TimelineContextMenu = ({
  x,
  y,
  items,
  onClose,
}) => {
  const theme = useTheme();
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleItemClick = useCallback((item) => {
    item.onClick();
    onClose();
  }, [onClose]);

  return (
    <div
      ref={menuRef}
      className={styles.contextMenu}
      style={{
        left: x,
        top: y,
        '--menu-background': theme.color('background'),
        '--menu-border': theme.color('border'),
      }}
    >
      {items.map((item, index) => (
        <React.Fragment key={item.id || index}>
          {item.separator ? (
            <div className={styles.contextMenuSeparator} />
          ) : (
            <button
              className={styles.contextMenuItem}
              onClick={() => handleItemClick(item)}
              disabled={item.disabled}
            >
              {item.icon && (
                <span className={styles.contextMenuIcon}>
                  {item.icon}
                </span>
              )}
              <span className={styles.contextMenuLabel}>
                {item.label}
              </span>
              {item.shortcut && (
                <span className={styles.contextMenuShortcut}>
                  {item.shortcut}
                </span>
              )}
            </button>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

TimelineContextMenu.propTypes = {
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  items: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    label: PropTypes.string,
    icon: PropTypes.node,
    shortcut: PropTypes.string,
    onClick: PropTypes.func,
    disabled: PropTypes.bool,
    separator: PropTypes.bool,
  })).isRequired,
  onClose: PropTypes.func.isRequired,
};

export default TimelineContextMenu;

export function useContextMenu() {
  const [contextMenu, setContextMenu] = React.useState(null);

  const showContextMenu = useCallback((event, items) => {
    event.preventDefault();
    setContextMenu({
      x: event.clientX,
      y: event.clientY,
      items,
    });
  }, []);

  const hideContextMenu = useCallback(() => {
    setContextMenu(null);
  }, []);

  return {
    contextMenu,
    showContextMenu,
    hideContextMenu,
  };
}
