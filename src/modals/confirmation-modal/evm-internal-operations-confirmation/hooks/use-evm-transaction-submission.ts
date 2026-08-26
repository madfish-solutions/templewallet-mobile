import { useCallback, useRef, useState } from 'react';

import { useEvmChain } from 'src/hooks/evm/use-evm-chains.hook';
import { StacksEnum } from 'src/navigator/enums/stacks.enum';
import { dispatch as storeDispatch } from 'src/store';
import { useEvmAccountChainAssetsSelector } from 'src/store/evm/assets/evm-assets-selectors';
import { navigateAction } from 'src/store/root-state.actions';
import { showErrorToast, showSuccessToast } from 'src/toast/toast.utils';
import { toEvmNetworkEssentials } from 'src/types/networks';
import { EvmTransferRequest } from 'src/utils/evm/build-evm-transfer-request';
import { EvmFees } from 'src/utils/evm/estimate-evm-transaction';
import { loadEtherlinkBalancesOnChain } from 'src/utils/evm/etherlink-balances.utils';
import { normalizeEvmTransactionError } from 'src/utils/evm/evm-transaction-error';
import { evmTransactionSubmissionService } from 'src/utils/evm/evm-transaction-submission';

interface Props {
  chainId: number;
  sourceAddress?: HexString;
  request?: EvmTransferRequest;
}

interface SubmitParams {
  gasLimit: bigint;
  fees: EvmFees;
}

export const useEvmTransactionSubmission = ({ chainId, sourceAddress, request }: Props) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submissionInProgressRef = useRef(false);
  const chain = useEvmChain(chainId);
  const knownAssets = useEvmAccountChainAssetsSelector(sourceAddress, chainId);

  const submit = useCallback(
    async ({ gasLimit, fees }: SubmitParams) => {
      if (submissionInProgressRef.current || !sourceAddress || !chain || !request) {
        return;
      }

      submissionInProgressRef.current = true;
      setIsSubmitting(true);
      const network = toEvmNetworkEssentials(chain);
      const result = await evmTransactionSubmissionService.submit({
        network,
        sourceAddress,
        transaction: { ...request, gas: gasLimit, ...fees },
        onBroadcast: hash => {
          showSuccessToast({
            operationHash: hash,
            operationUrl: `${chain.activeBlockExplorer.url}/tx/${hash}`,
            title: 'Success!',
            description: 'Transaction request sent! Confirming...'
          });
          storeDispatch(navigateAction({ screen: StacksEnum.MainStack }));
        }
      });

      setIsSubmitting(false);
      submissionInProgressRef.current = false;

      if (!result.success) {
        const { message } = normalizeEvmTransactionError(result.error);

        showErrorToast({ title: `Failed to confirm ${chain.name} transaction`, description: message });

        return;
      }

      const hash = result.receipt.transactionHash;

      showSuccessToast({
        operationHash: hash,
        operationUrl: `${chain.activeBlockExplorer.url}/tx/${hash}`,
        title: 'Success!',
        description: `${chain.name} transaction confirmed`
      });

      void loadEtherlinkBalancesOnChain({ network, account: sourceAddress, knownAssets }).catch(console.error);
    },
    [chain, knownAssets, request, sourceAddress]
  );

  return { isSubmitting, submit };
};
