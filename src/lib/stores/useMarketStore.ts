// Market state management with Zustand

import { create } from 'zustand';
import { Pool } from '../api/types';
import { normalizeImageUrl } from '../utils/media';

export interface PoolWithTimestamp extends Omit<Pool, 'createdAt' | 'updatedAt'> {
  lastUpdated?: number; // Timestamp in milliseconds - updates every time data changes
  createdAt?: number; // Timestamp in milliseconds - set once when pool is first added
  updatedAt?: string; // ISO string from API
  // Previous values for calculating changes
  previousPrice?: string;
  previousTvl?: string;
  previousParticipants?: number;
  previousProgress?: number;
  // Historical data for trends (last 10 values)
  priceHistory?: number[];
  tvlHistory?: number[];
  participantsHistory?: number[];
}

export interface WebSocketTokenData {
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
  holders?: number;
  buys?: number;
  sells?: number;
  txCount?: number;
  progress?: number;
  progressSol?: number;
  _balanceSol?: number;
  _balanceTokens?: number;
  last_tx_time?: number;
  isCurrentlyLive?: boolean;
  topHoldersPercentage?: number;
  lastUpdated?: number;
}

interface MarketState {
  pools: PoolWithTimestamp[];
  selectedPoolId: string | null;
  filter: 'all' | 'active' | 'upcoming' | 'finished';
  searchQuery: string;

  // Actions
  setPools: (pools: Pool[]) => void;
  setSelectedPoolId: (poolId: string | null) => void;
  setFilter: (filter: 'all' | 'active' | 'upcoming' | 'finished') => void;
  setSearchQuery: (query: string) => void;
  updatePoolPrice: (poolId: string, price: string) => void;
  updatePoolTvl: (poolId: string, tvl: string) => void;
  updatePoolProgress: (poolId: string, progress: number) => void;
  updatePoolParticipants: (poolId: string, participants: number) => void;
  updatePoolStatus: (poolId: string, status: Pool['status']) => void;
  updatePool: (poolId: string, updates: Partial<PoolWithTimestamp>) => void;
  addOrUpdatePoolFromWebSocket: (tokenData: WebSocketTokenData) => void;
}

export const useMarketStore = create<MarketState>((set) => ({
  pools: [],
  selectedPoolId: null,
  filter: 'all',
  searchQuery: '',

  setPools: (pools) =>
    set({
      pools: pools.map((pool) => {
        const poolWithTimestamp = pool as PoolWithTimestamp;
        return {
          ...poolWithTimestamp,
          createdAt: poolWithTimestamp.createdAt || Date.now(),
          lastUpdated: undefined, // Don't set lastUpdated initially - only on websocket updates
        };
      }),
    }),

  setSelectedPoolId: (poolId) => set({ selectedPoolId: poolId }),

  setFilter: (filter) => set({ filter }),

  setSearchQuery: (query) => set({ searchQuery: query }),

  updatePoolPrice: (poolId, price) =>
    set((state) => ({
      pools: state.pools.map((pool) => {
        if (pool.id === poolId) {
          const priceNum = parseFloat(price);
          const previousPrice = pool.tokenPrice;
          const priceHistory = pool.priceHistory || [];
          const newHistory = [...priceHistory, priceNum].slice(-10); // Keep last 10 values

          return {
            ...pool,
            tokenPrice: price,
            previousPrice,
            priceHistory: newHistory,
            lastUpdated: Date.now(),
            createdAt: pool.createdAt || Date.now(),
          };
        }
        return pool;
      }),
    })),

  updatePoolTvl: (poolId, tvl) =>
    set((state) => ({
      pools: state.pools.map((pool) => {
        if (pool.id === poolId) {
          const tvlNum = parseFloat(tvl);
          const previousTvl = pool.tvl;
          const tvlHistory = pool.tvlHistory || [];
          const newHistory = [...tvlHistory, tvlNum].slice(-10);

          return {
            ...pool,
            tvl,
            currentAmount: tvl,
            previousTvl,
            tvlHistory: newHistory,
            lastUpdated: Date.now(),
            createdAt: pool.createdAt || Date.now(),
          };
        }
        return pool;
      }),
    })),

  updatePoolProgress: (poolId, progress) =>
    set((state) => ({
      pools: state.pools.map((pool) => {
        if (pool.id === poolId) {
          const previousProgress = pool.progress;
          return {
            ...pool,
            progress,
            previousProgress,
            lastUpdated: Date.now(),
            createdAt: pool.createdAt || Date.now(),
          };
        }
        return pool;
      }),
    })),

  updatePoolParticipants: (poolId, participants) =>
    set((state) => ({
      pools: state.pools.map((pool) => {
        if (pool.id === poolId) {
          const previousParticipants = pool.participants;
          const participantsHistory = pool.participantsHistory || [];
          const newHistory = [...participantsHistory, participants].slice(-10);

          return {
            ...pool,
            participants,
            previousParticipants,
            participantsHistory: newHistory,
            lastUpdated: Date.now(),
            createdAt: pool.createdAt || Date.now(),
          };
        }
        return pool;
      }),
    })),

  updatePoolStatus: (poolId, status) =>
    set((state) => ({
      pools: state.pools.map((pool) =>
        pool.id === poolId
          ? {
              ...pool,
              status,
              lastUpdated: Date.now(),
              createdAt: pool.createdAt || Date.now(),
            }
          : pool
      ),
    })),

  updatePool: (poolId, updates) =>
    set((state) => ({
      pools: state.pools.map((pool) =>
        pool.id === poolId
          ? {
              ...pool,
              ...updates,
              lastUpdated: Date.now(),
              createdAt: pool.createdAt || Date.now(),
            }
          : pool
      ),
    })),

  addOrUpdatePoolFromWebSocket: (tokenData) =>
    set((state) => {
      const tokenAddress = tokenData.token || tokenData.mint;
      if (!tokenAddress) {
        return state;
      }

      // Determine if this is a new token announcement or just a price/stats update
      // New token announcements have name, symbol, and usually description/metadata
      const isNewTokenAnnouncement = !!(tokenData.name && tokenData.symbol);

      // Check if pool already exists
      const existingPoolIndex = state.pools.findIndex((pool) => pool.id === tokenAddress);

      if (existingPoolIndex !== -1) {
        // Update existing pool - only update values and timestamp

        const updatedPools = [...state.pools];
        const existingPool = updatedPools[existingPoolIndex];

        // Prepare historical tracking
        const updates: Partial<PoolWithTimestamp> = {};

        // Track TVL/Market Cap changes
        if (tokenData.marketCapUsd !== undefined || tokenData.marketCap !== undefined) {
          const newTvl = String(tokenData.marketCapUsd || tokenData.marketCap);
          const tvlNum = parseFloat(newTvl);
          const tvlHistory = existingPool.tvlHistory || [];
          updates.tvl = newTvl;
          updates.currentAmount = newTvl;
          updates.previousTvl = existingPool.tvl;
          updates.tvlHistory = [...tvlHistory, tvlNum].slice(-10);
        }

        // Track price changes
        if (tokenData.priceUsd !== undefined || tokenData.price !== undefined) {
          const newPrice = String(tokenData.priceUsd || tokenData.price);
          const priceNum = parseFloat(newPrice);
          const priceHistory = existingPool.priceHistory || [];
          updates.tokenPrice = newPrice;
          updates.previousPrice = existingPool.tokenPrice;
          updates.priceHistory = [...priceHistory, priceNum].slice(-10);
        }

        // Track holders/participants changes
        if (tokenData.holders !== undefined) {
          const participantsHistory = existingPool.participantsHistory || [];
          updates.participants = tokenData.holders;
          updates.previousParticipants = existingPool.participants;
          updates.participantsHistory = [...participantsHistory, tokenData.holders].slice(-10);
        }

        // Track progress changes
        if (tokenData.progress !== undefined) {
          updates.progress = tokenData.progress;
          updates.previousProgress = existingPool.progress;
        }

        updatedPools[existingPoolIndex] = {
          ...existingPool,
          ...updates,
          // Update timestamp
          lastUpdated: Date.now(),
          createdAt: existingPool.createdAt || Date.now(),
        };

        return { pools: updatedPools };
      } else if (isNewTokenAnnouncement) {
        // Only create new pool entry if this is a new token announcement (has name/symbol)
        // Do NOT create pools for price updates of tokens we don't know about

        // Safely extract image URL from metadataUri or photo
        const safeImageUrl =
          normalizeImageUrl(tokenData.metadataUri) || normalizeImageUrl(tokenData.photo);

        const newPool: PoolWithTimestamp = {
          id: tokenAddress,
          name: tokenData.name || 'Unknown Token',
          symbol: tokenData.symbol || 'TBA',
          description:
            tokenData.description || (tokenData.isCurrentlyLive ? 'Currently live' : undefined),
          status: 'active',
          progress: tokenData.progress || 0,
          tvl: tokenData.marketCapUsd
            ? String(tokenData.marketCapUsd)
            : tokenData.marketCap
              ? String(tokenData.marketCap)
              : '0',
          participants: tokenData.holders || 0,
          startTime: new Date().toISOString(),
          endTime: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
          targetAmount: tokenData.marketCapUsd
            ? String(tokenData.marketCapUsd * 2)
            : tokenData.marketCap
              ? String(tokenData.marketCap * 2)
              : '1000000',
          currentAmount: tokenData.marketCapUsd
            ? String(tokenData.marketCapUsd)
            : tokenData.marketCap
              ? String(tokenData.marketCap)
              : '0',
          tokenPrice: tokenData.priceUsd
            ? String(tokenData.priceUsd)
            : tokenData.price
              ? String(tokenData.price)
              : '0',
          tags: tokenData.isCurrentlyLive ? ['live', 'pumpfun'] : ['pumpfun'],
          imageUrl: safeImageUrl, // Use safely validated image URL
          websiteUrl: tokenData.website,
          twitterUrl: tokenData.x,
          createdAt: Date.now(),
          lastUpdated: Date.now(),
        };

        // Add new pool at the beginning (most recent first)
        return {
          pools: [newPool, ...state.pools],
        };
      } else {
        // This is a price update for a token we don't know about - ignore it
        return state;
      }
    }),
}));
