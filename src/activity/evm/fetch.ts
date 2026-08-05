import {
  EtherlinkAccountTransactionsPageParams,
  EtherlinkCoinBalanceHistoryItem,
  EtherlinkInternalTransaction,
  EtherlinkInternalTransactionsPageParams,
  EtherlinkLog,
  EtherlinkTokenTransfer,
  EtherlinkTokenTransfersPageParams,
  EtherlinkTransaction,
  EtherlinkTransactionLogsPageParams,
  fetchGetAccountCoinBalanceHistory,
  fetchGetAccountTokenTransfers,
  fetchGetAccountTransactions,
  fetchGetTransactionInternalTransactions,
  fetchGetTransactionLogs,
  fetchGetTransactionTokenTransfers,
  isErc20TokenTransfer,
  isErc721TokenTransfer
} from 'src/apis/etherlink';
import { TempleChainKind } from 'src/enums/temple-chain-kind.enum';
import { DEFAULT_EVM_CURRENCY } from 'src/token/interfaces/token-metadata.interface';
import { DEFAULT_EVM_CHAINS_SPECS } from 'src/types/networks';
import { equalsIgnoreCase } from 'src/utils/evm/on-chain/common.utils';
import { isDefined } from 'src/utils/is-defined';

import { ActivityOperKindEnum, ActivityOperTransferType, ActivityStatus, EvmActivity, EvmOperation } from '../types';
import { throwIfAborted } from '../utils';

import { EvmOperationKind, getEvmOperationKind } from './operation-kind';
import { getApprovalLogOwnerAddress, isApprovalLog, parseApprovalLog } from './parse-approval';

export interface EtherlinkActivitiesPageParams {
  operationsPageParams: EtherlinkAccountTransactionsPageParams | nullish;
  tokensTransfersPageParams: EtherlinkTokenTransfersPageParams | nullish;
}

export interface EtherlinkActivitiesPage {
  activities: EvmActivity[];
  nextPageParams: EtherlinkActivitiesPageParams | null;
  oldestRawTimestamp: number | null;
}

const EVM_ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

const MAX_CACHED_ACTIVITIES = 500;

const parsedActivitiesCache = new Map<string, EvmActivity>();

// The key includes the slice's log-index range: a transaction split across page boundaries must not
// freeze in its partial form - a different slice misses the cache, re-parses and merges downstream
const toCacheKey = (chainId: number, hash: string, transfers: EtherlinkTokenTransfer[]) => {
  const logIndexes = transfers.map(({ log_index: logIndex }) => logIndex);
  const range = logIndexes.length > 0 ? `${Math.min(...logIndexes)}-${Math.max(...logIndexes)}` : '';

  return `${chainId}:${hash.toLowerCase()}:${range}`;
};

const putCachedActivity = (chainId: number, transfers: EtherlinkTokenTransfer[], activity: EvmActivity) => {
  const key = toCacheKey(chainId, activity.hash, transfers);
  parsedActivitiesCache.delete(key);
  parsedActivitiesCache.set(key, activity);

  while (parsedActivitiesCache.size > MAX_CACHED_ACTIVITIES) {
    const oldestKey = parsedActivitiesCache.keys().next().value;

    if (oldestKey === undefined) {
      break;
    }

    parsedActivitiesCache.delete(oldestKey);
  }
};

export const resetEvmActivityCache = () => parsedActivitiesCache.clear();

const INTEGER_REGEX = /^-?\d+$/;

const toBigInt = (value: string) => (INTEGER_REGEX.test(value) ? BigInt(value) : 0n);

const fetchAllTxLogs = async (txHash: string, signal?: AbortSignal) => {
  const items: EtherlinkLog[] = [];
  let pageParams: EtherlinkTransactionLogsPageParams | undefined = undefined;

  do {
    throwIfAborted(signal);
    const page = await fetchGetTransactionLogs(txHash, pageParams, signal);
    items.push(...page.items);
    pageParams = page.next_page_params ?? undefined;
  } while (isDefined(pageParams));

  return items;
};

const fetchAllTxInternalTransactions = async (txHash: string, signal?: AbortSignal) => {
  const items: EtherlinkInternalTransaction[] = [];
  let pageParams: EtherlinkInternalTransactionsPageParams | undefined = undefined;

  do {
    throwIfAborted(signal);
    const page = await fetchGetTransactionInternalTransactions(txHash, pageParams, signal);
    items.push(...page.items);
    pageParams = page.next_page_params ?? undefined;
  } while (isDefined(pageParams));

  return items;
};

const fetchAllTxTokenTransfers = async (txHash: string, signal?: AbortSignal) => {
  const items: EtherlinkTokenTransfer[] = [];
  let pageParams: EtherlinkTokenTransfersPageParams | undefined = undefined;

  do {
    throwIfAborted(signal);
    const page = await fetchGetTransactionTokenTransfers(txHash, pageParams, signal);
    items.push(...page.items);
    pageParams = page.next_page_params ?? undefined;
  } while (isDefined(pageParams));

  return items;
};

const makeGasAsset = (chainId: number) => {
  const currency = DEFAULT_EVM_CHAINS_SPECS.find(specs => specs.chainId === chainId)?.currency ?? DEFAULT_EVM_CURRENCY;

  return { contract: currency.address, decimals: currency.decimals, nft: false, symbol: currency.symbol };
};

const makeGasTokenTransfer = (
  operation: Pick<EtherlinkTransaction, 'from' | 'to' | 'value'> & { logIndex: number },
  chainId: number,
  accountAddress: string
): EvmOperation => {
  const { from, to, value, logIndex } = operation;
  const isSending = equalsIgnoreCase(from.hash, accountAddress);

  return {
    kind: ActivityOperKindEnum.transfer,
    fromAddress: from.hash,
    toAddress: to?.hash ?? EVM_ZERO_ADDRESS,
    asset: { ...makeGasAsset(chainId), amountSigned: isSending ? `-${value}` : value },
    logIndex,
    type: isSending ? ActivityOperTransferType.sendToAccount : ActivityOperTransferType.receiveFromAccount
  };
};

const parseTokenTransfer = (transfer: EtherlinkTokenTransfer, accountAddress: string): EvmOperation => {
  const { from, to, log_index: logIndex } = transfer;
  const isSending = equalsIgnoreCase(from.hash, accountAddress);
  const amountNotSigned = isErc721TokenTransfer(transfer) ? '1' : transfer.total.value;
  const amountSigned = isSending ? `-${amountNotSigned}` : amountNotSigned;

  if (isErc20TokenTransfer(transfer)) {
    const { address_hash: address, decimals, symbol, icon_url: iconURL } = transfer.token;

    return {
      kind: ActivityOperKindEnum.transfer,
      fromAddress: from.hash,
      toAddress: to.hash,
      asset: {
        contract: address,
        amountSigned,
        decimals: decimals == null ? undefined : Number(decimals),
        nft: false,
        symbol: symbol ?? undefined,
        iconURL: iconURL ?? undefined
      },
      logIndex,
      type: isSending ? ActivityOperTransferType.sendToAccount : ActivityOperTransferType.receiveFromAccount
    };
  }

  const { total } = transfer;
  const instance = total.token_instance;
  const {
    address_hash: address,
    symbol,
    decimals: rawDecimals,
    icon_url: iconFallback
  } = instance?.token ?? transfer.token;

  return {
    kind: ActivityOperKindEnum.transfer,
    fromAddress: from.hash,
    toAddress: to.hash,
    asset: {
      contract: address,
      tokenId: instance?.id ?? total.token_id,
      amountSigned,
      decimals: rawDecimals == null ? 0 : Number(rawDecimals),
      nft: true,
      symbol: symbol ?? undefined,
      iconURL: instance?.metadata?.image ?? iconFallback ?? undefined
    },
    logIndex,
    type: isSending ? ActivityOperTransferType.sendToAccount : ActivityOperTransferType.receiveFromAccount
  };
};

const getApprovalsForAccount = async (tx: EtherlinkTransaction, accountAddress: string, signal?: AbortSignal) => {
  const logEntries = await fetchAllTxLogs(tx.hash, signal);

  return logEntries
    .map(({ topics, index, data, address, decoded }) => ({
      topics: topics.filter(isDefined),
      logIndex: index,
      data,
      address: address.hash,
      decoded
    }))
    .filter(
      ({ decoded, topics }) =>
        isApprovalLog({ decoded, topics }) && equalsIgnoreCase(getApprovalLogOwnerAddress(topics), accountAddress)
    )
    .map(({ topics, logIndex, data, address }) => parseApprovalLog({ topics, logIndex, data, address }));
};

const toUnorderedOperations = async (
  tx: EtherlinkTransaction,
  tokensTransfers: EtherlinkTokenTransfer[],
  nativeCoinDelta: string,
  accountAddress: string,
  chainId: number,
  signal?: AbortSignal
): Promise<EvmOperation[]> => {
  const { to, position, raw_input: rawInput, value, status } = tx;
  const toAddress = to?.hash;
  const parsedTokensTransfers = tokensTransfers.map(transfer => parseTokenTransfer(transfer, accountAddress));

  const operationKind = getEvmOperationKind({ data: rawInput, to: toAddress, value: toBigInt(value) });
  const gasTokenTransfer = makeGasTokenTransfer({ ...tx, logIndex: position }, chainId, accountAddress);
  const fallbackOperations: EvmOperation[] = [
    {
      kind: ActivityOperKindEnum.interaction,
      logIndex: position,
      withAddress: toAddress,
      asset: Number(value) > 0 ? { ...makeGasAsset(chainId), amountSigned: `-${value}` } : undefined
    }
  ];

  switch (operationKind) {
    case EvmOperationKind.DeployContract:
      return parsedTokensTransfers.concat(fallbackOperations);
    case EvmOperationKind.Send:
    case EvmOperationKind.Mint:
      if (rawInput === '0x') {
        return [gasTokenTransfer];
      }

      return parsedTokensTransfers.length
        ? parsedTokensTransfers.concat(Number(value) ? gasTokenTransfer : [])
        : fallbackOperations;
    case EvmOperationKind.Approval: {
      const approvals = await getApprovalsForAccount(tx, accountAddress, signal);

      return approvals.length ? approvals : fallbackOperations;
    }
    case EvmOperationKind.ApprovalForAll:
      return [{ kind: ActivityOperKindEnum.interaction, logIndex: position, withAddress: toAddress }];
    default: {
      if (status !== 'ok') {
        return fallbackOperations;
      }

      const hasGasTokenReceiveOperations = toBigInt(nativeCoinDelta) + toBigInt(value) > 0n;

      if (!tokensTransfers.length && !hasGasTokenReceiveOperations) {
        const approvalOperations = await getApprovalsForAccount(tx, accountAddress, signal);

        return approvalOperations.length ? approvalOperations : fallbackOperations;
      }

      let gasTokenReceiveOperations: EvmOperation[] = [];

      if (hasGasTokenReceiveOperations) {
        const internalOperations = await fetchAllTxInternalTransactions(tx.hash, signal);
        gasTokenReceiveOperations = internalOperations
          .filter(operation => equalsIgnoreCase(operation.to?.hash, accountAddress) && Number(operation.value) > 0)
          .map(operation => makeGasTokenTransfer({ ...operation, logIndex: operation.index }, chainId, accountAddress));
      }

      return parsedTokensTransfers.concat(gasTokenReceiveOperations).concat(Number(value) ? gasTokenTransfer : []);
    }
  }
};

interface EtherlinkHistoryData {
  explicitOperations: EtherlinkTransaction[];
  explicitOperationsNextPageParams: EtherlinkAccountTransactionsPageParams | nullish;
  coinBalanceHistoryItems: EtherlinkCoinBalanceHistoryItem[];
  tokensTransfers: EtherlinkTokenTransfer[];
  tokensTransfersNextPageParams: EtherlinkTokenTransfersPageParams | nullish;
}

const getEtherlinkHistoryData = async (
  currentOlderThan: EtherlinkActivitiesPageParams | undefined,
  accountAddress: string,
  signal?: AbortSignal
): Promise<EtherlinkHistoryData> => {
  const { operationsPageParams, tokensTransfersPageParams } = currentOlderThan ?? {};

  let explicitOperations: EtherlinkTransaction[] = [];
  let explicitOperationsNextPageParams: EtherlinkAccountTransactionsPageParams | nullish = null;
  let coinBalanceHistoryItems: EtherlinkCoinBalanceHistoryItem[] = [];

  if (operationsPageParams !== null) {
    throwIfAborted(signal);
    const operationsPage = await fetchGetAccountTransactions(accountAddress, operationsPageParams, signal);
    explicitOperations = operationsPage.items;
    explicitOperationsNextPageParams = operationsPage.next_page_params;

    throwIfAborted(signal);
    const coinBalanceHistoryPage = await fetchGetAccountCoinBalanceHistory(
      accountAddress,
      operationsPageParams && {
        block_number: operationsPageParams.block_number,
        items_count: operationsPageParams.items_count
      },
      signal
    );
    coinBalanceHistoryItems = coinBalanceHistoryPage.items;
  }

  let tokensTransfers: EtherlinkTokenTransfer[] = [];
  let tokensTransfersNextPageParams: EtherlinkTokenTransfersPageParams | nullish = null;

  if (tokensTransfersPageParams !== null) {
    throwIfAborted(signal);
    const tokensTransfersPage = await fetchGetAccountTokenTransfers(accountAddress, tokensTransfersPageParams, signal);
    tokensTransfers = tokensTransfersPage.items;
    tokensTransfersNextPageParams = tokensTransfersPage.next_page_params;
  }

  const lastTransfer = tokensTransfers.at(-1);
  const lastOperation = explicitOperations.at(-1);

  if (!explicitOperationsNextPageParams || !tokensTransfersNextPageParams) {
    return {
      explicitOperations,
      explicitOperationsNextPageParams,
      coinBalanceHistoryItems,
      tokensTransfers,
      tokensTransfersNextPageParams
    };
  }

  if (explicitOperationsNextPageParams.block_number <= tokensTransfersNextPageParams.block_number && lastTransfer) {
    const lastTransferHash = lastTransfer.transaction_hash;
    const lastTxTokensTransfers = await fetchAllTxTokenTransfers(lastTransferHash, signal);
    tokensTransfers = tokensTransfers
      .filter(({ transaction_hash: txHash }) => txHash !== lastTransferHash)
      .concat(
        lastTxTokensTransfers
          .filter(({ from, to }) => [from, to].some(({ hash }) => equalsIgnoreCase(hash, accountAddress)))
          .sort(({ log_index: aLogIndex }, { log_index: bLogIndex }) => bLogIndex - aLogIndex)
      );

    const lastRealignedTransfer = tokensTransfers.at(-1);

    if (lastRealignedTransfer) {
      const boundaryBlockNumber = lastRealignedTransfer.block_number;
      tokensTransfersNextPageParams = { block_number: boundaryBlockNumber, index: lastRealignedTransfer.log_index };

      explicitOperations = explicitOperations.filter(
        ({ block_number: blockNumber }) => blockNumber >= boundaryBlockNumber
      );
      coinBalanceHistoryItems = coinBalanceHistoryItems.filter(
        ({ block_number: blockNumber }) => blockNumber >= boundaryBlockNumber
      );

      const lastRemainingOperation = explicitOperations.at(-1);
      explicitOperationsNextPageParams = lastRemainingOperation
        ? {
            block_number: lastRemainingOperation.block_number,
            fee: lastRemainingOperation.fee?.value ?? '0',
            hash: lastRemainingOperation.hash,
            index: lastRemainingOperation.position,
            inserted_at: lastRemainingOperation.timestamp,
            // Only grows, never resets: the endpoint's own cursors count all items seen so far
            items_count: (operationsPageParams?.items_count ?? 0) + explicitOperations.length,
            value: lastRemainingOperation.value
          }
        : // Reuse the previous cursor (page 1 has none) - the next call retries this page while the other endpoint advances
          operationsPageParams;
    }
  } else if (
    explicitOperationsNextPageParams.block_number > tokensTransfersNextPageParams.block_number &&
    lastOperation
  ) {
    const lastOperationBlockNumber = lastOperation.block_number;
    const earliestBlockNumberOperationsHashes = new Set(
      explicitOperations
        .filter(({ block_number: blockNumber }) => blockNumber === lastOperationBlockNumber)
        .map(({ hash }) => hash.toLowerCase())
    );
    tokensTransfers = tokensTransfers.filter(
      ({ block_number: blockNumber, transaction_hash: txHash }) =>
        blockNumber > lastOperationBlockNumber || earliestBlockNumberOperationsHashes.has(txHash.toLowerCase())
    );

    const lastRemainingTransfer = tokensTransfers.at(-1);
    tokensTransfersNextPageParams = lastRemainingTransfer
      ? { block_number: lastRemainingTransfer.block_number, index: lastRemainingTransfer.log_index }
      : tokensTransfersPageParams;
  }

  return {
    explicitOperations,
    explicitOperationsNextPageParams,
    coinBalanceHistoryItems,
    tokensTransfers,
    tokensTransfersNextPageParams
  };
};

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

  explicitOperations.forEach((op, i) => {
    const fee = op.fee?.value ?? '0';
    const { delta: nativeCoinDeltaWithFee } = coinBalanceHistoryItems[i] ?? { delta: `-${fee}` };

    rawActivitiesByHash.set(op.hash, {
      tx: op,
      tokensTransfers: [],
      nativeCoinDelta: (toBigInt(nativeCoinDeltaWithFee) + toBigInt(fee)).toString()
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

  // The extra per-transaction requests run in parallel; the shared rate limiter still controls their speed
  const parsedActivities = await Promise.all(
    Array.from(rawActivitiesByHash, async ([hash, { tx, tokensTransfers: txTokensTransfers, nativeCoinDelta }]) => {
      throwIfAborted(signal);

      // Failed transactions are dropped from the feed
      if (tx?.status === 'error') {
        return undefined;
      }

      const cachedActivity = parsedActivitiesCache.get(toCacheKey(chainId, hash, txTokensTransfers));

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
        operationsCount: operations.length,
        addedAt: new Date(shellSource.timestamp).getTime(),
        status: ActivityStatus.applied,
        blockHeight,
        index: tx?.position ?? null,
        fee: tx ? tx.fee?.value ?? '0' : null,
        value: tx?.value ?? null
      };

      putCachedActivity(chainId, txTokensTransfers, activity);

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
