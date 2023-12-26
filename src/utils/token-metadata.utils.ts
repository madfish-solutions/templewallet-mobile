import { BigNumber } from 'bignumber.js';
import { chunk } from 'lodash-es';
import memoizee from 'memoizee';
import { useCallback } from 'react';
import { forkJoin, from, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { tezosMetadataApi, whitelistApi } from 'src/api.service';
import { useSelectedRpcUrlSelector } from 'src/store/settings/settings-selectors';
import { useTokensMetadataSelector } from 'src/store/tokens-metadata/tokens-metadata-selectors';
import { OVERRIDEN_MAINNET_TOKENS_METADATA, TEZ_TOKEN_SLUG } from 'src/token/data/tokens-metadata';
import { TokenMetadataInterface, TokenStandardsEnum } from 'src/token/interfaces/token-metadata.interface';
import type { TokenInterface } from 'src/token/interfaces/token.interface';
import { getTokenSlug } from 'src/token/utils/token.utils';

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

/** Currently, metadata service does not throw, instead, returns status 200. */
type SingleTokenMetadataResponse =
  | TokenMetadataResponse
  | {
      message: string;
    };

interface WhitelistResponse {
  keywords: Array<string>;
  logoURI: string;
  name: string;
  timestamp: string;
  tokens?: WhitelistTokensItem[];
  version: {
    major: number;
    minor: number;
    patch: number;
  };
}

export interface WhitelistTokensItem {
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

export const transformWhitelistToTokenMetadata = (token: WhitelistTokensItem): TokenMetadataInterface => ({
  id: token.fa2TokenId ?? 0,
  address: token.contractAddress,
  decimals: token.metadata.decimals,
  symbol: token.metadata.symbol ?? token.metadata.name?.substring(0, 8) ?? '???',
  name: token.metadata.name ?? token.metadata.symbol ?? 'Unknown Token',
  thumbnailUri: token.metadata.thumbnailUri,
  standard: token.type === 'FA12' ? TokenStandardsEnum.Fa12 : TokenStandardsEnum.Fa2
});

export const useTokenMetadataGetter = () => {
  const tokensMetadata = useTokensMetadataSelector();
  const selectedRpcUrl = useSelectedRpcUrlSelector();

  return useCallback(
    (slug: string): TokenMetadataInterface | undefined =>
      slug === TEZ_TOKEN_SLUG ? getNetworkGasTokenMetadata(selectedRpcUrl) : tokensMetadata[slug],
    [tokensMetadata, selectedRpcUrl]
  );
};

export const loadWhitelist$ = (selectedRpc: string) =>
  isDcpNode(selectedRpc)
    ? from([])
    : from(whitelistApi.get<WhitelistResponse>('tokens/quipuswap.whitelist.json')).pipe(
        map(({ data }) => data.tokens?.filter(x => x.contractAddress !== 'tez') ?? [])
      );

export const loadTokenMetadata$ = memoizee(
  (address: string, id = 0): Observable<TokenMetadataInterface> => {
    const overridenTokenMetadata = OVERRIDEN_MAINNET_TOKENS_METADATA.find(
      token => token.address === address && token.id === id
    );

    if (isDefined(overridenTokenMetadata)) {
      return of(overridenTokenMetadata);
    }

    return from(tezosMetadataApi.get<SingleTokenMetadataResponse>(`/metadata/${address}/${id}`)).pipe(
      map(({ data }) => {
        if (data && 'decimals' in data) {
          return transformDataToTokenMetadata(data, address, id);
        } else {
          throw new Error(`Service errored with: ${data.message}`);
        }
      })
    );
  },
  {
    normalizer: ([address, id]) => getTokenSlug({ address, id }),
    maxAge: 60_000,
    max: 20
  }
);

const METADATA_CHUNK_SIZE = 100;

export const loadTokensMetadata$ = (slugs: string[]): Observable<TokenMetadataInterface[]> =>
  forkJoin(
    // Parallelizing
    chunk(slugs, METADATA_CHUNK_SIZE).map(slugsChunk =>
      tezosMetadataApi.post<(TokenMetadataResponse | null)[]>('/', slugsChunk).then(({ data }) => data)
    )
  ).pipe(
    map(tokensChunks => tokensChunks.flat()),
    map(tokens =>
      tokens.map((token, index) => {
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
    ),
    map(tokens => tokens.filter(isDefined))
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
