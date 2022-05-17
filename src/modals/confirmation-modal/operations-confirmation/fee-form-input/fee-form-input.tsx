import { BigNumber } from 'bignumber.js';
import { FormikHelpers } from 'formik';
import React, { FC, useEffect, useState } from 'react';
import { Text, View, TouchableOpacity } from 'react-native';

import { AssetValueText } from '../../../../components/asset-value-text/asset-value-text';
import { Divider } from '../../../../components/divider/divider';
import { Icon } from '../../../../components/icon/icon';
import { IconNameEnum } from '../../../../components/icon/icon-name.enum';
import { Label } from '../../../../components/label/label';
import { Slider } from '../../../../components/slider/slider';
import { StyledNumericInput } from '../../../../components/styled-numberic-input/styled-numeric-input';
import { FormNumericInput } from '../../../../form/form-numeric-input/form-numeric-input';
import { formatSize } from '../../../../styles/format-size';
import { TEZ_TOKEN_METADATA } from '../../../../token/data/tokens-metadata';
import { isDefined } from '../../../../utils/is-defined';
import { mutezToTz, tzToMutez } from '../../../../utils/tezos.util';
import { getTezosToken } from '../../../../utils/wallet.utils';
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

  const [isShowDetailedInput, setIsShowDetailedInput] = useState(!estimationWasSuccessful);

  const sliderMinValue = basicFees.gasFeeSum.toNumber();
  const sliderMaxValue = basicFees.gasFeeSum.plus(2e-4).toNumber();
  const gasFeeBigNumber = values.gasFeeSum ?? new BigNumber(0);
  const storageLimitDefaultValue = basicFees.storageLimitSum;

  const storageFee = isDefined(values.storageLimitSum)
    ? mutezToTz(new BigNumber(values.storageLimitSum).times(minimalFeePerStorageByteMutez), TEZ_TOKEN_METADATA.decimals)
    : undefined;

  useEffect(() => setIsShowDetailedInput(!estimationWasSuccessful), [estimationWasSuccessful]);

  return (
    <>
      <View style={styles.infoContainer}>
        <View style={styles.infoContainerItem}>
          <Text style={styles.infoTitle}>Gas fee:</Text>
          <Text style={styles.infoFeeAmount}>
            {isDefined(values.gasFeeSum) ? `${values.gasFeeSum.toFixed()} ${TEZ_TOKEN_METADATA.symbol}` : 'Not defined'}
          </Text>
          {isDefined(values.gasFeeSum) && (
            <AssetValueText
              convertToDollar
              asset={getTezosToken(tzToMutez(values.gasFeeSum, TEZ_TOKEN_METADATA.decimals).toFixed())}
              style={styles.infoFeeValue}
              amount={getTezosToken(tzToMutez(values.gasFeeSum, TEZ_TOKEN_METADATA.decimals).toFixed()).balance}
            />
          )}
        </View>

        <Divider />

        <View style={styles.infoContainerItem}>
          <Text style={styles.infoTitle}>Storage fee:</Text>
          <Text style={styles.infoFeeAmount}>
            {isDefined(storageFee) ? `${storageFee} ${TEZ_TOKEN_METADATA.symbol}` : 'Not defined'}
          </Text>
          {isDefined(storageFee) && (
            <AssetValueText
              convertToDollar
              asset={getTezosToken(tzToMutez(storageFee, TEZ_TOKEN_METADATA.decimals).toFixed())}
              style={styles.infoFeeValue}
              amount={getTezosToken(tzToMutez(storageFee, TEZ_TOKEN_METADATA.decimals).toFixed()).balance}
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
                setFieldValue('gasFeeSum', new BigNumber(newValue).decimalPlaces(TEZ_TOKEN_METADATA.decimals));
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
