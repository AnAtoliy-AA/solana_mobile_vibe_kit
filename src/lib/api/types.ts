// TypeScript types for Launchpad API

export interface Pool {
  id: string;
  name: string;
  symbol: string;
  description?: string;
  status: 'active' | 'upcoming' | 'finished';
  progress: number; // 0-1
  tvl: string; // Total Value Locked
  participants: number;
  startTime: string; // ISO date string
  endTime: string; // ISO date string
  targetAmount: string;
  currentAmount: string;
  tokenPrice: string;
  tags: string[];
  imageUrl?: string;
  websiteUrl?: string;
  twitterUrl?: string;
  discordUrl?: string;
}

export interface PoolDetail extends Pool {
  priceHistory: PricePoint[];
  timeline: Timeline;
  socialLinks: SocialLinks;
  faq: FAQ[];
  participants: number;
  minParticipation?: string;
  maxParticipation?: string;
}

export interface PricePoint {
  timestamp: number;
  price: number;
  volume?: number;
}

export interface Timeline {
  created: string;
  startDate: string;
  endDate: string;
  distributionDate?: string;
}

export interface SocialLinks {
  website?: string;
  twitter?: string;
  discord?: string;
  telegram?: string;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface UserProfile {
  id: string;
  walletAddress: string;
  positions: Position[];
  totalPnl: string;
  totalValueUSD: string;
}

export interface Position {
  poolId: string;
  poolName: string;
  poolSymbol: string;
  amount: string;
  valueUSD: string;
  pnl: string;
  pnlPercentage: string;
  entryPrice: string;
  currentPrice: string;
}

export interface ActivityEvent {
  id: string;
  type: 'participation' | 'status_change' | 'price_update' | 'milestone';
  poolId: string;
  poolName?: string;
  user?: string;
  amount?: string;
  timestamp: string;
  message: string;
}

export interface ParticipationRequest {
  poolId: string;
  amount: string;
  walletAddress: string;
}

export interface ParticipationResponse {
  success: boolean;
  transactionId?: string;
  position?: Position;
  error?: string;
}

export interface WebSocketMessage {
  channel: string;
  type: 'price' | 'status' | 'tvl' | 'participation' | 'notification';
  data: WebSocketMessageData;
}

export interface WebSocketMessageData {
  price?: number;
  status?: string;
  tvl?: string;
  poolName?: string;
  user?: string;
  amount?: string;
  message?: string;
  currentAmount?: string;
  targetAmount?: string;
}

export interface TokenFromAPI {
  token?: string;
  _id?: string;
  id?: string;
  name?: string;
  symbol?: string;
  ticker?: string;
  description?: string;
  metaData?: {
    description?: string;
    image?: string;
    website?: string;
    twitter?: string;
    discord?: string;
  };
  status?: 'active' | 'upcoming' | 'finished';
  progress?: number;
  tvl?: string;
  marketCap?: string;
  participants?: number;
  startTime?: string;
  endTime?: string;
  targetAmount?: string;
  currentAmount?: string;
  raisedAmount?: string;
  price?: string;
  tokenPrice?: string;
  tags?: string[];
  image?: string;
  imageUrl?: string;
  website?: string;
  twitter?: string;
  discord?: string;
}
