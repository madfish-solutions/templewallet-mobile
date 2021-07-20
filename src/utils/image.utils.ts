const IPFS_GATEWAY = 'ipfs.io';
const IPFS_PROTOCOL_PREFIX = 'ipfs://';

export const formatImgUri = (origin: string) =>
  origin.startsWith(IPFS_PROTOCOL_PREFIX)
    ? `https://${IPFS_GATEWAY}/ipfs/${origin.substring(IPFS_PROTOCOL_PREFIX.length)}/`
    : origin;
