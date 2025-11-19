// Store for tracking token websocket update times

import { create } from 'zustand';

export interface TokenUpdate {
  token: string; // Token mint address
  lastMessageTime: number; // When the websocket message was received
  holders?: number;
  isLive?: boolean;
  topHoldersPercentage?: number;
  price?: number;
  marketCap?: number;
}

interface TokenUpdateState {
  tokenUpdates: Map<string, TokenUpdate>;

  // Actions
  recordTokenUpdate: (token: string, data: Partial<TokenUpdate>) => void;
  getTokenUpdate: (token: string) => TokenUpdate | undefined;
  clearTokenUpdate: (token: string) => void;
}

export const useTokenUpdateStore = create<TokenUpdateState>((set, get) => ({
  tokenUpdates: new Map(),

  recordTokenUpdate: (token, data) => {
    set((state) => {
      const newMap = new Map(state.tokenUpdates);
      const existing = newMap.get(token);

      const update: TokenUpdate = {
        ...existing,
        ...data,
        token,
        lastMessageTime: Date.now(), // Record when message was received
      };

      newMap.set(token, update);

      return { tokenUpdates: newMap };
    });
  },

  getTokenUpdate: (token) => {
    return get().tokenUpdates.get(token);
  },

  clearTokenUpdate: (token) => {
    set((state) => {
      const newMap = new Map(state.tokenUpdates);
      newMap.delete(token);
      return { tokenUpdates: newMap };
    });
  },
}));
