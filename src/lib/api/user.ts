// User API endpoints

import apiClient, { handleApiError } from './client';
import { UserProfile, ActivityEvent } from './types';
import { mockUserProfile, mockActivityEvents } from './mocks';

const USE_MOCK = process.env.REACT_APP_LAUNCHPAD_USE_MOCK === 'true';

/**
 * Get user profile with positions and PnL
 * Uses POST /api/profile endpoint as per Swagger documentation
 */
export const getUserProfile = async (walletAddress: string): Promise<UserProfile> => {
  if (USE_MOCK) {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 250));
    return {
      ...mockUserProfile,
      walletAddress,
    };
  }

  try {
    const requestBody = {
      wallet: walletAddress,
    };
    const response = await apiClient.post<UserProfile>('/profile', requestBody);
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error as Error));
  }
};

/**
 * Get user's transaction history
 * Uses POST /api/txs endpoint as per Swagger documentation
 */
export const getUserHistory = async (walletAddress: string): Promise<ActivityEvent[]> => {
  if (USE_MOCK) {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 200));
    return mockActivityEvents.filter((event) => event.user?.includes(walletAddress.slice(0, 4)));
  }

  try {
    const requestBody = {
      wallet: walletAddress,
      skip: 0,
      take: 100,
    };
    const response = await apiClient.post<{ txs?: ActivityEvent[]; data?: ActivityEvent[] }>(
      '/txs',
      requestBody
    );
    const txs = response.data?.txs || response.data?.data || response.data;
    return Array.isArray(txs) ? txs : [];
  } catch (error) {
    throw new Error(handleApiError(error as Error));
  }
};

/**
 * Get global activity feed
 * Uses POST /api/txs endpoint (without wallet filter) as per Swagger documentation
 */
export const getActivityFeed = async (limit = 50): Promise<ActivityEvent[]> => {
  if (USE_MOCK) {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 180));
    return mockActivityEvents.slice(0, limit);
  }

  try {
    const requestBody = {
      skip: 0,
      take: limit,
    };
    const response = await apiClient.post<{ txs?: ActivityEvent[]; data?: ActivityEvent[] }>(
      '/txs',
      requestBody
    );
    const txs = response.data?.txs || response.data?.data || response.data;
    return Array.isArray(txs) ? txs : [];
  } catch (error) {
    throw new Error(handleApiError(error as Error));
  }
};
