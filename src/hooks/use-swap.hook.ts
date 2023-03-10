import { TransferParams } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';
import { useCallback, useEffect, useState } from 'react';

import { Route3ContractInterface } from 'src/interfaces/route3.interface';
import { ROUTE3_CONTRACT } from 'src/screens/swap/config';
import { useSwapParamsSelector, useSwapTokensSelector } from 'src/store/swap/swap-selectors';
import { useSelectedAccountSelector } from 'src/store/wallet/wallet-selectors';
import { TokenInterface } from 'src/token/interfaces/token.interface';
import { getRoute3Token, mapToRoute3ExecuteHops } from 'src/utils/route3.util';
import { getTransferPermissions } from 'src/utils/swap-permissions.util';

import { useReadOnlyTezosToolkit } from './use-read-only-tezos-toolkit.hook';

const APP_ID = 2;

export const useSwap = () => {
  const selectedAccount = useSelectedAccountSelector();
  const tezos = useReadOnlyTezosToolkit(selectedAccount);
  const { data: swapParams } = useSwapParamsSelector();
  const { data: swapTokens } = useSwapTokensSelector();
  const [swapContract, setSwapContract] = useState<Route3ContractInterface>();

  useEffect(() => {
    tezos.contract.at<Route3ContractInterface>(ROUTE3_CONTRACT).then(setSwapContract);
  }, []);

  return useCallback(
    async (fromToken: TokenInterface, toToken: TokenInterface, minimumReceivedAmountAtomic: BigNumber) => {
      const resultParams: Array<TransferParams> = [];
      const fromRoute3Token = getRoute3Token(fromToken, swapTokens);
      const toRotue3Token = getRoute3Token(toToken, swapTokens);

      if (fromRoute3Token === undefined || toRotue3Token === undefined || swapContract === undefined) {
        return;
      }

      const inputAmountAtomic = new BigNumber(swapParams.input ?? 0).multipliedBy(10 ** fromToken.decimals);

      const swapOpParams = swapContract.methods.execute(
        fromRoute3Token.id,
        toRotue3Token.id,
        minimumReceivedAmountAtomic,
        selectedAccount.publicKeyHash,
        mapToRoute3ExecuteHops(swapParams.chains, fromRoute3Token.decimals),
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
    [tezos, selectedAccount.publicKeyHash, swapParams.chains, swapParams.output, swapContract]
  );
};
