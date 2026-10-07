import { trimEnd, uniq } from 'lodash-es';
import { getAddress } from 'viem';

import { AssetMediaURIs } from './assets/types';
import { fromTokenSlug } from './from-token-slug';
import {
  DWEB_IPFS_GATE,
  getIpfsAwareItemInfo,
  getIpfsItemInfo,
  IPFS_GATE,
  IPFS_PROTOCOL,
  IpfsUriInfo,
  isInvalidIpfsMediaUri,
  normalizeIpfsUri
} from './ipfs.utils';
import { isDefined } from './is-defined';
import { isString } from './is-string';
import { isTruthy } from './is-truthy';
import {
  buildObjktAssetUrls,
  buildObjktTokenThumbnailUrl,
  isObjktAssetUrl,
  ObjktAssetRendition,
  splitSearch
} from './objkt-cdn';
import { ETHERLINK_MAINNET_CHAIN_ID } from './rpc/rpc-list';

const MEDIA_HOST = 'https://static.tcinfra.net/media';

type TcInfraMediaSize = 'small' | 'medium' | 'large' | 'raw';

const DEFAULT_MEDIA_SIZE: TcInfraMediaSize = 'small';

const IPFS_GATES = [IPFS_GATE, DWEB_IPFS_GATE];

const isImageDataUri = (uri: string) => uri.startsWith('data:image/');

const isDirectlyLoadableUri = (uri: string) => /^(https?|data|blob):/.test(uri);

const assureGetDataUriImage = (uri?: string) => (uri && isImageDataUri(uri) ? uri : undefined);

/** Public IPFS gateways for an `ipfs://` URI or a path-style gateway link; any other http(s) link is used as is. */
const buildIpfsGatewayUrls = (uri: string | undefined): string[] => {
  if (!uri) {
    return [];
  }

  const ipfsInfo = getIpfsAwareItemInfo(uri);
  if (!ipfsInfo) {
    return uri.startsWith('http') ? [uri] : [];
  }

  return IPFS_GATES.map(gate => `${gate}/${ipfsInfo.path}${ipfsInfo.search}`);
};

const isGatewayFallbackUri = (uri: string) =>
  !isInvalidIpfsMediaUri(uri) && !isObjktAssetUrl(uri) && (uri.startsWith(IPFS_PROTOCOL) || uri.startsWith('http'));

/** objkt's CDN first, then the IPFS gateways for the first URI they can serve. Data URIs are left out. */
const buildTezosMediaStack = (
  uris: Array<string | undefined>,
  renditions: ObjktAssetRendition[] = ['artifact']
): string[] => {
  const definedUris = uris.filter(isTruthy);
  const objktUrls = definedUris.flatMap(uri => renditions.flatMap(rendition => buildObjktAssetUrls(uri, rendition)));

  return objktUrls.concat(buildIpfsGatewayUrls(definedUris.find(isGatewayFallbackUri)));
};

export const buildTezosCollectibleImagesStack = (
  slug: string,
  { artifactUri, displayUri, thumbnailUri }: AssetMediaURIs,
  fullView = false
): string[] => {
  if (fullView) {
    return uniq(
      [
        assureGetDataUriImage(artifactUri),
        assureGetDataUriImage(displayUri),
        ...buildTezosMediaStack([displayUri, artifactUri, thumbnailUri]),
        assureGetDataUriImage(thumbnailUri)
      ].filter(isTruthy)
    );
  }

  const [address, id] = fromTokenSlug(slug);
  // Data URIs stay out of the grid stack: many <SvgXml /> components on the Collectibles screen hurt performance
  const previewStack = buildTezosMediaStack([thumbnailUri, displayUri]);

  return uniq(
    [
      // Some image or video assets (see: KT1RJ6PbjHpwc3M5rw5s2Nbmefwbuwbdxton_773019) are only available through this option:
      id && buildObjktTokenThumbnailUrl(address, id),
      ...(previewStack.length > 0 ? previewStack : buildTezosMediaStack([artifactUri]))
    ].filter(isTruthy)
  );
};

const buildArtifactFallbackUris = (artifactUri: string) => {
  if (isGatewayFallbackUri(artifactUri)) {
    return buildIpfsGatewayUrls(artifactUri);
  }

  return isDirectlyLoadableUri(artifactUri) ? [artifactUri] : [];
};

const DIRECTORY_INDEX_PATH = '/index.html';

/** objkt and the gateways serve a folder artifact by its `index.html`, which must come before the query string */
const toDirectoryIndexUrl = (url: string) => {
  if (!url.startsWith('http')) {
    return url;
  }

  const [base, search] = splitSearch(url);

  return base.endsWith(DIRECTORY_INDEX_PATH) ? url : `${trimEnd(base, '/')}${DIRECTORY_INDEX_PATH}${search}`;
};

/**
 * objkt's copies of the artifact, then the gateways, or the original itself when a player can load it directly.
 * Folder artifacts (`application/x-directory`) are addressed by their `index.html`.
 */
export const buildObjktCollectibleArtifactUris = (artifactUri: string, isDirectory = false): string[] => {
  if (isInvalidIpfsMediaUri(artifactUri)) {
    return [];
  }

  const candidates = uniq(buildObjktAssetUrls(artifactUri, 'artifact').concat(buildArtifactFallbackUris(artifactUri)));

  return isDirectory ? uniq(candidates.map(toDirectoryIndexUrl)) : candidates;
};

export const buildCollectionLogoStack = (logoUri: string | nullish): string[] =>
  logoUri
    ? uniq(
        [assureGetDataUriImage(logoUri), ...buildTezosMediaStack([logoUri], ['thumb288', 'artifact'])].filter(isTruthy)
      )
    : [];

interface MediaUriInfo {
  uri?: string;
  ipfs: IpfsUriInfo | nullish;
}

const getMediaUriInfo = (uri?: string): MediaUriInfo => ({
  uri,
  ipfs: uri ? getIpfsItemInfo(uri) : null
});

const CLOUDFLARE_IPFS_REGEX = /^https?:\/\/cloudflare-ipfs\.com\/ipfs/;
const buildMediaHostWebUri = (uri: string, size: TcInfraMediaSize) =>
  `${MEDIA_HOST}/${size}/web/${uri.replace(/^https?:\/\//, '')}`;

const buildIpfsMediaUriByInfo = (
  { uri, ipfs: ipfsInfo }: MediaUriInfo,
  size: TcInfraMediaSize = DEFAULT_MEDIA_SIZE,
  useMediaHost = true
) => {
  if (!uri) {
    return;
  }

  if (ipfsInfo) {
    return useMediaHost
      ? `${MEDIA_HOST}/${size}/ipfs/${ipfsInfo.path}${ipfsInfo.search}`
      : `${IPFS_GATE}/${ipfsInfo.path}${ipfsInfo.search}`;
  }

  if (CLOUDFLARE_IPFS_REGEX.test(uri)) {
    return `${IPFS_GATE}${uri.replace(CLOUDFLARE_IPFS_REGEX, '')}`;
  }

  if (uri.startsWith('http')) {
    // This option also serves as a proxy for any `http` source
    return useMediaHost ? buildMediaHostWebUri(uri, size) : uri;
  }
};

export const formatImgUri = (uri = '', size: TcInfraMediaSize = DEFAULT_MEDIA_SIZE, useMediaHost = true) =>
  buildIpfsMediaUriByInfo(getMediaUriInfo(uri), size, useMediaHost);

export const buildTokenImagesStack = (url?: string, preferDirectSource = false): string[] => {
  if (!isDefined(url)) {
    return [];
  }

  if (url.startsWith(IPFS_PROTOCOL) || url.startsWith('http')) {
    const uriInfo = getMediaUriInfo(url);
    const directFallback = uriInfo.ipfs ? buildIpfsMediaUriByInfo(uriInfo, 'small', false) : uriInfo.uri;
    const mediaHostSources = [buildIpfsMediaUriByInfo(uriInfo, 'small'), buildIpfsMediaUriByInfo(uriInfo, 'medium')];

    return (preferDirectSource ? [directFallback, ...mediaHostSources] : [...mediaHostSources, directFallback]).filter(
      isTruthy
    );
  }

  if (isImageDataUri(url)) {
    return [url];
  }

  return [];
};

const IMG_PROXY_HOST = 'https://img.templewallet.com';
const RAINBOW_ASSETS_BASE_URL = 'https://raw.githubusercontent.com/rainbow-me/assets/master/blockchains/';
const COMPRESSED_TOKEN_ICON_SIZE = 80;

/** Extend along with new EVM chains */
const CHAIN_ID_TO_IMAGE_CHAIN_NAME: Record<number, string> = {
  [ETHERLINK_MAINNET_CHAIN_ID]: 'etherlink'
};

const getCompressedImageUrl = (imageUrl: string, size: number) =>
  `${IMG_PROXY_HOST}/insecure/fill/${size}/${size}/ce/0/plain/${encodeURIComponent(imageUrl)}@png`;

const getEvmTokenRainbowLogoUrl = (chainId: number, address: string) => {
  const chainName = CHAIN_ID_TO_IMAGE_CHAIN_NAME[chainId];
  if (!chainName) {
    return undefined;
  }

  try {
    return `${RAINBOW_ASSETS_BASE_URL}${chainName}/assets/${getAddress(address)}/logo.png`;
  } catch {
    return undefined;
  }
};

export const buildEvmTokenIconSources = (chainId: number, address: string, iconURL?: string): string[] => {
  const rainbowLogoUrl = getEvmTokenRainbowLogoUrl(chainId, address);

  return [
    // Blockscout serves some Etherlink token icons directly from IPFS gateways.
    // Prefer the original gateway URL to avoid an unnecessary proxy hop.
    iconURL?.startsWith('http') ? iconURL : undefined,
    iconURL && getCompressedImageUrl(iconURL, COMPRESSED_TOKEN_ICON_SIZE),
    rainbowLogoUrl && getCompressedImageUrl(rainbowLogoUrl, COMPRESSED_TOKEN_ICON_SIZE)
  ].filter(isTruthy);
};

/** Blockscout serves ipfs images through dweb.link, so it is appended as the last option gateway */
export const buildEvmCollectibleImagesStack = (uri?: string): string[] => {
  const normalizedUri = normalizeIpfsUri(uri);
  const stack = buildTokenImagesStack(normalizedUri);

  return normalizedUri?.startsWith(IPFS_PROTOCOL)
    ? stack.concat(`${DWEB_IPFS_GATE}/${normalizedUri.slice(IPFS_PROTOCOL.length)}`)
    : stack;
};

export const isImgUriSvg = (url: string) => /\.svg(?:$|[?#])/i.test(url);

const SVG_DATA_URI_UTF8_PREFIX = 'data:image/svg+xml;charset=utf-8,';
const SVG_DATA_URI_BASE64_PREFIX = 'data:image/svg+xml;base64,';

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

// react-native-svg has no foreignObject, feImage or SMIL animation support and can crash on them
export const svgRequiresWebViewRendering = (xml: string) => /<foreignObject|<feImage|<animate|<set\b/i.test(xml);
