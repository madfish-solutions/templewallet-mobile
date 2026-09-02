import { Buffer } from 'buffer';

import { IPFS_GATE, IPFS_PROTOCOL, normalizeIpfsUri } from 'src/utils/image.utils';

const COVALENT_IPFS_GATE = 'https://ipfs.covalenthq.com/ipfs';

const JSON_DATA_URI_REGEX = /^data:application\/json(;base64)?,/;

export const parseJsonDataUri = <T>(uri: string): T | undefined => {
  const match = JSON_DATA_URI_REGEX.exec(uri);
  if (!match) {
    return undefined;
  }

  const payload = uri.slice(match[0].length);

  try {
    return JSON.parse(match[1] ? Buffer.from(payload, 'base64').toString('utf8') : decodeURIComponent(payload));
  } catch {
    return undefined;
  }
};

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
