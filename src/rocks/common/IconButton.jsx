import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useTheme } from '../workspace/ThemeContext';
import styles from './IconButton.module.css';

const IconButton = ({
  icon,
  onClick,
  tooltip,
  disabled = false,
  size = 'medium',
  variant = 'default',
  className,
  children,
}) => {
  const theme = useTheme();

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={classNames(
        styles.iconButton,
        styles[size],
        styles[variant],
        className,
      )}
      title={tooltip}
      style={{
        '--icon-size': theme.spacing(size === 'small' ? 2.5 : size === 'large' ? 3.5 : 3),
        '--hover-color': theme.color('hover'),
        '--active-color': theme.color('selected'),
        '--disabled-color': theme.color('disabled'),
      }}
    >
      <span className={styles.icon} aria-hidden="true">
        {icon}
      </span>
      {children && <span className={styles.label}>{children}</span>}
    </button>
  );
};

IconButton.propTypes = {
  icon: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  tooltip: PropTypes.string,
  disabled: PropTypes.bool,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  variant: PropTypes.oneOf(['default', 'primary', 'secondary', 'danger']),
  className: PropTypes.string,
  children: PropTypes.node,
};

export default React.memo(IconButton);
