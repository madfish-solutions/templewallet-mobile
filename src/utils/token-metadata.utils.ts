import memoize from 'mem';
import { from, Observable } from 'rxjs';
import { map, filter, withLatestFrom } from 'rxjs/operators';

import { tokenMetadataApi } from '../api.service';
import { RootState } from '../store/create-store';
import { TokensMetadataRootState } from '../store/tokens-metadata/tokens-metadata-state';
import { TEZ_TOKEN_SLUG } from '../token/data/tokens-metadata';
import { emptyTokenMetadata, TokenMetadataInterface } from '../token/interfaces/token-metadata.interface';
import { getTokenSlug } from '../token/utils/token.utils';
import { isDefined } from './is-defined';
import { getNetworkGasTokenMetadata } from './network.utils';

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

export const normalizeTokenMetadata = (
  selectedRpcUrl: string,
  slug: string,
  rawMetadata?: TokenMetadataInterface
): TokenMetadataInterface => {
  const [tokenAddress, tokenId] = slug.split('_');
  const gasTokenMetadata = getNetworkGasTokenMetadata(selectedRpcUrl);

  return slug === TEZ_TOKEN_SLUG
    ? gasTokenMetadata
    : rawMetadata ?? {
        ...emptyTokenMetadata,
        symbol: '???',
        name: `${tokenAddress} ${tokenId}`,
        address: tokenAddress,
        id: Number(tokenId ?? 0)
      };
};

export const getFiatToUsdRate = (state: RootState) => {
  const fiatExchangeRates = state.currency.fiatToTezosRates.data;
  const fiatCurrency = state.settings.fiatCurrency;
  const tezUsdExchangeRates = state.currency.usdToTokenRates.data[TEZ_TOKEN_SLUG];

  const fiatExchangeRate: number | undefined = fiatExchangeRates[fiatCurrency.toLowerCase()];
  const exchangeRateTezos: number | undefined = tezUsdExchangeRates;

  if (isDefined(fiatExchangeRate) && isDefined(exchangeRateTezos)) {
    return fiatExchangeRate / exchangeRateTezos;
  }

  return undefined;
};

export const getTokenExchangeRate = (state: RootState, slug: string) => {
  const tokenUsdExchangeRate = state.currency.usdToTokenRates.data[slug];
  const fiatToUsdRate = getFiatToUsdRate(state);

  return isDefined(tokenUsdExchangeRate) && isDefined(fiatToUsdRate) ? tokenUsdExchangeRate * fiatToUsdRate : undefined;
};

export const getTokenMetadata = (state: RootState, slug: string) => {
  const tokenMetadata = normalizeTokenMetadata(
    state.settings.selectedRpcUrl,
    slug,
    state.tokensMetadata.metadataRecord[slug]
  );
  const exchangeRate = getTokenExchangeRate(state, slug);

  return {
    ...tokenMetadata,
    exchangeRate
  };
};

export const withMetadataSlugs =
  <T>(state$: Observable<TokensMetadataRootState>) =>
  (observable$: Observable<T>) =>
    observable$.pipe(
      withLatestFrom(state$, (value, { tokensMetadata }): [T, Record<string, TokenMetadataInterface>] => [
        value,
        tokensMetadata.metadataRecord
      ])
    );

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
