import { useCallback, useEffect } from 'react';

import { useEvmTransactionFee } from 'src/hooks/evm/use-evm-transaction-fee';
import { showErrorToast } from 'src/toast/error-toast.utils';
import { EvmSubmissionFees } from 'src/utils/evm/estimate-evm-transaction';

interface Params {
  feeState: ReturnType<typeof useEvmTransactionFee>;
  isSubmitting: boolean;
  submit: (fees: EvmSubmissionFees) => Promise<void>;
  onConfirm?: EmptyFn;
}

export const useEvmConfirmAction = ({ feeState, isSubmitting, submit, onConfirm }: Params) => {
  const {
    estimationError,
    getSubmissionFees,
    gasLimit,
    hasInsufficientNativeBalance,
    isEstimating,
    retry,
    selectedFees
  } = feeState;

  useEffect(() => {
    if (estimationError?.message) {
      showErrorToast({ title: 'Failed to estimate the transaction', description: estimationError.message });
    }
  }, [estimationError?.message]);

  const confirm = useCallback(async () => {
    onConfirm?.();

    const submissionFees = await getSubmissionFees();

    if (submissionFees) {
      await submit(submissionFees);
    } else {
      showErrorToast({ description: 'Failed to resolve submission fees.' });
    }
  }, [getSubmissionFees, submit, onConfirm]);

  const disabled = estimationError
    ? isEstimating || isSubmitting
    : isEstimating || isSubmitting || !gasLimit || !selectedFees || hasInsufficientNativeBalance;

  return {
    disabled,
    isLoading: isEstimating || isSubmitting,
    onPress: estimationError ? retry : confirm,
    title: estimationError ? 'Retry' : 'Confirm'
  };
};
