import { TempleChainKind } from 'src/enums/temple-chain-kind.enum';

import type { Activity, EvmOperation } from '../types';
import { isEvmActivity, toActivityKey } from '../utils';

// Gas/fallback operations carry a synthetic logIndex (tx position) that can numerically collide with a real log_index
const toOperationMergeKey = (operation: EvmOperation) =>
  `${operation.kind}:${operation.asset?.contract ?? ''}:${operation.logIndex}`;

const mergeColliding = (existing: Activity, incoming: Activity): Activity => {
  if (isEvmActivity(existing) && isEvmActivity(incoming)) {
    const byMergeKey = new Map<string, EvmOperation>();
    existing.operations.forEach(operation => byMergeKey.set(toOperationMergeKey(operation), operation));
    incoming.operations.forEach(operation => {
      const key = toOperationMergeKey(operation);

      if (!byMergeKey.has(key)) {
        byMergeKey.set(key, operation);
      }
    });

    const operations = Array.from(byMergeKey.values()).sort((a, b) => a.logIndex - b.logIndex);

    return { ...existing, operations };
  }

  return incoming.operations.length > existing.operations.length ? incoming : existing;
};

const CHAIN_ORDER: Record<TempleChainKind, number> = {
  [TempleChainKind.Tezos]: 0,
  [TempleChainKind.EVM]: 1
};

const compareActivities = (a: Activity, b: Activity) =>
  b.addedAt - a.addedAt || CHAIN_ORDER[a.chain] - CHAIN_ORDER[b.chain];

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

interface SourceBoundaryState {
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
