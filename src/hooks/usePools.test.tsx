import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as poolsApi from '../lib/api/pools';
import { usePoolListInfinite, usePoolDetail } from './usePools';

jest.mock('../lib/api/pools');

const createWrapper = () => {
  const queryClient = new QueryClient();
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  Wrapper.displayName = 'QueryClientWrapper';
  return Wrapper;
};

describe('usePools hooks', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('fetches pool list with pagination', async () => {
    (poolsApi.getPoolList as jest.Mock).mockResolvedValue([
      {
        id: 'pool-1',
        name: 'Pool 1',
        symbol: 'P1',
        status: 'active',
        progress: 0,
        tvl: '0',
        participants: 0,
        startTime: new Date().toISOString(),
        endTime: new Date().toISOString(),
        targetAmount: '0',
        currentAmount: '0',
        tokenPrice: '0',
        tags: [],
      },
    ]);

    const { result } = renderHook(() => usePoolListInfinite(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => result.current.data !== undefined);
    expect(poolsApi.getPoolList).toHaveBeenCalled();
  });

  it('fetches pool detail', async () => {
    (poolsApi.getPoolDetail as jest.Mock).mockResolvedValue({
      id: 'pool-1',
      name: 'Pool 1',
      symbol: 'P1',
    });

    const { result } = renderHook(() => usePoolDetail('pool-1'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => result.current.data !== undefined);
    expect(poolsApi.getPoolDetail).toHaveBeenCalledWith('pool-1');
  });
});
