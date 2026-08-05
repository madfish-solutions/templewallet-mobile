import axios from 'axios';
import PQueue from 'p-queue';

import { refetchOnce429 } from '../utils';

import { ETHERLINK_API_BASE_URL } from './constants';
import {
  EtherlinkAccountCoinBalanceHistoryResponse,
  EtherlinkAccountInfo,
  EtherlinkAccountNftsPageParams,
  EtherlinkAccountNftsResponse,
  EtherlinkAccountTokenTransfersResponse,
  EtherlinkAccountTransactionsPageParams,
  EtherlinkAccountTransactionsResponse,
  EtherlinkAddressNftInstance,
  EtherlinkCoinBalanceHistoryPageParams,
  EtherlinkInternalTransactionsPageParams,
  EtherlinkTokenBalance,
  EtherlinkTokenInfo,
  EtherlinkTokenTransfersPageParams,
  EtherlinkTransactionInternalTransactionsResponse,
  EtherlinkTransactionLogsPageParams,
  EtherlinkTransactionLogsResponse,
  EtherlinkTransactionTokenTransfersResponse
} from './types';

export {
  isErc20TokenBalance,
  isEtherlinkCollectibleTokenType,
  isErc20TokenTransfer,
  isErc721TokenTransfer
} from './types';
export type {
  EtherlinkTokenType,
  EtherlinkTokenInfo,
  EtherlinkAddressNftInstance,
  EtherlinkTransaction,
  EtherlinkTokenTransfer,
  EtherlinkInternalTransaction,
  EtherlinkLog,
  EtherlinkDecodedInput,
  EtherlinkCoinBalanceHistoryItem,
  EtherlinkAccountTransactionsPageParams,
  EtherlinkTokenTransfersPageParams,
  EtherlinkTransactionLogsPageParams,
  EtherlinkInternalTransactionsPageParams,
  EtherlinkCoinBalanceHistoryPageParams
} from './types';

const api = axios.create({ baseURL: ETHERLINK_API_BASE_URL });

const apiQueue = new PQueue({ intervalCap: 170, interval: 60_000, carryoverConcurrencyCount: true, concurrency: 10 });

interface FetchGetParams<P extends object> {
  endpoint: string;
  pageParams?: P;
  signal?: AbortSignal;
}

async function fetchGet<R, P extends object = never>({ endpoint, pageParams, signal }: FetchGetParams<P>) {
  const response = await apiQueue.add(() => api.get<R>(endpoint, { params: pageParams, signal }), { signal });

  return response.data;
}

export const fetchGetAccountInfo = (address: string) =>
  fetchGet<EtherlinkAccountInfo, never>({ endpoint: `/addresses/${address}` });

export const fetchGetTokensBalances = (address: string) =>
  fetchGet<EtherlinkTokenBalance[], never>({ endpoint: `/addresses/${address}/token-balances` });

export const fetchGetTokenInfo = (contract: string) =>
  fetchGet<EtherlinkTokenInfo, never>({ endpoint: `/tokens/${contract}` });

const fetchGetAccountNfts = (address: string, pageParams?: EtherlinkAccountNftsPageParams) =>
  fetchGet<EtherlinkAccountNftsResponse, EtherlinkAccountNftsPageParams>({
    endpoint: `/addresses/${address}/nft`,
    pageParams
  });

export const fetchAllAccountNfts = async (address: string) => {
  let nextPageParams: EtherlinkAccountNftsPageParams | undefined;
  let allItems: EtherlinkAddressNftInstance[] = [];

  do {
    const { items, next_page_params: newNextPageParams } = await refetchOnce429(() =>
      fetchGetAccountNfts(address, nextPageParams)
    );
    allItems = allItems.concat(items);
    nextPageParams = newNextPageParams ?? undefined;
  } while (nextPageParams != null);

  return allItems;
};

export const fetchGetAccountTransactions = (
  address: string,
  pageParams?: EtherlinkAccountTransactionsPageParams,
  signal?: AbortSignal
) =>
  refetchOnce429(() =>
    fetchGet<EtherlinkAccountTransactionsResponse, EtherlinkAccountTransactionsPageParams>({
      endpoint: `/addresses/${address}/transactions`,
      pageParams,
      signal
    })
  );

export const fetchGetAccountTokenTransfers = (
  address: string,
  pageParams?: EtherlinkTokenTransfersPageParams,
  signal?: AbortSignal
) =>
  refetchOnce429(() =>
    fetchGet<EtherlinkAccountTokenTransfersResponse, EtherlinkTokenTransfersPageParams>({
      endpoint: `/addresses/${address}/token-transfers`,
      pageParams,
      signal
    })
  );

export const fetchGetAccountCoinBalanceHistory = (
  address: string,
  pageParams?: EtherlinkCoinBalanceHistoryPageParams,
  signal?: AbortSignal
) =>
  refetchOnce429(() =>
    fetchGet<EtherlinkAccountCoinBalanceHistoryResponse, EtherlinkCoinBalanceHistoryPageParams>({
      endpoint: `/addresses/${address}/coin-balance-history`,
      pageParams,
      signal
    })
  );

export const fetchGetTransactionLogs = (
  txHash: string,
  pageParams?: EtherlinkTransactionLogsPageParams,
  signal?: AbortSignal
) =>
  refetchOnce429(() =>
    fetchGet<EtherlinkTransactionLogsResponse, EtherlinkTransactionLogsPageParams>({
      endpoint: `/transactions/${txHash}/logs`,
      pageParams,
      signal
    })
  );

export const fetchGetTransactionInternalTransactions = (
  txHash: string,
  pageParams?: EtherlinkInternalTransactionsPageParams,
  signal?: AbortSignal
) =>
  refetchOnce429(() =>
    fetchGet<EtherlinkTransactionInternalTransactionsResponse, EtherlinkInternalTransactionsPageParams>({
      endpoint: `/transactions/${txHash}/internal-transactions`,
      pageParams,
      signal
    })
  );

export const fetchGetTransactionTokenTransfers = (
  txHash: string,
  pageParams?: EtherlinkTokenTransfersPageParams,
  signal?: AbortSignal
) =>
  refetchOnce429(() =>
    fetchGet<EtherlinkTransactionTokenTransfersResponse, EtherlinkTokenTransfersPageParams>({
      endpoint: `/transactions/${txHash}/token-transfers`,
      pageParams,
      signal
    })
  );
