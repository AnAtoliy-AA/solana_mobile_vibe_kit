import { renderHook, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useLivePool, useLiveActivity } from './useLiveUpdates';
import { useMarketStore } from '../lib/stores/useMarketStore';
import { useActivityStore } from '../lib/stores/useActivityStore';
import { useTokenUpdateStore } from '../lib/stores/useTokenUpdateStore';
import {
  subscribeToPool,
  subscribeToActivity,
  subscribeToPumpfunMintTokens,
  subscribeToPumpfunTokenUpdates,
} from '../lib/websocket/channels';

jest.mock('../lib/stores/useMarketStore', () => ({
  useMarketStore: jest.fn(),
}));

jest.mock('../lib/stores/useActivityStore', () => ({
  useActivityStore: jest.fn(),
}));

jest.mock('../lib/stores/useTokenUpdateStore', () => ({
  useTokenUpdateStore: jest.fn(),
}));

jest.mock('../lib/websocket/channels', () => ({
  subscribeToPool: jest.fn(),
  subscribeToActivity: jest.fn(),
  subscribeToUser: jest.fn(),
  subscribeToPumpfunMintTokens: jest.fn(),
  subscribeToPumpfunTokenUpdates: jest.fn(),
}));

const marketStoreMock = {
  updatePoolPrice: jest.fn(),
  updatePoolTvl: jest.fn(),
  updatePoolProgress: jest.fn(),
  updatePoolParticipants: jest.fn(),
  updatePoolStatus: jest.fn(),
  updatePool: jest.fn(),
  addOrUpdatePoolFromWebSocket: jest.fn(),
};

const activityStoreMock = {
  prependEvent: jest.fn(),
};

const tokenUpdateStoreMock = {
  recordTokenUpdate: jest.fn(),
};

const subscriptionMock = () => ({
  unsubscribe: jest.fn(),
});

const setupWrapper = () => {
  const queryClient = new QueryClient();
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  Wrapper.displayName = 'QueryClientWrapper';
  return Wrapper;
};

describe('useLivePool', () => {
  const wrapper = setupWrapper();
  let poolCallback: ((payload: any) => void) | undefined;

  beforeEach(() => {
    jest.clearAllMocks();
    (useMarketStore as unknown as jest.Mock).mockImplementation((selector) =>
      selector(marketStoreMock)
    );
    (subscribeToPool as jest.Mock).mockImplementation((_poolId: string, callback: any) => {
      poolCallback = callback;
      return subscriptionMock();
    });
  });

  it('subscribes to pool and updates store on price event', () => {
    const { unmount } = renderHook(() => useLivePool('pool-1'), { wrapper });
    act(() => {
      poolCallback?.({ type: 'price', data: { price: 0.42 } });
    });
    expect(marketStoreMock.updatePoolPrice).toHaveBeenCalledWith('pool-1', '0.42');
    unmount();
  });

  it('cleans up subscription on unmount', () => {
    const unsubscribe = jest.fn();
    (subscribeToPool as jest.Mock).mockImplementation((_poolId: string, callback: any) => {
      poolCallback = callback;
      return { unsubscribe };
    });

    const { unmount } = renderHook(() => useLivePool('pool-1'), { wrapper });
    unmount();
    expect(unsubscribe).toHaveBeenCalled();
  });
});

describe('useLiveActivity', () => {
  let _activityCallback: ((payload: any) => void) | undefined;
  let mintCallback: ((payload: any) => void) | undefined;
  let tokenCallback: ((payload: any) => void) | undefined;

  beforeEach(() => {
    jest.clearAllMocks();
    (useMarketStore as unknown as jest.Mock).mockImplementation((selector) =>
      selector(marketStoreMock)
    );
    (useActivityStore as unknown as jest.Mock).mockImplementation((selector) =>
      selector(activityStoreMock)
    );
    (useTokenUpdateStore as unknown as jest.Mock).mockImplementation((selector) =>
      selector(tokenUpdateStoreMock)
    );
    (subscribeToActivity as jest.Mock).mockImplementation((callback: any) => {
      _activityCallback = callback;
      return subscriptionMock();
    });
    (subscribeToPumpfunMintTokens as jest.Mock).mockImplementation((callback: any) => {
      mintCallback = callback;
      return subscriptionMock();
    });
    (subscribeToPumpfunTokenUpdates as jest.Mock).mockImplementation((callback: any) => {
      tokenCallback = callback;
      return subscriptionMock();
    });
  });

  it('records pumpfun mint updates and adds events', () => {
    renderHook(() => useLiveActivity());
    act(() => {
      mintCallback?.({
        mint: 'mint-1',
        name: 'Pump Token',
        symbol: 'PUMP',
        price: 1,
        marketCap: 1000,
      });
    });
    expect(tokenUpdateStoreMock.recordTokenUpdate).toHaveBeenCalledWith(
      'mint-1',
      expect.objectContaining({ price: 1 })
    );
    expect(marketStoreMock.addOrUpdatePoolFromWebSocket).toHaveBeenCalled();
    expect(activityStoreMock.prependEvent).toHaveBeenCalled();
  });

  it('handles pumpfun token updates', () => {
    renderHook(() => useLiveActivity());
    act(() => {
      tokenCallback?.({
        token: 'token-1',
        holders: 10,
        price: 0.5,
        marketCap: 50000,
      });
    });
    expect(tokenUpdateStoreMock.recordTokenUpdate).toHaveBeenCalledWith(
      'token-1',
      expect.objectContaining({ holders: 10 })
    );
  });
});
