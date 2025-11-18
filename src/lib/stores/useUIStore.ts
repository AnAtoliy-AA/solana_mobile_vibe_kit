// UI state management with Zustand

import { create } from 'zustand';

interface UIState {
  // Modal states
  isParticipationModalOpen: boolean;
  participationPoolId: string | null;

  // Loading states
  isLoading: boolean;
  loadingMessage: string;

  // Toast notifications
  toasts: Toast[];

  // Actions
  openParticipationModal: (poolId: string) => void;
  closeParticipationModal: () => void;
  setLoading: (isLoading: boolean, message?: string) => void;
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  duration?: number;
}

export const useUIStore = create<UIState>((set) => ({
  // Initial state
  isParticipationModalOpen: false,
  participationPoolId: null,
  isLoading: false,
  loadingMessage: '',
  toasts: [],

  // Actions
  openParticipationModal: (poolId) =>
    set({
      isParticipationModalOpen: true,
      participationPoolId: poolId,
    }),

  closeParticipationModal: () =>
    set({
      isParticipationModalOpen: false,
      participationPoolId: null,
    }),

  setLoading: (isLoading, message = '') =>
    set({
      isLoading,
      loadingMessage: message,
    }),

  addToast: (toast) =>
    set((state) => {
      const id = `toast-${Date.now()}-${Math.random()}`;
      const newToast: Toast = { ...toast, id };

      // Auto-remove toast after duration
      if (toast.duration !== 0) {
        setTimeout(() => {
          set((s) => ({
            toasts: s.toasts.filter((t) => t.id !== id),
          }));
        }, toast.duration || 5000);
      }

      return {
        toasts: [...state.toasts, newToast],
      };
    }),

  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    })),
}));
