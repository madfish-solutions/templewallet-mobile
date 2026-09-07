import { BigNumber } from 'bignumber.js';
import { chunk } from 'lodash-es';
import memoizee from 'memoizee';
import { useCallback } from 'react';
import {
  bufferTime,
  catchError,
  concat,
  defer,
  EMPTY,
  expand,
  filter,
  from,
  map,
  mergeMap,
  Observable,
  of,
  retry,
  tap,
  timer
} from 'rxjs';

import { scamlistApi, tezosMetadataApi, whitelistApi } from 'src/api.service';
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
  displayUri?: string;
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

interface ScamlistResponse {
  name: string;
  version: string;
  slugs: Record<string, boolean>;
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
  decimals: token.decimals ?? 0,
  symbol: token.symbol ?? token.name?.substring(0, 8) ?? '???',
  name: token.name ?? token.symbol ?? 'Unknown Token',
  thumbnailUri: token.thumbnailUri,
  artifactUri: token.artifactUri,
  displayUri: token.displayUri
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

export const loadScamlist$ = () =>
  from(scamlistApi.get<ScamlistResponse>('tokens/scamlist.json')).pipe(map(({ data }) => data.slugs));

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

/** In-flight metadata POSTs. Keep low to avoid saturating mobile + the metadata API. */
const METADATA_QUERY_CONCURRENCY = 2;

const METADATA_HTTP_RETRY_COUNT = 2;

const METADATA_HTTP_RETRY_BASE_DELAY_MS = 400;

/** Coalesce streamed chunk results so Redux/UI is not updated on every HTTP response. */
const METADATA_EMIT_BUFFER_MS = 1000;

/** Extra POSTs of remaining `null` slugs after the first successful response. */
const METADATA_NULL_RETRY_MAX_ROUNDS = 10;

/** Delay before the first null-retry wave; doubles for each extra round. */
const METADATA_NULL_RETRY_BASE_DELAY_MS = 1000;

interface MetadataChunkMapping {
  metadata: TokenMetadataInterface[];
  nullSlugs: string[];
}

type MetadataWaveTokens = { kind: 'tokens'; metadata: TokenMetadataInterface[] };

type MetadataWaveRound = { kind: 'round'; nullSlugs: string[]; extraRound: number; inputSize: number };

type MetadataWaveEvent = MetadataWaveTokens | MetadataWaveRound;

export const mapMetadataChunkResponses = (
  slugs: string[],
  data: (TokenMetadataResponse | null)[]
): MetadataChunkMapping => {
  const metadata: TokenMetadataInterface[] = [];
  const nullSlugs: string[] = [];

  slugs.forEach((slug, index) => {
    const [address, id] = slug.split('_');
    const numericId = Number(id);
    const overridenTokenMetadata = OVERRIDEN_MAINNET_TOKENS_METADATA.find(
      token => token.address === address && token.id === numericId
    );

    if (overridenTokenMetadata) {
      metadata.push(overridenTokenMetadata);

      return;
    }

    const token = data[index];

    if (token) {
      metadata.push(transformDataToTokenMetadata(token, address, numericId));
    } else {
      nullSlugs.push(slug);
    }
  });

  return { metadata, nullSlugs };
};

/**
 * Retry API `null`s while they look like flakes, not "this service has no metadata".
 * Compared against that wave's input (all chunks together), not each HTTP chunk.
 * Huge NFT collections often return a high null rate on early waves, so the first
 * extra attempt is always allowed and later waves continue while remaining nulls
 * are at most 90% of that round's input (up to METADATA_NULL_RETRY_MAX_ROUNDS).
 */
export const shouldRetryMetadataNulls = (nullCount: number, inputCount: number, extraRound: number): boolean => {
  if (nullCount === 0 || extraRound >= METADATA_NULL_RETRY_MAX_ROUNDS) {
    return false;
  }

  if (extraRound === 0) {
    return true;
  }

  return nullCount / inputCount <= 0.9;
};

const fetchMetadataChunk$ = (slugs: string[]) =>
  defer(() => from(tezosMetadataApi.post<(TokenMetadataResponse | null)[]>('/', slugs).then(({ data }) => data))).pipe(
    retry({
      count: METADATA_HTTP_RETRY_COUNT,
      delay: (_error, retryCount) => timer(METADATA_HTTP_RETRY_BASE_DELAY_MS * 2 ** (retryCount - 1))
    })
  );

const fetchSlugsInChunks$ = (slugs: string[]): Observable<MetadataChunkMapping> =>
  from(chunk(slugs, METADATA_CHUNK_SIZE)).pipe(
    mergeMap(
      slugsChunk =>
        fetchMetadataChunk$(slugsChunk).pipe(
          map(data => mapMetadataChunkResponses(slugsChunk, data)),
          catchError((error: unknown) => {
            console.error('loadTokensMetadata$ chunk failed', slugsChunk, error);

            return of({ metadata: [], nullSlugs: slugsChunk });
          })
        ),
      METADATA_QUERY_CONCURRENCY
    )
  );

const fetchMetadataWave$ = (slugs: string[], extraRound: number): Observable<MetadataWaveEvent> => {
  let nullSlugs: string[] = [];

  return concat(
    fetchSlugsInChunks$(slugs).pipe(
      tap(mapping => {
        nullSlugs = nullSlugs.concat(mapping.nullSlugs);
      }),
      mergeMap(mapping =>
        mapping.metadata.length > 0 ? of({ kind: 'tokens' as const, metadata: mapping.metadata }) : EMPTY
      )
    ),
    defer(() => of({ kind: 'round' as const, nullSlugs, extraRound, inputSize: slugs.length }))
  );
};

export const loadTokensMetadata$ = (slugs: string[]): Observable<TokenMetadataInterface[]> => {
  if (slugs.length === 0) {
    return EMPTY;
  }

  return fetchMetadataWave$(slugs, 0).pipe(
    expand(event => {
      if (
        event.kind !== 'round' ||
        !shouldRetryMetadataNulls(event.nullSlugs.length, event.inputSize, event.extraRound)
      ) {
        return EMPTY;
      }

      return timer(Math.min(20000, METADATA_NULL_RETRY_BASE_DELAY_MS * 2 ** event.extraRound)).pipe(
        mergeMap(() => fetchMetadataWave$(event.nullSlugs, event.extraRound + 1))
      );
    }),
    mergeMap(event => (event.kind === 'tokens' ? of(event.metadata) : EMPTY)),
    bufferTime(METADATA_EMIT_BUFFER_MS),
    filter(batches => batches.length > 0),
    map(batches => batches.flat())
  );
};

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
