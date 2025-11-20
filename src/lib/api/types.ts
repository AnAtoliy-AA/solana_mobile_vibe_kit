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
  telegramUrl?: string;

  // Extended fields from API
  pool?: string; // Pool address
  creator?: string; // Creator wallet
  supply?: number;
  decimals?: number;
  tokenType?: string;
  priceSol?: number;
  priceUsd?: number;
  marketCapUsd?: number;
  hardcap?: number;
  buys?: number;
  sells?: number;
  txCount?: number;
  volumeSol?: number;
  volumeUsd?: number;
  isMigrated?: boolean;
  isCurrentlyLive?: boolean;
  topHoldersList?: TokenHolder[];
  createdAt?: string;
  updatedAt?: string;
}

export interface PoolDetail extends Pool {
  priceHistory: PricePoint[];
  timeline: Timeline;
  socialLinks: SocialLinks;
  faq: FAQ[];
  participants: number;
  minParticipation?: string;
  maxParticipation?: string;
  holders?: TokenHolder[]; // Complete holders list from API
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

export interface TokenHolder {
  wallet: string;
  amount: number;
  percentage: number;
  _id: string;
}

export interface TokenFromAPI {
  // Basic identifiers
  token?: string;
  _id?: string;
  id?: string;

  // Token info
  name?: string;
  symbol?: string;
  ticker?: string;
  description?: string;
  photo?: string; // IPFS image
  metadataUri?: string;

  // Token economics
  supply?: number;
  decimals?: number;
  tokenType?: string;

  // Pricing
  price?: string | number;
  priceSol?: number;
  priceUsd?: number;
  tokenPrice?: string;
  marketCapUsd?: number;

  // Pool info
  pool?: string;
  hardcap?: number;
  creator?: string;
  configAddress?: string | null;

  // Progress & amounts
  progress?: number;
  progressSol?: number;
  _balanceSol?: number; // Current raised in SOL
  _balanceTokens?: number;
  targetAmount?: string;
  currentAmount?: string;
  raisedAmount?: string;

  // Trading stats
  buys?: number;
  sells?: number;
  txCount?: number;
  volumeSol?: number;
  volumeUsd?: number;
  holders?: number;

  // Timestamps
  mint_time?: number;
  list_time?: number;
  last_tx_time?: number;
  createdAt?: string;
  updatedAt?: string;
  startTime?: string;
  endTime?: string;

  // Migration
  isMigrated?: boolean;
  migrationPool?: string | null;

  // Livestream
  isCurrentlyLive?: boolean;
  liveStartTime?: number | null;
  numLivestreamParticipants?: number | null;

  // Holders
  topHoldersPercentage?: number;
  topHoldersList?: TokenHolder[];
  creatorSharePercentage?: number;

  // Social & metadata
  website?: string;
  x?: string; // Twitter/X
  telegram?: string;
  twitter?: string;
  discord?: string;
  metaData?: {
    description?: string;
    image?: string;
    website?: string;
    twitter?: string;
    discord?: string;
  };

  // Draft status
  isDraft?: boolean;

  // Legacy fields
  status?: 'active' | 'upcoming' | 'finished';
  tvl?: string;
  marketCap?: string;
  participants?: number;
  tags?: string[];
  image?: string;
  imageUrl?: string;
}
