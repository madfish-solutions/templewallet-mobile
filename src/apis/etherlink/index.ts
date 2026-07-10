import axios, { AxiosInstance } from 'axios';

import { ConcurrencyLimiter } from 'src/utils/concurrency-limiter.utils';
import { ETHERLINK_MAINNET_CHAIN_ID } from 'src/utils/rpc/rpc-list';

import { ETHERLINK_API_BASE_URLS, EtherlinkChainId } from './constants';
import {
  EtherlinkAccountInfo,
  EtherlinkAccountNftsPageParams,
  EtherlinkAccountNftsResponse,
  EtherlinkAddressNftInstance,
  EtherlinkTokenBalance,
  EtherlinkTokenInfo
} from './types';

export type { EtherlinkChainId } from './constants';
export { isErc20TokenBalance } from './types';
export type { EtherlinkTokenType } from './types';

const apiInstances: Record<EtherlinkChainId, AxiosInstance> = {
  [ETHERLINK_MAINNET_CHAIN_ID]: axios.create({ baseURL: ETHERLINK_API_BASE_URLS[ETHERLINK_MAINNET_CHAIN_ID] })
};

const apiConcurrencyLimiters: Record<EtherlinkChainId, ConcurrencyLimiter> = {
  [ETHERLINK_MAINNET_CHAIN_ID]: new ConcurrencyLimiter(10)
};

interface FetchGetParams<P extends object> {
  chainId: EtherlinkChainId;
  endpoint: string;
  pageParams?: P;
  signal?: AbortSignal;
}

async function fetchGet<R, P extends object = never>({ chainId, endpoint, pageParams, signal }: FetchGetParams<P>) {
  const release = await apiConcurrencyLimiters[chainId].acquire();
  setTimeout(release, 1000);

  const { data } = await apiInstances[chainId].get<R>(endpoint, {
    params: pageParams,
    signal
  });

  return data;
}

export const fetchGetAccountInfo = (chainId: EtherlinkChainId, address: string, signal?: AbortSignal) =>
  fetchGet<EtherlinkAccountInfo, never>({ chainId, endpoint: `/addresses/${address}`, signal });

export const fetchGetTokensBalances = (chainId: EtherlinkChainId, address: string, signal?: AbortSignal) =>
  fetchGet<EtherlinkTokenBalance[], never>({ chainId, endpoint: `/addresses/${address}/token-balances`, signal });

export const fetchGetTokenInfo = (chainId: EtherlinkChainId, contract: string, signal?: AbortSignal) =>
  fetchGet<EtherlinkTokenInfo, never>({ chainId, endpoint: `/tokens/${contract}`, signal });

const fetchGetAccountNfts = (
  chainId: EtherlinkChainId,
  address: string,
  pageParams?: EtherlinkAccountNftsPageParams,
  signal?: AbortSignal
) =>
  fetchGet<EtherlinkAccountNftsResponse, EtherlinkAccountNftsPageParams>({
    chainId,
    endpoint: `/addresses/${address}/nft`,
    pageParams,
    signal
  });

export const fetchAllAccountNfts = async (chainId: EtherlinkChainId, address: string, signal?: AbortSignal) => {
  let nextPageParams: EtherlinkAccountNftsPageParams | undefined;
  let allItems: EtherlinkAddressNftInstance[] = [];

  do {
    const { items, next_page_params: newNextPageParams } = await fetchGetAccountNfts(
      chainId,
      address,
      nextPageParams,
      signal
    );
    allItems = allItems.concat(items);
    nextPageParams = newNextPageParams ?? undefined;
  } while (nextPageParams != null);

  return allItems;
};
