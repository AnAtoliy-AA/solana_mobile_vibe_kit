// WebSocket channel management and message handlers

import { subscribe, unsubscribe } from './centrifuge';
import { Subscription } from 'centrifuge';

export type ChannelType = 'pool' | 'activity' | 'user';

export interface PoolUpdateData {
  price?: number;
  status?: string;
  tvl?: string;
  participants?: number;
  currentAmount?: string;
  targetAmount?: string;
}

export interface PoolUpdate {
  type: 'price' | 'status' | 'tvl' | 'participants';
  poolId: string;
  data: PoolUpdateData;
}

export interface ActivityUpdateData {
  poolName?: string;
  user?: string;
  amount?: string;
  message?: string;
}

export interface ActivityUpdate {
  type: 'participation' | 'status_change' | 'price_update' | 'milestone';
  poolId: string;
  data: ActivityUpdateData;
}

export interface UserUpdateData {
  message?: string;
  title?: string;
  positionId?: string;
}

export interface UserUpdate {
  type: 'notification' | 'position_update';
  userId: string;
  data: UserUpdateData;
}

/**
 * Subscribe to pool updates
 */
export const subscribeToPool = (
  poolId: string,
  onUpdate: (update: PoolUpdate) => void
): Subscription | null => {
  const channel = `pool:${poolId}`;

  return subscribe(
    channel,
    (message) => {
      try {
        const msg = message as { type?: string; data?: PoolUpdateData };
        const update: PoolUpdate = {
          type: (msg.type as PoolUpdate['type']) || 'price',
          poolId,
          data: msg.data || (msg as PoolUpdateData),
        };
        onUpdate(update);
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Failed to parse pool update:', error);
        }
      }
    },
    (error) => {
      if (process.env.NODE_ENV === 'development') {
        console.error(`Pool subscription error for ${poolId}:`, error);
      }
    }
  );
};

/**
 * Subscribe to activity feed
 */
export const subscribeToActivity = (
  onUpdate: (update: ActivityUpdate) => void
): Subscription | null => {
  const channel = 'activity';

  return subscribe(
    channel,
    (message) => {
      try {
        const msg = message as { type?: string; poolId?: string; data?: ActivityUpdateData };
        const update: ActivityUpdate = {
          type: (msg.type as ActivityUpdate['type']) || 'participation',
          poolId: msg.poolId || '',
          data: msg.data || (msg as ActivityUpdateData),
        };
        onUpdate(update);
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Failed to parse activity update:', error);
        }
      }
    },
    (error) => {
      if (process.env.NODE_ENV === 'development') {
        console.error('Activity subscription error:', error);
      }
    }
  );
};

/**
 * Subscribe to user notifications
 */
export const subscribeToUser = (
  userId: string,
  onUpdate: (update: UserUpdate) => void
): Subscription | null => {
  const channel = `user:${userId}`;

  return subscribe(
    channel,
    (message) => {
      try {
        const msg = message as { type?: string; data?: UserUpdateData };
        const update: UserUpdate = {
          type: (msg.type as UserUpdate['type']) || 'notification',
          userId,
          data: msg.data || (msg as UserUpdateData),
        };
        onUpdate(update);
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Failed to parse user update:', error);
        }
      }
    },
    (error) => {
      if (process.env.NODE_ENV === 'development') {
        console.error(`User subscription error for ${userId}:`, error);
      }
    }
  );
};

/**
 * Unsubscribe from all channels
 */
export const unsubscribeAll = (subscriptions: (Subscription | null)[]): void => {
  subscriptions.forEach((sub) => {
    if (sub) {
      unsubscribe(sub);
    }
  });
};
