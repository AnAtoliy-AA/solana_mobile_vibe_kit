// ChangeIndicator - displays value changes with arrows and colors

import React from 'react';

interface ChangeIndicatorProps {
  change: number;
  showPercent?: boolean;
  showArrow?: boolean;
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

const ChangeIndicator: React.FC<ChangeIndicatorProps> = ({
  change,
  showPercent = true,
  showArrow = true,
  size = 'medium',
  className = '',
}) => {
  const isPositive = change > 0;
  const isNegative = change < 0;
  const isNeutral = change === 0;

  const getClassName = () => {
    if (size === 'small') {
      return `metric-change ${isPositive ? 'positive' : isNegative ? 'negative' : 'neutral'} ${className}`;
    } else if (size === 'large') {
      return `price-change-large ${isPositive ? 'positive' : isNegative ? 'negative' : 'neutral'} ${className}`;
    }
    return `price-change-badge ${isPositive ? 'positive' : isNegative ? 'negative' : 'neutral'} ${className}`;
  };

  const getArrow = () => {
    if (isPositive) return '↑';
    if (isNegative) return '↓';
    return '→';
  };

  if (isNeutral && !showPercent) {
    return null;
  }

  return (
    <span className={getClassName()}>
      {showArrow && (
        <span className={`change-arrow ${isPositive ? 'up' : isNegative ? 'down' : ''}`}>
          {getArrow()}
        </span>
      )}
      {showPercent && (
        <span>
          {isPositive && '+'}
          {change.toFixed(2)}%
        </span>
      )}
    </span>
  );
};

export default ChangeIndicator;
