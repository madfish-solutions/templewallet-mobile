import memoize from 'mem';
import { forkJoin, from, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { tokenMetadataApi } from '../api.service';
import { tokenBalanceMetadata } from '../store/wallet/wallet-state.utils';
import { TokenBalanceInterface } from '../token/interfaces/token-balance.interface';
import { TokenMetadataInterface } from '../token/interfaces/token-metadata.interface';
import { getTokenSlug } from '../token/utils/token.utils';

export interface TokenMetadataResponse {
  decimals: number;
  symbol?: string;
  name?: string;
  thumbnailUri?: string;
  artifactUri?: string;
}

export const loadTokenMetadata$ = memoize(
  (address: string, id = 0): Observable<TokenMetadataInterface> =>
    from(tokenMetadataApi.get<TokenMetadataResponse>(`/metadata/${address}/${id}`)).pipe(
      map(({ data }) => ({
        id,
        address,
        decimals: data.decimals,
        symbol: data.symbol ?? data.name?.substring(0, 8) ?? '???',
        name: data.name ?? data.symbol ?? 'Unknown Token',
        thumbnailUri: data.thumbnailUri,
        artifactUri: data.artifactUri
      }))
    ),
  { cacheKey: ([address, id]) => getTokenSlug({ address, id }) }
);

export const loadTokensMetadata$ = memoize(
  (tokensArray = []): Observable<TokenMetadataResponse[]> =>
    from(tokenMetadataApi.post<TokenMetadataResponse[]>('/', tokensArray)).pipe(map(({ data }) => data)),
  { cacheKey: ([tokensArray]) => tokensArray }
);

export const loadTokensWithBalanceMetadata$ = (tokensWithBalance: TokenBalanceInterface[]) =>
  forkJoin(
    tokensWithBalance.map(balance =>
      loadTokenMetadata$(balance.contract, balance.token_id).pipe(catchError(() => of(tokenBalanceMetadata(balance))))
    )
  );
