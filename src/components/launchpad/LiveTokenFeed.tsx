// Live token feed showing tokens from websocket messages

import React, { useMemo } from 'react';
import { IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonBadge } from '@ionic/react';
import { useTokenUpdateStore } from '../../lib/stores/useTokenUpdateStore';
import { useTimeAgo } from '../../hooks/useTimeAgo';
import './LiveTokenFeed.css';

const LiveTokenFeed: React.FC = () => {
  const tokenUpdates = useTokenUpdateStore((state) => state.tokenUpdates);

  // Convert Map to array and sort by most recent first
  const sortedTokens = useMemo(() => {
    return Array.from(tokenUpdates.values()).sort((a, b) => b.lastMessageTime - a.lastMessageTime);
  }, [tokenUpdates]);

  if (sortedTokens.length === 0) {
    return (
      <IonCard className="live-token-feed">
        <IonCardHeader>
          <IonCardTitle>Live Token Updates</IonCardTitle>
        </IonCardHeader>
        <IonCardContent>
          <div className="feed-empty">
            <p>Waiting for websocket messages...</p>
            <p className="feed-hint">Token updates will appear here when received</p>
          </div>
        </IonCardContent>
      </IonCard>
    );
  }

  return (
    <IonCard className="live-token-feed">
      <IonCardHeader>
        <div className="feed-header">
          <IonCardTitle>Live Token Updates</IonCardTitle>
          <IonBadge color="success">{sortedTokens.length} tokens</IonBadge>
        </div>
      </IonCardHeader>
      <IonCardContent>
        <div className="token-list">
          {sortedTokens.map((token) => (
            <TokenItem key={token.token} tokenUpdate={token} />
          ))}
        </div>
      </IonCardContent>
    </IonCard>
  );
};

interface TokenItemProps {
  tokenUpdate: {
    token: string;
    lastMessageTime: number;
    holders?: number;
    isLive?: boolean;
    topHoldersPercentage?: number;
    price?: number;
    marketCap?: number;
  };
}

const TokenItem: React.FC<TokenItemProps> = ({ tokenUpdate }) => {
  const timeAgo = useTimeAgo(tokenUpdate.lastMessageTime);
  const receivedTime = new Date(tokenUpdate.lastMessageTime);

  const formatTokenAddress = (address: string) => {
    return address.slice(0, 6) + '...' + address.slice(-6);
  };

  const formatMarketCap = (mc?: number) => {
    if (typeof mc !== 'number') {
      return null;
    }
    if (mc >= 1000000) return `$${(mc / 1000000).toFixed(2)}M`;
    if (mc >= 1000) return `$${(mc / 1000).toFixed(1)}K`;
    return `$${mc.toFixed(0)}`;
  };

  return (
    <div className="token-item" title={`Message received: ${receivedTime.toLocaleString()}`}>
      <div className="token-info">
        <div className="token-address">
          <code>{formatTokenAddress(tokenUpdate.token)}</code>
          {tokenUpdate.isLive && <span className="live-badge">LIVE</span>}
        </div>
        <div className="token-stats">
          {tokenUpdate.holders !== undefined && (
            <span className="stat">Holders: {tokenUpdate.holders.toLocaleString()}</span>
          )}
          {tokenUpdate.price !== undefined && (
            <span className="stat">Price: ${tokenUpdate.price}</span>
          )}
          {tokenUpdate.marketCap !== undefined && (
            <span className="stat">Market Cap: {formatMarketCap(tokenUpdate.marketCap)}</span>
          )}
          {tokenUpdate.topHoldersPercentage !== undefined && (
            <span className="stat">
              Top 10: {(tokenUpdate.topHoldersPercentage * 100).toFixed(1)}%
            </span>
          )}
        </div>
      </div>
      <div className="token-time">
        <span className="time-indicator" aria-hidden="true" />
        <span className="time-ago">{timeAgo || 'just now'}</span>
        <span className="exact-time">{receivedTime.toLocaleTimeString()}</span>
      </div>
    </div>
  );
};

export default LiveTokenFeed;
