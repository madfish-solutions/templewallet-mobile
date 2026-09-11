import React, { FC, useCallback, useEffect, useMemo } from 'react';
import { SendTransactionRequest } from 'viem';

import { HeaderTitle } from 'src/components/header/header-title/header-title';
import { useNavigationSetOptions } from 'src/components/header/use-navigation-set-options.hook';
import { TempleChainKind } from 'src/enums/temple-chain-kind.enum';
import { useEvmTransactionFee } from 'src/hooks/evm/use-evm-transaction-fee';
import { Account } from 'src/interfaces/account.interfaces';
import { useNavigation } from 'src/navigator/hooks/use-navigation.hook';
import { showErrorToast } from 'src/toast/error-toast.utils';
import { WcSendTransactionRequestContent } from 'src/types/strict-wc-session-request';
import { buildPreparedEvmTransaction } from 'src/utils/evm/build-prepared-evm-transaction';
import { parseRpcTransactionRequest } from 'src/utils/evm/parse-rpc-transaction-request';
import { toEvmTransactionRequest } from 'src/utils/evm/to-evm-transaction-request';

import { AppMetadataView } from '../../common/app-metadata-view';
import { ConfirmationLayout } from '../../common/confirmation-layout/confirmation-layout';
import { EvmTransactionFeeDetails } from '../../common/evm-transaction-fee-details';
import { WcSessionRequestConfirmationSelectors } from '../selectors';

import { WcTransactionPreview } from './wc-transaction-preview';

interface Props {
  requestContent: WcSendTransactionRequestContent;
  chainId: number;
  account: Account;
  accountAddress: HexString;
  appName: string;
  iconUri?: string;
  iconSeed: string;
  isSubmitting: boolean;
  onConfirm: SyncFn<SendTransactionRequest>;
}

const renderHeaderTitle = () => <HeaderTitle title="Confirm Operation" />;

export const WcSendTransactionConfirmation: FC<Props> = ({
  requestContent,
  chainId,
  account,
  accountAddress,
  appName,
  iconUri,
  iconSeed,
  isSubmitting,
  onConfirm
}) => {
  const { goBack } = useNavigation();

  const [txRequest] = requestContent.params;

  const parsedTxRequest = useMemo(() => parseRpcTransactionRequest(txRequest), [txRequest]);

  const estimationRequest = useMemo(() => toEvmTransactionRequest(parsedTxRequest), [parsedTxRequest]);

  const feeState = useEvmTransactionFee({
    chainId,
    sourceAddress: accountAddress,
    request: estimationRequest
  });
  const {
    estimationError,
    getSubmissionFees,
    retry,
    isEstimating,
    gasLimit,
    selectedFees,
    hasInsufficientNativeBalance
  } = feeState;

  useEffect(() => {
    if (estimationError?.message) {
      showErrorToast({ title: 'Failed to estimate the transaction', description: estimationError.message });
    }
  }, [estimationError?.message]);

  useNavigationSetOptions({ headerTitle: renderHeaderTitle }, []);

  const confirm = useCallback(async () => {
    const submissionFees = await getSubmissionFees();

    if (!submissionFees) {
      showErrorToast({ description: 'Failed to resolve submission fees.' });

      return;
    }

    onConfirm(buildPreparedEvmTransaction(parsedTxRequest, submissionFees));
  }, [getSubmissionFees, onConfirm, parsedTxRequest]);

  const isConfirmDisabled = estimationError
    ? isEstimating || isSubmitting
    : isEstimating || isSubmitting || !gasLimit || !selectedFees || hasInsufficientNativeBalance;

  return (
    <ConfirmationLayout
      headerContent={<AppMetadataView name={appName} iconUri={iconUri} iconSeed={iconSeed} />}
      account={account}
      accountChainKind={TempleChainKind.EVM}
      preview={<WcTransactionPreview transaction={parsedTxRequest} chainId={chainId} accountAddress={accountAddress} />}
      details={<EvmTransactionFeeDetails feeState={feeState} />}
      backAction={{
        disabled: isSubmitting,
        onPress: goBack,
        testID: WcSessionRequestConfirmationSelectors.cancelButton
      }}
      confirmAction={{
        disabled: isConfirmDisabled,
        isLoading: isEstimating || isSubmitting,
        onPress: estimationError ? retry : confirm,
        title: estimationError ? 'Retry' : 'Confirm',
        testID: WcSessionRequestConfirmationSelectors.confirmButton
      }}
    />
  );
};
