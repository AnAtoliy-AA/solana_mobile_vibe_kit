// Pool API endpoints

import apiClient, { handleApiError } from './client';
import {
  Pool,
  PoolDetail,
  ParticipationRequest,
  ParticipationResponse,
  TokenFromAPI,
} from './types';
import { getFilteredPools, getPoolById } from './mocks';

const USE_MOCK = process.env.REACT_APP_LAUNCHPAD_USE_MOCK === 'true';

/**
 * Transform API token data to Pool format
 */
const transformTokenToPool = (token: TokenFromAPI): Pool => {
  const now = new Date();
  const startTime = token.startTime
    ? new Date(token.startTime)
    : new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const endTime = token.endTime
    ? new Date(token.endTime)
    : new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

  // Determine status based on timestamps
  let status: 'active' | 'upcoming' | 'finished' = 'active';
  if (now < startTime) {
    status = 'upcoming';
  } else if (now > endTime) {
    status = 'finished';
  }

  return {
    id: token.token || token._id || token.id || `token-${Date.now()}-${Math.random()}`,
    name: token.name || token.symbol || 'Unknown Token',
    symbol: token.symbol || token.ticker || 'TKN',
    description: token.description || token.metaData?.description || '',
    status: token.status || status,
    progress: token.progress || Math.random() * 0.7 + 0.1, // 10-80%
    tvl: token.tvl || token.marketCap || (Math.random() * 1000000 + 100000).toFixed(0),
    participants: token.participants || Math.floor(Math.random() * 5000 + 100),
    startTime: startTime.toISOString(),
    endTime: endTime.toISOString(),
    targetAmount: token.targetAmount || (Math.random() * 500000 + 100000).toFixed(0),
    currentAmount:
      token.currentAmount || token.raisedAmount || (Math.random() * 300000 + 50000).toFixed(0),
    tokenPrice: token.price || token.tokenPrice || (Math.random() * 0.1 + 0.01).toFixed(4),
    tags: token.tags || [],
    imageUrl: token.image || token.imageUrl || token.metaData?.image,
    websiteUrl: token.website || token.metaData?.website,
    twitterUrl: token.twitter || token.metaData?.twitter,
    discordUrl: token.discord || token.metaData?.discord,
  };
};

/**
 * Get list of all pools/tokens
 * Uses POST /api/tokens endpoint as per Swagger documentation
 */
export const getPoolList = async (status?: 'active' | 'upcoming' | 'finished'): Promise<Pool[]> => {
  if (USE_MOCK) {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 300));
    return getFilteredPools(status);
  }

  try {
    // Build request body for POST /api/tokens
    const requestBody: Record<string, string | number> = {
      skip: 0,
      take: 100, // Fetch up to 100 tokens
    };

    // Add status filter if provided
    if (status) {
      requestBody.status = status;
    }

    // Use URLSearchParams object - axios will handle it correctly with application/x-www-form-urlencoded
    const urlEncodedData = new URLSearchParams();
    Object.entries(requestBody).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        urlEncodedData.append(key, String(value));
      }
    });

    const response = await apiClient.post<{
      tokens?: TokenFromAPI[] | Record<string, TokenFromAPI>;
      data?: TokenFromAPI[];
    }>('/tokens', urlEncodedData);

    // Handle different possible response structures
    const tokensData = response.data?.tokens || response.data?.data || response.data;

    // Convert object to array if needed (API returns object with token addresses as keys)
    let tokensArray: TokenFromAPI[];
    if (Array.isArray(tokensData)) {
      tokensArray = tokensData;
    } else if (tokensData && typeof tokensData === 'object') {
      // Convert object to array of values
      tokensArray = Object.values(tokensData);
    } else {
      tokensArray = [];
    }

    // Transform API tokens to Pool format
    const pools: Pool[] = tokensArray.map(transformTokenToPool);

    return pools;
  } catch (error) {
    throw new Error(handleApiError(error as Error));
  }
};

/**
 * Get detailed information about a specific pool/token
 * Uses POST /api/tokens with filter to get specific token details
 */
export const getPoolDetail = async (poolId: string): Promise<PoolDetail> => {
  if (USE_MOCK) {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 200));
    const poolDetail = getPoolById(poolId);
    if (!poolDetail) {
      throw new Error('Pool not found');
    }
    return poolDetail;
  }

  try {
    // Get token details by filtering for specific ID
    const requestBody = {
      skip: 0,
      take: 1,
      tokenId: poolId, // or tokenAddress: poolId if using addresses
    };

    // Use URLSearchParams object - axios will handle it correctly with application/x-www-form-urlencoded
    const urlEncodedData = new URLSearchParams();
    Object.entries(requestBody).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        urlEncodedData.append(key, String(value));
      }
    });

    const response = await apiClient.post<{
      tokens?: TokenFromAPI[] | Record<string, TokenFromAPI>;
      data?: TokenFromAPI[];
    }>('/tokens', urlEncodedData);
    const tokens = response.data?.tokens || response.data?.data || response.data;

    if (Array.isArray(tokens) && tokens.length > 0) {
      const pool = transformTokenToPool(tokens[0]);
      // Convert Pool to PoolDetail by adding required fields
      const poolDetail: PoolDetail = {
        ...pool,
        priceHistory: [],
        timeline: {
          created: pool.startTime,
          startDate: pool.startTime,
          endDate: pool.endTime,
        },
        socialLinks: {
          website: pool.websiteUrl,
          twitter: pool.twitterUrl,
          discord: pool.discordUrl,
        },
        faq: [],
      };
      return poolDetail;
    }

    throw new Error('Token not found');
  } catch (error) {
    throw new Error(handleApiError(error as Error));
  }
};

/**
 * Participate in a pool
 */
export const participateInPool = async (
  request: ParticipationRequest
): Promise<ParticipationResponse> => {
  if (USE_MOCK) {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Mock success response
    return {
      success: true,
      transactionId: `tx_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      position: {
        poolId: request.poolId,
        poolName: 'Mock Pool',
        poolSymbol: 'MOCK',
        amount: request.amount,
        valueUSD: (parseFloat(request.amount) * 0.05).toString(),
        pnl: '0',
        pnlPercentage: '0%',
        entryPrice: '0.05',
        currentPrice: '0.05',
      },
    };
  }

  try {
    const response = await apiClient.post<ParticipationResponse>('/participate', request);
    return response.data;
  } catch (error) {
    return {
      success: false,
      error: handleApiError(error as Error),
    };
  }
};

/**
 * Get pool statistics
 */
export const getPoolStats = async (poolId: string) => {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 150));
    return {
      poolId,
      totalParticipants: Math.floor(Math.random() * 5000) + 100,
      averageParticipation: (Math.random() * 500 + 50).toFixed(2),
      priceChange24h: (Math.random() * 20 - 10).toFixed(2),
      volume24h: (Math.random() * 1000000 + 100000).toFixed(2),
    };
  }

  try {
    const response = await apiClient.get(`/pools/${poolId}/stats`);
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error as Error));
  }
};
