import memoize from 'mem';
import { useCallback, useMemo } from 'react';
import { from, Observable } from 'rxjs';
import { map, filter, withLatestFrom } from 'rxjs/operators';

import { tezosMetadataApi, whitelistApi } from 'src/api.service';
import { UNKNOWN_TOKEN_SYMBOL } from 'src/config/general';
import { useSelector } from 'src/store/selector';
import { TokensMetadataRootState } from 'src/store/tokens-metadata/tokens-metadata-state';
import { TEZ_TOKEN_SLUG } from 'src/token/data/tokens-metadata';
import { emptyTokenMetadata, TokenMetadataInterface } from 'src/token/interfaces/token-metadata.interface';
import { getTokenSlug } from 'src/token/utils/token.utils';

import { isDefined } from './is-defined';
import { getNetworkGasTokenMetadata, isDcpNode } from './network.utils';

export interface TokenMetadataResponse {
  decimals: number;
  symbol?: string;
  name?: string;
  thumbnailUri?: string;
  artifactUri?: string;
}

interface WhitelistResponse {
  keywords: Array<string>;
  logoURI: string;
  name: string;
  timestamp: string;
  tokens?: Array<TokenListItem>;
  version: {
    major: number;
    minor: number;
    patch: number;
  };
}

interface TokenListItem {
  contractAddress: 'tez' | string;
  fa2TokenId?: number;
  network: 'mainnet' | string;
  metadata: {
    decimals: number;
    name: string;
    symbol: string;
    thumbnailUri?: string;
  };
  type: 'FA2' | 'FA12';
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

const transformWhitelistToTokenMetadata = (token: TokenListItem, address: string, id: number) => ({
  id,
  address,
  decimals: token.metadata.decimals,
  symbol: token.metadata.symbol ?? token.metadata.name?.substring(0, 8) ?? '???',
  name: token.metadata.name ?? token.metadata.symbol ?? 'Unknown Token',
  thumbnailUri: token.metadata.thumbnailUri
});

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
        symbol: UNKNOWN_TOKEN_SYMBOL,
        name: `${tokenAddress} ${tokenId}`,
        address: tokenAddress,
        id: Number(tokenId ?? 0)
      };
};

export const useFiatToUsdRate = () => {
  const fiatExchangeRates = useSelector(state => state.currency.fiatToTezosRates.data);
  const fiatCurrency = useSelector(state => state.settings.fiatCurrency);
  const tezUsdExchangeRates = useSelector(state => state.currency.usdToTokenRates.data[TEZ_TOKEN_SLUG]);

  const fiatExchangeRate: number | undefined = fiatExchangeRates[fiatCurrency.toLowerCase()];
  const exchangeRateTezos: number | undefined = tezUsdExchangeRates;

  if (isDefined(fiatExchangeRate) && isDefined(exchangeRateTezos)) {
    return fiatExchangeRate / exchangeRateTezos;
  }

  return undefined;
};

export const useGetTokenExchangeRate = () => {
  const fiatToUsdRate = useFiatToUsdRate();
  const usdToTokenRates = useSelector(state => state.currency.usdToTokenRates);

  return useCallback(
    (slug: string) => {
      const tokenUsdExchangeRate = usdToTokenRates.data[slug];

      return isDefined(tokenUsdExchangeRate) && isDefined(fiatToUsdRate)
        ? tokenUsdExchangeRate * fiatToUsdRate
        : undefined;
    },
    [fiatToUsdRate, usdToTokenRates]
  );
};

export const useTokenMetadata = (slug: string) => {
  const getTokenMetadata = useGetTokenMetadata();

  return useMemo(() => getTokenMetadata(slug), [getTokenMetadata, slug]);
};

export const useGetTokenMetadata = () => {
  const selectedRpcUrl = useSelector(state => state.settings.selectedRpcUrl);

  const metadataRecord = useSelector(state => state.tokensMetadata.metadataRecord);

  const getTokenExchangeRate = useGetTokenExchangeRate();

  return useCallback(
    (slug: string) => {
      const tokenMetadata = normalizeTokenMetadata(selectedRpcUrl, slug, metadataRecord[slug]);
      const exchangeRate = getTokenExchangeRate(slug);

      return {
        ...tokenMetadata,
        exchangeRate
      };
    },
    [selectedRpcUrl, metadataRecord, getTokenExchangeRate]
  );
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

export const loadWhitelist$ = (selectedRpc: string): Observable<Array<TokenMetadataInterface>> =>
  isDcpNode(selectedRpc)
    ? from([])
    : from(whitelistApi.get<WhitelistResponse>('tokens/quipuswap.whitelist.json')).pipe(
        map(({ data }) =>
          isDefined(data.tokens)
            ? data.tokens
                .filter(x => x.contractAddress !== 'tez')
                .map(token => transformWhitelistToTokenMetadata(token, token.contractAddress, token.fa2TokenId ?? 0))
            : []
        )
      );

export const loadTokenMetadata$ = memoize(
  (address: string, id = 0): Observable<TokenMetadataInterface> => {
    const slug = `${address}_${id}`;
    console.log('Loading metadata for:', slug);

    return from(
      tezosMetadataApi.get<TokenMetadataResponse>(`/metadata/${address}/${id}`).then(
        res => {
          console.log('Metadata load result:', res.data);

          return res;
        },
        error => {
          console.error('Metadata load error:', error);

          throw error;
        }
      )
    ).pipe(
      map(({ data }) => transformDataToTokenMetadata(data, address, id)),
      filter(isDefined)
    );
  },
  { cacheKey: ([address, id]) => getTokenSlug({ address, id }) }
);

export const loadTokensMetadata$ = memoize(
  (slugs: Array<string>): Observable<Array<TokenMetadataInterface>> =>
    from(tezosMetadataApi.post<Array<TokenMetadataResponse | null>>('/', slugs)).pipe(
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
