import { IPFS_GATE, IPFS_PROTOCOL, normalizeIpfsUri } from 'src/utils/image.utils';

const COVALENT_IPFS_GATE = 'https://ipfs.covalenthq.com/ipfs';

export const toHttpMetadataUri = (uri?: string | null): string | undefined => {
  const normalizedUri = normalizeIpfsUri(uri ?? undefined);
  if (!normalizedUri) {
    return undefined;
  }

  if (normalizedUri.startsWith(IPFS_PROTOCOL)) {
    return `${IPFS_GATE}/${normalizedUri.slice(IPFS_PROTOCOL.length)}`;
  }

  return /^https?:\/\//i.test(normalizedUri) ? normalizedUri.replace(COVALENT_IPFS_GATE, IPFS_GATE) : undefined;
};
