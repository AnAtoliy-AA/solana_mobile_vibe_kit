// Component to display "last updated" time

import React from 'react';
import { useTimeAgo } from '../../hooks/useTimeAgo';
import './LastUpdated.css';

interface LastUpdatedProps {
  timestamp?: number;
  prefix?: string;
}

const LastUpdated: React.FC<LastUpdatedProps> = ({ timestamp, prefix = 'Updated' }) => {
  const timeAgo = useTimeAgo(timestamp);

  if (!timestamp || !timeAgo) {
    return null;
  }

  return (
    <span className="last-updated" title={new Date(timestamp).toLocaleString()}>
      <span className="last-updated-indicator" aria-hidden="true" />
      {prefix} {timeAgo}
    </span>
  );
};

export default LastUpdated;
