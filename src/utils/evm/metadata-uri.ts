import { Buffer } from 'buffer';

import { IPFS_GATE, IPFS_PROTOCOL, normalizeIpfsUri } from 'src/utils/image.utils';

const COVALENT_IPFS_GATE = 'https://ipfs.covalenthq.com/ipfs';

const JSON_DATA_URI_REGEX = /^data:application\/json((?:;[^,]*)?),/;

const decodeDataUriPayload = (payload: string) => {
  try {
    return decodeURIComponent(payload);
  } catch {
    return payload;
  }
};

export const parseJsonDataUri = <T>(uri: string): T | undefined => {
  const match = JSON_DATA_URI_REGEX.exec(uri);
  if (!match) {
    return undefined;
  }

  const isBase64 = match[1].split(';').includes('base64');
  const payload = uri.slice(match[0].length);

  try {
    return JSON.parse(isBase64 ? Buffer.from(payload, 'base64').toString('utf8') : decodeDataUriPayload(payload));
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
