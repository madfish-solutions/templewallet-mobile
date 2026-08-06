import { TempleChainKind } from 'src/enums/temple-chain-kind.enum';
import { equalsIgnoreCase } from 'src/utils/evm/on-chain/common.utils';

import { fetchEtherlinkActivities } from '../evm/fetch';
import type { EvmActivity } from '../types';
import { throwIfAborted } from '../utils';

import { fetchWithPageLoop } from './page-loop';
import { ActivityFeedPage, ActivityFeedSource, EvmSourceCursor, UNKNOWN_SCANNED_DOWN_TO } from './types';

const matchesContract = (activity: EvmActivity, contract: string) =>
  activity.operations.some(({ asset }) => equalsIgnoreCase(asset?.contract, contract));

const fetchEvmPage = async (
  accountAddress: string,
  chainId: number,
  contract: string | undefined,
  cursor: EvmSourceCursor | undefined,
  signal: AbortSignal
): Promise<ActivityFeedPage<EvmSourceCursor>> => {
  throwIfAborted(signal);
  const { activities, nextPageParams, oldestRawTimestamp } = await fetchEtherlinkActivities(
    accountAddress,
    chainId,
    cursor,
    signal
  );

  // `scannedDownTo` is taken from raw items, so a page with zero parsed activities still moves the feed forward
  const scannedDownTo = nextPageParams === null ? 0 : oldestRawTimestamp ?? UNKNOWN_SCANNED_DOWN_TO;

  return {
    activities: contract ? activities.filter(activity => matchesContract(activity, contract)) : activities,
    nextCursor: nextPageParams,
    scannedDownTo
  };
};

export const createEvmActivitySource = (
  accountAddress: string,
  chainId: number,
  contract?: string
): ActivityFeedSource<EvmSourceCursor> => ({
  chain: TempleChainKind.EVM,
  fetch: (cursor, signal) =>
    fetchWithPageLoop(
      (pageCursor, pageSignal) => fetchEvmPage(accountAddress, chainId, contract, pageCursor, pageSignal),
      cursor,
      signal
    )
});
