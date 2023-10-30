import { ChainIds } from '@taquito/taquito';
import { useMemo } from 'react';

import { useSelectedRpcUrlSelector } from '../store/settings/settings-selectors';
import { getNetworkGasTokenMetadata, isDcpNode } from '../utils/network.utils';

import { useChainId } from './use-chain-id.hook';

export const useNetworkInfo = () => {
  const selectedRpcUrl = useSelectedRpcUrlSelector();
  const chainId = useChainId();

  return useMemo(() => {
    const nodeIsDcp = isDcpNode(selectedRpcUrl);

    return {
      isTezosMainnet: chainId === ChainIds.MAINNET,
      isTezosNode: !nodeIsDcp,
      isDcpNode: nodeIsDcp,
      metadata: getNetworkGasTokenMetadata(selectedRpcUrl)
    };
  }, [selectedRpcUrl, chainId]);
};
