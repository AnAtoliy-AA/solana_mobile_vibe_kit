// Utility functions for calculating value changes

/**
 * Calculate percentage change between two values
 * @param current - Current value
 * @param previous - Previous value
 * @returns Percentage change (e.g., 5.5 for 5.5% increase)
 */
export function calculatePercentageChange(
  current: string | number | undefined,
  previous: string | number | undefined
): number {
  if (current === undefined || previous === undefined) {
    return 0;
  }

  const currentNum = typeof current === 'string' ? parseFloat(current) : current;
  const previousNum = typeof previous === 'string' ? parseFloat(previous) : previous;

  if (isNaN(currentNum) || isNaN(previousNum) || previousNum === 0) {
    return 0;
  }

  return ((currentNum - previousNum) / previousNum) * 100;
}

/**
 * Format percentage change for display
 * @param change - Percentage change value
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted string (e.g., "+5.50%")
 */
export function formatPercentageChange(change: number, decimals = 2): string {
  const sign = change > 0 ? '+' : '';
  return `${sign}${change.toFixed(decimals)}%`;
}

/**
 * Get change direction
 * @param change - Percentage change value
 * @returns Direction ('up', 'down', or 'neutral')
 */
export function getChangeDirection(change: number): 'up' | 'down' | 'neutral' {
  if (change > 0) return 'up';
  if (change < 0) return 'down';
  return 'neutral';
}

/**
 * Get change class name based on direction
 * @param change - Percentage change value
 * @returns CSS class name ('positive', 'negative', or 'neutral')
 */
export function getChangeClassName(change: number): 'positive' | 'negative' | 'neutral' {
  if (change > 0) return 'positive';
  if (change < 0) return 'negative';
  return 'neutral';
}

/**
 * Calculate change indicator data for a metric
 * @param current - Current value
 * @param previous - Previous value
 * @returns Object with change percentage and metadata
 */
export interface ChangeIndicatorData {
  change: number;
  direction: 'up' | 'down' | 'neutral';
  className: 'positive' | 'negative' | 'neutral';
  formattedChange: string;
  arrow: '↑' | '↓' | '→';
}

export function getChangeIndicatorData(
  current: string | number | undefined,
  previous: string | number | undefined
): ChangeIndicatorData | null {
  if (current === undefined || previous === undefined) {
    return null;
  }

  const change = calculatePercentageChange(current, previous);
  const direction = getChangeDirection(change);
  const className = getChangeClassName(change);
  const formattedChange = formatPercentageChange(change);
  const arrow = direction === 'up' ? '↑' : direction === 'down' ? '↓' : '→';

  return {
    change,
    direction,
    className,
    formattedChange,
    arrow,
  };
}
