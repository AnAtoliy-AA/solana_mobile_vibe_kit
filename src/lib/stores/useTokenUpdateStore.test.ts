import { act } from '@testing-library/react';
import { useTokenUpdateStore } from './useTokenUpdateStore';

describe('useTokenUpdateStore', () => {
  beforeEach(() => {
    const store = useTokenUpdateStore.getState();
    const keys = Array.from(store.tokenUpdates.keys());
    act(() => {
      keys.forEach((key) => useTokenUpdateStore.getState().clearTokenUpdate(key));
    });
  });

  it('records and retrieves token updates', () => {
    act(() => {
      useTokenUpdateStore.getState().recordTokenUpdate('token-1', { holders: 100 });
    });

    const update = useTokenUpdateStore.getState().getTokenUpdate('token-1');
    expect(update?.token).toBe('token-1');
    expect(update?.holders).toBe(100);
    expect(update?.lastMessageTime).toBeDefined();
  });

  it('clears token updates', () => {
    act(() => {
      useTokenUpdateStore.getState().recordTokenUpdate('token-2', { holders: 50 });
      useTokenUpdateStore.getState().clearTokenUpdate('token-2');
    });

    const update = useTokenUpdateStore.getState().getTokenUpdate('token-2');
    expect(update).toBeUndefined();
  });
});
