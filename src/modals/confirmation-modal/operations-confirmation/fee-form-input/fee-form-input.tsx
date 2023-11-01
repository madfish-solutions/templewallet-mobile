import { BigNumber } from 'bignumber.js';
import { FormikHelpers } from 'formik';
import React, { FC, useEffect, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import { AssetValueText } from '../../../../components/asset-value-text/asset-value-text';
import { Divider } from '../../../../components/divider/divider';
import { Icon } from '../../../../components/icon/icon';
import { IconNameEnum } from '../../../../components/icon/icon-name.enum';
import { Label } from '../../../../components/label/label';
import { Slider } from '../../../../components/slider/slider';
import { StyledNumericInput } from '../../../../components/styled-numberic-input/styled-numeric-input';
import { FormNumericInput } from '../../../../form/form-numeric-input/form-numeric-input';
import { useNetworkInfo } from '../../../../hooks/use-network-info.hook';
import { formatSize } from '../../../../styles/format-size';
import { isDefined } from '../../../../utils/is-defined';
import { mutezToTz, tzToMutez } from '../../../../utils/tezos.util';
import { useTezosToken } from '../../../../utils/wallet.utils';

import { FeeFormInputValues } from './fee-form-input.form';
import { useFeeFormInputStyles } from './fee-form-input.styles';

interface Props {
  values: FeeFormInputValues;
  basicFees: Required<FeeFormInputValues>;
  estimationWasSuccessful: boolean;
  onlyOneOperation: boolean;
  minimalFeePerStorageByteMutez: number;
  setFieldValue: FormikHelpers<FeeFormInputValues>['setFieldValue'];
}

export const FeeFormInput: FC<Props> = ({
  values,
  basicFees,
  estimationWasSuccessful,
  onlyOneOperation,
  minimalFeePerStorageByteMutez,
  setFieldValue
}) => {
  const styles = useFeeFormInputStyles();

  const { metadata } = useNetworkInfo();

  const [isShowDetailedInput, setIsShowDetailedInput] = useState(!estimationWasSuccessful);

  const sliderMinValue = basicFees.gasFeeSum.toNumber();
  const sliderMaxValue = basicFees.gasFeeSum.plus(2e-4).toNumber();
  const gasFeeBigNumber = values.gasFeeSum ?? new BigNumber(0);
  const storageLimitDefaultValue = basicFees.storageLimitSum;

  const storageFee = isDefined(values.storageLimitSum)
    ? mutezToTz(new BigNumber(values.storageLimitSum).times(minimalFeePerStorageByteMutez), metadata.decimals)
    : undefined;

  const rawGasFeeSumToken = useTezosToken(
    isDefined(values.gasFeeSum) ? tzToMutez(values.gasFeeSum, metadata.decimals).toFixed() : '0'
  );
  const gasFeeSumToken = isDefined(values.gasFeeSum) ? rawGasFeeSumToken : undefined;

  const rawStorageFeeToken = useTezosToken(
    isDefined(storageFee) ? tzToMutez(storageFee, metadata.decimals).toFixed() : '0'
  );
  const storageFeeToken = isDefined(storageFee) ? rawStorageFeeToken : undefined;

  useEffect(() => setIsShowDetailedInput(!estimationWasSuccessful), [estimationWasSuccessful]);

  return (
    <>
      <View style={styles.infoContainer}>
        <View style={styles.infoContainerItem}>
          <Text style={styles.infoTitle}>Gas fee:</Text>
          <Text style={styles.infoFeeAmount}>
            {isDefined(values.gasFeeSum) ? `${values.gasFeeSum.toFixed()} ${metadata.symbol}` : 'Not defined'}
          </Text>
          {isDefined(gasFeeSumToken) && (
            <AssetValueText
              convertToDollar
              asset={gasFeeSumToken}
              style={styles.infoFeeValue}
              amount={gasFeeSumToken.balance}
            />
          )}
        </View>

        <Divider />

        <View style={styles.infoContainerItem}>
          <Text style={styles.infoTitle}>Storage fee:</Text>
          <Text style={styles.infoFeeAmount}>
            {isDefined(storageFee) ? `${storageFee} ${metadata.symbol}` : 'Not defined'}
          </Text>
          {storageFeeToken && (
            <AssetValueText
              convertToDollar
              asset={storageFeeToken}
              style={styles.infoFeeValue}
              amount={storageFeeToken.balance}
            />
          )}
        </View>
      </View>

      <Divider size={formatSize(32)} />

      <View style={styles.inputContainer}>
        <View style={styles.sliderContainer}>
          {isShowDetailedInput ? (
            <>
              <Label description="Total:" />
              <StyledNumericInput value={gasFeeBigNumber.plus(storageFee ?? 0)} editable={false} />
              <Divider size={formatSize(16)} />

              <Label description="Gas fee:" />
              <FormNumericInput name="gasFeeSum" isShowCleanButton={true} />

              {onlyOneOperation && (
                <>
                  <Label description="Storage limit:" />
                  <FormNumericInput name="storageLimitSum" isShowCleanButton={true} />
                </>
              )}
            </>
          ) : (
            <Slider
              value={gasFeeBigNumber.toNumber()}
              minimumValue={sliderMinValue}
              maximumValue={sliderMaxValue}
              step={1e-6}
              onValueChange={(newValue: number) => {
                setFieldValue('gasFeeSum', new BigNumber(newValue).decimalPlaces(metadata.decimals));
                !isDefined(values.storageLimitSum) && setFieldValue('storageLimitSum', storageLimitDefaultValue, false);
              }}
            />
          )}
        </View>
        {estimationWasSuccessful && (
          <>
            <Divider size={formatSize(8)} />
            <TouchableOpacity
              style={styles.toggleViewButton}
              onPress={() => setIsShowDetailedInput(!isShowDetailedInput)}
            >
              <Icon name={isShowDetailedInput ? IconNameEnum.X : IconNameEnum.Gear} size={formatSize(16)} />
            </TouchableOpacity>
          </>
        )}
      </View>
    </>
  );
};
