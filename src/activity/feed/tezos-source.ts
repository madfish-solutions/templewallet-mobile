import { OPERATION_LIMIT } from 'src/config/general';
import { TempleChainKind } from 'src/enums/temple-chain-kind.enum';
import { isDefined } from 'src/utils/is-defined';

import { parseTezosOperationsGroup } from '../tezos';
import { createOperationsFetcher, fetchOperGroupsForOperations, OperationsFetcher } from '../tezos/fetch';
import { ActivityStatus } from '../types';
import { throwIfAborted } from '../utils';

import { fetchWithPageLoop } from './page-loop';
import { ActivityFeedPage, ActivityFeedSource, TezosSourceCursor } from './types';

const fetchTezosPage = async (
  fetchOperations: OperationsFetcher,
  accountAddress: string,
  chainId: string,
  cursor: TezosSourceCursor | undefined,
  signal: AbortSignal
): Promise<ActivityFeedPage<TezosSourceCursor>> => {
  throwIfAborted(signal);
  const { operations, oldestRawOperation } = await fetchOperations(OPERATION_LIMIT, cursor, signal);

  // Ids only decrease between pages, so an empty raw page means there is nothing older left
  if (!oldestRawOperation) {
    return { activities: [], nextCursor: null, scannedDownTo: 0 };
  }

  const nextCursor = {
    hash: oldestRawOperation.hash,
    oldestTzktOperation: { id: oldestRawOperation.id }
  };
  const scannedDownTo = new Date(oldestRawOperation.timestamp).getTime();

  throwIfAborted(signal);
  const groups = await fetchOperGroupsForOperations(
    operations.map(({ hash }) => hash),
    cursor,
    signal
  );

  throwIfAborted(signal);

  return {
    // failed groups are hidden
    activities: groups
      .map(group => parseTezosOperationsGroup(group, chainId, accountAddress))
      .filter(isDefined)
      .filter(({ status }) => status !== ActivityStatus.failed),
    nextCursor,
    scannedDownTo
  };
};

export const createTezosActivitySource = (
  accountAddress: string,
  chainId: string,
  assetSlug?: string
): ActivityFeedSource<TezosSourceCursor> => {
  const fetchOperations = createOperationsFetcher(accountAddress, assetSlug);

  return {
    chain: TempleChainKind.Tezos,
    fetch: (cursor, signal) =>
      fetchWithPageLoop(
        (pageCursor, pageSignal) => fetchTezosPage(fetchOperations, accountAddress, chainId, pageCursor, pageSignal),
        cursor,
        signal
      )
  };
};
