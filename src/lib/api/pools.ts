// Pool API endpoints

import apiClient, { handleApiError } from './client';
import {
  Pool,
  PoolDetail,
  ParticipationRequest,
  ParticipationResponse,
  TokenFromAPI,
  TokenHolder,
} from './types';
import { normalizeImageUrl } from '../utils/media';
import { getFilteredPools, getPoolById } from './mocks';

const USE_MOCK = process.env.REACT_APP_LAUNCHPAD_USE_MOCK === 'true';

/**
 * Transform API token data to Pool format
 */
const transformTokenToPool = (token: TokenFromAPI): Pool => {
  const now = new Date();

  // Use mint_time or createdAt for start time
  const startTime = token.startTime
    ? new Date(token.startTime)
    : token.mint_time
      ? new Date(token.mint_time)
      : token.createdAt
        ? new Date(token.createdAt)
        : new Date(now.getTime() - 24 * 60 * 60 * 1000);

  const endTime = token.endTime
    ? new Date(token.endTime)
    : new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

  // Determine status based on timestamps and migration
  let status: 'active' | 'upcoming' | 'finished' = 'active';
  if (token.isMigrated) {
    status = 'finished';
  } else if (now < startTime) {
    status = 'upcoming';
  } else if (now > endTime) {
    status = 'finished';
  }

  // Calculate target amount from hardcap (in SOL)
  const targetAmount = token.targetAmount || (token.hardcap ? String(token.hardcap) : '30');

  // Current amount from _balanceSol or calculate from progress
  const currentAmount =
    token.currentAmount ||
    (token._balanceSol ? String(token._balanceSol) : undefined) ||
    (token.progress && token.hardcap ? String(token.progress * token.hardcap) : '0');

  // TVL/Market Cap from marketCapUsd or volumeUsd
  const tvl =
    token.tvl ||
    token.marketCap ||
    (token.marketCapUsd ? String(token.marketCapUsd) : undefined) ||
    (token.volumeUsd ? String(token.volumeUsd) : '0');

  // Token price from priceUsd or priceSol
  const tokenPrice =
    String(token.price) ||
    token.tokenPrice ||
    (token.priceUsd ? String(token.priceUsd) : undefined) ||
    (token.priceSol ? String(token.priceSol) : '0');

  const imageCandidates = [token.photo, token.image, token.imageUrl, token.metaData?.image];
  const normalizedImageUrl = imageCandidates
    .map((candidate) => normalizeImageUrl(candidate))
    .find(Boolean);

  return {
    id: token.token || token._id || token.id || `token-${Date.now()}-${Math.random()}`,
    name: token.name || token.symbol || 'Unknown Token',
    symbol: token.symbol || token.ticker || 'TKN',
    description: token.description || token.metaData?.description || '',
    status: token.status || status,
    progress: token.progress || token.progressSol || 0,
    tvl,
    participants: token.holders || token.participants || 0,
    startTime: startTime.toISOString(),
    endTime: endTime.toISOString(),
    targetAmount,
    currentAmount,
    tokenPrice,
    tags: token.tags || [],
    imageUrl: normalizedImageUrl,
    websiteUrl: token.website || token.metaData?.website,
    twitterUrl: token.x || token.twitter || token.metaData?.twitter,
    discordUrl: token.discord || token.metaData?.discord,
    telegramUrl: token.telegram,

    // Extended fields
    pool: token.pool,
    creator: token.creator,
    supply: token.supply,
    decimals: token.decimals,
    tokenType: token.tokenType,
    priceSol: token.priceSol,
    priceUsd: token.priceUsd,
    marketCapUsd: token.marketCapUsd,
    hardcap: token.hardcap,
    buys: token.buys,
    sells: token.sells,
    txCount: token.txCount,
    volumeSol: token.volumeSol,
    volumeUsd: token.volumeUsd,
    isMigrated: token.isMigrated,
    isCurrentlyLive: token.isCurrentlyLive,
    topHoldersList: token.topHoldersList,
    createdAt: token.createdAt,
    updatedAt: token.updatedAt,
  };
};

/**
 * Get list of all pools/tokens with pagination support
 * Uses POST /api/tokens endpoint as per Swagger documentation
 */
export const getPoolList = async (
  status?: 'active' | 'upcoming' | 'finished',
  page = 0,
  version = 1
): Promise<Pool[]> => {
  if (USE_MOCK) {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 300));
    return getFilteredPools(status);
  }

  try {
    // Build request body for POST /api/tokens
    const urlEncodedData = new URLSearchParams();
    urlEncodedData.append('page', String(page));
    urlEncodedData.append('version', String(version));

    // Add status filter if provided
    if (status) {
      urlEncodedData.append('status', status);
    }

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
 * Uses POST /api/tokens with id parameter to fetch specific token
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
    // Fetch specific token by id
    const urlEncodedData = new URLSearchParams();
    urlEncodedData.append('id', poolId);

    const response = await apiClient.post<{
      tokens?: TokenFromAPI[] | Record<string, TokenFromAPI>;
      data?: TokenFromAPI[];
      holders?: TokenHolder[];
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

    if (tokensArray.length === 0) {
      throw new Error('Token not found');
    }

    // Transform the token to Pool format
    const pool = transformTokenToPool(tokensArray[0]);

    // Extract holders list from response
    const holders = response.data?.holders || [];

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
      holders, // Add complete holders list
    };
    return poolDetail;
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
