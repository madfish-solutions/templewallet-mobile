import memoize from 'mem';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { tokenMetadataApi } from '../api.service';
import { TokenMetadataInterface } from '../token/interfaces/token-metadata.interface';
import { getTokenSlug } from '../token/utils/token.utils';

type TokenMetadata = {
  decimals: number;
  symbol: string;
  name: string;
  thumbnailUri: string;
};

export const loadTokenMetadata$ = memoize(
  (address: string, id = 0): Observable<TokenMetadataInterface> =>
    from(tokenMetadataApi.get<TokenMetadata>(`/metadata/${address}/${id}`)).pipe(
      map(({ data }) => ({
        id,
        address,
        decimals: data.decimals,
        symbol: data.symbol ?? data.name?.substring(8) ?? '???',
        name: data.name ?? data.symbol ?? 'Unknown Token',
        iconUrl: data.thumbnailUri
      }))
    ),
  { cacheKey: ([address, tokenId]) => getTokenSlug({ address, tokenId }) }
);
