import { ChainIds } from '@taquito/taquito';
import { useMemo } from 'react';

import { useChainId } from './use-chain-id.hook';

export const useNetworkInfo = () => {
  const chainId = useChainId();

  return useMemo(() => ({ isTezosMainnet: chainId === ChainIds.MAINNET }), [chainId]);
};
