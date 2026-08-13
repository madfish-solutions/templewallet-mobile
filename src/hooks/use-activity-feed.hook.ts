import { useIsFocused } from '@react-navigation/native';
import { ChainIds } from '@taquito/taquito';
import { useCallback, useEffect, useRef, useState } from 'react';

import { resetEvmActivityCache } from 'src/activity/evm/fetch';
import {
  ActivityFeedAssetFilter,
  ActivityFeedController,
  ActivityFeedSource,
  ActivityFeedSourceFailure,
  ActivityFeedState,
  createActivityFeedController,
  createEvmActivitySource,
  createTezosActivitySource,
  SourceCursor
} from 'src/activity/feed';
import { Activity } from 'src/activity/types';
import { EVM_ADDRESS_PLACEHOLDER } from 'src/config/wallet.const';
import { TempleChainKind } from 'src/enums/temple-chain-kind.enum';
import { useAppStateStatus } from 'src/hooks/use-app-state-status.hook';
import { useHarvestEvmActivityMetadata } from 'src/hooks/use-harvest-evm-activity-metadata.hook';
import { useAccountAddressForEvm, useAccountAddressForTezos } from 'src/store/wallet/wallet-selectors';
import { showErrorToast } from 'src/toast/toast.utils';
import { useAnalytics } from 'src/utils/analytics/use-analytics.hook';
import { putToCappedCache } from 'src/utils/capped-cache.utils';
import { ETHERLINK_MAINNET_CHAIN_ID } from 'src/utils/rpc/rpc-list';

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

  const assetFilterKey = toAssetFilterKey(assetFilter);
  const sessionKey = `${tezosAddress ?? ''}:${evmAddress ?? ''}|${assetFilterKey}`;

  const [feedState, setFeedState] = useState<ActivityFeedState>(() => buildInitialFeedState(sessionKey));
  const [renderedSessionKey, setRenderedSessionKey] = useState(sessionKey);

  // Reset before paint on an account/filter change, so the previous account's rows never flash
  if (renderedSessionKey !== sessionKey) {
    setRenderedSessionKey(sessionKey);
    setFeedState(buildInitialFeedState(sessionKey));
  }

  const previousAccountKeyRef = useRef<string | undefined>(undefined);
  const controllerRef = useRef<ActivityFeedController | undefined>(undefined);
  const isFocusedRef = useRef(isFocused);
  isFocusedRef.current = isFocused;
  const trackErrorEventRef = useRef(trackErrorEvent);
  trackErrorEventRef.current = trackErrorEvent;
  const assetFilterRef = useRef(assetFilter);
  assetFilterRef.current = assetFilter;
  const sessionKeyRef = useRef(sessionKey);
  sessionKeyRef.current = sessionKey;

  const handleStateChange = useCallback((controllerSessionKey: string, state: ActivityFeedState) => {
    // The session key advances on render, the controller only in the setup effect: in between, a late
    // callback of the old cycle must not publish the old account's state under the new key
    if (controllerSessionKey !== sessionKeyRef.current) {
      return;
    }

    if (state.activities.length > 0) {
      putToCappedCache(sessionFeedSnapshots, controllerSessionKey, state.activities, MAX_SESSION_SNAPSHOTS);
    }

    setFeedState(state);
  }, []);

  const handleSourceFailure = useCallback(
    ({ chain, error, isFirstPage, isFirstFailureInCycle }: ActivityFeedSourceFailure) => {
      trackErrorEventRef.current(
        isFirstPage ? 'InitialLoadActivityFeedError' : 'LoadMoreActivityFeedError',
        error,
        [],
        { chain }
      );

      if (isFirstFailureInCycle) {
        showErrorToast({
          description: `${chain === TempleChainKind.Tezos ? 'Tezos' : 'Etherlink'} activity is unavailable`
        });
      }
    },
    []
  );

  useEffect(() => {
    const filter = assetFilterRef.current;
    const controllerSessionKey = sessionKeyRef.current;
    const sources: ActivityFeedSource<SourceCursor>[] = [];

    if (tezosAddress && (!filter || filter.chainKind === TempleChainKind.Tezos)) {
      sources.push(
        createTezosActivitySource(
          tezosAddress,
          ChainIds.MAINNET,
          filter?.chainKind === TempleChainKind.Tezos ? filter.assetSlug : undefined
        )
      );
    }

    if (evmAddress && evmAddress !== EVM_ADDRESS_PLACEHOLDER && (!filter || filter.chainKind === TempleChainKind.EVM)) {
      sources.push(
        createEvmActivitySource(
          evmAddress,
          ETHERLINK_MAINNET_CHAIN_ID,
          filter?.chainKind === TempleChainKind.EVM ? filter.contract : undefined
        )
      );
    }

    // The cache is per account: clear it when the account changes, keep it when only the asset filter changes
    const accountKey = `${tezosAddress ?? ''}:${evmAddress ?? ''}`;

    if (previousAccountKeyRef.current !== accountKey) {
      previousAccountKeyRef.current = accountKey;
      resetEvmActivityCache();
    }

    const controller = createActivityFeedController({
      sources,
      initialStaleActivities: getSessionSnapshotActivities(controllerSessionKey),
      onStateChange: state => handleStateChange(controllerSessionKey, state),
      onSourceFailure: handleSourceFailure
    });
    controllerRef.current = controller;
    controller.start();

    return () => controller.destroy();
  }, [assetFilterKey, evmAddress, handleSourceFailure, handleStateChange, tezosAddress]);

  const refresh = useCallback(() => controllerRef.current?.refresh() ?? Promise.resolve(), []);

  const refreshIfStale = useCallback(() => {
    if (isFocusedRef.current) {
      controllerRef.current?.refreshIfStale();
    }
  }, []);

  useEffect(() => {
    if (isFocused) {
      refreshIfStale();
    }
  }, [isFocused, refreshIfStale]);

  useAppStateStatus({
    onAppActiveState: refreshIfStale
  });

  const handleLoadMore = useCallback(() => controllerRef.current?.loadMore() ?? Promise.resolve(), []);

  useHarvestEvmActivityMetadata(feedState.activities, sessionKey);

  return { ...feedState, handleLoadMore, refresh };
};
