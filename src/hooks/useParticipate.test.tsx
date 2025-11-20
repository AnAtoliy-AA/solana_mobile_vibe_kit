import { renderHook, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useParticipate } from './usePools';
import * as poolsApi from '../lib/api/pools';
import { useUIStore } from '../lib/stores/useUIStore';

jest.mock('../lib/api/pools');
jest.mock('../lib/stores/useUIStore', () => ({
  useUIStore: jest.fn(),
}));

const mockUseUIStore = useUIStore as unknown as jest.Mock;

const createWrapper = (queryClient: QueryClient) => {
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  Wrapper.displayName = 'QueryClientWrapper';
  return Wrapper;
};

describe('useParticipate', () => {
  const addToast = jest.fn();
  const closeModal = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseUIStore.mockImplementation((selector) =>
      selector({
        addToast,
        closeParticipationModal: closeModal,
      })
    );
  });

  it('handles successful participation', async () => {
    (poolsApi.participateInPool as jest.Mock).mockResolvedValue({ success: true });
    const queryClient = new QueryClient();
    const invalidateSpy = jest.spyOn(queryClient, 'invalidateQueries');
    const { result } = renderHook(() => useParticipate(), {
      wrapper: createWrapper(queryClient),
    });

    await act(async () => {
      await result.current.mutateAsync({
        poolId: 'pool-1',
        amount: '5',
        walletAddress: 'wallet',
      });
    });

    expect(addToast).toHaveBeenCalledWith({
      type: 'success',
      message: 'Successfully participated with 5 SOL',
    });
    expect(closeModal).toHaveBeenCalled();
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['pools'] });
  });

  it('surfaces error toast when API returns failure', async () => {
    (poolsApi.participateInPool as jest.Mock).mockResolvedValue({
      success: false,
      error: 'Cap reached',
    });
    const queryClient = new QueryClient();
    const { result } = renderHook(() => useParticipate(), {
      wrapper: createWrapper(queryClient),
    });

    await act(async () => {
      await result.current.mutateAsync({
        poolId: 'pool-1',
        amount: '5',
        walletAddress: 'wallet',
      });
    });

    expect(addToast).toHaveBeenCalledWith({
      type: 'error',
      message: 'Cap reached',
    });
    expect(closeModal).not.toHaveBeenCalled();
  });

  it('handles thrown errors', async () => {
    (poolsApi.participateInPool as jest.Mock).mockRejectedValue(new Error('Network'));
    const queryClient = new QueryClient();
    const { result } = renderHook(() => useParticipate(), {
      wrapper: createWrapper(queryClient),
    });

    await act(async () => {
      await expect(
        result.current.mutateAsync({
          poolId: 'pool-1',
          amount: '5',
          walletAddress: 'wallet',
        })
      ).rejects.toThrow('Network');
    });

    expect(addToast).toHaveBeenCalledWith({
      type: 'error',
      message: 'Network',
    });
  });
});
