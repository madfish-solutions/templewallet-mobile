import React, { FC, useCallback, useEffect, useMemo } from 'react';

import { Divider } from 'src/components/divider/divider';
import { HeaderTitle } from 'src/components/header/header-title/header-title';
import { useNavigationSetOptions } from 'src/components/header/use-navigation-set-options.hook';
import { TempleChainKind } from 'src/enums/temple-chain-kind.enum';
import { useNavigation } from 'src/navigator/hooks/use-navigation.hook';
import { useAllAccounts } from 'src/store/wallet/wallet-selectors';
import { formatSize } from 'src/styles/format-size';
import { showErrorToast } from 'src/toast/error-toast.utils';
import { getAccountAddressForEvm } from 'src/utils/account.utils';
import { buildEvmTransferRequest } from 'src/utils/evm/build-evm-transfer-request';

import { ConfirmationLayout } from '../common/confirmation-layout/confirmation-layout';
import { EvmTransactionFeeDetails } from '../common/evm-transaction-fee-details';
import { OperationPreviewAssetAmounts } from '../common/operation-preview-asset-amounts';
import { OperationPreviewCard } from '../common/operation-preview-card';
import { EvmInternalOperationsConfirmationModalParams } from '../confirmation-modal.params';

import { useEvmTransactionSubmission } from './hooks/use-evm-transaction-submission';
import { useEvmTransferFee } from './hooks/use-evm-transfer-fee';

type Props = Omit<EvmInternalOperationsConfirmationModalParams, 'type'>;

const renderHeaderTitle = () => <HeaderTitle title="Confirm Send" />;

export const EvmInternalOperationsConfirmation: FC<Props> = ({ accountId, asset, receiverAddress, atomicAmount }) => {
  const { goBack } = useNavigation();
  const accounts = useAllAccounts();
  const sourceAccount = accounts.find(account => account.id === accountId);
  const sourceAddress = sourceAccount ? getAccountAddressForEvm(sourceAccount) : undefined;
  const request = useMemo(
    () => (sourceAddress ? buildEvmTransferRequest(sourceAddress, receiverAddress, asset, atomicAmount) : undefined),
    [asset, atomicAmount, receiverAddress, sourceAddress]
  );
  const feeState = useEvmTransferFee({ sourceAddress, request, asset });
  const { isSubmitting, submit } = useEvmTransactionSubmission({
    chainId: asset.chainId,
    sourceAddress,
    request
  });
  const estimationError = feeState.estimationError;
  const retryEstimation = feeState.retry;
  const getSubmissionFees = feeState.getSubmissionFees;

  useEffect(() => {
    if (estimationError?.message) {
      showErrorToast({ title: 'Failed to estimate the transaction', description: estimationError.message });
    }
  }, [estimationError?.message]);

  const confirm = useCallback(async () => {
    const submissionFees = await getSubmissionFees();

    if (submissionFees) {
      await submit(submissionFees);
    } else {
      showErrorToast({ description: 'Failed to resolve submission fees.' });
    }
  }, [getSubmissionFees, submit]);

  useNavigationSetOptions({ headerTitle: renderHeaderTitle }, []);

  const isConfirmDisabled = estimationError
    ? feeState.isEstimating || isSubmitting
    : feeState.isEstimating ||
      isSubmitting ||
      !feeState.gasLimit ||
      !feeState.selectedFees ||
      feeState.hasInsufficientNativeBalance;

  return (
    <ConfirmationLayout
      account={sourceAccount}
      accountChainKind={TempleChainKind.EVM}
      preview={<EvmTransferPreview asset={asset} receiverAddress={receiverAddress} atomicAmount={atomicAmount} />}
      details={<EvmTransactionFeeDetails feeState={feeState} />}
      backAction={{ disabled: isSubmitting, onPress: goBack }}
      confirmAction={{
        disabled: isConfirmDisabled,
        isLoading: feeState.isEstimating || isSubmitting,
        onPress: estimationError ? retryEstimation : confirm,
        title: estimationError ? 'Retry' : 'Confirm'
      }}
    />
  );
};

interface EvmTransferPreviewProps {
  asset: Props['asset'];
  receiverAddress: HexString;
  atomicAmount: string;
}

const EvmTransferPreview: FC<EvmTransferPreviewProps> = ({ asset, receiverAddress, atomicAmount }) => (
  <OperationPreviewCard iconSeed={receiverAddress} description="Transfer to" publicKeyHash={receiverAddress}>
    <Divider size={formatSize(8)} />
    <OperationPreviewAssetAmounts asset={asset} amount={atomicAmount} receiver={receiverAddress} showMinusSign />
  </OperationPreviewCard>
);
