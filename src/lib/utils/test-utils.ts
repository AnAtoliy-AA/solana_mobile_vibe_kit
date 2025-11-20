import type { StoreApi, UseBoundStore } from 'zustand';

export const createZustandResetter = <T>(useStore: UseBoundStore<StoreApi<T>>) => {
  const initialState = useStore.getState();
  return () => useStore.setState(initialState, true);
};
