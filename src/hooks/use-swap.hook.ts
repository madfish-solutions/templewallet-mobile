import { TransferParams } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';
import { useCallback, useEffect, useState } from 'react';

import { Route3Chain, Route3ContractInterface, Route3Token } from 'src/interfaces/route3.interface';
import { ROUTE3_CONTRACT } from 'src/screens/swap/config';
import { useSelectedAccountSelector } from 'src/store/wallet/wallet-selectors';
import { mapToRoute3ExecuteHops } from 'src/utils/route3.util';
import { getTransferPermissions } from 'src/utils/swap-permissions.util';

import { useReadOnlyTezosToolkit } from './use-read-only-tezos-toolkit.hook';

const APP_ID = 2;

export const useSwap = () => {
  const selectedAccount = useSelectedAccountSelector();
  const tezos = useReadOnlyTezosToolkit(selectedAccount);
  const [swapContract, setSwapContract] = useState<Route3ContractInterface>();

  useEffect(() => {
    tezos.contract.at<Route3ContractInterface>(ROUTE3_CONTRACT).then(setSwapContract);
  }, []);

  return useCallback(
    async (
      fromToken: Route3Token,
      toToken: Route3Token,
      inputAmountAtomic: BigNumber,
      minimumReceivedAmountAtomic: BigNumber,
      chains: Array<Route3Chain>
    ) => {
      if (!swapContract) {
        return;
      }
      const resultParams: Array<TransferParams> = [];

      const swapOpParams = swapContract.methods.execute(
        fromToken.id,
        toToken.id,
        minimumReceivedAmountAtomic,
        selectedAccount.publicKeyHash,
        mapToRoute3ExecuteHops(chains, fromToken.decimals),
        APP_ID
      );

      if (fromToken.symbol === 'XTZ') {
        resultParams.push(
          swapOpParams.toTransferParams({
            amount: inputAmountAtomic.toNumber(),
            mutez: true
          })
        );
      } else {
        resultParams.push(swapOpParams.toTransferParams());
      }

      const { approve, revoke } = await getTransferPermissions(
        tezos,
        ROUTE3_CONTRACT,
        selectedAccount.publicKeyHash,
        fromToken,
        inputAmountAtomic
      );

      resultParams.unshift(...approve);
      resultParams.push(...revoke);

      return resultParams;
    },
    [tezos, selectedAccount.publicKeyHash, swapContract]
  );
};
