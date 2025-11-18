// React Query hooks for user data

import { useQuery } from '@tanstack/react-query';
import { getUserProfile, getUserHistory, getActivityFeed } from '../lib/api/user';

/**
 * Hook to fetch user profile
 */
export const useUserProfile = (walletAddress: string | null) => {
  return useQuery({
    queryKey: ['userProfile', walletAddress],
    queryFn: () => {
      if (!walletAddress) throw new Error('Wallet address is required');
      return getUserProfile(walletAddress);
    },
    enabled: !!walletAddress,
    staleTime: 60000, // 1 minute
  });
};

/**
 * Hook to fetch user transaction history
 */
export const useUserHistory = (walletAddress: string | null) => {
  return useQuery({
    queryKey: ['userHistory', walletAddress],
    queryFn: () => {
      if (!walletAddress) throw new Error('Wallet address is required');
      return getUserHistory(walletAddress);
    },
    enabled: !!walletAddress,
  });
};

/**
 * Hook to fetch activity feed
 */
export const useActivityFeed = (limit = 50) => {
  return useQuery({
    queryKey: ['activityFeed', limit],
    queryFn: () => getActivityFeed(limit),
    refetchInterval: 15000, // Refetch every 15 seconds
  });
};
