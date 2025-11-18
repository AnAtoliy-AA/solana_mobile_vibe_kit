// Market state management with Zustand

import { create } from 'zustand';
import { Pool } from '../api/types';

interface MarketState {
  pools: Pool[];
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
}

export const useMarketStore = create<MarketState>((set) => ({
  pools: [],
  selectedPoolId: null,
  filter: 'all',
  searchQuery: '',

  setPools: (pools) => set({ pools }),

  setSelectedPoolId: (poolId) => set({ selectedPoolId: poolId }),

  setFilter: (filter) => set({ filter }),

  setSearchQuery: (query) => set({ searchQuery: query }),

  updatePoolPrice: (poolId, price) =>
    set((state) => ({
      pools: state.pools.map((pool) =>
        pool.id === poolId ? { ...pool, tokenPrice: price } : pool
      ),
    })),

  updatePoolTvl: (poolId, tvl) =>
    set((state) => ({
      pools: state.pools.map((pool) =>
        pool.id === poolId ? { ...pool, tvl, currentAmount: tvl } : pool
      ),
    })),

  updatePoolProgress: (poolId, progress) =>
    set((state) => ({
      pools: state.pools.map((pool) => (pool.id === poolId ? { ...pool, progress } : pool)),
    })),
}));
