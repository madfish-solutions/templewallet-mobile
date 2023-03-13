import { TransferParams } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';
import { useCallback, useEffect, useState } from 'react';

import { Route3ContractInterface, Route3Chain } from 'src/interfaces/route3.interface';
import { ROUTE3_CONTRACT } from 'src/screens/swap/config';
import { useSwapTokensSelector } from 'src/store/swap/swap-selectors';
import { useSelectedAccountSelector } from 'src/store/wallet/wallet-selectors';
import { TokenInterface } from 'src/token/interfaces/token.interface';
import { getRoute3Token, mapToRoute3ExecuteHops } from 'src/utils/route3.util';
import { getTransferPermissions } from 'src/utils/swap-permissions.util';

import { useReadOnlyTezosToolkit } from './use-read-only-tezos-toolkit.hook';

const APP_ID = 2;

export const useSwap = () => {
  const selectedAccount = useSelectedAccountSelector();
  const tezos = useReadOnlyTezosToolkit(selectedAccount);
  const { data: swapTokens } = useSwapTokensSelector();
  const [swapContract, setSwapContract] = useState<Route3ContractInterface>();

  useEffect(() => {
    tezos.contract.at<Route3ContractInterface>(ROUTE3_CONTRACT).then(setSwapContract);
  }, []);

  return useCallback(
    async (
      fromToken: TokenInterface,
      toToken: TokenInterface,
      inputAmountAtomic: BigNumber,
      minimumReceivedAmountAtomic: BigNumber,
      chains: Array<Route3Chain>
    ) => {
      const resultParams: Array<TransferParams> = [];
      const fromRoute3Token = getRoute3Token(fromToken, swapTokens);
      const toRotue3Token = getRoute3Token(toToken, swapTokens);

      if (fromRoute3Token === undefined || toRotue3Token === undefined || swapContract === undefined) {
        return;
      }

      const swapOpParams = swapContract.methods.execute(
        fromRoute3Token.id,
        toRotue3Token.id,
        minimumReceivedAmountAtomic,
        selectedAccount.publicKeyHash,
        mapToRoute3ExecuteHops(chains, fromRoute3Token.decimals),
        APP_ID
      );

      if (fromToken.symbol === 'TEZ') {
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
