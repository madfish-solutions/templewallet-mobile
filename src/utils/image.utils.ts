import { isString } from './is-string';

const IPFS_PROTOCOL_PREFIX = 'ipfs://';
const OBJKT_ORIGIN = 'https://assets.objkt.media/file';
const OBJKT_RESIZE_3 = 'assets-003';

const MEDIA_HOST = 'https://static.tcinfra.net';
const MEDIA_SIZE = 'small';

export const formatImgUri = (origin = '') => {
  if (origin.startsWith('ipfs://')) {
    return `${MEDIA_HOST}/media/${MEDIA_SIZE}/ipfs/${origin.substring(7)}`;
  }

  if (origin.startsWith('http')) {
    return `${MEDIA_HOST}/media/${MEDIA_SIZE}/web/${origin.replace(/^https?:\/\//, '')}`;
  }

  return origin;
};

export const isImgUriSvg = (url: string) => url.endsWith('.svg');

export const SVG_DATA_URI_UTF8_PREFIX = 'data:image/svg+xml;charset=utf-8,';

export const isImgUriDataUri = (uri: string) => isSvgDataUriInUtf8Encoding(uri);

const isSvgDataUriInUtf8Encoding = (uri: string) =>
  uri.slice(0, SVG_DATA_URI_UTF8_PREFIX.length).toLowerCase() === SVG_DATA_URI_UTF8_PREFIX;

export const isImageRectangular = (uri?: string) => {
  if (isString(uri) && isSvgDataUriInUtf8Encoding(uri)) {
    const viewBoxVal = uri
      .match(/viewBox=['"][0-9]+ [0-9]+ [0-9]+ [0-9]+['"]/g)?.[0]
      ?.slice(9, -1)
      .split(' ');

    if (viewBoxVal) {
      const [minX, minY, maxX, maxY] = viewBoxVal;
      const width = Number(maxX) - Number(minX);
      const height = Number(maxY) - Number(minY);
      if (Number.isFinite(width) && Number.isFinite(height) && width !== height) {
        return true;
      }
    }
  }
};

export const getXmlFromSvgDataUriInUtf8Encoding = (uri: string) =>
  decodeURIComponent(uri).slice(SVG_DATA_URI_UTF8_PREFIX.length);

export const fixSvgXml = (xml: string) => xml.replace(/(\d*\.?\d+)-(\d*)/g, '$1 -$2');

export const formatCollectibleObjktMediumUri = (assetSlug: string) => {
  const [address, id] = assetSlug.split('_');

  return `${OBJKT_ORIGIN}/${OBJKT_RESIZE_3}/${address}/${id}/thumb288`;
};

export const formatCollectibleObjktArtifactUri = (artifactUri: string) =>
  `${OBJKT_ORIGIN}/${OBJKT_RESIZE_3}/${
    artifactUri.includes('ipfs://') ? artifactUri.substring(IPFS_PROTOCOL_PREFIX.length) : artifactUri
  }/artifact`;
