import { TokenInterface } from '../token/interfaces/token.interface';

const IPFS_GATEWAY = 'cloudflare-ipfs.com';
const IPFS_PROTOCOL_PREFIX = 'ipfs://';
const OBJKT_ORIGIN = 'https://assets.objkt.media/file/assets-001';

export const formatImgUri = (origin: string) =>
  origin.startsWith(IPFS_PROTOCOL_PREFIX)
    ? `https://${IPFS_GATEWAY}/ipfs/${origin.substring(IPFS_PROTOCOL_PREFIX.length)}/`
    : origin;

export const isImgUriSvg = (url: string) => url.endsWith('.svg');

export const formatCollectibleUri = (collectible: TokenInterface) => {
  const { address } = collectible;
  const id = `${collectible.id}`;

  return `${OBJKT_ORIGIN}/${address}/${id.length > 1 ? id[id.length - 2] : 0}/${id[id.length - 1]}/${id}/thumb400`;
};
