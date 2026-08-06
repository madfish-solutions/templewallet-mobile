import { TempleChainKind } from 'src/enums/temple-chain-kind.enum';

import type { Activity, EvmOperation } from '../types';
import { isEvmActivity, toActivityKey } from '../utils';

const mergeColliding = (existing: Activity, incoming: Activity): Activity => {
  if (isEvmActivity(existing) && isEvmActivity(incoming)) {
    const byLogIndex = new Map<number, EvmOperation>();
    existing.operations.forEach(operation => byLogIndex.set(operation.logIndex, operation));
    incoming.operations.forEach(operation => {
      if (!byLogIndex.has(operation.logIndex)) {
        byLogIndex.set(operation.logIndex, operation);
      }
    });

    const operations = Array.from(byLogIndex.values()).sort((a, b) => a.logIndex - b.logIndex);

    return { ...existing, operations, operationsCount: operations.length };
  }

  return incoming.operations.length > existing.operations.length ? incoming : existing;
};

const CHAIN_ORDER: Record<TempleChainKind, number> = {
  [TempleChainKind.Tezos]: 0,
  [TempleChainKind.EVM]: 1
};

const compareActivities = (a: Activity, b: Activity) =>
  b.addedAt - a.addedAt || CHAIN_ORDER[a.chain] - CHAIN_ORDER[b.chain];

// Stable sort keeps the new-to-old order inside each buffer (Hermes has no `toSorted`)
export const mergeActivityBuffers = (buffers: Activity[][]): Activity[] => {
  const byKey = new Map<string, Activity>();

  for (const buffer of buffers) {
    for (const activity of buffer) {
      const key = toActivityKey(activity);
      const existing = byKey.get(key);
      byKey.set(key, existing ? mergeColliding(existing, activity) : activity);
    }
  }

  return Array.from(byKey.values()).sort(compareActivities);
};

export interface SourceBoundaryState {
  scannedDownTo: number;
  exhausted: boolean;
  errored: boolean;
}

// The newest `scannedDownTo` among sources that can still load more - everything newer is already loaded by all of them
export const getSafeBoundary = (states: readonly SourceBoundaryState[]) => {
  const boundaries = states
    .filter(({ exhausted, errored }) => !exhausted && !errored)
    .map(({ scannedDownTo }) => scannedDownTo)
    .filter(Number.isFinite);

  return boundaries.length ? Math.max(...boundaries) : Number.NEGATIVE_INFINITY;
};

export const cutAtBoundary = (activities: Activity[], boundary: number) =>
  boundary === Number.NEGATIVE_INFINITY ? activities : activities.filter(({ addedAt }) => addedAt >= boundary);
