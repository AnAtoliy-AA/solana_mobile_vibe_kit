// Activity feed state management with Zustand

import { create } from 'zustand';
import { ActivityEvent } from '../api/types';

interface ActivityState {
  events: ActivityEvent[];
  filter: 'all' | 'my-activity';

  // Actions
  setEvents: (events: ActivityEvent[]) => void;
  addEvent: (event: ActivityEvent) => void;
  setFilter: (filter: 'all' | 'my-activity') => void;
  prependEvent: (event: ActivityEvent) => void;
}

export const useActivityStore = create<ActivityState>((set) => ({
  events: [],
  filter: 'all',

  setEvents: (events) => set({ events }),

  addEvent: (event) =>
    set((state) => ({
      events: [...state.events, event],
    })),

  prependEvent: (event) =>
    set((state) => ({
      events: [event, ...state.events],
    })),

  setFilter: (filter) => set({ filter }),
}));
