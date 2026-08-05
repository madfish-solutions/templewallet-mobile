import React, { FC, useCallback, useEffect, useMemo } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import { AssetValueText } from 'src/components/asset-value-text/asset-value-text';
import { AttentionMessage } from 'src/components/attention-message/attention-message';
import { Divider } from 'src/components/divider/divider';
import { FormattedAmount } from 'src/components/formatted-amount';
import { HeaderTitle } from 'src/components/header/header-title/header-title';
import { useNavigationSetOptions } from 'src/components/header/use-navigation-set-options.hook';
import { IconV2 } from 'src/components/icon-v2';
import { IconNameV2Enum } from 'src/components/icon-v2/icon-name.enum.ts';
import { Label } from 'src/components/label/label';
import { PublicKeyHashText } from 'src/components/public-key-hash-text/public-key-hash-text';
import { RobotIcon } from 'src/components/robot-icon/robot-icon';
import { Slider } from 'src/components/slider/slider';
import { StyledTextInput } from 'src/components/styled-text-input/styled-text-input';
import { TruncatedText } from 'src/components/truncated-text';
import { TempleChainKind } from 'src/enums/temple-chain-kind.enum';
import { useNavigation } from 'src/navigator/hooks/use-navigation.hook';
import { useAllAccounts } from 'src/store/wallet/wallet-selectors';
import { formatSize } from 'src/styles/format-size';
import { showErrorToast } from 'src/toast/error-toast.utils';
import { getAccountAddressForEvm } from 'src/utils/account.utils';
import { buildEvmTransferRequest } from 'src/utils/evm/build-evm-transfer-request';
import { isDefined } from 'src/utils/is-defined.ts';

import { ConfirmationLayout } from '../confirmation-layout/confirmation-layout';
import { EvmInternalOperationsConfirmationModalParams } from '../confirmation-modal.params';
import { useFeeFormInputStyles } from '../operations-confirmation/fee-form-input/fee-form-input.styles';
import { useOperationsPreviewItemStyles } from '../operations-confirmation/operations-preview/operations-preview-item/operations-preview-item.styles';

import { useEvmTransferFee } from './hooks/use-evm-transfer-fee';
import { useEvmTransferSubmission } from './hooks/use-evm-transfer-submission';
import { useEvmInternalOperationsConfirmationStyles } from './styles';

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
  const feeState = useEvmTransferFee({ sourceAddress, request, asset, atomicAmount });
  const { isSubmitting, resetSubmissionError, submissionError, submit } = useEvmTransferSubmission({
    chainId: asset.chainId,
    sourceAddress,
    request
  });
  const transactionError = submissionError ?? feeState.estimationError;
  const retryEstimation = feeState.retry;
  const getSubmissionFees = feeState.getSubmissionFees;

  useEffect(() => {
    if (transactionError) {
      showErrorToast({ title: 'EVM transaction error', description: transactionError.message });
    }
  }, [transactionError]);

  const retry = useCallback(() => {
    resetSubmissionError();
    void retryEstimation();
  }, [resetSubmissionError, retryEstimation]);
  const confirm = useCallback(async () => {
    const submissionFees = await getSubmissionFees();

    if (submissionFees) {
      await submit(submissionFees);
    }
  }, [getSubmissionFees, submit]);

  useNavigationSetOptions({ headerTitle: renderHeaderTitle }, []);

  const isConfirmDisabled = transactionError
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
      details={<EvmTransferFeeDetails feeState={feeState} />}
      backAction={{ disabled: isSubmitting, onPress: goBack }}
      confirmAction={{
        disabled: isConfirmDisabled,
        isLoading: feeState.isEstimating,
        onPress: transactionError ? retry : confirm,
        title: transactionError ? 'Retry' : 'Confirm'
      }}
    />
  );
};

interface EvmTransferPreviewProps {
  asset: Props['asset'];
  receiverAddress: HexString;
  atomicAmount: string;
}

const EvmTransferPreview: FC<EvmTransferPreviewProps> = ({ asset, receiverAddress, atomicAmount }) => {
  const styles = useOperationsPreviewItemStyles();

  return (
    <View style={styles.container}>
      <View style={styles.contentWrapper}>
        <View style={styles.infoContainer}>
          <RobotIcon seed={receiverAddress} size={formatSize(32)} />
          <Divider size={formatSize(10)} />
          <TruncatedText style={styles.description}>Transfer to</TruncatedText>
        </View>
        <View style={styles.hashContainer}>
          <PublicKeyHashText publicKeyHash={receiverAddress} />
        </View>
      </View>
      <Divider size={formatSize(8)} />
      <AssetValueText
        asset={asset}
        amount={atomicAmount}
        receiver={receiverAddress}
        showMinusSign
        style={styles.amountToken}
      />
      <Divider size={formatSize(8)} />
      <AssetValueText convertToDollar asset={asset} amount={atomicAmount} showMinusSign style={styles.amountDollar} />
    </View>
  );
};

interface EvmTransferFeeDetailsProps {
  feeState: ReturnType<typeof useEvmTransferFee>;
}

const EvmTransferFeeDetails: FC<EvmTransferFeeDetailsProps> = ({ feeState }) => {
  const styles = useEvmInternalOperationsConfirmationStyles();
  const feeFormStyles = useFeeFormInputStyles();

  return (
    <>
      <Divider size={formatSize(24)} />
      <View style={feeFormStyles.infoContainer}>
        <View style={[feeFormStyles.infoContainerItem, styles.feeInfoItem]}>
          <Text style={feeFormStyles.infoTitle}>Network fee:</Text>
          <Text style={feeFormStyles.infoFeeAmount}>
            {feeState.estimationError
              ? 'Unavailable'
              : feeState.formattedFee
              ? `${feeState.formattedFee} ${feeState.feeAsset.symbol}`
              : 'Estimating...'}
          </Text>
          {isDefined(feeState.fee) && isDefined(feeState.feeAsset.exchangeRate) && (
            <Text style={feeFormStyles.infoFeeValue}>
              (
              <FormattedAmount amount={feeState.feeFiatValue} hideApproximateSign isDollarValue />)
            </Text>
          )}
        </View>
      </View>

      <Divider size={formatSize(32)} />
      <View style={feeFormStyles.inputContainer}>
        <View style={feeFormStyles.sliderContainer}>
          {!feeState.isDetailedInputVisible && feeState.isSliderAvailable && (
            <Slider
              value={feeState.slider.value}
              minimumValue={feeState.slider.minimumValue}
              maximumValue={feeState.slider.maximumValue}
              step={feeState.slider.step}
              onValueChange={feeState.handleSliderValueChange}
            />
          )}
          {feeState.isDetailedInputVisible && (
            <>
              <Label description="Gas price (GWEI):" />
              <StyledTextInput
                value={feeState.gasPriceInput}
                isError={Boolean(feeState.gasPriceError)}
                keyboardType="decimal-pad"
                placeholder="0"
                onChangeText={feeState.handleGasPriceInputChange}
              />
            </>
          )}
        </View>
        <Divider size={formatSize(8)} />
        <TouchableOpacity style={feeFormStyles.toggleViewButton} onPress={feeState.toggleDetailedInput}>
          <IconV2 name={feeState.isDetailedInputVisible ? IconNameV2Enum.XBig : IconNameV2Enum.Settings} />
        </TouchableOpacity>
      </View>

      {isDefined(feeState.gasPriceError) && (
        <>
          <Divider size={formatSize(16)} />
          <AttentionMessage>
            <Text>{feeState.gasPriceError}</Text>
          </AttentionMessage>
        </>
      )}
      {feeState.hasInsufficientNativeBalance && (
        <>
          <Divider size={formatSize(16)} />
          <AttentionMessage>
            <Text>Insufficient XTZ balance for the amount and network fee</Text>
          </AttentionMessage>
        </>
      )}
      <Divider size={formatSize(24)} />
    </>
  );
};
