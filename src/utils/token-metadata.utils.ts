import memoize from 'mem';
import { forkJoin, from, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

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

type DetailedAssetMetdata = {
  decimals: number;
  symbol: string;
  name: string;
  shouldPreferSymbol?: boolean;
  thumbnailUri?: string;
  displayUri?: string;
  artifactUri?: string;
};

export const loadTokensMetadata$ = memoize(
  (slugs: Array<string>): Observable<Array<TokenMetadataInterface>> =>
    from(tokenMetadataApi.post<Array<DetailedAssetMetdata | null>>('/', slugs)).pipe(
      map(({ data }) => {
        const processedData = data.map((token, index) => {
          if (!isDefined(token)) {
            return null;
          }

          return {
            id: Number(slugs[index].split('_')[1]),
            address: slugs[index].split('_')[0],
            decimals: token.decimals,
            symbol: token.symbol ?? token.name?.substring(0, 8) ?? '???',
            name: token.name ?? token.symbol ?? 'Unknown Token',
            thumbnailUri: token.thumbnailUri,
            artifactUri: token.artifactUri
          };
        });

        const definedData: Array<TokenMetadataInterface> = processedData.filter(isDefined);

        return definedData;
      })
    )
);

export const loadTokensWithBalanceMetadata$ = (tokensWithBalance: TokenBalanceInterface[]) =>
  forkJoin(
    tokensWithBalance.map(balance =>
      loadTokenMetadata$(balance.contract, balance.token_id).pipe(catchError(() => of(tokenBalanceMetadata(balance))))
    )
  );
