import { TokenInterface } from '../token/interfaces/token.interface';

const IPFS_GATEWAY = 'ipfs.io';
const IPFS_PROTOCOL_PREFIX = 'ipfs://';

export const formatImgUri = (origin: string) =>
  origin.startsWith(IPFS_PROTOCOL_PREFIX)
    ? `https://${IPFS_GATEWAY}/ipfs/${origin.substring(IPFS_PROTOCOL_PREFIX.length)}/`
    : origin;

export const isImgUriSvg = (url: string) => url.endsWith('.svg');

export const formatCollectibleUri = (collectible: TokenInterface) => {
  const { address } = collectible;
  const id = `${collectible.id}`;

  return `https://assets.objkt.com/file/assets-001/${address}/${id.length > 1 ? id[id.length - 2] : 0}/${
    id[id.length - 1]
  }/${id}/thumb400`;
};
