import { useMemo } from 'react';

import { getViemPublicClient } from 'src/utils/rpc/evm-client.utils';
import { ETHERLINK_MAINNET_CHAIN_ID } from 'src/utils/rpc/rpc-list';

import { useEvmChain } from './use-evm-chains.hook';

export const useEtherlinkPublicClient = () => {
  const { activeRpc, chainId } = useEvmChain(ETHERLINK_MAINNET_CHAIN_ID)!;

  // TODO: Add preferredRpcUrl when choosing RPC node becomes available
  return useMemo(
    () => getViemPublicClient({ rpcBaseURL: activeRpc.rpcBaseURL, chainId }),
    [activeRpc.rpcBaseURL, chainId]
  );
};
