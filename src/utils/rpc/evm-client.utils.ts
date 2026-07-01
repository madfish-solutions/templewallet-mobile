import { uniq } from 'lodash-es';
import memoizee from 'memoizee';
import {
  Chain,
  createPublicClient,
  extractChain,
  fallback,
  http,
  HttpTransportConfig,
  PublicClient,
  Transport
} from 'viem';
import * as ViemChains from 'viem/chains';

import { DEFAULT_EVM_CURRENCY } from 'src/token/interfaces/token-metadata.interface';
import { DEFAULT_RPC_INDEX, EvmNetworkEssentials } from 'src/types/networks';

import { isDefined } from '../is-defined';

import { FALLBACK_EVM_RPCS_LIST } from './rpc-list';

type ChainPublicClient = PublicClient<Transport, Pick<Chain, 'id' | 'name' | 'nativeCurrency' | 'rpcUrls'>>;

const DEFAULT_TRANSPORT_CONFIG: HttpTransportConfig = {
  /** Defaults to 3 */
  retryCount: 1,
  /** Defaults to 150 */
  retryDelay: 300
};

const getViemTransportForNetwork = (network: EvmNetworkEssentials): Transport => {
  const fallbacks = FALLBACK_EVM_RPCS_LIST[network.chainId];
  const shouldApplyFallbacks = isDefined(fallbacks) && network.rpcBaseURL === fallbacks[DEFAULT_RPC_INDEX];

  if (!shouldApplyFallbacks) return http(network.rpcBaseURL, DEFAULT_TRANSPORT_CONFIG);

  return fallback(
    uniq([network.rpcBaseURL].concat(fallbacks)).map(url => http(url, { retryCount: 0 })),
    { retryCount: 0 }
  );
};

const getViemChainByChainId = (chainId: number): Chain | undefined =>
  extractChain({ chains: getViemChainsList(), id: chainId });

const getViemChainsList = memoizee(() => Object.values(ViemChains) as Chain[]);

const getCustomViemChain = (network: EvmNetworkEssentials) => ({
  id: network.chainId,
  rpcUrls: {
    default: {
      http: [network.rpcBaseURL]
    }
  },
  name: '',
  nativeCurrency: DEFAULT_EVM_CURRENCY
});

export const getViemPublicClient = memoizee(
  (network: EvmNetworkEssentials): ChainPublicClient => {
    const viemChain = getViemChainByChainId(network.chainId);

    return createPublicClient({
      chain: viemChain ?? getCustomViemChain(network),
      transport: getViemTransportForNetwork(network),
      batch: { multicall: { batchSize: 64, wait: 20 } }
    });
  },
  { normalizer: ([network]) => `${network.chainId}_${network.rpcBaseURL}`, max: 10 }
);
