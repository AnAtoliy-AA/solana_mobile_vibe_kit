import { renderHook, act } from '@testing-library/react';
import { useTimeAgo } from './useTimeAgo';

describe('useTimeAgo', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2024-01-01T00:00:10Z'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('returns empty string when no timestamp provided', () => {
    const { result } = renderHook(() => useTimeAgo(undefined));
    expect(result.current).toBe('');
  });

  it('shows "just now" for timestamps within 10s', () => {
    const timestamp = Date.now() - 5000;
    const { result } = renderHook(() => useTimeAgo(timestamp));
    expect(result.current).toBe('just now');
  });

  it('updates label over time', () => {
    const timestamp = Date.now() - 15_000; // 15 seconds ago
    const { result } = renderHook(() => useTimeAgo(timestamp, 1000));

    expect(result.current).toBe('15s ago');

    act(() => {
      jest.advanceTimersByTime(60_000);
    });

    expect(result.current).toBe('1m ago');
  });

  it('formats hours and days correctly', () => {
    const timestamp = Date.now() - 5 * 60 * 60 * 1000; // 5 hours ago
    const { result } = renderHook(() => useTimeAgo(timestamp));
    expect(result.current).toBe('5h ago');

    const timestampDays = Date.now() - 3 * 24 * 60 * 60 * 1000;
    const { result: resultDays } = renderHook(() => useTimeAgo(timestampDays));
    expect(resultDays.current).toBe('3d ago');
  });
});
