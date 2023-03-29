import { BigNumber } from 'bignumber.js';
import memoize from 'mem';
import { from, Observable } from 'rxjs';
import { map, filter, withLatestFrom } from 'rxjs/operators';

import { TokenInterface } from 'src/token/interfaces/token.interface';
import { getTokenSlug } from 'src/token/utils/token.utils';

import { tezosMetadataApi, whitelistApi } from '../api.service';
import { UNKNOWN_TOKEN_SYMBOL } from '../config/general';
import { RootState } from '../store/create-store';
import { TokensMetadataRootState } from '../store/tokens-metadata/tokens-metadata-state';
import { TEZ_TOKEN_SLUG } from '../token/data/tokens-metadata';
import {
  emptyTokenMetadata,
  TokenMetadataInterface,
  TokenStandardsEnum
} from '../token/interfaces/token-metadata.interface';
import { getDollarValue } from './balance.utils';
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

    return from(tezosMetadataApi.get<TokenMetadataResponse>(`/metadata/${address}/${id}`)).pipe(
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

export const isAssetSearched = ({ name, symbol, address }: TokenInterface, lowerCaseSearchValue: string) =>
  name.toLowerCase().includes(lowerCaseSearchValue) ||
  symbol.toLowerCase().includes(lowerCaseSearchValue) ||
  address.toLowerCase().includes(lowerCaseSearchValue);

export const applySortByDollarValueDecrease = (assets: TokenInterface[]) =>
  assets.sort((a, b) => {
    const aDollarValue = isTruthy(a.exchangeRate) ? getDollarValue(a.balance, a, a.exchangeRate) : BigNumber(0);
    const bDollarValue = isTruthy(b.exchangeRate) ? getDollarValue(b.balance, b, b.exchangeRate) : BigNumber(0);

    return bDollarValue.minus(aDollarValue).toNumber();
  });
