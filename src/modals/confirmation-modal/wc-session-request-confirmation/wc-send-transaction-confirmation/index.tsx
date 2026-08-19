import React, { FC, useCallback, useEffect, useMemo } from 'react';
import { SendTransactionRequest } from 'viem';

import { HeaderTitle } from 'src/components/header/header-title/header-title';
import { useNavigationSetOptions } from 'src/components/header/use-navigation-set-options.hook';
import { TempleChainKind } from 'src/enums/temple-chain-kind.enum';
import { useEvmTransactionFee } from 'src/hooks/evm/use-evm-transaction-fee';
import { Account } from 'src/interfaces/account.interfaces';
import { useNavigation } from 'src/navigator/hooks/use-navigation.hook';
import { showErrorToast } from 'src/toast/error-toast.utils';
import { buildPreparedEvmTransaction } from 'src/utils/evm/build-prepared-evm-transaction';
import { parseRpcTransactionRequest } from 'src/utils/evm/parse-rpc-transaction-request';
import { toEvmTransactionRequest } from 'src/utils/evm/to-evm-transaction-request';
import { validateSendTransactionParams } from 'src/utils/evm/validation-schemas';

import { AppMetadataView } from '../../common/app-metadata-view';
import { ConfirmationLayout } from '../../common/confirmation-layout/confirmation-layout';
import { EvmTransactionFeeDetails } from '../../common/evm-transaction-fee-details';
import { WcSessionRequestConfirmationSelectors } from '../selectors';

import { WcTransactionPreview } from './wc-transaction-preview';

interface Props {
  params: unknown;
  chainId: number;
  account?: Account;
  accountAddress?: HexString;
  appName: string;
  iconUri?: string;
  iconSeed: string;
  isSubmitting: boolean;
  onConfirm: (preparedTransaction: SendTransactionRequest) => void;
}

const renderHeaderTitle = () => <HeaderTitle title="Confirm Operation" />;

export const WcSendTransactionConfirmation: FC<Props> = ({
  params,
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

  const parsedResult = useMemo(() => {
    try {
      const [rawTransaction] = validateSendTransactionParams(params);

      return { ok: true as const, parsed: parseRpcTransactionRequest(rawTransaction) };
    } catch (error) {
      return {
        ok: false as const,
        error: error instanceof Error ? error : new Error('Invalid transaction params')
      };
    }
  }, [params]);

  const estimationRequest = useMemo(
    () => (parsedResult.ok ? toEvmTransactionRequest(parsedResult.parsed) : undefined),
    [parsedResult]
  );

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

  useEffect(() => {
    if (!parsedResult.ok) {
      showErrorToast({ title: 'Invalid transaction', description: parsedResult.error.message });
    }
  }, [parsedResult]);

  useNavigationSetOptions({ headerTitle: renderHeaderTitle }, []);

  const confirm = useCallback(async () => {
    if (!parsedResult.ok) {
      showErrorToast({ description: 'Invalid transaction params.' });

      return;
    }

    const submissionFees = await getSubmissionFees();

    if (!submissionFees) {
      showErrorToast({ description: 'Failed to resolve submission fees.' });

      return;
    }

    onConfirm(buildPreparedEvmTransaction(parsedResult.parsed, submissionFees));
  }, [getSubmissionFees, onConfirm, parsedResult]);

  const isConfirmDisabled = !parsedResult.ok
    ? true
    : estimationError
    ? isEstimating || isSubmitting
    : isEstimating || isSubmitting || !gasLimit || !selectedFees || hasInsufficientNativeBalance || !accountAddress;

  return (
    <ConfirmationLayout
      headerContent={<AppMetadataView name={appName} iconUri={iconUri} iconSeed={iconSeed} />}
      account={account}
      accountChainKind={TempleChainKind.EVM}
      preview={
        parsedResult.ok ? (
          <WcTransactionPreview transaction={parsedResult.parsed} chainId={chainId} accountAddress={accountAddress} />
        ) : null
      }
      details={parsedResult.ok ? <EvmTransactionFeeDetails feeState={feeState} /> : null}
      backAction={{
        disabled: isSubmitting,
        onPress: goBack,
        testID: WcSessionRequestConfirmationSelectors.cancelButton
      }}
      confirmAction={{
        disabled: isConfirmDisabled,
        isLoading: isEstimating || isSubmitting,
        onPress: estimationError && parsedResult.ok ? () => void retry() : () => void confirm(),
        title: estimationError && parsedResult.ok ? 'Retry' : 'Confirm',
        testID: WcSessionRequestConfirmationSelectors.confirmButton
      }}
    />
  );
};
