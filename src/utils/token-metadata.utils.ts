import memoize from 'mem';
import { forkJoin, from, Observable, of } from 'rxjs';
import { catchError, map, filter } from 'rxjs/operators';

import { tokenMetadataApi } from '../api.service';
import { tokenBalanceMetadata } from '../store/wallet/wallet-state.utils';
import { TokenBalanceInterface } from '../token/interfaces/token-balance.interface';
import { TokenMetadataInterface } from '../token/interfaces/token-metadata.interface';
import { getTokenSlug } from '../token/utils/token.utils';
import { isDefined } from './is-defined';

export interface TokenMetadataResponse {
  decimals: number;
  symbol?: string;
  name?: string;
  thumbnailUri?: string;
  artifactUri?: string;
}

const transformDataToTokenMetadata = (token: TokenMetadataResponse | null, address: string, id: number) =>
  !isDefined(token)
    ? null
    : {
        id,
        address,
        decimals: token.decimals,
        symbol: token.symbol ?? token.name?.substring(0, 8) ?? '???',
        name: token.name ?? token.symbol ?? 'Unknown Token',
        thumbnailUri: token.thumbnailUri,
        artifactUri: token.artifactUri
      };

export const loadTokenMetadata$ = memoize(
  (address: string, id = 0): Observable<TokenMetadataInterface> =>
    from(tokenMetadataApi.get<TokenMetadataResponse>(`/metadata/${address}/${id}`)).pipe(
      map(({ data }) => transformDataToTokenMetadata(data, address, id)),
      filter(isDefined)
    ),
  { cacheKey: ([address, id]) => getTokenSlug({ address, id }) }
);

export const loadTokensMetadata$ = memoize(
  (slugs: Array<string>): Observable<Array<TokenMetadataInterface>> =>
    from(tokenMetadataApi.post<Array<TokenMetadataResponse | null>>('/', slugs)).pipe(
      map(({ data }) =>
        data
          .map((token, index) => {
            const [address, id] = slugs[index].split('_');

            return transformDataToTokenMetadata(token, address, Number(id));
          })
          .filter(isDefined)
      )
    )
);

export const loadTokensWithBalanceMetadata$ = (tokensWithBalance: TokenBalanceInterface[]) =>
  forkJoin(
    tokensWithBalance.map(balance =>
      loadTokenMetadata$(balance.contract, balance.token_id).pipe(catchError(() => of(tokenBalanceMetadata(balance))))
    )
  );
