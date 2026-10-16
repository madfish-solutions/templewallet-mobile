import { EtherlinkTokenTransfer, EtherlinkTransaction } from 'src/apis/etherlink';
import { TempleChainKind } from 'src/enums/temple-chain-kind.enum';
import { putToCappedCache } from 'src/utils/capped-cache.utils';
import { equalsIgnoreCase } from 'src/utils/evm/on-chain/common.utils';
import { isDefined } from 'src/utils/is-defined';

import { ActivityStatus, EvmActivity } from '../types';
import { throwIfAborted } from '../utils';

import { EtherlinkActivitiesPageParams, getEtherlinkHistoryData } from './fetchers';
import { parseTokenTransfer, toBigInt, toUnorderedOperations } from './parse';

export type { EtherlinkActivitiesPageParams } from './fetchers';

interface EtherlinkActivitiesPage {
  activities: EvmActivity[];
  nextPageParams: EtherlinkActivitiesPageParams | null;
  oldestRawTimestamp: number | null;
}

const MAX_CACHED_ACTIVITIES = 500;

const parsedActivitiesCache = new Map<string, EvmActivity>();

// The key includes the account: parsed operations are account-relative (direction, approvals, fees).
// It also includes the slice's log-index range: a transaction split across page boundaries must not
// freeze in its partial form - a different slice misses the cache, re-parses and merges downstream
const toCacheKey = (accountAddress: string, chainId: number, hash: string, transfers: EtherlinkTokenTransfer[]) => {
  const logIndexes = transfers.map(({ log_index: logIndex }) => logIndex);
  const range = logIndexes.length > 0 ? `${Math.min(...logIndexes)}-${Math.max(...logIndexes)}` : '';

  return `${accountAddress.toLowerCase()}:${chainId}:${hash.toLowerCase()}:${range}`;
};

const putCachedActivity = (
  accountAddress: string,
  chainId: number,
  transfers: EtherlinkTokenTransfer[],
  activity: EvmActivity
) =>
  putToCappedCache(
    parsedActivitiesCache,
    toCacheKey(accountAddress, chainId, activity.hash, transfers),
    activity,
    MAX_CACHED_ACTIVITIES
  );

const getOldestTimestamp = (items: { timestamp: string }[]) =>
  items.reduce<number | null>((oldest, { timestamp }) => {
    const parsed = Date.parse(timestamp);

    return Number.isNaN(parsed) || (oldest !== null && oldest <= parsed) ? oldest : parsed;
  }, null);

interface RawActivity {
  tx?: EtherlinkTransaction;
  tokensTransfers: EtherlinkTokenTransfer[];
  nativeCoinDelta: string;
}

export const fetchEtherlinkActivities = async (
  accountAddress: string,
  chainId: number,
  pageParams: EtherlinkActivitiesPageParams | undefined,
  signal?: AbortSignal
): Promise<EtherlinkActivitiesPage> => {
  const {
    explicitOperations,
    explicitOperationsNextPageParams,
    coinBalanceHistoryItems,
    tokensTransfers,
    tokensTransfersNextPageParams
  } = await getEtherlinkHistoryData(pageParams, accountAddress, signal);

  const rawActivitiesByHash = new Map<string, RawActivity>();
  const coinDeltaByTxHash = new Map<string, bigint>();

  coinBalanceHistoryItems.forEach(({ transaction_hash: transactionHash, delta }) => {
    if (!transactionHash) {
      return;
    }

    const key = transactionHash.toLowerCase();
    const currentDelta = coinDeltaByTxHash.get(key) ?? 0n;

    coinDeltaByTxHash.set(key, currentDelta + toBigInt(delta));
  });

  explicitOperations.forEach(op => {
    const fee = toBigInt(op.fee?.value ?? '0');
    const accountPaidFee = equalsIgnoreCase(op.from.hash, accountAddress) ? fee : 0n;
    const balanceDelta = coinDeltaByTxHash.get(op.hash.toLowerCase());
    const nativeCoinDelta = balanceDelta == null ? 0n : balanceDelta + accountPaidFee;

    rawActivitiesByHash.set(op.hash, {
      tx: op,
      tokensTransfers: [],
      nativeCoinDelta: nativeCoinDelta.toString()
    });
  });

  tokensTransfers.forEach(transfer => {
    const raw = rawActivitiesByHash.get(transfer.transaction_hash);

    if (raw) {
      raw.tokensTransfers.push(transfer);
    } else {
      rawActivitiesByHash.set(transfer.transaction_hash, { tokensTransfers: [transfer], nativeCoinDelta: '0' });
    }
  });

  // The shared rate limiter, not this loop, decides how fast the per-transaction requests go out
  const parsedActivities = await Promise.all(
    Array.from(rawActivitiesByHash, async ([hash, { tx, tokensTransfers: txTokensTransfers, nativeCoinDelta }]) => {
      throwIfAborted(signal);

      // failed transactions are hidden
      if (tx?.status === 'error') {
        return undefined;
      }

      const cachedActivity = parsedActivitiesCache.get(toCacheKey(accountAddress, chainId, hash, txTokensTransfers));

      if (cachedActivity) {
        return cachedActivity;
      }

      const firstTransfer = txTokensTransfers.at(0);
      const shellSource = tx ?? firstTransfer;

      if (!shellSource) {
        return undefined;
      }

      const operations = tx
        ? await toUnorderedOperations(tx, txTokensTransfers, nativeCoinDelta, accountAddress, chainId, signal)
        : txTokensTransfers.map(transfer => parseTokenTransfer(transfer, accountAddress));
      operations.sort((a, b) => a.logIndex - b.logIndex);

      const blockHeight: `${number}` = `${shellSource.block_number}`;
      const activity: EvmActivity = {
        chain: TempleChainKind.EVM,
        chainId,
        hash,
        operations,
        addedAt: new Date(shellSource.timestamp).getTime(),
        status: ActivityStatus.applied,
        blockHeight,
        index: tx?.position ?? null,
        fee: tx ? tx.fee?.value ?? '0' : null,
        value: tx?.value ?? null
      };

      putCachedActivity(accountAddress, chainId, txTokensTransfers, activity);

      return activity;
    })
  );

  const activities = parsedActivities.filter(isDefined);

  activities.sort(({ blockHeight: aLevel, index: aIndex }, { blockHeight: bLevel, index: bIndex }) =>
    Number(aLevel) === Number(bLevel) ? (bIndex ?? 0) - (aIndex ?? 0) : Number(bLevel) - Number(aLevel)
  );

  return {
    activities,
    nextPageParams:
      explicitOperationsNextPageParams === null && tokensTransfersNextPageParams === null
        ? null
        : {
            operationsPageParams: explicitOperationsNextPageParams,
            tokensTransfersPageParams: tokensTransfersNextPageParams
          },
    oldestRawTimestamp: getOldestTimestamp([...explicitOperations, ...tokensTransfers])
  };
};
