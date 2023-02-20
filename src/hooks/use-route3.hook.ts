import { BigNumber } from 'bignumber.js';
import { useCallback } from 'react';

import { Route3ContractInterface } from 'src/interfaces/route3.interface';
import { ROUTE3_CONTRACT } from 'src/screens/swap/config';
import { useRoute3SwapParamsSelector, useRoute3TokensSelector } from 'src/store/route3/route3-selectors';
import { useSelectedAccountSelector } from 'src/store/wallet/wallet-selectors';
import { TokenInterface } from 'src/token/interfaces/token.interface';
import { getRoute3Token, mapToRoute3ExecuteHops } from 'src/utils/route3.util';

import { useReadOnlyTezosToolkit } from './use-read-only-tezos-toolkit.hook';

const APP_ID = 2;

export const useRoute3 = () => {
  const selectedAccount = useSelectedAccountSelector();
  const tezos = useReadOnlyTezosToolkit(selectedAccount);
  const { data: swapParams } = useRoute3SwapParamsSelector();
  const { data: route3Tokens } = useRoute3TokensSelector();

  return useCallback(
    async (fromToken: TokenInterface, toToken: TokenInterface, minimumReceivedAmountAtomic: BigNumber) => {
      const fromRoute3Token = getRoute3Token(fromToken, route3Tokens);
      const toRotue3Token = getRoute3Token(toToken, route3Tokens);

      if (fromRoute3Token === undefined || toRotue3Token === undefined) {
        return;
      }

      const param = {
        app_id: APP_ID,
        min_out: minimumReceivedAmountAtomic,
        receiver: selectedAccount.publicKeyHash,
        token_in_id: fromRoute3Token.id,
        token_out_id: toRotue3Token.id,
        hops: mapToRoute3ExecuteHops(swapParams.chains, fromRoute3Token.decimals)
      };

      const route3ContractInstance = await tezos.contract.at<Route3ContractInterface>(ROUTE3_CONTRACT);

      const swapOpParams = route3ContractInstance.methods.execute(
        param.token_in_id,
        param.token_out_id,
        param.min_out,
        param.receiver,
        param.hops,
        param.app_id
      );

      if (fromToken.symbol === 'TEZ') {
        return swapOpParams.toTransferParams({
          amount: (swapParams.input ?? 0) * 10 ** fromToken.decimals,
          mutez: true
        });
      }

      return swapOpParams.toTransferParams();
    },
    [tezos, selectedAccount.publicKeyHash, swapParams.chains, swapParams.output]
  );
};
