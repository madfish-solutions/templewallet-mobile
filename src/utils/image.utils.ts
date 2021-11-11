const IPFS_GATEWAY = 'ipfs.io';
const IPFS_PROTOCOL_PREFIX = 'ipfs://';

export const formatImgUri = (origin: string) =>
  origin.startsWith(IPFS_PROTOCOL_PREFIX)
    ? `https://${IPFS_GATEWAY}/ipfs/${origin.substring(IPFS_PROTOCOL_PREFIX.length)}/`
    : origin;

export const formatNftUri = (address: string, id: string) =>
  `https://assets.objkt.com/file/assets-001/${address}/${id.length > 1 ? id[id.length - 2] : 0}/${
    id[id.length - 1]
  }/${id}/thumb200`;
