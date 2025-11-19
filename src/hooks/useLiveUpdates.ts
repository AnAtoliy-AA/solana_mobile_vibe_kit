// WebSocket hooks for live updates

import { useEffect, useRef } from 'react';
import { Subscription } from 'centrifuge';
import {
  subscribeToPool,
  subscribeToActivity,
  subscribeToUser,
  subscribeToPumpfunMintTokens,
  subscribeToPumpfunTokenUpdates,
  PumpfunMintTokensEvent,
  PumpfunTokenUpdateEvent,
} from '../lib/websocket/channels';
import { useMarketStore } from '../lib/stores/useMarketStore';
import type { PoolWithTimestamp, WebSocketTokenData } from '../lib/stores/useMarketStore';
import { useActivityStore } from '../lib/stores/useActivityStore';
import { useTokenUpdateStore } from '../lib/stores/useTokenUpdateStore';
import { useQueryClient } from '@tanstack/react-query';
import type { ActivityEvent, Pool } from '../lib/api/types';

const isPoolStatus = (value: string | undefined): value is Pool['status'] => {
  return value === 'active' || value === 'upcoming' || value === 'finished';
};

/**
 * Hook to subscribe to live pool updates
 */
export const useLivePool = (poolId: string | null) => {
  const subscriptionRef = useRef<Subscription | null>(null);
  const updatePoolPrice = useMarketStore((state) => state.updatePoolPrice);
  const updatePoolTvl = useMarketStore((state) => state.updatePoolTvl);
  const updatePoolProgress = useMarketStore((state) => state.updatePoolProgress);
  const updatePoolParticipants = useMarketStore((state) => state.updatePoolParticipants);
  const updatePoolStatus = useMarketStore((state) => state.updatePoolStatus);
  const updatePool = useMarketStore((state) => state.updatePool);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!poolId) return;

    // Subscribe to pool updates
    subscriptionRef.current = subscribeToPool(poolId, (update) => {
      const nextStatus = update.data.status;

      switch (update.type) {
        case 'price':
          if (update.data.price !== undefined) {
            updatePoolPrice(poolId, String(update.data.price));
          }
          break;
        case 'tvl':
          if (update.data.tvl) {
            updatePoolTvl(poolId, update.data.tvl);
          }
          break;
        case 'status':
          if (isPoolStatus(nextStatus)) {
            updatePoolStatus(poolId, nextStatus);
          }
          // Refetch pool detail on status change
          queryClient.invalidateQueries({ queryKey: ['pool', poolId] });
          break;
        case 'participants':
          if (update.data.participants !== undefined) {
            updatePoolParticipants(poolId, update.data.participants);
          }
          break;
        default:
          break;
      }

      // Update multiple fields if provided
      const updates: Partial<PoolWithTimestamp> = {};
      if (update.data.price !== undefined) updates.tokenPrice = String(update.data.price);
      if (update.data.tvl) {
        updates.tvl = update.data.tvl;
        updates.currentAmount = update.data.tvl;
      }
      if (update.data.participants !== undefined) updates.participants = update.data.participants;
      if (isPoolStatus(nextStatus)) {
        updates.status = nextStatus;
      }

      // Calculate and update progress if needed
      if (update.data.currentAmount && update.data.targetAmount) {
        const progress =
          parseFloat(update.data.currentAmount) / parseFloat(update.data.targetAmount);
        updates.progress = Math.min(progress, 1);
        updatePoolProgress(poolId, updates.progress);
      }

      // Batch update if we have multiple fields
      if (Object.keys(updates).length > 0) {
        updatePool(poolId, updates);
      }
    });

    // Cleanup on unmount
    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
      }
    };
  }, [
    poolId,
    updatePoolPrice,
    updatePoolTvl,
    updatePoolProgress,
    updatePoolParticipants,
    updatePoolStatus,
    updatePool,
    queryClient,
  ]);
};

/**
 * Hook to subscribe to live activity feed
 */
export const useLiveActivity = () => {
  const activitySubscriptionRef = useRef<Subscription | null>(null);
  const pumpfunMintSubscriptionRef = useRef<Subscription | null>(null);
  const pumpfunTokenSubscriptionRef = useRef<Subscription | null>(null);
  const prependEvent = useActivityStore((state) => state.prependEvent);
  const recordTokenUpdate = useTokenUpdateStore((state) => state.recordTokenUpdate);
  const addOrUpdatePoolFromWebSocket = useMarketStore(
    (state) => state.addOrUpdatePoolFromWebSocket
  );

  useEffect(() => {
    // Subscribe to activity updates
    activitySubscriptionRef.current = subscribeToActivity((update) => {
      // Create activity event from update
      const event = {
        id: `event_${Date.now()}`,
        type: update.type,
        poolId: update.poolId,
        poolName: update.data.poolName,
        user: update.data.user,
        amount: update.data.amount,
        timestamp: new Date().toISOString(),
        message: update.data.message || `${update.type} event`,
      };

      prependEvent(event);
    });

    // Subscribe to Pump.fun mint tokens feed
    pumpfunMintSubscriptionRef.current = subscribeToPumpfunMintTokens((update) => {
      // Record the mint event with timestamp
      if (update.mint) {
        recordTokenUpdate(update.mint, {
          price: update.price,
          marketCap: update.marketCap,
        });
      }

      // Add new pool to the market store when a token is minted
      addOrUpdatePoolFromWebSocket(toWebSocketTokenData(update));

      const event = mapPumpfunMintToActivityEvent(update);
      if (event) {
        prependEvent(event);
      }
    });

    // Subscribe to Pump.fun token updates feed
    pumpfunTokenSubscriptionRef.current = subscribeToPumpfunTokenUpdates((update) => {
      // Record the token update with timestamp
      const tokenAddress = update.token || update.mint;
      if (tokenAddress) {
        recordTokenUpdate(tokenAddress, {
          holders: update.holders,
          isLive: update.isCurrentlyLive,
          topHoldersPercentage: update.topHoldersPercentage,
          price: update.price,
          marketCap: update.marketCap,
        });
      }

      // Add or update pool in the market store
      addOrUpdatePoolFromWebSocket(toWebSocketTokenData(update));

      const event = mapPumpfunTokenUpdateToActivityEvent(update);
      if (event) {
        prependEvent(event);
      }
    });

    // Cleanup on unmount
    return () => {
      activitySubscriptionRef.current?.unsubscribe();
      pumpfunMintSubscriptionRef.current?.unsubscribe();
      pumpfunTokenSubscriptionRef.current?.unsubscribe();
    };
  }, [prependEvent, recordTokenUpdate, addOrUpdatePoolFromWebSocket]);
};

/**
 * Hook to subscribe to user notifications
 */
export const useLiveUserNotifications = (userId: string | null) => {
  const subscriptionRef = useRef<Subscription | null>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!userId) return;

    // Subscribe to user updates
    subscriptionRef.current = subscribeToUser(userId, (update) => {
      if (update.type === 'notification') {
        // Handle notification
      } else if (update.type === 'position_update') {
        // Refetch user profile on position update
        queryClient.invalidateQueries({ queryKey: ['userProfile', userId] });
      }
    });

    // Cleanup on unmount
    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
      }
    };
  }, [userId, queryClient]);
};

const toWebSocketTokenData = (
  update: PumpfunMintTokensEvent | PumpfunTokenUpdateEvent
): WebSocketTokenData => ({
  token: update.token || update.mint,
  mint: update.mint,
  name: update.name,
  symbol: update.symbol,
  description: update.description,
  website: update.website,
  x: update.x,
  telegram: update.telegram,
  photo: update.photo,
  metadataUri: update.metadataUri,
  price: update.price,
  priceUsd: 'priceUsd' in update ? update.priceUsd : undefined,
  marketCap: update.marketCap,
  marketCapUsd: 'marketCapUsd' in update ? update.marketCapUsd : undefined,
  volumeSol: 'volumeSol' in update ? update.volumeSol : undefined,
  volumeUsd: 'volumeUsd' in update ? update.volumeUsd : undefined,
  volume24h: 'volume24h' in update ? update.volume24h : undefined,
  liquidity: 'liquidity' in update ? update.liquidity : undefined,
  holders: 'holders' in update ? update.holders : undefined,
  buys: 'buys' in update ? update.buys : undefined,
  sells: 'sells' in update ? update.sells : undefined,
  txCount: 'txCount' in update ? update.txCount : undefined,
  progress: 'progress' in update ? update.progress : undefined,
  progressSol: 'progressSol' in update ? update.progressSol : undefined,
  _balanceSol: '_balanceSol' in update ? update._balanceSol : undefined,
  _balanceTokens: '_balanceTokens' in update ? update._balanceTokens : undefined,
  last_tx_time: 'last_tx_time' in update ? update.last_tx_time : undefined,
  isCurrentlyLive: 'isCurrentlyLive' in update ? update.isCurrentlyLive : undefined,
  topHoldersPercentage: 'topHoldersPercentage' in update ? update.topHoldersPercentage : undefined,
  lastUpdated: 'lastUpdated' in update ? update.lastUpdated : undefined,
});

const mapPumpfunMintToActivityEvent = (update: PumpfunMintTokensEvent): ActivityEvent | null => {
  if (!update) {
    return null;
  }

  const messageParts: string[] = [];

  if (update.name) {
    messageParts.push(`${update.name} (${update.symbol || 'TBA'}) created`);
  }

  if (update.price !== undefined) {
    messageParts.push(`price $${update.price}`);
  }

  if (update.marketCap !== undefined) {
    messageParts.push(`mc $${update.marketCap}`);
  }

  const formattedMessage = messageParts.join(' | ');

  return {
    id: `pumpfun_mint_${update.mint || Date.now()}`,
    type: 'milestone',
    poolId: update.mint || 'pumpfun-mint',
    poolName: update.name,
    user: update.creator,
    amount: update.price ? String(update.price) : undefined,
    timestamp: update.createdAt || new Date().toISOString(),
    message: formattedMessage || 'New Pump.fun mint detected',
  };
};

const mapPumpfunTokenUpdateToActivityEvent = (
  update: PumpfunTokenUpdateEvent
): ActivityEvent | null => {
  if (!update) {
    return null;
  }

  const tokenAddress = update.token || update.mint;
  if (!tokenAddress) {
    return null;
  }

  const messageParts: string[] = [];
  const messageReceivedTime = new Date().toISOString(); // Capture exact time message was received

  // Format token identifier
  const tokenId = tokenAddress.slice(0, 4) + '...' + tokenAddress.slice(-4);
  messageParts.push(`Token ${tokenId}`);

  // Add name/symbol if available
  if (update.name && update.symbol) {
    messageParts.push(`${update.name} (${update.symbol})`);
  } else if (update.name) {
    messageParts.push(update.name);
  }

  // Add holders count
  if (update.holders !== undefined) {
    messageParts.push(`${update.holders.toLocaleString()} holders`);
  }

  // Add price if available
  if (update.price !== undefined) {
    messageParts.push(`$${update.price}`);
  }

  // Add market cap if available
  if (update.marketCap !== undefined) {
    const mcFormatted =
      update.marketCap >= 1000000
        ? `$${(update.marketCap / 1000000).toFixed(2)}M`
        : `$${(update.marketCap / 1000).toFixed(1)}K`;
    messageParts.push(`MC ${mcFormatted}`);
  }

  // Add live status
  if (update.isCurrentlyLive) {
    messageParts.push('LIVE');
  }

  // Add top holders concentration
  if (update.topHoldersPercentage !== undefined) {
    messageParts.push(`Top 10: ${(update.topHoldersPercentage * 100).toFixed(1)}%`);
  }

  // Add message received time
  const receivedTime = new Date().toLocaleTimeString();
  messageParts.push(`Received ${receivedTime}`);

  const formattedMessage = messageParts.join(' | ');

  return {
    id: `pumpfun_token_${tokenAddress}_${Date.now()}`,
    type: 'price_update',
    poolId: tokenAddress,
    poolName: update.name || tokenId,
    timestamp: messageReceivedTime, // Use the message received time, not server time
    message: formattedMessage || 'Pump.fun token update received',
  };
};
