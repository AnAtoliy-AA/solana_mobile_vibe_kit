// Shared helpers for media URLs (images, videos, etc.)

const trustedHosts = [
  'ipfs.io',
  'gateway.pinata.cloud',
  'cloudflare-ipfs.com',
  'dweb.link',
  'nftstorage.link',
  'arweave.net',
  'ar-io.net',
  'pump.fun',
  'cdn.pump.fun',
  'shdw-drive.genesysgo.net',
];

const normalizeIpfs = (ipfsUrl: string): string => {
  const ipfsPath = ipfsUrl.replace('ipfs://', '').replace('ipfs/', '');
  return `https://ipfs.io/ipfs/${ipfsPath}`;
};

export function normalizeImageUrl(rawUrl?: string): string | undefined {
  if (!rawUrl) {
    return undefined;
  }

  const trimmedUrl = rawUrl.trim();

  if (!trimmedUrl) {
    return undefined;
  }

  if (trimmedUrl.startsWith('data:')) {
    return trimmedUrl;
  }

  let url = trimmedUrl;

  if (trimmedUrl.startsWith('ipfs://')) {
    url = normalizeIpfs(trimmedUrl);
  } else if (trimmedUrl.startsWith('ipfs/')) {
    url = normalizeIpfs(`ipfs://${trimmedUrl.replace('ipfs/', '')}`);
  } else if (trimmedUrl.startsWith('//')) {
    url = `https:${trimmedUrl}`;
  } else if (!trimmedUrl.startsWith('http://') && !trimmedUrl.startsWith('https://')) {
    return undefined;
  }

  try {
    const parsed = new URL(url);
    const isTrusted = trustedHosts.some((host) => parsed.hostname.includes(host));
    return isTrusted ? parsed.toString() : undefined;
  } catch {
    return undefined;
  }
}
