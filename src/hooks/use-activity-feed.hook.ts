import { useIsFocused } from '@react-navigation/native';
import { ChainIds } from '@taquito/taquito';
import { useCallback, useEffect, useRef, useState } from 'react';
import { isAddress } from 'viem';

import { resetEvmActivityCache } from 'src/activity/evm/fetch';
import {
  ActivityFeedAssetFilter,
  ActivityFeedSource,
  createEvmActivitySource,
  createTezosActivitySource,
  cutAtBoundary,
  getSafeBoundary,
  mergeActivityBuffers,
  SourceCursor,
  UNKNOWN_SCANNED_DOWN_TO
} from 'src/activity/feed';
import { Activity } from 'src/activity/types';
import { isEvmActivity } from 'src/activity/utils';
import { EVM_ADDRESS_PLACEHOLDER } from 'src/config/wallet.const';
import { TempleChainKind } from 'src/enums/temple-chain-kind.enum';
import { useAppStateStatus } from 'src/hooks/use-app-state-status.hook';
import { dispatch } from 'src/store';
import { processLoadedEvmCollectiblesMetadataAction } from 'src/store/evm/collectibles-metadata/evm-collectibles-metadata-actions';
import { useEvmChainCollectiblesMetadataSelector } from 'src/store/evm/collectibles-metadata/evm-collectibles-metadata-selectors';
import { processLoadedEvmTokensMetadataAction } from 'src/store/evm/tokens-metadata/evm-tokens-metadata-actions';
import { useEvmChainTokensMetadataSelector } from 'src/store/evm/tokens-metadata/evm-tokens-metadata-selectors';
import { useAccountAddressForEvm, useAccountAddressForTezos } from 'src/store/wallet/wallet-selectors';
import { showErrorToast } from 'src/toast/toast.utils';
import {
  EvmAssetStandardEnum,
  EvmCollectibleMetadata,
  EvmTokenMetadata
} from 'src/token/interfaces/token-metadata.interface';
import { useAnalytics } from 'src/utils/analytics/use-analytics.hook';
import { putToCappedCache } from 'src/utils/capped-cache.utils';
import { toEvmAssetSlug } from 'src/utils/from-token-slug';
import { ETHERLINK_MAINNET_CHAIN_ID } from 'src/utils/rpc/rpc-list';
import { sleep } from 'src/utils/timeouts.util';

const RETRY_DELAYS = [2000, 4000, 8000];
const MIN_NEW_ROWS_PER_LOAD_MORE = 10;
const MAX_LOAD_MORE_CYCLES = 3;
const FOCUS_REFETCH_THRESHOLD = 60_000;

interface SourceEntry {
  readonly chain: TempleChainKind;
  loadNextPage(signal: AbortSignal): Promise<{ activities: Activity[]; exhausted: boolean; scannedDownTo: number }>;
  resetCursor(): void;
  buffer: Activity[];
  scannedDownTo: number;
  exhausted: boolean;
  errored: boolean;
  isLoading: boolean;
  hasLoadedFirstPage: boolean;
}

type SourceEntryState = Pick<
  SourceEntry,
  'buffer' | 'scannedDownTo' | 'exhausted' | 'errored' | 'isLoading' | 'hasLoadedFirstPage'
>;

const initialSourceState = (): SourceEntryState => ({
  buffer: [],
  scannedDownTo: UNKNOWN_SCANNED_DOWN_TO,
  exhausted: false,
  errored: false,
  isLoading: false,
  hasLoadedFirstPage: false
});

const toSourceEntry = <C extends SourceCursor>(source: ActivityFeedSource<C>): SourceEntry => {
  let cursor: C | undefined;

  return {
    chain: source.chain,
    async loadNextPage(signal: AbortSignal) {
      const page = await source.fetch(cursor, signal);
      cursor = page.nextCursor ?? undefined;

      return {
        activities: page.activities,
        exhausted: page.nextCursor === null,
        scannedDownTo: page.scannedDownTo
      };
    },
    resetCursor() {
      cursor = undefined;
    },
    ...initialSourceState()
  };
};

const resetEntry = (entry: SourceEntry) => {
  entry.resetCursor();
  Object.assign(entry, initialSourceState());
};

interface ActivityFeedState {
  activities: Activity[];
  isInitialLoading: boolean;
  isLoadingMore: boolean;
  isEmpty: boolean;
  isAllErrored: boolean;
  isAllLoaded: boolean;
}

const isAwaitingFirstPages = (entries: SourceEntry[]) =>
  entries.some(entry => !entry.hasLoadedFirstPage && !entry.errored);

const getRenderableActivities = (entries: SourceEntry[]) =>
  cutAtBoundary(mergeActivityBuffers(entries.map(({ buffer }) => buffer)), getSafeBoundary(entries));

const computeFeedState = (
  entries: SourceEntry[],
  isLoadingMore: boolean,
  staleActivities: Activity[]
): ActivityFeedState => {
  const isReloading = isAwaitingFirstPages(entries);
  const isAllErrored = entries.length > 0 && entries.every(entry => entry.errored);

  return {
    // Nothing is shown until every source loaded its first page; during a refresh the previous rows stay on screen
    activities: isReloading ? staleActivities : getRenderableActivities(entries),
    isInitialLoading: entries.length > 0 && isReloading && staleActivities.length === 0,
    isLoadingMore,
    // Errored sources do not block the empty state - the toast already told the user about them
    isEmpty:
      !isAllErrored && entries.every(entry => entry.errored || (entry.hasLoadedFirstPage && entry.buffer.length === 0)),
    isAllErrored,
    isAllLoaded: entries.every(entry => entry.exhausted || entry.errored)
  };
};

const pickBoundaryLimitingSource = (entries: SourceEntry[]) => {
  const active = entries.filter(entry => !entry.exhausted && !entry.errored);
  const finite = active.filter(entry => Number.isFinite(entry.scannedDownTo));
  const pool = finite.length > 0 ? finite : active;

  return pool.reduce<SourceEntry | undefined>(
    (limiting, entry) => (limiting && limiting.scannedDownTo >= entry.scannedDownTo ? limiting : entry),
    undefined
  );
};

const MAX_SESSION_SNAPSHOTS = 5;

// Survives screen unmounts: a re-open paints the previous rows instantly while the sources reload behind them.
// Keyed per account+filter, so stacked screens (Activity + token page) keep their own snapshots
const sessionFeedSnapshots = new Map<string, Activity[]>();

const getSessionSnapshotActivities = (key: string) => sessionFeedSnapshots.get(key) ?? [];

const buildInitialFeedState = (sessionKey: string): ActivityFeedState => {
  const snapshotActivities = getSessionSnapshotActivities(sessionKey);

  return {
    activities: snapshotActivities,
    isInitialLoading: snapshotActivities.length === 0,
    isLoadingMore: false,
    isEmpty: false,
    isAllErrored: false,
    isAllLoaded: false
  };
};

const toAssetFilterKey = (filter: ActivityFeedAssetFilter | undefined) => {
  if (!filter) {
    return '';
  }

  return filter.chainKind === TempleChainKind.Tezos
    ? `${filter.chainKind}:${filter.assetSlug}`
    : `${filter.chainKind}:${filter.contract}`;
};

export const useActivityFeed = (assetFilter?: ActivityFeedAssetFilter) => {
  const tezosAddress = useAccountAddressForTezos();
  const evmAddress = useAccountAddressForEvm();
  const isFocused = useIsFocused();
  const { trackErrorEvent } = useAnalytics();

  const evmTokensMetadata = useEvmChainTokensMetadataSelector(ETHERLINK_MAINNET_CHAIN_ID);
  const evmCollectiblesMetadata = useEvmChainCollectiblesMetadataSelector(ETHERLINK_MAINNET_CHAIN_ID);

  const assetFilterKey = toAssetFilterKey(assetFilter);
  const sessionKey = `${tezosAddress ?? ''}:${evmAddress ?? ''}|${assetFilterKey}`;

  const [feedState, setFeedState] = useState<ActivityFeedState>(() => buildInitialFeedState(sessionKey));
  const [renderedSessionKey, setRenderedSessionKey] = useState(sessionKey);
  const feedStateRef = useRef(feedState);

  // Reset before paint on an account/filter change, so the previous account's rows never flash
  if (renderedSessionKey !== sessionKey) {
    setRenderedSessionKey(sessionKey);
    const nextFeedState = buildInitialFeedState(sessionKey);
    feedStateRef.current = nextFeedState;
    setFeedState(nextFeedState);
  }

  const staleActivitiesRef = useRef<Activity[]>([]);
  const previousAccountKeyRef = useRef<string | undefined>(undefined);
  const entriesRef = useRef<SourceEntry[]>([]);
  const abortControllerRef = useRef<AbortController | undefined>(undefined);
  const isLoadingMoreRef = useRef(false);
  const isToastShownRef = useRef(false);
  const lastSuccessfulLoadRef = useRef(0);
  const harvestedAssetSlugsRef = useRef(new Set<string>());
  const isFocusedRef = useRef(isFocused);
  isFocusedRef.current = isFocused;
  const trackErrorEventRef = useRef(trackErrorEvent);
  trackErrorEventRef.current = trackErrorEvent;
  const assetFilterRef = useRef(assetFilter);
  assetFilterRef.current = assetFilter;
  const sessionKeyRef = useRef(sessionKey);
  sessionKeyRef.current = sessionKey;
  const entriesSessionKeyRef = useRef<string | undefined>(undefined);

  const sync = useCallback(() => {
    // The session key advances on render, the entries only in the setup effect: in between, a late
    // callback of the old cycle must not publish the old account's buffers under the new key
    if (entriesSessionKeyRef.current !== sessionKeyRef.current) {
      return;
    }

    const state = computeFeedState(entriesRef.current, isLoadingMoreRef.current, staleActivitiesRef.current);
    feedStateRef.current = state;

    if (state.activities.length > 0) {
      putToCappedCache(sessionFeedSnapshots, sessionKeyRef.current, state.activities, MAX_SESSION_SNAPSHOTS);
    }

    setFeedState(state);
  }, []);

  const reportSourceFailure = useCallback((chain: TempleChainKind, error: unknown, isFirstPage: boolean) => {
    console.error(error);
    trackErrorEventRef.current(isFirstPage ? 'InitialLoadActivityFeedError' : 'LoadMoreActivityFeedError', error, [], {
      chain
    });
    // A first-page failure makes the next focus/foreground refetch immediately, so a source that never
    // delivered recovers; load-more failures keep the clock - a refresh would collapse the scroll depth
    if (isFirstPage) {
      lastSuccessfulLoadRef.current = 0;
    }

    if (isToastShownRef.current) {
      return;
    }

    isToastShownRef.current = true;
    showErrorToast({
      description: `${chain === TempleChainKind.Tezos ? 'Tezos' : 'Etherlink'} activity is unavailable`
    });
  }, []);

  const loadSourcePage = useCallback(
    async (entry: SourceEntry, signal: AbortSignal, isFirstPage: boolean) => {
      if (signal.aborted) {
        return;
      }

      entry.isLoading = true;
      sync();

      try {
        for (let attempt = 0; attempt <= RETRY_DELAYS.length; attempt++) {
          try {
            const page = await entry.loadNextPage(signal);

            if (signal.aborted) {
              return;
            }

            entry.buffer = entry.buffer.concat(page.activities);
            entry.scannedDownTo = Math.min(entry.scannedDownTo, page.scannedDownTo);
            entry.exhausted = page.exhausted;
            entry.errored = false;
            entry.hasLoadedFirstPage = true;

            // A clock zeroed by a first-page failure must survive later successes, so the next focus still refetches
            if (lastSuccessfulLoadRef.current !== 0) {
              lastSuccessfulLoadRef.current = Date.now();
            }

            return;
          } catch (error) {
            if (signal.aborted) {
              return;
            }

            if (attempt === RETRY_DELAYS.length) {
              entry.errored = true;
              reportSourceFailure(entry.chain, error, isFirstPage);

              return;
            }

            await sleep(RETRY_DELAYS[attempt]);

            if (signal.aborted) {
              return;
            }
          }
        }
      } finally {
        // An aborted call must not touch the entry - a new load cycle already owns it
        if (!signal.aborted) {
          entry.isLoading = false;
          sync();
        }
      }
    },
    [reportSourceFailure, sync]
  );

  const loadFirstPages = useCallback(
    (signal: AbortSignal) =>
      Promise.all(entriesRef.current.map(entry => loadSourcePage(entry, signal, true))).catch(error =>
        console.error(error)
      ),
    [loadSourcePage]
  );

  const startNewLoadCycle = useCallback(() => {
    abortControllerRef.current?.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;
    isLoadingMoreRef.current = false;
    isToastShownRef.current = false;
    lastSuccessfulLoadRef.current = Date.now();

    return controller;
  }, []);

  const refresh = useCallback(() => {
    const controller = startNewLoadCycle();
    staleActivitiesRef.current = feedStateRef.current.activities;
    entriesRef.current.forEach(resetEntry);
    sync();

    return loadFirstPages(controller.signal);
  }, [loadFirstPages, startNewLoadCycle, sync]);

  useEffect(() => {
    const controller = startNewLoadCycle();
    const filter = assetFilterRef.current;
    const entries: SourceEntry[] = [];

    if (tezosAddress && (!filter || filter.chainKind === TempleChainKind.Tezos)) {
      entries.push(
        toSourceEntry(
          createTezosActivitySource(
            tezosAddress,
            ChainIds.MAINNET,
            filter?.chainKind === TempleChainKind.Tezos ? filter.assetSlug : undefined
          )
        )
      );
    }

    if (evmAddress && evmAddress !== EVM_ADDRESS_PLACEHOLDER && (!filter || filter.chainKind === TempleChainKind.EVM)) {
      entries.push(
        toSourceEntry(
          createEvmActivitySource(
            evmAddress,
            ETHERLINK_MAINNET_CHAIN_ID,
            filter?.chainKind === TempleChainKind.EVM ? filter.contract : undefined
          )
        )
      );
    }

    // The cache is per account: clear it when the account changes, keep it when only the asset filter changes
    const accountKey = `${tezosAddress ?? ''}:${evmAddress ?? ''}`;

    if (previousAccountKeyRef.current !== accountKey) {
      previousAccountKeyRef.current = accountKey;
      resetEvmActivityCache();
    }

    harvestedAssetSlugsRef.current.clear();
    staleActivitiesRef.current = getSessionSnapshotActivities(sessionKeyRef.current);
    entriesSessionKeyRef.current = sessionKeyRef.current;
    entriesRef.current = entries;
    sync();
    loadFirstPages(controller.signal);

    return () => controller.abort();
  }, [assetFilterKey, evmAddress, loadFirstPages, startNewLoadCycle, sync, tezosAddress]);

  const refreshIfStale = useCallback(() => {
    if (isFocusedRef.current && Date.now() - lastSuccessfulLoadRef.current > FOCUS_REFETCH_THRESHOLD) {
      refresh();
    }
  }, [refresh]);

  useEffect(() => {
    if (isFocused) {
      refreshIfStale();
    }
  }, [isFocused, refreshIfStale]);

  useAppStateStatus({
    onAppActiveState: refreshIfStale
  });

  const handleLoadMore = useCallback(async () => {
    const controller = abortControllerRef.current;
    const entries = entriesRef.current;

    if (!controller || isLoadingMoreRef.current || entries.some(entry => entry.isLoading)) {
      return;
    }

    if (entries.every(entry => entry.exhausted || entry.errored)) {
      return;
    }

    const { signal } = controller;
    isLoadingMoreRef.current = true;
    sync();

    try {
      const renderableCountBefore = getRenderableActivities(entries).length;

      for (let cycle = 0; cycle < MAX_LOAD_MORE_CYCLES; cycle++) {
        const limitingSource = pickBoundaryLimitingSource(entries);

        if (!limitingSource) {
          break;
        }

        await loadSourcePage(limitingSource, signal, false);

        if (signal.aborted) {
          return;
        }

        if (getRenderableActivities(entries).length - renderableCountBefore >= MIN_NEW_ROWS_PER_LOAD_MORE) {
          break;
        }
      }
    } finally {
      isLoadingMoreRef.current = false;
      sync();
    }
  }, [loadSourcePage, sync]);

  useEffect(() => {
    const harvested = harvestedAssetSlugsRef.current;
    const tokensMetadata: Record<string, EvmTokenMetadata> = {};
    const collectiblesMetadata: Record<string, EvmCollectibleMetadata> = {};

    for (const activity of feedState.activities) {
      if (!isEvmActivity(activity)) {
        continue;
      }

      for (const { asset } of activity.operations) {
        if (asset == null) {
          continue;
        }

        const contract = asset.contract.toLowerCase();

        if (!isAddress(contract)) {
          continue;
        }

        const slug = toEvmAssetSlug(contract, asset.tokenId);

        if (harvested.has(slug)) {
          continue;
        }

        if (asset.nft === true) {
          if (!evmCollectiblesMetadata[slug]) {
            collectiblesMetadata[slug] = {
              address: contract,
              tokenId: asset.tokenId ?? '0',
              symbol: asset.symbol,
              iconURL: asset.iconURL
            };
          }

          harvested.add(slug);
        } else if (evmTokensMetadata[slug]) {
          harvested.add(slug);
        } else if (asset.decimals != null) {
          tokensMetadata[slug] = {
            address: contract,
            standard: EvmAssetStandardEnum.ERC20,
            symbol: asset.symbol,
            decimals: asset.decimals,
            iconURL: asset.iconURL
          };

          harvested.add(slug);
        }
      }
    }

    if (Object.keys(tokensMetadata).length > 0) {
      dispatch(processLoadedEvmTokensMetadataAction({ chainId: ETHERLINK_MAINNET_CHAIN_ID, metadata: tokensMetadata }));
    }

    if (Object.keys(collectiblesMetadata).length > 0) {
      dispatch(
        processLoadedEvmCollectiblesMetadataAction({
          chainId: ETHERLINK_MAINNET_CHAIN_ID,
          metadata: collectiblesMetadata
        })
      );
    }
  }, [evmCollectiblesMetadata, evmTokensMetadata, feedState.activities]);

  return { ...feedState, handleLoadMore, refresh };
};
