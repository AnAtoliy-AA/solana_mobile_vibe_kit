// Hook for displaying "time ago" with auto-refresh

import { useState, useEffect } from 'react';

/**
 * Hook that returns a formatted "time ago" string and automatically updates it
 * @param timestamp - Unix timestamp in milliseconds
 * @param refreshInterval - How often to update (in ms), default 10 seconds
 * @returns Formatted time ago string (e.g., "2s ago", "5m ago", "1h ago")
 */
export const useTimeAgo = (timestamp?: number, refreshInterval = 10000): string => {
  const [timeAgo, setTimeAgo] = useState<string>('');

  useEffect(() => {
    if (!timestamp) {
      setTimeAgo('');
      return;
    }

    const updateTimeAgo = () => {
      const now = Date.now();
      const diffMs = now - timestamp;
      const diffSec = Math.floor(diffMs / 1000);
      const diffMin = Math.floor(diffSec / 60);
      const diffHour = Math.floor(diffMin / 60);
      const diffDay = Math.floor(diffHour / 24);

      if (diffSec < 10) {
        setTimeAgo('just now');
      } else if (diffSec < 60) {
        setTimeAgo(`${diffSec}s ago`);
      } else if (diffMin < 60) {
        setTimeAgo(`${diffMin}m ago`);
      } else if (diffHour < 24) {
        setTimeAgo(`${diffHour}h ago`);
      } else {
        setTimeAgo(`${diffDay}d ago`);
      }
    };

    // Update immediately
    updateTimeAgo();

    // Set up interval to update periodically
    const interval = setInterval(updateTimeAgo, refreshInterval);

    return () => clearInterval(interval);
  }, [timestamp, refreshInterval]);

  return timeAgo;
};
