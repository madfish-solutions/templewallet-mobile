import { useMemo } from 'react';

import { getViemPublicClient } from 'src/utils/rpc/evm-client.utils';
import { ETHERLINK_MAINNET_CHAIN_ID } from 'src/utils/rpc/rpc-list';

import { useEvmChain } from './use-evm-chains.hook';

export const useEvmPublicClient = (chainId: number) => {
  const chain = useEvmChain(chainId);

  // TODO: Add preferredRpcUrl when choosing RPC node becomes available
  return useMemo(
    () => (chain ? getViemPublicClient({ rpcBaseURL: chain.activeRpc.rpcBaseURL, chainId }) : undefined),
    [chain, chainId]
  );
};

export const useEtherlinkPublicClient = () => {
  const publicClient = useEvmPublicClient(ETHERLINK_MAINNET_CHAIN_ID);

  if (!publicClient) throw new Error('Etherlink network is unavailable');

  return publicClient;
};
