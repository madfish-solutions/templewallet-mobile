import { TempleChainKind } from 'src/enums/temple-chain-kind.enum';

import { ActivityStatus, EvmActivity } from '../types';

import { createActivityFeedController, ActivityFeedState, ActivityFeedSourceFailure } from './activity-feed-controller';
import { ActivityFeedPage, ActivityFeedSource, EvmSourceCursor } from './types';

const CHAIN_ID = 42793;

const makeActivity = (hash: string, addedAt: number): EvmActivity => ({
  chain: TempleChainKind.EVM,
  chainId: CHAIN_ID,
  hash,
  operations: [],
  addedAt,
  status: ActivityStatus.applied,
  blockHeight: '1',
  index: null,
  fee: null,
  value: null
});

interface ScriptedPage {
  activities: EvmActivity[];
  nextCursor: EvmSourceCursor | null;
  scannedDownTo: number;
  fail?: boolean;
  defer?: boolean;
}

const NEXT_CURSOR: EvmSourceCursor = { operationsPageParams: undefined, tokensTransfersPageParams: undefined };

const createScriptedSource = (script: ScriptedPage[]) => {
  const calls: number[] = [];
  let deferredResolve: (() => void) | undefined;

  const source: ActivityFeedSource<EvmSourceCursor> = {
    chain: TempleChainKind.EVM,
    fetch: async (_cursor, _signal): Promise<ActivityFeedPage<EvmSourceCursor>> => {
      const index = calls.length;
      calls.push(index);
      const page = script[Math.min(index, script.length - 1)];

      if (page.defer) {
        await new Promise<void>(resolve => {
          deferredResolve = resolve;
        });
      }
      if (page.fail) {
        throw new Error(`scripted failure #${index}`);
      }

      return {
        activities: page.activities,
        nextCursor: page.nextCursor,
        scannedDownTo: page.scannedDownTo
      };
    }
  };

  return { source, calls, resolveDeferred: () => deferredResolve?.() };
};

const flush = async (ms = 0) => {
  await jest.advanceTimersByTimeAsync(ms);
};

const RETRY_TOTAL_MS = 2000 + 4000 + 8000;

const setup = (sources: ActivityFeedSource<EvmSourceCursor>[]) => {
  const states: ActivityFeedState[] = [];
  const failures: ActivityFeedSourceFailure[] = [];
  const controller = createActivityFeedController({
    sources,
    initialStaleActivities: [],
    onStateChange: state => states.push(state),
    onSourceFailure: failure => failures.push(failure)
  });
  const lastState = () => states.at(-1);

  return { controller, states, failures, lastState };
};

describe('createActivityFeedController', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('discards a stale in-flight loadMore page when refresh() starts a new cycle', async () => {
    const fresh = makeActivity('fresh', 3000);
    const stale = makeActivity('stale', 1000);
    const { source, resolveDeferred } = createScriptedSource([
      { activities: [makeActivity('first', 5000)], nextCursor: NEXT_CURSOR, scannedDownTo: 4000 },
      { activities: [stale], nextCursor: NEXT_CURSOR, scannedDownTo: 900, defer: true },
      { activities: [fresh], nextCursor: null, scannedDownTo: 0 }
    ]);
    const { controller, lastState } = setup([source]);

    controller.start();
    await flush();

    const loadMorePromise = controller.loadMore();
    await flush();

    const refreshPromise = controller.refresh();
    resolveDeferred();
    await flush();
    await refreshPromise;
    await loadMorePromise;

    const hashes = (lastState()?.activities ?? []).map(({ hash }) => hash);
    expect(hashes).toContain('fresh');
    expect(hashes).not.toContain('stale');
  });

  it('zeroes the staleness clock on first-page failure and keeps it zeroed past later successes', async () => {
    const failing = createScriptedSource([
      { activities: [], nextCursor: NEXT_CURSOR, scannedDownTo: 0, fail: true },
      { activities: [], nextCursor: NEXT_CURSOR, scannedDownTo: 0, fail: true },
      { activities: [], nextCursor: NEXT_CURSOR, scannedDownTo: 0, fail: true },
      { activities: [], nextCursor: NEXT_CURSOR, scannedDownTo: 0, fail: true },
      { activities: [makeActivity('recovered', 100)], nextCursor: null, scannedDownTo: 0 }
    ]);
    const succeeding = createScriptedSource([
      { activities: [makeActivity('ok', 200)], nextCursor: null, scannedDownTo: 0, defer: true }
    ]);
    const { controller } = setup([failing.source, succeeding.source]);

    controller.start();
    await flush(RETRY_TOTAL_MS);

    succeeding.resolveDeferred();
    await flush();

    const failingCallsBefore = failing.calls.length;
    controller.refreshIfStale();
    await flush(RETRY_TOTAL_MS);
    succeeding.resolveDeferred();
    await flush();

    expect(failing.calls.length).toBeGreaterThan(failingCallsBefore);
  });

  it('marks exactly one failure per cycle as isFirstFailureInCycle', async () => {
    const a = createScriptedSource([{ activities: [], nextCursor: null, scannedDownTo: 0, fail: true }]);
    const b = createScriptedSource([{ activities: [], nextCursor: null, scannedDownTo: 0, fail: true }]);
    const { controller, failures } = setup([a.source, b.source]);

    controller.start();
    await flush(RETRY_TOTAL_MS);

    expect(failures).toHaveLength(2);
    expect(failures.filter(({ isFirstFailureInCycle }) => isFirstFailureInCycle)).toHaveLength(1);

    failures.length = 0;
    const refreshPromise = controller.refresh().catch(() => undefined);
    await flush(RETRY_TOTAL_MS);
    await refreshPromise;

    expect(failures).toHaveLength(2);
    expect(failures.filter(({ isFirstFailureInCycle }) => isFirstFailureInCycle)).toHaveLength(1);
  });

  it('auto-runs a single bounded load-more when the first pages come back empty', async () => {
    const { source, calls } = createScriptedSource([{ activities: [], nextCursor: NEXT_CURSOR, scannedDownTo: 500 }]);
    const { controller, states, lastState } = setup([source]);

    controller.start();
    await flush();
    await flush();
    await flush();
    await flush();
    await flush();

    expect(calls.length).toBe(4);
    expect(lastState()?.isEmpty).toBe(true);
    expect(lastState()?.isLoadingMore).toBe(false);

    const midFlight = states.filter(
      state => state.activities.length === 0 && state.isLoadingMore && state.isInitialLoading
    );
    expect(midFlight.length).toBeGreaterThan(0);
  });

  it('stops auto-continuing at source exhaustion', async () => {
    const { source, calls } = createScriptedSource([
      { activities: [], nextCursor: NEXT_CURSOR, scannedDownTo: 500 },
      { activities: [], nextCursor: null, scannedDownTo: 200 }
    ]);
    const { controller, lastState } = setup([source]);

    controller.start();
    await flush();
    await flush();
    await flush();

    expect(calls).toHaveLength(2);
    expect(lastState()?.isEmpty).toBe(true);
    expect(lastState()?.isAllLoaded).toBe(true);
  });
});
