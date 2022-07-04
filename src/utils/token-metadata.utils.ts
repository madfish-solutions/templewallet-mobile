import memoize from 'mem';
import { from, Observable } from 'rxjs';
import { map, filter, withLatestFrom } from 'rxjs/operators';

import { tokenMetadataApi } from '../api.service';
import { TokensMetadataRootState, TokensMetadataState } from '../store/tokens-metadata/tokens-metadata-state';
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

export const withMetadataSlugs =
  <T>(state$: Observable<TokensMetadataRootState>) =>
  (observable$: Observable<T>) =>
    observable$.pipe(
      withLatestFrom(state$, (value, { tokensMetadata }): [T, Record<string, TokenMetadataInterface>] => [
        value,
        tokensMetadata.metadataRecord
      ])
    );

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
