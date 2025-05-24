import React from 'react';
import { CardProps } from '../types';

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hover = false,
  dark = false,
  onClick,
}) => {
  const baseClasses = 'card';
  const hoverClasses = hover ? 'card--hover' : '';
  const darkClasses = dark ? 'card--dark' : '';
  const combinedClasses = `${baseClasses} ${hoverClasses} ${darkClasses} ${className}`.trim();

  const CardElement = onClick ? 'button' : 'div';

  return (
    <CardElement
      className={combinedClasses}
      onClick={onClick}
      type={onClick ? 'button' : undefined}
    >
      {children}
    </CardElement>
  );
};

export default Card;