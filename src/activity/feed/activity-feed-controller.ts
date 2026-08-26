import { TempleChainKind } from 'src/enums/temple-chain-kind.enum';
import { sleep } from 'src/utils/timeouts.util';

import type { Activity } from '../types';

import { cutAtBoundary, getSafeBoundary, mergeActivityBuffers } from './merge';
import { ActivityFeedSource, SourceCursor, UNKNOWN_SCANNED_DOWN_TO } from './types';

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

export interface ActivityFeedState {
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

export interface ActivityFeedSourceFailure {
  chain: TempleChainKind;
  error: unknown;
  isFirstPage: boolean;
  isFirstFailureInCycle: boolean;
}

interface ActivityFeedControllerOptions {
  sources: ReadonlyArray<ActivityFeedSource<SourceCursor>>;
  initialStaleActivities: Activity[];
  onStateChange: (state: ActivityFeedState) => void;
  onSourceFailure: (failure: ActivityFeedSourceFailure) => void;
}

export interface ActivityFeedController {
  start(): void;
  refresh(): Promise<void>;
  refreshIfStale(): void;
  loadMore(): Promise<void>;
  destroy(): void;
}

export const createActivityFeedController = ({
  sources,
  initialStaleActivities,
  onStateChange,
  onSourceFailure
}: ActivityFeedControllerOptions): ActivityFeedController => {
  const entries = sources.map(toSourceEntry);
  let abortController: AbortController | undefined;
  let isLoadingMore = false;
  let hasReportedFailureInCycle = false;
  let lastSuccessfulLoad = 0;
  let staleActivities = initialStaleActivities;
  let currentState = computeFeedState(entries, false, staleActivities);
  let destroyed = false;

  const publish = () => {
    // A destroyed controller must not touch the UI - the hook already listens to its successor
    if (destroyed) {
      return;
    }

    currentState = computeFeedState(entries, isLoadingMore, staleActivities);
    onStateChange(currentState);
  };

  const reportSourceFailure = (chain: TempleChainKind, error: unknown, isFirstPage: boolean) => {
    console.error(error);
    // A first-page failure makes the next focus/foreground refetch immediately, so a source that never
    // delivered recovers; load-more failures keep the clock - a refresh would collapse the scroll depth
    if (isFirstPage) {
      lastSuccessfulLoad = 0;
    }

    const isFirstFailureInCycle = !hasReportedFailureInCycle;
    hasReportedFailureInCycle = true;
    onSourceFailure({ chain, error, isFirstPage, isFirstFailureInCycle });
  };

  const loadSourcePage = async (entry: SourceEntry, signal: AbortSignal, isFirstPage: boolean) => {
    if (signal.aborted) {
      return;
    }

    entry.isLoading = true;
    publish();

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
          if (lastSuccessfulLoad !== 0) {
            lastSuccessfulLoad = Date.now();
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
        publish();
      }
    }
  };

  const loadFirstPages = async (signal: AbortSignal) => {
    try {
      await Promise.all(entries.map(entry => loadSourcePage(entry, signal, true)));
    } catch (error) {
      console.error(error);
    }
  };

  const startNewLoadCycle = () => {
    abortController?.abort();
    const controller = new AbortController();
    abortController = controller;
    isLoadingMore = false;
    hasReportedFailureInCycle = false;
    lastSuccessfulLoad = Date.now();

    return controller;
  };

  const refresh = () => {
    const controller = startNewLoadCycle();
    staleActivities = currentState.activities;
    entries.forEach(resetEntry);
    publish();

    return loadFirstPages(controller.signal);
  };

  return {
    start() {
      const controller = startNewLoadCycle();
      publish();
      loadFirstPages(controller.signal);
    },
    refresh,
    refreshIfStale() {
      if (Date.now() - lastSuccessfulLoad > FOCUS_REFETCH_THRESHOLD) {
        refresh();
      }
    },
    async loadMore() {
      const controller = abortController;

      if (!controller || isLoadingMore || entries.some(entry => entry.isLoading)) {
        return;
      }

      if (entries.every(entry => entry.exhausted || entry.errored)) {
        return;
      }

      const { signal } = controller;
      isLoadingMore = true;
      publish();

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
        isLoadingMore = false;
        publish();
      }
    },
    destroy() {
      destroyed = true;
      abortController?.abort();
    }
  };
};
