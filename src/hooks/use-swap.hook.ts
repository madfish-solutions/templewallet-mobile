import BigNumber from 'bignumber.js';
import { useCallback } from 'react';

import { Route3SwapHops, Route3LiquidityBakingHops, Route3Token } from 'src/interfaces/route3.interface';
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
      expectedReceivedAtomic: BigNumber,
      slippageRatio: number,
      hops: Route3SwapHops | Route3LiquidityBakingHops
    ) =>
      getSwapTransferParams(
        fromRoute3Token,
        toRoute3Token,
        inputAmountAtomic,
        expectedReceivedAtomic,
        slippageRatio,
        hops,
        tezos,
        publicKeyHash
      ),
    [tezos, publicKeyHash]
  );
};
