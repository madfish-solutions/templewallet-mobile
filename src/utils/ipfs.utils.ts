export const IPFS_PROTOCOL = 'ipfs://';
export const IPFS_GATE = 'https://ipfs.filebase.io/ipfs';
export const DWEB_IPFS_GATE = 'https://dweb.link/ipfs';

/** Black circle in `thumbnailUri`
 * See:
 * - KT1M2JnD1wsg7w2B4UXJXtKQPuDUpU2L7cJH_79
 * - KT1RJ6PbjHpwc3M5rw5s2Nbmefwbuwbdxton_19484
 * - KT1RJ6PbjHpwc3M5rw5s2Nbmefwbuwbdxton_3312
 */
const INVALID_IPFS_ID = 'QmNrhZHUaEqxhyLfqoq1mtHSipkWHeT31LNHb1QEbDHgnc';

const IPFS_GATEWAY_PATH_REGEX = /^https?:\/\/[^?#]+?\/ipfs\/([^?#]+)(\?[^#]*)?/i;
/** CIDv0 (base58btc, `Qm…`) or CIDv1 in base32 (`b…`), the two forms gateways put in paths */
const CID_REGEX = /^(Qm[1-9A-HJ-NP-Za-km-z]{44}|b[a-z2-7]{58,})$/;

export interface IpfsUriInfo {
  id: string;
  /** CID followed by the nested path, as written in the URI */
  path: string;
  /** With leading `?` if applicable */
  search: '' | `?${string}`;
}

/** Some contracts emit the `ipfs://ipfs/<CID>` double-prefix form, which breaks gateway conversion */
export const normalizeIpfsUri = (uri?: string | null) => uri?.replace(/^ipfs:\/\/ipfs\//, IPFS_PROTOCOL) ?? undefined;

export const isInvalidIpfsMediaUri = (uri: string) => uri.includes(INVALID_IPFS_ID);

export const getIpfsItemInfo = (uri: string): IpfsUriInfo | null => {
  const normalizedUri = normalizeIpfsUri(uri);
  if (!normalizedUri?.startsWith(IPFS_PROTOCOL)) {
    return null;
  }

  const [path, search] = normalizedUri.slice(IPFS_PROTOCOL.length).split('?');
  const id = path.split('/')[0];

  if (!id || id === INVALID_IPFS_ID) {
    return null;
  }

  return {
    id,
    path,
    search: search ? `?${search}` : ''
  };
};

/** The `ipfs://` form of a path-style HTTP gateway link whose first path segment is a CID */
const recoverIpfsUri = (uri: string) => {
  const match = uri.match(IPFS_GATEWAY_PATH_REGEX);
  if (!match) {
    return undefined;
  }

  const [, pathWithCid, search = ''] = match;
  const [cid] = pathWithCid.split('/');

  return CID_REGEX.test(cid) ? `${IPFS_PROTOCOL}${pathWithCid}${search}` : undefined;
};

/** IPFS info of an `ipfs://` URI, or of a path-style HTTP gateway link */
export const getIpfsAwareItemInfo = (uri: string): IpfsUriInfo | null => {
  const nativeInfo = getIpfsItemInfo(uri);
  if (nativeInfo) {
    return nativeInfo;
  }

  const recoveredUri = recoverIpfsUri(uri);

  return recoveredUri ? getIpfsItemInfo(recoveredUri) : null;
};
