// WebSocket hooks for live updates

import { useEffect, useRef } from 'react';
import { Subscription } from 'centrifuge';
import { subscribeToPool, subscribeToActivity, subscribeToUser } from '../lib/websocket/channels';
import { useMarketStore } from '../lib/stores/useMarketStore';
import { useActivityStore } from '../lib/stores/useActivityStore';
import { useQueryClient } from '@tanstack/react-query';

/**
 * Hook to subscribe to live pool updates
 */
export const useLivePool = (poolId: string | null) => {
  const subscriptionRef = useRef<Subscription | null>(null);
  const updatePoolPrice = useMarketStore((state) => state.updatePoolPrice);
  const updatePoolTvl = useMarketStore((state) => state.updatePoolTvl);
  const updatePoolProgress = useMarketStore((state) => state.updatePoolProgress);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!poolId) return;

    // Subscribe to pool updates
    subscriptionRef.current = subscribeToPool(poolId, (update) => {
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
          // Refetch pool detail on status change
          queryClient.invalidateQueries({ queryKey: ['pool', poolId] });
          break;
        default:
          break;
      }

      // Calculate and update progress if needed
      if (update.data.currentAmount && update.data.targetAmount) {
        const progress =
          parseFloat(update.data.currentAmount) / parseFloat(update.data.targetAmount);
        updatePoolProgress(poolId, Math.min(progress, 1));
      }
    });

    // Cleanup on unmount
    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
      }
    };
  }, [poolId, updatePoolPrice, updatePoolTvl, updatePoolProgress, queryClient]);
};

/**
 * Hook to subscribe to live activity feed
 */
export const useLiveActivity = () => {
  const subscriptionRef = useRef<Subscription | null>(null);
  const prependEvent = useActivityStore((state) => state.prependEvent);

  useEffect(() => {
    // Subscribe to activity updates
    subscriptionRef.current = subscribeToActivity((update) => {
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

    // Cleanup on unmount
    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
      }
    };
  }, [prependEvent]);
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
