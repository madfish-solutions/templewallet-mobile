import { BigNumber } from 'bignumber.js';
import { chunk } from 'lodash-es';
import memoize from 'mem';
import { forkJoin, from, Observable, of } from 'rxjs';
import { map, filter, withLatestFrom } from 'rxjs/operators';

import { tezosMetadataApi, whitelistApi } from 'src/api.service';
import { UNKNOWN_TOKEN_SYMBOL } from 'src/config/general';
import type { RootState } from 'src/store/types';
import { OVERRIDEN_MAINNET_TOKENS_METADATA, TEZ_TOKEN_SLUG } from 'src/token/data/tokens-metadata';
import {
  emptyTokenMetadata,
  TokenMetadataInterface,
  TokenStandardsEnum
} from 'src/token/interfaces/token-metadata.interface';
import type { TokenInterface } from 'src/token/interfaces/token.interface';
import { getTokenSlug } from 'src/token/utils/token.utils';

import { getDollarValue } from './balance.utils';
import { FiatCurrenciesEnum } from './exchange-rate.util';
import { isDefined } from './is-defined';
import { isTruthy } from './is-truthy';
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

const transformDataToTokenMetadata = (
  token: TokenMetadataResponse,
  address: string,
  id: number
): TokenMetadataInterface => ({
  id,
  address,
  decimals: token.decimals,
  symbol: token.symbol ?? token.name?.substring(0, 8) ?? '???',
  name: token.name ?? token.symbol ?? 'Unknown Token',
  thumbnailUri: token.thumbnailUri,
  artifactUri: token.artifactUri
});

const transformWhitelistToTokenMetadata = (
  token: TokenListItem,
  address: string,
  id: number
): TokenMetadataInterface => ({
  id,
  address,
  decimals: token.metadata.decimals,
  symbol: token.metadata.symbol ?? token.metadata.name?.substring(0, 8) ?? '???',
  name: token.metadata.name ?? token.metadata.symbol ?? 'Unknown Token',
  thumbnailUri: token.metadata.thumbnailUri,
  standard: token.type === 'FA12' ? TokenStandardsEnum.Fa12 : TokenStandardsEnum.Fa2
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

export const getFiatToUsdRate = (state: RootState) => {
  const fiatExchangeRates = state.currency.fiatToTezosRates.data;
  const fiatCurrency = state.settings.fiatCurrency;
  const tezUsdExchangeRates = state.currency.usdToTokenRates.data[TEZ_TOKEN_SLUG];

  // Coingecko and Temple Wallet APIs return slightly different TEZ/USD exchange rates
  if (fiatCurrency === FiatCurrenciesEnum.USD) {
    return 1;
  }

  const fiatExchangeRate: number | undefined = fiatExchangeRates[fiatCurrency.toLowerCase()];
  const exchangeRateTezos: number | undefined = tezUsdExchangeRates;

  if (isDefined(fiatExchangeRate) && isDefined(exchangeRateTezos)) {
    return fiatExchangeRate / exchangeRateTezos;
  }

  return undefined;
};

const getTokenExchangeRate = (state: RootState, slug: string) => {
  const tokenUsdExchangeRate = state.currency.usdToTokenRates.data[slug];
  const fiatToUsdRate = getFiatToUsdRate(state);

  return isDefined(tokenUsdExchangeRate) && isDefined(fiatToUsdRate) ? tokenUsdExchangeRate * fiatToUsdRate : undefined;
};

export const getTokenMetadata = (state: RootState, slug: string): TokenMetadataInterface => {
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
    const overridenTokenMetadata = OVERRIDEN_MAINNET_TOKENS_METADATA.find(
      token => token.address === address && token.id === id
    );

    if (isDefined(overridenTokenMetadata)) {
      return of(overridenTokenMetadata);
    }

    const slug = `${address}_${id}`;
    console.log('Loading metadata for:', slug);

    return from(tezosMetadataApi.get<TokenMetadataResponse>(`/metadata/${address}/${id}`)).pipe(
      map(({ data }) => transformDataToTokenMetadata(data, address, id)),
      filter(isDefined)
    );
  },
  { cacheKey: ([address, id]) => getTokenSlug({ address, id }) }
);

const METADATA_CHUNK_SIZE = 100;

export const loadTokensMetadata$ = memoize(
  (slugs: string[]): Observable<TokenMetadataInterface[]> =>
    forkJoin(
      // Parallelizing
      chunk(slugs, METADATA_CHUNK_SIZE).map(slugsChunk =>
        tezosMetadataApi.post<(TokenMetadataResponse | null)[]>('/', slugsChunk).then(({ data }) => data)
      )
    ).pipe(
      map(datas =>
        datas.map((data, i) =>
          data
            .map((token, j) => {
              const index = i * METADATA_CHUNK_SIZE + j;
              const slug = slugs[index]!;
              const [address, id] = slug.split('_');
              const overridenTokenMetadata = OVERRIDEN_MAINNET_TOKENS_METADATA.find(
                token => token.address === address && token.id === Number(id)
              );

              if (overridenTokenMetadata) {
                return overridenTokenMetadata;
              }

              return token && transformDataToTokenMetadata(token, address, Number(id));
            })
            .filter(isDefined)
        )
      ),
      map(datas => datas.flat())
    )
);

interface SearchableAsset extends Pick<TokenInterface, 'name' | 'symbol'> {
  address?: string;
}

export const isAssetSearched = ({ name, symbol, address }: SearchableAsset, lowerCaseSearchValue: string) =>
  Boolean(name?.toLowerCase().includes(lowerCaseSearchValue)) ||
  Boolean(symbol?.toLowerCase().includes(lowerCaseSearchValue)) ||
  Boolean(address?.toLowerCase().includes(lowerCaseSearchValue));

type SortableByDollarAsset = Pick<TokenInterface, 'decimals' | 'balance' | 'exchangeRate'>;

export const applySortByDollarValueDecrease: <T extends SortableByDollarAsset>(assets: T[]) => T[] = assets =>
  assets.sort((a, b) => {
    const aDollarValue = isTruthy(a.exchangeRate)
      ? getDollarValue(a.balance, a.decimals, a.exchangeRate)
      : BigNumber(0);
    const bDollarValue = isTruthy(b.exchangeRate)
      ? getDollarValue(b.balance, b.decimals, b.exchangeRate)
      : BigNumber(0);

    return bDollarValue.minus(aDollarValue).toNumber();
  });

export const withMetadataSlugs =
  <T>(state$: Observable<RootState>) =>
  (observable$: Observable<T>) =>
    observable$.pipe(
      withLatestFrom(state$, (value, { tokensMetadata }): [T, Record<string, TokenMetadataInterface>] => [
        value,
        tokensMetadata.metadataRecord
      ])
    );
