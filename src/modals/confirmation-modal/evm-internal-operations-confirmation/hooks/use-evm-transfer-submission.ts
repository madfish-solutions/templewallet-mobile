import { useCallback, useEffect, useRef, useState } from 'react';
import { Hash, TransactionReceipt } from 'viem';

import { useEvmChain } from 'src/hooks/evm/use-evm-chains.hook';
import { StacksEnum } from 'src/navigator/enums/stacks.enum';
import { dispatch as storeDispatch } from 'src/store';
import { useEvmAccountChainAssetsSelector } from 'src/store/evm/assets/evm-assets-selectors';
import { navigateAction } from 'src/store/root-state.actions';
import { showSuccessToast } from 'src/toast/toast.utils';
import { toEvmNetworkEssentials } from 'src/types/networks';
import { EvmTransferRequest } from 'src/utils/evm/build-evm-transfer-request';
import { EvmFees } from 'src/utils/evm/estimate-evm-transaction';
import { loadEtherlinkBalancesOnChain } from 'src/utils/evm/etherlink-balances.utils';
import { EvmTransactionError, normalizeEvmTransactionError } from 'src/utils/evm/evm-transaction-error';
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

export const useEvmTransferSubmission = ({ chainId, sourceAddress, request }: Props) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<EvmTransactionError>();
  const [submittedHash, setSubmittedHash] = useState<Hash>();
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
      setSubmissionError(undefined);
      const network = toEvmNetworkEssentials(chain);
      let receipt: TransactionReceipt;

      try {
        receipt = await evmTransactionSubmissionService.submit({
          network,
          sourceAddress,
          submittedHash,
          transaction: { ...request, gas: gasLimit, ...fees }
        });
      } catch (error) {
        const normalizedError = normalizeEvmTransactionError(error);

        setSubmittedHash(normalizedError.pendingTransactionHash);
        setSubmissionError(normalizedError);
        setIsSubmitting(false);
        submissionInProgressRef.current = false;

        return;
      }

      const hash = receipt.transactionHash;

      setSubmittedHash(undefined);
      setIsSubmitting(false);
      submissionInProgressRef.current = false;
      showSuccessToast({
        operationHash: hash,
        operationUrl: `${chain.activeBlockExplorer.url}/tx/${hash}`,
        title: 'Success!',
        description: `${chain.name} transaction confirmed`
      });
      storeDispatch(navigateAction({ screen: StacksEnum.MainStack }));

      void loadEtherlinkBalancesOnChain({ network, account: sourceAddress, knownAssets }).catch(console.error);
    },
    [chain, knownAssets, request, sourceAddress, submittedHash]
  );

  useEffect(() => {
    setSubmittedHash(undefined);
    setSubmissionError(undefined);
  }, [chainId, request, sourceAddress]);

  const resetSubmissionError = useCallback(() => setSubmissionError(undefined), []);

  return { isSubmitting, resetSubmissionError, submissionError, submit };
};
