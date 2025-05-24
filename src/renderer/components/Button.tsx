import React from 'react';
import { ButtonProps } from '../types';

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  onClick,
  children,
  className = '',
}) => {
  const baseClasses = 'btn';
  const variantClasses = `btn--${variant}`;
  const sizeClasses = `btn--${size}`;
  const combinedClasses = `${baseClasses} ${variantClasses} ${sizeClasses} ${className}`.trim();

  return (
    <button
      className={combinedClasses}
      disabled={disabled || loading}
      onClick={onClick}
      type="button"
    >
      {loading && (
        <span className="loading-spinner" aria-hidden="true">
          ⟳
        </span>
      )}
      {children}
    </button>
  );
};

export default Button;