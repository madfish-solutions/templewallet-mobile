import React, { FC } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import { AttentionMessageV2 } from 'src/components/attention-message/attention-message';
import { Divider } from 'src/components/divider/divider';
import { FormattedAmount } from 'src/components/formatted-amount';
import { IconV2 } from 'src/components/icon-v2';
import { IconNameV2Enum } from 'src/components/icon-v2/icon-name.enum.ts';
import { Label } from 'src/components/label/label';
import { Slider } from 'src/components/slider/slider';
import { StyledTextInput } from 'src/components/styled-text-input/styled-text-input';
import { useEvmTransactionFee } from 'src/hooks/evm/use-evm-transaction-fee';
import { formatSize } from 'src/styles/format-size';
import { isDefined } from 'src/utils/is-defined.ts';

import { useFeeFormInputStyles } from '../../operations-confirmation/fee-form-input/fee-form-input.styles';

import { useEvmTransactionFeeDetailsStyles } from './styles';

interface Props {
  feeState: ReturnType<typeof useEvmTransactionFee>;
}

export const EvmTransactionFeeDetails: FC<Props> = ({ feeState }) => {
  const styles = useEvmTransactionFeeDetailsStyles();
  const feeFormStyles = useFeeFormInputStyles();
  const {
    estimationError,
    fee,
    feeAsset,
    feeFiatValue,
    formattedFee,
    gasPriceError,
    gasPriceInput,
    handleGasPriceInputChange,
    handleSliderValueChange,
    hasInsufficientNativeBalance,
    isDetailedInputVisible,
    isSliderAvailable,
    slider,
    toggleDetailedInput
  } = feeState;

  return (
    <>
      <Divider size={formatSize(24)} />
      <View style={feeFormStyles.infoContainer}>
        <View style={[feeFormStyles.infoContainerItem, styles.feeInfoItem]}>
          <Text style={feeFormStyles.infoTitle}>Network fee:</Text>
          <Text style={feeFormStyles.infoFeeAmount}>
            {estimationError ? 'Unavailable' : formattedFee ? `${formattedFee} ${feeAsset.symbol}` : 'Estimating...'}
          </Text>
          {isDefined(fee) && isDefined(feeAsset.exchangeRate) && (
            <Text style={feeFormStyles.infoFeeValue}>
              (
              <FormattedAmount amount={feeFiatValue} hideApproximateSign isDollarValue />)
            </Text>
          )}
        </View>
      </View>

      <Divider size={formatSize(32)} />
      <View style={feeFormStyles.inputContainer}>
        <View style={feeFormStyles.sliderContainer}>
          {!isDetailedInputVisible && isSliderAvailable && (
            <Slider
              value={slider.value}
              minimumValue={slider.minimumValue}
              maximumValue={slider.maximumValue}
              step={slider.step}
              onValueChange={handleSliderValueChange}
            />
          )}
          {isDetailedInputVisible && (
            <>
              <Label description="Gas price (GWEI):" />
              <StyledTextInput
                value={gasPriceInput}
                isError={Boolean(gasPriceError)}
                keyboardType="decimal-pad"
                placeholder="0"
                onChangeText={handleGasPriceInputChange}
              />
            </>
          )}
        </View>
        <Divider size={formatSize(8)} />
        <TouchableOpacity style={feeFormStyles.toggleViewButton} onPress={toggleDetailedInput}>
          <IconV2 name={isDetailedInputVisible ? IconNameV2Enum.XBig : IconNameV2Enum.Settings} />
        </TouchableOpacity>
      </View>

      {isDefined(gasPriceError) && (
        <>
          <Divider size={formatSize(16)} />
          <AttentionMessageV2>
            <Text style={styles.attentionMessageText}>{gasPriceError}</Text>
          </AttentionMessageV2>
        </>
      )}
      {hasInsufficientNativeBalance && (
        <>
          <Divider size={formatSize(16)} />
          <AttentionMessageV2>
            <Text style={styles.attentionMessageText}>
              Insufficient {feeAsset.symbol} balance for the amount and network fee
            </Text>
          </AttentionMessageV2>
        </>
      )}
      <Divider size={formatSize(24)} />
    </>
  );
};
