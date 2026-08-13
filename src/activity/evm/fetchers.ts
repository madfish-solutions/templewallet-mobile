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
  fetchGetTransactionTokenTransfers
} from 'src/apis/etherlink';
import { equalsIgnoreCase } from 'src/utils/evm/on-chain/common.utils';
import { isDefined } from 'src/utils/is-defined';

import { throwIfAborted } from '../utils';

export interface EtherlinkActivitiesPageParams {
  operationsPageParams: EtherlinkAccountTransactionsPageParams | nullish;
  tokensTransfersPageParams: EtherlinkTokenTransfersPageParams | nullish;
}

const fetchAllPages = async <T, P extends object>(
  fetchPage: (pageParams: P | undefined, signal?: AbortSignal) => Promise<{ items: T[]; next_page_params: P | null }>,
  signal?: AbortSignal
) => {
  const items: T[] = [];
  let pageParams: P | undefined;

  do {
    throwIfAborted(signal);
    const page = await fetchPage(pageParams, signal);
    items.push(...page.items);
    pageParams = page.next_page_params ?? undefined;
  } while (isDefined(pageParams));

  return items;
};

export const fetchAllTxLogs = (txHash: string, signal?: AbortSignal) =>
  fetchAllPages<EtherlinkLog, EtherlinkTransactionLogsPageParams>(
    (pageParams, pageSignal) => fetchGetTransactionLogs(txHash, pageParams, pageSignal),
    signal
  );

export const fetchAllTxInternalTransactions = (txHash: string, signal?: AbortSignal) =>
  fetchAllPages<EtherlinkInternalTransaction, EtherlinkInternalTransactionsPageParams>(
    (pageParams, pageSignal) => fetchGetTransactionInternalTransactions(txHash, pageParams, pageSignal),
    signal
  );

const fetchAllTxTokenTransfers = (txHash: string, signal?: AbortSignal) =>
  fetchAllPages<EtherlinkTokenTransfer, EtherlinkTokenTransfersPageParams>(
    (pageParams, pageSignal) => fetchGetTransactionTokenTransfers(txHash, pageParams, pageSignal),
    signal
  );

export interface AlignedEtherlinkPage {
  explicitOperations: EtherlinkTransaction[];
  explicitOperationsNextPageParams: EtherlinkAccountTransactionsPageParams | nullish;
  coinBalanceHistoryItems: EtherlinkCoinBalanceHistoryItem[];
  tokensTransfers: EtherlinkTokenTransfer[];
  tokensTransfersNextPageParams: EtherlinkTokenTransfersPageParams | nullish;
}

interface AlignEtherlinkPagesInput {
  accountAddress: string;
  explicitOperations: EtherlinkTransaction[];
  explicitOperationsNextPageParams: EtherlinkAccountTransactionsPageParams;
  coinBalanceHistoryItems: EtherlinkCoinBalanceHistoryItem[];
  tokensTransfers: EtherlinkTokenTransfer[];
  tokensTransfersNextPageParams: EtherlinkTokenTransfersPageParams;
  operationsPageParams: EtherlinkAccountTransactionsPageParams | nullish;
  tokensTransfersPageParams: EtherlinkTokenTransfersPageParams | nullish;
  /** All transfers of the boundary transaction, pre-fetched when the transfers page ends above the operations page */
  lastTxTokensTransfers: EtherlinkTokenTransfer[] | undefined;
}

// Trims both endpoints' pages to a shared block boundary and rebuilds their cursors, so the next call resumes both together
const alignEtherlinkPages = (input: AlignEtherlinkPagesInput): AlignedEtherlinkPage => {
  const { accountAddress, operationsPageParams, tokensTransfersPageParams, lastTxTokensTransfers } = input;
  let { explicitOperations, coinBalanceHistoryItems, tokensTransfers } = input;
  let explicitOperationsNextPageParams: EtherlinkAccountTransactionsPageParams | nullish =
    input.explicitOperationsNextPageParams;
  let tokensTransfersNextPageParams: EtherlinkTokenTransfersPageParams | nullish = input.tokensTransfersNextPageParams;

  const lastTransfer = tokensTransfers.at(-1);
  const lastOperation = explicitOperations.at(-1);

  if (lastTxTokensTransfers && lastTransfer) {
    const lastTransferHash = lastTransfer.transaction_hash;
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
    input.explicitOperationsNextPageParams.block_number > input.tokensTransfersNextPageParams.block_number &&
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

export const getEtherlinkHistoryData = async (
  currentOlderThan: EtherlinkActivitiesPageParams | undefined,
  accountAddress: string,
  signal?: AbortSignal
): Promise<AlignedEtherlinkPage> => {
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

  if (!explicitOperationsNextPageParams || !tokensTransfersNextPageParams) {
    return {
      explicitOperations,
      explicitOperationsNextPageParams,
      coinBalanceHistoryItems,
      tokensTransfers,
      tokensTransfersNextPageParams
    };
  }

  const lastTxTokensTransfers =
    explicitOperationsNextPageParams.block_number <= tokensTransfersNextPageParams.block_number && lastTransfer
      ? await fetchAllTxTokenTransfers(lastTransfer.transaction_hash, signal)
      : undefined;

  return alignEtherlinkPages({
    accountAddress,
    explicitOperations,
    explicitOperationsNextPageParams,
    coinBalanceHistoryItems,
    tokensTransfers,
    tokensTransfersNextPageParams,
    operationsPageParams,
    tokensTransfersPageParams,
    lastTxTokensTransfers
  });
};
