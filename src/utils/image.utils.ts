const IPFS_GATEWAY = 'cloudflare-ipfs.com';
const IPFS_PROTOCOL_PREFIX = 'ipfs://';
const OBJKT_ORIGIN = 'https://assets.objkt.media/file';
const OBJKT_RESIZE_1 = 'assets-001';
const OBJKT_RESIZE_3 = 'assets-003';

export const formatImgUri = (origin: string) =>
  origin.startsWith(IPFS_PROTOCOL_PREFIX)
    ? `https://${IPFS_GATEWAY}/ipfs/${origin.substring(IPFS_PROTOCOL_PREFIX.length)}/`
    : origin;

export const isImgUriSvg = (url: string) => url.endsWith('.svg');

export const formatCollectibleObjktBigUri = (assetSlug: string) => {
  const [address, id] = assetSlug.split('_');

  return `${OBJKT_ORIGIN}/${OBJKT_RESIZE_1}/${address}/${id.length > 1 ? id[id.length - 2] : 0}/${
    id[id.length - 1]
  }/${id}/thumb400`;
};

export const formatCollectibleObjktMediumUri = (assetSlug: string) => {
  const [address, id] = assetSlug.split('_');

  return `${OBJKT_ORIGIN}/${OBJKT_RESIZE_3}/${address}/${id}/thumb288`;
};

export const formatCollectibleObjktArtifactUri = (artifactUri: string) =>
  `${OBJKT_ORIGIN}/${OBJKT_RESIZE_3}/${
    artifactUri.includes('ipfs://') ? artifactUri.substring(IPFS_PROTOCOL_PREFIX.length) : artifactUri
  }/artifact`;
