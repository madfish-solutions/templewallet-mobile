import { TransferParams } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';
import { useCallback, useEffect, useState } from 'react';

import { Route3Chain, Route3ContractInterface, Route3Token } from 'src/interfaces/route3.interface';
import { ROUTE3_CONTRACT } from 'src/screens/swap/config';
import { useSelectedAccountSelector } from 'src/store/wallet/wallet-selectors';
import { mapToRoute3ExecuteHops } from 'src/utils/route3.util';
import { getTransferPermissions } from 'src/utils/transfer-permissions.util';

import { useReadOnlyTezosToolkit } from './use-read-only-tezos-toolkit.hook';

const APP_ID = 2;

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

      const resultParams: Array<TransferParams> = [];

      const swapOpParams = swapContract.methods.execute(
        fromRoute3Token.id,
        toRoute3Token.id,
        minimumReceivedAtomic,
        selectedAccount.publicKeyHash,
        mapToRoute3ExecuteHops(chains, fromRoute3Token.decimals),
        APP_ID
      );

      if (fromRoute3Token.symbol.toLowerCase() === 'xtz') {
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
        fromRoute3Token,
        inputAmountAtomic
      );

      resultParams.unshift(...approve);
      resultParams.push(...revoke);

      return resultParams;
    },
    [tezos, selectedAccount.publicKeyHash, swapContract]
  );
};
