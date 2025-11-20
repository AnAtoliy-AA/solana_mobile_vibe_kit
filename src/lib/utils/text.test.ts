import { getTokenInitials } from './text';

describe('getTokenInitials', () => {
  it('uses name when available', () => {
    expect(getTokenInitials('Solana Meme', 'SM')).toBe('SO');
  });

  it('falls back to symbol', () => {
    expect(getTokenInitials(undefined, 'SM')).toBe('SM');
  });

  it('handles whitespace and special characters', () => {
    expect(getTokenInitials('  $Meme Coin!!  ')).toBe('ME');
  });

  it('returns ?? when no input provided', () => {
    expect(getTokenInitials()).toBe('??');
  });

  it('handles emoji or non alphanumeric characters', () => {
    expect(getTokenInitials('🚀🚀', '🚀x')).toBe('🚀');
  });
});
