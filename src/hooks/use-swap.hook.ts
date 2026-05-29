import BigNumber from 'bignumber.js';
import { useCallback } from 'react';

import { Route3SwapHops, Route3LiquidityBakingHops, Route3Token } from 'src/interfaces/route3.interface';
import { useAccountAddressForTezos } from 'src/store/wallet/wallet-selectors';
import { getSwapTransferParams } from 'src/utils/swap.utils';

import { DeadEndBoundaryError } from '../components/error-boundary';

import { useReadOnlyTezosToolkit } from './use-read-only-tezos-toolkit.hook';

export const useSwap = () => {
  const tezosAddress = useAccountAddressForTezos();

  if (!tezosAddress) {
    throw new DeadEndBoundaryError();
  }

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
        tezosAddress
      ),
    [tezos, tezosAddress]
  );
};
