// Pure utility functions for formatting (moved outside components for performance)

/**
 * Format large numbers with K/M suffixes
 */
export function formatNumber(num: string | number): string {
  const value = typeof num === 'string' ? parseFloat(num) : num;
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(2)}M`;
  } else if (value >= 1000) {
    return `$${(value / 1000).toFixed(1)}K`;
  }
  return `$${value.toFixed(0)}`;
}

/**
 * Format Solana address to shortened version
 */
export function formatAddress(address: string): string {
  if (!address) return 'N/A';
  return `${address.slice(0, 4)}...${address.slice(-4)}`;
}

/**
 * Parse numeric value from string or number
 */
export function parseNumeric(value?: string | number): number {
  if (typeof value === 'number') return value;
  if (!value) return 0;
  const parsed = parseFloat(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

/**
 * Get timestamp from createdAt field
 */
export function getCreatedAtTimestamp(createdAt?: number | string): number | undefined {
  if (!createdAt) return undefined;
  if (typeof createdAt === 'number') return createdAt;
  const timestamp = new Date(createdAt).getTime();
  return Number.isNaN(timestamp) ? undefined : timestamp;
}
