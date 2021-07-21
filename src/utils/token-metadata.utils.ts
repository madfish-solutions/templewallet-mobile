import { AxiosResponse } from 'axios';
import memoize from 'mem';

import { tokenMetadataApi } from '../api.service';
import { tokenMetadataSlug } from '../token/utils/token.utils';

type TokenMetadata = {
  decimals: number;
  symbol: string;
  name: string;
  thumbnailUri: string;
};

export const getTokenMetadata = memoize(
  (tokenAddress: string, tokenId = 0) =>
    tokenMetadataApi
      .get<unknown, AxiosResponse<TokenMetadata>>(`/metadata/${tokenAddress}/${tokenId}`)
      .then(res => res.data),
  { cacheKey: ([address, tokenId]) => tokenMetadataSlug({ address, tokenId }) }
);
