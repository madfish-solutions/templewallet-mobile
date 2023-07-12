import { BigNumber } from 'bignumber.js';
import { useCallback, useEffect, useState } from 'react';

import { ROUTE3_CONTRACT } from 'src/config/swap';
import { Route3Chain, Route3ContractInterface, Route3Token } from 'src/interfaces/route3.interface';
import { useSelectedAccountSelector } from 'src/store/wallet/wallet-selectors';
import { getSwapTransferParams } from 'src/utils/swap.utils';

import { useReadOnlyTezosToolkit } from './use-read-only-tezos-toolkit.hook';

export const useSwap = () => {
  const selectedAccount = useSelectedAccountSelector();
  const tezos = useReadOnlyTezosToolkit(selectedAccount);
  const [swapContract, setSwapContract] = useState<Route3ContractInterface>();

  useEffect(() => {
    tezos.contract.at<Route3ContractInterface>(ROUTE3_CONTRACT).then(setSwapContract);
  }, [tezos]);

  return useCallback(
    async (
      fromRoute3Token: Route3Token,
      toRoute3Token: Route3Token,
      inputAmountAtomic: BigNumber,
      minimumReceivedAtomic: BigNumber,
      chains: Array<Route3Chain>
    ) => {
      if (swapContract === undefined) {
        return;
      }

      return getSwapTransferParams(
        fromRoute3Token,
        toRoute3Token,
        inputAmountAtomic,
        minimumReceivedAtomic,
        chains,
        tezos,
        selectedAccount.publicKeyHash,
        swapContract
      );
    },
    [tezos, selectedAccount.publicKeyHash, swapContract]
  );
};
