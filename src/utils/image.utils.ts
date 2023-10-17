import 'react-native-url-polyfill/auto';

import { AssetMediaURIs } from './assets/types';
import { isString } from './is-string';

const IPFS_PROTOCOL = 'ipfs://';
const OBJKT_MEDIA_HOST = 'https://assets.objkt.media/file/assets-003';
const IPFS_GATE = 'https://cloudflare-ipfs.com/ipfs';
const MEDIA_HOST = 'https://static.tcinfra.net/media';

type TcInfraMediaSize = 'small' | 'medium' | 'large' | 'raw';
type ObjktMediaTail = 'display' | 'artifact' | 'thumb288';

const DEFAULT_MEDIA_SIZE: TcInfraMediaSize = 'small';

export const buildCollectibleImagesStack = (
  slug: string,
  { artifactUri, displayUri, thumbnailUri }: AssetMediaURIs,
  fullView = false
) => {
  const [address, id] = slug.split('_');

  const dataUriStack = [
    artifactUri?.startsWith('data:image/') ? artifactUri : undefined,
    displayUri?.startsWith('data:image/') ? displayUri : undefined
  ];
  const httpStack = [
    artifactUri?.startsWith('http') ? artifactUri : undefined,
    displayUri?.startsWith('http') ? displayUri : undefined
  ];

  return fullView
    ? [
        ...dataUriStack,
        buildObjktMediaURI(artifactUri, 'display'),
        buildObjktMediaURI(displayUri, 'display'),
        buildObjktMediaURI(thumbnailUri, 'display'),
        buildIpfsMediaURI(displayUri, 'raw'),
        buildIpfsMediaURI(displayUri, 'large'),
        buildIpfsMediaURI(displayUri, 'medium'),
        buildIpfsMediaURI(displayUri, 'small'),
        buildIpfsMediaURI(artifactUri, 'raw'),
        buildIpfsMediaURI(artifactUri, 'large'),
        buildIpfsMediaURI(artifactUri, 'medium'),
        buildIpfsMediaURI(artifactUri, 'small'),
        ...httpStack
      ]
    : [
        ...dataUriStack,
        buildObjktMediaURI(artifactUri, 'thumb288'),
        buildObjktMediaURI(displayUri, 'thumb288'),
        buildObjktMediaURI(thumbnailUri, 'thumb288'),
        // Some image of video asset (see: KT1RJ6PbjHpwc3M5rw5s2Nbmefwbuwbdxton_773019) only available through this option:
        buildObjktMediaUriForItemPath(`${address}/${id}`, 'thumb288'),
        buildIpfsMediaURI(thumbnailUri, 'medium'),
        buildIpfsMediaURI(thumbnailUri, 'small'),
        buildIpfsMediaURI(displayUri, 'medium'),
        buildIpfsMediaURI(displayUri, 'small'),
        buildIpfsMediaURI(artifactUri, 'medium'),
        buildIpfsMediaURI(artifactUri, 'small'),
        ...httpStack
      ];
};

const getIpfsItemInfo = (uri: string) => {
  if (!uri.startsWith(IPFS_PROTOCOL)) {
    return null;
  }

  const [path, search] = uri.slice(IPFS_PROTOCOL.length).split('?');
  const id = path.split('/')[0];

  if (id === INVALID_IPFS_ID) {
    return null;
  }

  return {
    id,
    path,
    /** With leading `?` */
    search: search ? `?${search}` : ''
  };
};

/** Black circle in `thumbnailUri`
 * See:
 * - KT1M2JnD1wsg7w2B4UXJXtKQPuDUpU2L7cJH_79
 * - KT1RJ6PbjHpwc3M5rw5s2Nbmefwbuwbdxton_19484
 * - KT1RJ6PbjHpwc3M5rw5s2Nbmefwbuwbdxton_3312
 */
const INVALID_IPFS_ID = 'QmNrhZHUaEqxhyLfqoq1mtHSipkWHeT31LNHb1QEbDHgnc';

const buildObjktMediaURI = (uri: string | undefined, tail: ObjktMediaTail) => {
  if (!uri) {
    return;
  }

  const ipfsInfo = getIpfsItemInfo(uri);
  if (!ipfsInfo) {
    return;
  }

  let result = buildObjktMediaUriForItemPath(ipfsInfo.id, tail);
  if (ipfsInfo.search) {
    result += `/index.html${ipfsInfo.search}`;
  }

  return result;
};

const buildObjktMediaUriForItemPath = (itemId: string, tail: ObjktMediaTail) => `${OBJKT_MEDIA_HOST}/${itemId}/${tail}`;

const buildIpfsMediaURI = (uri?: string, size: TcInfraMediaSize = DEFAULT_MEDIA_SIZE, useMediaHost = true) => {
  if (!uri) {
    return;
  }

  const ipfsInfo = getIpfsItemInfo(uri);

  if (ipfsInfo) {
    return useMediaHost
      ? `${MEDIA_HOST}/${size}/ipfs/${ipfsInfo.path}${ipfsInfo.search}`
      : `${IPFS_GATE}/${ipfsInfo.path}${ipfsInfo.search}`;
  }

  if (useMediaHost && uri.startsWith('http')) {
    return `${MEDIA_HOST}/${size}/web/${uri.replace(/^https?:\/\//, '')}`;
  }

  return;
};

export const formatImgUri = (uri = '', size: TcInfraMediaSize = DEFAULT_MEDIA_SIZE, useMediaHost = true) =>
  buildIpfsMediaURI(uri, size, useMediaHost) ?? uri;

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

  return buildObjktMediaUriForItemPath(`${address}/${id}`, 'thumb288');
};

export const formatCollectibleObjktArtifactUri = (artifactUri: string) => {
  if (artifactUri.startsWith('data:image')) {
    return artifactUri;
  }

  return buildObjktMediaURI(artifactUri, 'artifact') ?? '';
};
