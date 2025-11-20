import { normalizeImageUrl } from './media';

describe('normalizeImageUrl', () => {
  it('returns undefined for empty values', () => {
    expect(normalizeImageUrl(undefined)).toBeUndefined();
    expect(normalizeImageUrl('   ')).toBeUndefined();
  });

  it('allows trusted https URLs', () => {
    const url = 'https://ipfs.io/ipfs/hash.png';
    expect(normalizeImageUrl(url)).toBe(url);
  });

  it('converts ipfs:// URLs to https gateway', () => {
    const url = 'ipfs://QmHash/image.png';
    expect(normalizeImageUrl(url)).toBe('https://ipfs.io/ipfs/QmHash/image.png');
  });

  it('normalizes protocol-relative URLs', () => {
    const url = '//cdn.pump.fun/image.png';
    expect(normalizeImageUrl(url)).toBe('https://cdn.pump.fun/image.png');
  });

  it('rejects untrusted domains', () => {
    const url = 'https://example.com/image.png';
    expect(normalizeImageUrl(url)).toBeUndefined();
  });

  it('returns data URLs unchanged', () => {
    const url = 'data:image/png;base64,AAA';
    expect(normalizeImageUrl(url)).toBe(url);
  });
});
