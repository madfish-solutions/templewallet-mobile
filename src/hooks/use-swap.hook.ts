import { BigNumber } from 'bignumber.js';
import { useCallback } from 'react';

import { Route3LiquidityBakingChains, Route3SwapChains, Route3Token } from 'src/interfaces/route3.interface';
import { useCurrentAccountPkhSelector } from 'src/store/wallet/wallet-selectors';
import { getSwapTransferParams } from 'src/utils/swap.utils';

import { useReadOnlyTezosToolkit } from './use-read-only-tezos-toolkit.hook';

export const useSwap = () => {
  const publicKeyHash = useCurrentAccountPkhSelector();
  const tezos = useReadOnlyTezosToolkit();

  return useCallback(
    async (
      fromRoute3Token: Route3Token,
      toRoute3Token: Route3Token,
      inputAmountAtomic: BigNumber,
      minimumReceivedAtomic: BigNumber,
      chains: Route3SwapChains | Route3LiquidityBakingChains
    ) =>
      getSwapTransferParams(
        fromRoute3Token,
        toRoute3Token,
        inputAmountAtomic,
        minimumReceivedAtomic,
        chains,
        tezos,
        publicKeyHash
      ),
    [tezos, publicKeyHash]
  );
};
