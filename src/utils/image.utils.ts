import { isString } from './is-string';
import 'react-native-url-polyfill/auto';

const IPFS_PROTOCOL = 'ipfs:';
const OBJKT_ORIGIN = 'https://assets.objkt.media/file';
const OBJKT_RESIZE_3 = 'assets-003';

const IPFS_GATE = 'https://cloudflare-ipfs.com/ipfs';
const MEDIA_HOST = 'https://static.tcinfra.net';

export enum ImageResolutionEnum {
  SMALL = 'small',
  MEDIUM = 'medium'
}

export const formatImgUri = (origin = '', resolution = ImageResolutionEnum.SMALL, shouldUseMediaHost = true) => {
  if (origin.startsWith('ipfs://')) {
    const ipfsId = origin.substring(7);

    return shouldUseMediaHost ? `${MEDIA_HOST}/media/${resolution}/ipfs/${ipfsId}` : `${IPFS_GATE}/${ipfsId}`;
  }

  if (origin.startsWith('http') && shouldUseMediaHost) {
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
  const url = new URL(artifactUri); // Throws `TypeError: Invalid URL`

  return url.protocol === 'ipfs:' ? artifactUri.substring(IPFS_PROTOCOL.length) : artifactUri;
};

export const formatCollectibleObjktArtifactUri = (artifactUri: string) => {
  if (artifactUri.startsWith('data:image')) {
    return artifactUri;
  }

  try {
    const url = new URL(artifactUri); // Throws `TypeError: Invalid URL`
    const urlPath = `${url.protocol}${url.hostname}`;

    if (url.searchParams.get('fxhash') !== null) {
      return `${OBJKT_ORIGIN}/${OBJKT_RESIZE_3}/${cutIpfsPrefix(urlPath)}/artifact/index.html${url.search}`;
    }

    return `${OBJKT_ORIGIN}/${OBJKT_RESIZE_3}/${cutIpfsPrefix(urlPath)}/artifact`;
  } catch (error) {
    console.error(error);

    return '';
  }
};

export const formatCollectibleObjktDisplayUri = (displayUri: string) => {
  if (displayUri.startsWith('data:image')) {
    return displayUri;
  }

  const url = new URL(displayUri);
  const urlPath = `${url.protocol}${url.hostname}`;

  return `${OBJKT_ORIGIN}/${OBJKT_RESIZE_3}/${cutIpfsPrefix(urlPath)}/display`;
};
