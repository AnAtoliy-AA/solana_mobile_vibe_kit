// React Query hooks for pools

import React from 'react';
import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { getPoolList, getPoolDetail, participateInPool, getPoolStats } from '../lib/api/pools';
import { ParticipationRequest } from '../lib/api/types';
import { useMarketStore } from '../lib/stores/useMarketStore';
import { useUIStore } from '../lib/stores/useUIStore';

/**
 * Hook to fetch pool list with infinite scroll support
 */
export const usePoolListInfinite = (status?: 'active' | 'upcoming' | 'finished') => {
  const setPools = useMarketStore((state) => state.setPools);

  const query = useInfiniteQuery({
    queryKey: ['pools-infinite', status],
    queryFn: ({ pageParam = 0 }) => getPoolList(status, pageParam, 1),
    getNextPageParam: (lastPage, allPages) => {
      // If last page has no tokens, we've reached the end
      if (lastPage.length === 0) {
        return undefined;
      }
      // Return next page number
      return allPages.length;
    },
    initialPageParam: 0,
  });

  // Flatten all pages into single array and update store
  React.useEffect(() => {
    if (query.data?.pages) {
      const allPools = query.data.pages.flat();
      setPools(allPools);
    }
  }, [query.data, setPools]);

  return query;
};

/**
 * Hook to fetch pool list (legacy - single page)
 */
export const usePoolList = (status?: 'active' | 'upcoming' | 'finished') => {
  const setPools = useMarketStore((state) => state.setPools);

  const query = useQuery({
    queryKey: ['pools', status],
    queryFn: () => getPoolList(status, 0, 1),
  });

  // Update store when data changes
  React.useEffect(() => {
    if (query.data) {
      setPools(query.data);
    }
  }, [query.data, setPools]);

  return query;
};

/**
 * Hook to fetch pool detail
 */
export const usePoolDetail = (poolId: string | null) => {
  return useQuery({
    queryKey: ['pool', poolId],
    queryFn: () => {
      if (!poolId) throw new Error('Pool ID is required');
      return getPoolDetail(poolId);
    },
    enabled: !!poolId,
  });
};

/**
 * Hook to fetch pool stats
 */
export const usePoolStats = (poolId: string | null) => {
  return useQuery({
    queryKey: ['poolStats', poolId],
    queryFn: () => {
      if (!poolId) throw new Error('Pool ID is required');
      return getPoolStats(poolId);
    },
    enabled: !!poolId,
    refetchInterval: 10000, // Refetch every 10 seconds
  });
};

/**
 * Hook to participate in a pool
 */
export const useParticipate = () => {
  const queryClient = useQueryClient();
  const addToast = useUIStore((state) => state.addToast);
  const closeParticipationModal = useUIStore((state) => state.closeParticipationModal);

  return useMutation({
    mutationFn: (request: ParticipationRequest) => participateInPool(request),
    onSuccess: (data, variables) => {
      if (data.success) {
        addToast({
          type: 'success',
          message: `Successfully participated with ${variables.amount} SOL`,
        });

        // Invalidate queries to refetch updated data
        queryClient.invalidateQueries({ queryKey: ['pools'] });
        queryClient.invalidateQueries({ queryKey: ['pool', variables.poolId] });
        queryClient.invalidateQueries({ queryKey: ['userProfile'] });

        closeParticipationModal();
      } else {
        addToast({
          type: 'error',
          message: data.error || 'Participation failed',
        });
      }
    },
    onError: (error: Error) => {
      addToast({
        type: 'error',
        message: error.message || 'Participation failed',
      });
    },
  });
};
