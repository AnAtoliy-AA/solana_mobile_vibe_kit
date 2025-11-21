// TrendChart - displays mini bar chart for value trends

import React from 'react';

interface TrendChartProps {
  data: number[];
  height?: number;
  className?: string;
}

const TrendChart: React.FC<TrendChartProps> = ({ data, height = 20, className = '' }) => {
  if (!data || data.length === 0) {
    return null;
  }

  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  const normalize = (value: number) => {
    return ((value - min) / range) * 100;
  };

  const getChangeClass = (index: number) => {
    if (index === 0) return 'neutral';
    const current = data[index];
    const previous = data[index - 1];
    if (current > previous) return 'positive';
    if (current < previous) return 'negative';
    return 'neutral';
  };

  return (
    <div className={`trend-indicator ${className}`} style={{ height: `${height}px` }}>
      {data.map((value, index) => (
        <div
          key={index}
          className={`trend-bar ${getChangeClass(index)}`}
          style={{ height: `${normalize(value)}%` }}
          title={`Value: ${value.toFixed(2)}`}
        />
      ))}
    </div>
  );
};

export default TrendChart;
