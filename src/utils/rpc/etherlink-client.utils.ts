import memoizee from 'memoizee';
import { Chain, createPublicClient, fallback, http, PublicClient, Transport } from 'viem';
import { etherlink } from 'viem/chains';

import { FALLBACK_ETHERLINK_RPC_LIST } from './rpc-list';

export type ChainPublicClient = PublicClient<Transport, Pick<Chain, 'id' | 'name' | 'nativeCurrency' | 'rpcUrls'>>;

export const getViemPublicClient = memoizee((): ChainPublicClient => {
  return createPublicClient({
    chain: etherlink,
    transport: fallback(
      FALLBACK_ETHERLINK_RPC_LIST.map(url => http(url, { retryCount: 0 })),
      { retryCount: 0 }
    ),
    batch: { multicall: { batchSize: 64, wait: 20 } }
  });
});
