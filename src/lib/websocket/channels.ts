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

export interface PumpfunMintTokensEvent {
  mint?: string;
  token?: string;
  name?: string;
  symbol?: string;
  description?: string;
  website?: string;
  x?: string;
  telegram?: string;
  photo?: string;
  metadataUri?: string;
  creator?: string;
  price?: number;
  priceUsd?: number;
  marketCap?: number;
  marketCapUsd?: number;
  createdAt?: string;
}

export interface TopHolder {
  wallet: string;
  amount: number;
  percentage: number;
}

export interface PumpfunTokenUpdateEvent {
  token?: string; // Token mint address
  mint?: string; // Alias for token
  name?: string;
  symbol?: string;
  description?: string;
  website?: string;
  x?: string;
  telegram?: string;
  photo?: string;
  metadataUri?: string;
  price?: number;
  priceUsd?: number;
  marketCap?: number;
  marketCapUsd?: number;
  volumeSol?: number;
  volumeUsd?: number;
  volume24h?: number;
  liquidity?: number;
  buys?: number;
  sells?: number;
  txCount?: number;
  last_tx_time?: number;
  progress?: number;
  progressSol?: number;
  _balanceSol?: number;
  _balanceTokens?: number;
  updatedAt?: string;
  lastUpdated?: number;
  // New fields from actual websocket data
  isCurrentlyLive?: boolean;
  liveStartTime?: string | null;
  creatorSharePercentage?: number;
  holders?: number;
  topHoldersList?: TopHolder[];
  topHoldersPercentage?: number;
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
        // Failed to parse pool update
      }
    },
    () => {
      // Pool subscription error
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
        // Failed to parse activity update
      }
    },
    () => {
      // Activity subscription error
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
        // Failed to parse user update
      }
    },
    () => {
      // User subscription error
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

/**
 * Subscribe to Pump.fun mint token feed
 */
export const subscribeToPumpfunMintTokens = (
  onUpdate: (update: PumpfunMintTokensEvent) => void
): Subscription | null => {
  const channel = 'pumpfun-mintTokens';

  const subscription = subscribe(
    channel,
    (message) => {
      if (!message) {
        return;
      }

      try {
        const data = message as PumpfunMintTokensEvent;
        onUpdate(data);
      } catch (error) {
        // Failed to parse pumpfun mint tokens update
      }
    },
    () => {
      // Pumpfun mint tokens subscription error
    }
  );

  return subscription;
};

/**
 * Subscribe to Pump.fun token updates feed
 */
export const subscribeToPumpfunTokenUpdates = (
  onUpdate: (update: PumpfunTokenUpdateEvent) => void
): Subscription | null => {
  const channel = 'pumpfun-tokenUpdates';

  const subscription = subscribe(
    channel,
    (message) => {
      if (!message) {
        return;
      }

      try {
        // Parse the message - it comes as the data directly from Centrifuge
        const data = message as PumpfunTokenUpdateEvent;

        // Normalize token/mint field
        if (data.token && !data.mint) {
          data.mint = data.token;
        }

        onUpdate(data);
      } catch (error) {
        // Failed to parse pumpfun token update
      }
    },
    () => {
      // Pumpfun token updates subscription error
    }
  );

  return subscription;
};
