import { isString } from './is-string';
import 'react-native-url-polyfill/auto';

const IPFS_PROTOCOL_PREFIX = 'ipfs://';
const OBJKT_ORIGIN = 'https://assets.objkt.media/file';
const OBJKT_RESIZE_3 = 'assets-003';

const MEDIA_HOST = 'https://static.tcinfra.net';
const MEDIA_SIZE = 'small';

export const formatImgUri = (origin = '', resolution = MEDIA_SIZE) => {
  if (origin.startsWith('ipfs://')) {
    return `${MEDIA_HOST}/media/${resolution}/ipfs/${origin.substring(7)}`;
  }

  if (origin.startsWith('http')) {
    return `${MEDIA_HOST}/media/${resolution}/web/${origin.replace(/^https?:\/\//, '')}`;
  }

  return origin;
};

export const isImgUriSvg = (url: string) => url.endsWith('.svg');

const SVG_DATA_URI_UTF8_PREFIX = 'data:image/svg+xml;charset=utf-8,';

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

const cutIpfsPrefix = (artifactUri: string) => {
  const url = new URL(artifactUri);

  url.protocol === 'ipfs:' ? artifactUri.substring(IPFS_PROTOCOL_PREFIX.length) : artifactUri;
};

export const formatCollectibleObjktArtifactUri = (artifactUri: string) => {
  if (artifactUri.startsWith('data:image')) {
    return artifactUri;
  }

  const url = new URL(artifactUri);
  const urlPath = `${url.protocol}${url.pathname}`;

  if (url.searchParams.get('fxhash') !== null) {
    return `${OBJKT_ORIGIN}/${OBJKT_RESIZE_3}/${cutIpfsPrefix(urlPath)}/artifact/index.html${url.search}`;
  }

  return `${OBJKT_ORIGIN}/${OBJKT_RESIZE_3}/${cutIpfsPrefix(urlPath)}/artifact`;
};
