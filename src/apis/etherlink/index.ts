import axios from 'axios';

import { ConcurrencyLimiter } from 'src/utils/concurrency-limiter.utils';

import { refetchOnce429 } from '../utils';

import { ETHERLINK_API_BASE_URL } from './constants';
import {
  EtherlinkAccountInfo,
  EtherlinkAccountNftsPageParams,
  EtherlinkAccountNftsResponse,
  EtherlinkAddressNftInstance,
  EtherlinkTokenBalance,
  EtherlinkTokenInfo
} from './types';

export { isErc20TokenBalance, isEtherlinkCollectibleTokenType } from './types';
export type { EtherlinkTokenType, EtherlinkTokenInfo, EtherlinkAddressNftInstance } from './types';

const api = axios.create({ baseURL: ETHERLINK_API_BASE_URL });

const apiConcurrencyLimiter = new ConcurrencyLimiter(10);

interface FetchGetParams<P extends object> {
  endpoint: string;
  pageParams?: P;
}

async function fetchGet<R, P extends object = never>({ endpoint, pageParams }: FetchGetParams<P>) {
  const release = await apiConcurrencyLimiter.acquire();
  setTimeout(release, 1000);

  const { data } = await api.get<R>(endpoint, {
    params: pageParams
  });

  return data;
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
