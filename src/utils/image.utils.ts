import { TokenInterface } from '../token/interfaces/token.interface';

const IPFS_GATEWAY = 'ipfs.io';
const IPFS_PROTOCOL_PREFIX = 'ipfs://';

enum ImageSizeEnum {
  Small = '288',
  Big = '400'
}

export const formatImgUri = (origin: string) =>
  origin.startsWith(IPFS_PROTOCOL_PREFIX)
    ? `https://${IPFS_GATEWAY}/ipfs/${origin.substring(IPFS_PROTOCOL_PREFIX.length)}/`
    : origin;

export const formatCollectibleUri = (collectible: TokenInterface, size: number) => {
  const { address } = collectible;
  const id = `${collectible.id}`;

  return `https://assets.objkt.com/file/assets-001/${address}/${id.length > 1 ? id[id.length - 2] : 0}/${
    id[id.length - 1]
  }/${id}/thumb${size > 288 ? ImageSizeEnum.Big : ImageSizeEnum.Small}`;
};
