import { uniq } from 'lodash-es';

import { AssetMediaURIs } from './assets/types';
import { isString } from './is-string';
import { isTruthy } from './is-truthy';

const IPFS_PROTOCOL = 'ipfs://';
const OBJKT_MEDIA_HOST = 'https://assets.objkt.media/file/assets-003';
const IPFS_GATE = 'https://ipfs.io/ipfs';

type ObjktMediaTail = 'display' | 'artifact' | 'thumb288';

const buildIpfsMediaUrisByInfo = (info: MediaUriInfo) => [
  buildIpfsMediaUriByInfo(info),
  buildIpfsMediaUriByInfo(info, 'https://ipfs.filebase.io/ipfs')
];

export const buildCollectibleImagesStack = (
  slug: string,
  { artifactUri, displayUri, thumbnailUri }: AssetMediaURIs,
  fullView = false
): string[] => {
  const [address, id] = slug.split('_');

  const artifactInfo = getMediaUriInfo(artifactUri);
  const displayInfo = getMediaUriInfo(displayUri);
  const thumbnailInfo = getMediaUriInfo(thumbnailUri);

  const stack = fullView
    ? [
        assureGetDataUriImage(artifactUri),
        assureGetDataUriImage(displayUri),

        buildObjktMediaURI(artifactInfo.ipfs, 'display'),
        buildObjktMediaURI(displayInfo.ipfs, 'display'),
        buildObjktMediaURI(thumbnailInfo.ipfs, 'display'),

        ...buildIpfsMediaUrisByInfo(displayInfo),

        ...buildIpfsMediaUrisByInfo(artifactInfo),

        assureGetDataUriImage(thumbnailUri)
      ]
    : [
        /* There are performance issues with these on Collectibles screen with many <SvgXml /> components.
      assureGetDataUriImage(thumbnailUri),
      assureGetDataUriImage(displayUri),
      assureGetDataUriImage(artifactUri),
      */

        // Some image of video asset (see: KT1RJ6PbjHpwc3M5rw5s2Nbmefwbuwbdxton_773019) only available through this option:
        buildObjktMediaUriForItemPath(`${address}/${id}`, 'thumb288'),

        buildObjktMediaURI(artifactInfo.ipfs, 'thumb288'),
        buildObjktMediaURI(displayInfo.ipfs, 'thumb288'),
        buildObjktMediaURI(thumbnailInfo.ipfs, 'thumb288'),

        ...buildIpfsMediaUrisByInfo(thumbnailInfo),
        ...buildIpfsMediaUrisByInfo(displayInfo),
        ...buildIpfsMediaUrisByInfo(artifactInfo)
      ];

  return uniq(stack.filter(isTruthy));
};

interface MediaUriInfo {
  uri?: string;
  ipfs: IpfsUriInfo | nullish;
}

const getMediaUriInfo = (uri?: string): MediaUriInfo => ({
  uri,
  ipfs: uri ? getIpfsItemInfo(uri) : null
});

interface IpfsUriInfo {
  id: string;
  path: string;
  /** With leading `?` if applicable */
  search: '' | `?${string}`;
}

const getIpfsItemInfo = (uri: string): IpfsUriInfo | null => {
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

const buildObjktMediaURI = (ipfsInfo: IpfsUriInfo | nullish, tail: ObjktMediaTail) => {
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

const CLOUDFLARE_IPFS_REGEX = /^https?:\/\/cloudflare-ipfs\.com/;

const buildIpfsMediaUriByInfo = ({ uri, ipfs: ipfsInfo }: MediaUriInfo, ipfsGate = IPFS_GATE) => {
  if (!uri) {
    return;
  }

  if (ipfsInfo) {
    return `${ipfsGate}/${ipfsInfo.path}${ipfsInfo.search}`;
  }

  if (CLOUDFLARE_IPFS_REGEX.test(uri)) {
    return `${ipfsGate}/${uri.replace(CLOUDFLARE_IPFS_REGEX, '')}`;
  }

  if (uri.startsWith('http')) {
    // This option also serves as a proxy for any `http` source
    return uri;
  }
};

export const formatImgUri = (uri = '') => buildIpfsMediaUriByInfo(getMediaUriInfo(uri));

export const isImgUriSvg = (url: string) => url.endsWith('.svg');

const SVG_DATA_URI_UTF8_PREFIX = 'data:image/svg+xml;charset=utf-8,';
const SVG_DATA_URI_BASE64_PREFIX = 'data:image/svg+xml;base64,';

const assureGetDataUriImage = (uri?: string) => (uri?.startsWith('data:image/') ? uri : undefined);

export const isImgUriDataUri = (uri: string) => isSvgDataUriInUtf8Encoding(uri);

const isSvgDataUriInUtf8Encoding = (uri: string) =>
  uri.slice(0, SVG_DATA_URI_UTF8_PREFIX.length).toLowerCase() === SVG_DATA_URI_UTF8_PREFIX;

export const isSvgDataUriInBase64Encoding = (uri: string) =>
  uri.slice(0, SVG_DATA_URI_BASE64_PREFIX.length).toLowerCase() === SVG_DATA_URI_BASE64_PREFIX;

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

/** Observed in Plenty NFTs the following: `path="...123-456...""`
 * There should be a space before `-` sign for `<SvgXml />` to render.
 */
export const fixSvgXml = (xml: string) => xml.replace(/(\d*\.?\d+)-(\d*)/g, '$1 -$2');

export const formatCollectibleArtifactUri = (artifactUri: string) => formatObjktMediaUri(artifactUri, 'artifact');

export const formatObjktLogoUri = (logoUri: string) => formatObjktMediaUri(logoUri, 'thumb288');

const formatObjktMediaUri = (mediaUri: string, tail: ObjktMediaTail) =>
  assureGetDataUriImage(mediaUri) || buildObjktMediaURI(getIpfsItemInfo(mediaUri), tail);
