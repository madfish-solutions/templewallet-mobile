import axios from 'axios';

import { ConcurrencyLimiter } from 'src/utils/concurrency-limiter.utils';

import { ETHERLINK_API_BASE_URL } from './constants';
import {
  EtherlinkAccountInfo,
  EtherlinkAccountNftsPageParams,
  EtherlinkAccountNftsResponse,
  EtherlinkAddressNftInstance,
  EtherlinkTokenBalance,
  EtherlinkTokenInfo
} from './types';

export { isErc20TokenBalance } from './types';
export type { EtherlinkTokenType } from './types';

const api = axios.create({ baseURL: ETHERLINK_API_BASE_URL });

const apiConcurrencyLimiter = new ConcurrencyLimiter(10);

interface FetchGetParams<P extends object> {
  endpoint: string;
  pageParams?: P;
  signal?: AbortSignal;
}

async function fetchGet<R, P extends object = never>({ endpoint, pageParams, signal }: FetchGetParams<P>) {
  const release = await apiConcurrencyLimiter.acquire();
  setTimeout(release, 1000);

  const { data } = await api.get<R>(endpoint, {
    params: pageParams,
    signal
  });

  return data;
}

export const fetchGetAccountInfo = (address: string, signal?: AbortSignal) =>
  fetchGet<EtherlinkAccountInfo, never>({ endpoint: `/addresses/${address}`, signal });

export const fetchGetTokensBalances = (address: string, signal?: AbortSignal) =>
  fetchGet<EtherlinkTokenBalance[], never>({ endpoint: `/addresses/${address}/token-balances`, signal });

export const fetchGetTokenInfo = (contract: string, signal?: AbortSignal) =>
  fetchGet<EtherlinkTokenInfo, never>({ endpoint: `/tokens/${contract}`, signal });

const fetchGetAccountNfts = (address: string, pageParams?: EtherlinkAccountNftsPageParams, signal?: AbortSignal) =>
  fetchGet<EtherlinkAccountNftsResponse, EtherlinkAccountNftsPageParams>({
    endpoint: `/addresses/${address}/nft`,
    pageParams,
    signal
  });

export const fetchAllAccountNfts = async (address: string, signal?: AbortSignal) => {
  let nextPageParams: EtherlinkAccountNftsPageParams | undefined;
  let allItems: EtherlinkAddressNftInstance[] = [];

  do {
    const { items, next_page_params: newNextPageParams } = await fetchGetAccountNfts(address, nextPageParams, signal);
    allItems = allItems.concat(items);
    nextPageParams = newNextPageParams ?? undefined;
  } while (nextPageParams != null);

  return allItems;
};
