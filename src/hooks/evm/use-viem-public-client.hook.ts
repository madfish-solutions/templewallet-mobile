import { useMemo } from 'react';

import { getViemPublicClient } from 'src/utils/rpc/evm-client.utils';

import { useEvmChain } from './use-evm-chains.hook';

export const useViemPublicClient = (chainId: number) => {
  const chain = useEvmChain(chainId);

  // TODO: Add preferredRpcUrl when choosing RPC node becomes available
  return useMemo(
    () => (chain ? getViemPublicClient({ rpcBaseURL: chain.activeRpc.rpcBaseURL, chainId }) : undefined),
    [chain, chainId]
  );
};
