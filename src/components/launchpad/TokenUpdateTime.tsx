// Component to display when websocket message was received for a token

import React from 'react';
import { useTokenUpdateStore } from '../../lib/stores/useTokenUpdateStore';
import { useTimeAgo } from '../../hooks/useTimeAgo';
import './TokenUpdateTime.css';

interface TokenUpdateTimeProps {
  token: string; // Token mint address
  showDetails?: boolean;
}

const TokenUpdateTime: React.FC<TokenUpdateTimeProps> = ({ token, showDetails = false }) => {
  const tokenUpdate = useTokenUpdateStore((state) => state.getTokenUpdate(token));
  const timeAgo = useTimeAgo(tokenUpdate?.lastMessageTime);

  if (!tokenUpdate || !tokenUpdate.lastMessageTime) {
    return null;
  }

  const receivedTime = new Date(tokenUpdate.lastMessageTime);

  return (
    <div className="token-update-time" title={`Message received: ${receivedTime.toLocaleString()}`}>
      <span className="update-indicator" aria-hidden="true" />
      <span className="update-time">{timeAgo || 'just now'}</span>
      {showDetails && tokenUpdate.holders !== undefined && (
        <span className="update-details">
          {tokenUpdate.holders.toLocaleString()} holders
          {tokenUpdate.topHoldersPercentage !== undefined && (
            <> - Top 10: {(tokenUpdate.topHoldersPercentage * 100).toFixed(1)}%</>
          )}
        </span>
      )}
    </div>
  );
};

export default TokenUpdateTime;
