import { act } from '@testing-library/react';
import { useUIStore } from './useUIStore';
import { createZustandResetter } from '../utils/test-utils';

describe('useUIStore', () => {
  const resetStore = createZustandResetter(useUIStore);

  beforeEach(() => {
    resetStore();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('opens and closes participation modal', () => {
    act(() => {
      useUIStore.getState().openParticipationModal('pool-1');
    });
    expect(useUIStore.getState().isParticipationModalOpen).toBe(true);
    expect(useUIStore.getState().participationPoolId).toBe('pool-1');

    act(() => {
      useUIStore.getState().closeParticipationModal();
    });
    expect(useUIStore.getState().isParticipationModalOpen).toBe(false);
    expect(useUIStore.getState().participationPoolId).toBeNull();
  });

  it('adds toast and auto-removes it', () => {
    act(() => {
      useUIStore.getState().addToast({ type: 'success', message: 'Saved' });
    });
    const toastId = useUIStore.getState().toasts[0].id;
    expect(toastId).toBeDefined();

    act(() => {
      jest.advanceTimersByTime(5000);
    });

    expect(useUIStore.getState().toasts.find((toast) => toast.id === toastId)).toBeUndefined();
  });
});
