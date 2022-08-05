import { useMemo } from 'react';

import { useSelectedRpcUrlSelector } from '../store/settings/settings-selectors';
import { getNetworkGasTokenMetadata, isDcpNode } from '../utils/network.utils';

export const useNetworkInfo = () => {
  const selectedRpcUrl = useSelectedRpcUrlSelector();

  return useMemo(
    () => ({
      isTezosNode: !isDcpNode(selectedRpcUrl),
      metadata: getNetworkGasTokenMetadata(selectedRpcUrl)
    }),
    [selectedRpcUrl]
  );
};
