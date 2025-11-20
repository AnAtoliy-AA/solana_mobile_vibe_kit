import { act } from '@testing-library/react';
import { useMarketStore } from './useMarketStore';
import { Pool } from '../api/types';
import { createZustandResetter } from '../utils/test-utils';

const basePool: Pool = {
  id: 'pool-1',
  name: 'Test Token',
  symbol: 'TEST',
  status: 'active',
  progress: 0.1,
  tvl: '1000',
  participants: 10,
  startTime: new Date().toISOString(),
  endTime: new Date().toISOString(),
  targetAmount: '2000',
  currentAmount: '1000',
  tokenPrice: '0.1',
  tags: [],
};

describe('useMarketStore', () => {
  const resetStore = createZustandResetter(useMarketStore);

  beforeEach(() => {
    resetStore();
  });

  it('sets pools with timestamps', () => {
    act(() => {
      useMarketStore.getState().setPools([basePool]);
    });
    const pools = useMarketStore.getState().pools;
    expect(pools).toHaveLength(1);
    expect(pools[0].createdAt).toBeDefined();
  });

  it('updates pool price', () => {
    act(() => {
      useMarketStore.getState().setPools([basePool]);
    });
    act(() => {
      useMarketStore.getState().updatePoolPrice('pool-1', '0.2');
    });
    expect(useMarketStore.getState().pools[0].tokenPrice).toBe('0.2');
  });

  it('adds new pool from websocket announcements', () => {
    act(() => {
      useMarketStore.getState().addOrUpdatePoolFromWebSocket({
        token: 'socket-token',
        name: 'Socket',
        symbol: 'SOC',
        photo: 'https://ipfs.io/ipfs/img.png',
      });
    });
    const pools = useMarketStore.getState().pools;
    expect(pools[0].id).toBe('socket-token');
    expect(pools[0].imageUrl).toContain('https://');
  });

  it('ignores websocket updates without identifiers', () => {
    act(() => {
      useMarketStore.getState().addOrUpdatePoolFromWebSocket({ priceUsd: 1 });
    });
    expect(useMarketStore.getState().pools).toHaveLength(0);
  });
});
