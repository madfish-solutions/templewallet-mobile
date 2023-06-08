import { ChainIds } from '@taquito/taquito';
import { useMemo } from 'react';

import { useSelectedRpcUrlSelector } from '../store/settings/settings-selectors';
import { getNetworkGasTokenMetadata, isDcpNode } from '../utils/network.utils';
import { useChainId } from './use-chain-id.hook';

export const useNetworkInfo = () => {
  const selectedRpcUrl = useSelectedRpcUrlSelector();
  const chainId = useChainId();

  return useMemo(
    () => ({
      isTezosMainnet: chainId === ChainIds.MAINNET,
      isTezosNode: !isDcpNode(selectedRpcUrl),
      isDcpNode: isDcpNode(selectedRpcUrl),
      metadata: getNetworkGasTokenMetadata(selectedRpcUrl)
    }),
    [selectedRpcUrl, chainId]
  );
};
