import React, { FC, useMemo } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import { AssetValueText } from 'src/components/asset-value-text/asset-value-text';
import { Divider } from 'src/components/divider/divider';
import { FormattedAmount } from 'src/components/formatted-amount';
import { HeaderTitle } from 'src/components/header/header-title/header-title';
import { useNavigationSetOptions } from 'src/components/header/use-navigation-set-options.hook';
import { Icon } from 'src/components/icon/icon';
import { IconNameEnum } from 'src/components/icon/icon-name.enum';
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
import { getAccountAddressForEvm } from 'src/utils/account.utils';
import { buildEvmTransferRequest } from 'src/utils/evm/build-evm-transfer-request';

import { ConfirmationLayout } from '../confirmation-layout/confirmation-layout';
import { EvmTransferConfirmationModalParams } from '../confirmation-modal.params';
import { useFeeFormInputStyles } from '../operations-confirmation/fee-form-input/fee-form-input.styles';
import { useOperationsPreviewItemStyles } from '../operations-confirmation/operations-preview/operations-preview-item/operations-preview-item.styles';

import { useEvmTransferConfirmationStyles } from './evm-transfer-confirmation.styles';
import { NETWORK_FEE_STEP } from './evm-transfer-fee.utils';
import { useEvmTransferFee } from './use-evm-transfer-fee.hook';
import { useEvmTransferSubmission } from './use-evm-transfer-submission.hook';

type Props = Omit<EvmTransferConfirmationModalParams, 'type'>;

export const EvmTransferConfirmation: FC<Props> = ({ accountId, asset, receiverAddress, atomicAmount }) => {
  const { goBack } = useNavigation();
  const accounts = useAllAccounts();
  const sourceAccount = accounts.find(account => account.id === accountId);
  const sourceAddress = sourceAccount ? getAccountAddressForEvm(sourceAccount) : undefined;
  const request = useMemo(
    () => (sourceAddress ? buildEvmTransferRequest(sourceAddress, receiverAddress, asset, atomicAmount) : undefined),
    [asset, atomicAmount, receiverAddress, sourceAddress]
  );
  const feeState = useEvmTransferFee({ sourceAddress, request, asset, atomicAmount });
  const { isSubmitting, submit } = useEvmTransferSubmission({
    sourceAddress,
    request,
    gasLimit: feeState.gasLimit,
    gasPrice: feeState.selectedGasPrice
  });

  useNavigationSetOptions({ headerTitle: () => <HeaderTitle title="Confirm Send" /> }, []);

  const isConfirmDisabled =
    feeState.isEstimating ||
    isSubmitting ||
    Boolean(feeState.estimationError) ||
    !feeState.selectedGasPrice ||
    feeState.hasInsufficientNativeBalance;

  return (
    <ConfirmationLayout
      account={sourceAccount}
      accountChainKind={TempleChainKind.EVM}
      preview={<EvmTransferPreview asset={asset} receiverAddress={receiverAddress} atomicAmount={atomicAmount} />}
      details={<EvmTransferFeeDetails feeState={feeState} />}
      backAction={{ disabled: isSubmitting, onPress: goBack }}
      confirmAction={{ disabled: isConfirmDisabled, onPress: submit }}
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
  const styles = useEvmTransferConfirmationStyles();
  const feeFormStyles = useFeeFormInputStyles();

  return (
    <>
      <Divider size={formatSize(24)} />
      <View style={feeFormStyles.infoContainer}>
        <View style={[feeFormStyles.infoContainerItem, styles.feeInfoItem]}>
          <Text style={feeFormStyles.infoTitle}>Network fee:</Text>
          <Text style={feeFormStyles.infoFeeAmount}>
            {feeState.formattedFee ? `${feeState.formattedFee} XTZ` : 'Estimating...'}
          </Text>
          {!!feeState.fee && feeState.feeAsset.exchangeRate !== undefined && (
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
              step={NETWORK_FEE_STEP}
              onValueChange={feeState.handleSliderValueChange}
            />
          )}
          {feeState.isDetailedInputVisible && (
            <>
              <Label description="Gas price (GWEI):" />
              <StyledTextInput
                value={feeState.gasPriceInput}
                keyboardType="decimal-pad"
                placeholder="0"
                onChangeText={feeState.handleGasPriceInputChange}
              />
            </>
          )}
        </View>
        <Divider size={formatSize(8)} />
        <TouchableOpacity style={feeFormStyles.toggleViewButton} onPress={feeState.toggleDetailedInput}>
          <Icon name={feeState.isDetailedInputVisible ? IconNameEnum.X : IconNameEnum.Gear} size={formatSize(16)} />
        </TouchableOpacity>
      </View>

      {!!feeState.estimationError && <Text style={styles.errorText}>{feeState.estimationError}</Text>}
      {feeState.hasInsufficientNativeBalance && (
        <Text style={styles.errorText}>Insufficient XTZ balance for the amount and network fee</Text>
      )}
      <Divider size={formatSize(24)} />
    </>
  );
};
