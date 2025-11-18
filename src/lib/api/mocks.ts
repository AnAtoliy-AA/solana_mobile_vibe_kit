// Mock data for Launchpad development

import { Pool, PoolDetail, UserProfile, ActivityEvent, PricePoint } from './types';

// Generate price history for charts
const generatePriceHistory = (days = 7): PricePoint[] => {
  const now = Date.now();
  const dayMs = 24 * 60 * 60 * 1000;
  const points: PricePoint[] = [];

  let price = 0.045 + Math.random() * 0.01;

  for (let i = days; i >= 0; i--) {
    const timestamp = now - i * dayMs;
    price = price * (0.95 + Math.random() * 0.1); // Random walk
    points.push({
      timestamp,
      price: parseFloat(price.toFixed(6)),
      volume: Math.floor(Math.random() * 100000) + 50000,
    });
  }

  return points;
};

export const mockPools: Pool[] = [
  {
    id: 'pool_1',
    name: 'Solana Meme Token',
    symbol: 'SMT',
    description: 'A community-driven meme token built on Solana for maximum speed and low fees.',
    status: 'active',
    progress: 0.65,
    tvl: '1250000',
    participants: 1234,
    startTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    endTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    targetAmount: '2000000',
    currentAmount: '1300000',
    tokenPrice: '0.05',
    tags: ['meme', 'community'],
    imageUrl: 'https://via.placeholder.com/150/FF6B6B/FFFFFF?text=SMT',
  },
  {
    id: 'pool_2',
    name: 'DeFi Yield Aggregator',
    symbol: 'YIELD',
    description:
      'Automated yield farming aggregator optimizing returns across Solana DeFi protocols.',
    status: 'active',
    progress: 0.42,
    tvl: '840000',
    participants: 567,
    startTime: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    endTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    targetAmount: '2000000',
    currentAmount: '840000',
    tokenPrice: '0.12',
    tags: ['defi', 'yield'],
    imageUrl: 'https://via.placeholder.com/150/4ECDC4/FFFFFF?text=YIELD',
  },
  {
    id: 'pool_3',
    name: 'NFT Marketplace Coin',
    symbol: 'NFTM',
    description: 'Governance token for the next-gen NFT marketplace with zero listing fees.',
    status: 'upcoming',
    progress: 0,
    tvl: '0',
    participants: 0,
    startTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    endTime: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000).toISOString(),
    targetAmount: '1500000',
    currentAmount: '0',
    tokenPrice: '0.08',
    tags: ['nft', 'marketplace'],
    imageUrl: 'https://via.placeholder.com/150/95E1D3/FFFFFF?text=NFTM',
  },
  {
    id: 'pool_4',
    name: 'GameFi Revolution',
    symbol: 'GAME',
    description: 'Play-to-earn gaming ecosystem token with cross-game asset interoperability.',
    status: 'finished',
    progress: 1.0,
    tvl: '3200000',
    participants: 2567,
    startTime: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    endTime: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    targetAmount: '3000000',
    currentAmount: '3200000',
    tokenPrice: '0.15',
    tags: ['gaming', 'p2e'],
    imageUrl: 'https://via.placeholder.com/150/F38181/FFFFFF?text=GAME',
  },
  {
    id: 'pool_5',
    name: 'Social Network Token',
    symbol: 'SOCIAL',
    description: 'Decentralized social media platform rewarding content creators directly.',
    status: 'active',
    progress: 0.78,
    tvl: '1560000',
    participants: 892,
    startTime: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    endTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    targetAmount: '2000000',
    currentAmount: '1560000',
    tokenPrice: '0.06',
    tags: ['social', 'creator economy'],
    imageUrl: 'https://via.placeholder.com/150/AA96DA/FFFFFF?text=SOCIAL',
  },
];

export const mockPoolDetails: Record<string, PoolDetail> = {
  pool_1: {
    ...mockPools[0],
    priceHistory: generatePriceHistory(7),
    timeline: {
      created: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      startDate: mockPools[0].startTime,
      endDate: mockPools[0].endTime,
      distributionDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
    },
    socialLinks: {
      website: 'https://example.com',
      twitter: 'https://twitter.com/smt',
      discord: 'https://discord.gg/smt',
    },
    faq: [
      {
        question: 'What is the minimum participation amount?',
        answer: 'The minimum participation amount is 10 SOL.',
      },
      {
        question: 'When will tokens be distributed?',
        answer: 'Tokens will be distributed 7 days after the pool ends.',
      },
      {
        question: 'Is there a vesting schedule?',
        answer: 'Yes, tokens vest over 6 months with a 1-month cliff.',
      },
    ],
    minParticipation: '10',
    maxParticipation: '10000',
  },
  pool_2: {
    ...mockPools[1],
    priceHistory: generatePriceHistory(7),
    timeline: {
      created: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      startDate: mockPools[1].startTime,
      endDate: mockPools[1].endTime,
      distributionDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString(),
    },
    socialLinks: {
      website: 'https://example.com/yield',
      twitter: 'https://twitter.com/yield',
      telegram: 'https://t.me/yield',
    },
    faq: [
      {
        question: 'What protocols does YIELD aggregate?',
        answer: 'YIELD aggregates Raydium, Orca, Marinade, and Solend.',
      },
      {
        question: 'How are returns optimized?',
        answer: 'Our smart contracts automatically rebalance to maximize APY.',
      },
    ],
    minParticipation: '50',
    maxParticipation: '50000',
  },
};

export const mockUserProfile: UserProfile = {
  id: 'user_123',
  walletAddress: '7xKXtg2CW3UuvBFbEhC1GZGgCCWjB1Z2N8V9QmRpXzHe',
  positions: [
    {
      poolId: 'pool_1',
      poolName: 'Solana Meme Token',
      poolSymbol: 'SMT',
      amount: '5000',
      valueUSD: '250',
      pnl: '+50',
      pnlPercentage: '+25%',
      entryPrice: '0.04',
      currentPrice: '0.05',
    },
    {
      poolId: 'pool_2',
      poolName: 'DeFi Yield Aggregator',
      poolSymbol: 'YIELD',
      amount: '2000',
      valueUSD: '240',
      pnl: '+40',
      pnlPercentage: '+20%',
      entryPrice: '0.10',
      currentPrice: '0.12',
    },
  ],
  totalPnl: '+90',
  totalValueUSD: '490',
};

export const mockActivityEvents: ActivityEvent[] = [
  {
    id: 'event_1',
    type: 'participation',
    poolId: 'pool_1',
    poolName: 'Solana Meme Token',
    user: '7xKX...pXzHe',
    amount: '100',
    timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    message: 'Participated with 100 SOL',
  },
  {
    id: 'event_2',
    type: 'milestone',
    poolId: 'pool_1',
    poolName: 'Solana Meme Token',
    timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    message: 'Pool reached 50% funding milestone',
  },
  {
    id: 'event_3',
    type: 'participation',
    poolId: 'pool_2',
    poolName: 'DeFi Yield Aggregator',
    user: 'Abc3...9dFg',
    amount: '250',
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    message: 'Participated with 250 SOL',
  },
  {
    id: 'event_4',
    type: 'price_update',
    poolId: 'pool_1',
    poolName: 'Solana Meme Token',
    timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    message: 'Token price updated to $0.051',
  },
  {
    id: 'event_5',
    type: 'participation',
    poolId: 'pool_1',
    poolName: 'Solana Meme Token',
    user: 'Def6...2kLm',
    amount: '50',
    timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    message: 'Participated with 50 SOL',
  },
];

// Helper to get filtered pools
export const getFilteredPools = (status?: 'active' | 'upcoming' | 'finished'): Pool[] => {
  if (!status) return mockPools;
  return mockPools.filter((pool) => pool.status === status);
};

// Helper to get pool by ID
export const getPoolById = (id: string): PoolDetail | undefined => {
  if (mockPoolDetails[id]) {
    return mockPoolDetails[id];
  }

  const pool = mockPools.find((p) => p.id === id);
  if (!pool) {
    return undefined;
  }

  return {
    ...pool,
    priceHistory: generatePriceHistory(7),
    timeline: {
      created: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    },
    socialLinks: {},
    faq: [],
  };
};
