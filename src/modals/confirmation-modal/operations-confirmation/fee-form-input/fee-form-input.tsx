import { BigNumber } from 'bignumber.js';
import { FormikHelpers } from 'formik';
import React, { FC, useState } from 'react';
import { Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

import { BalanceText } from '../../../../components/balance-text/balance-text';
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
import { mutezToTz } from '../../../../utils/tezos.util';
import { FeeFormInputValues } from './fee-form-input.form';
import { useFeeFormInputStyles } from './fee-form-input.styles';

interface Props {
  values: FeeFormInputValues;
  basicFees: Required<FeeFormInputValues>;
  estimationWasSuccessful: boolean;
  onlyOneOperation: boolean;
  minimalFeePerStorageByteMutez: number;
  setFieldValue: FormikHelpers<FeeFormInputValues>['setFieldValue'];
  exchangeRate: number;
}

export const FeeFormInput: FC<Props> = ({
  values,
  basicFees,
  estimationWasSuccessful,
  onlyOneOperation,
  minimalFeePerStorageByteMutez,
  setFieldValue,
  exchangeRate
}) => {
  const styles = useFeeFormInputStyles();

  const [isShowDetailedInput, setIsShowDetailedInput] = useState(!estimationWasSuccessful);

  const sliderMinValue = basicFees.gasFeeSum.toNumber();
  const sliderMaxValue = basicFees.gasFeeSum.plus(2e-4).toNumber();
  const gasFeeBigNumber = values.gasFeeSum ?? new BigNumber(0);

  const storageFee = isDefined(values.storageLimitSum)
    ? mutezToTz(new BigNumber(values.storageLimitSum).times(minimalFeePerStorageByteMutez), TEZ_TOKEN_METADATA.decimals)
    : undefined;

  return (
    <>
      <View style={styles.infoContainer}>
        <View style={styles.infoContainerItem}>
          <Text style={styles.infoTitle}>Gas fee:</Text>
          <Text style={styles.infoFeeAmount}>
            {isDefined(values.gasFeeSum) ? `${values.gasFeeSum.toFixed()} TEZ` : 'Not defined'}
          </Text>
          {isDefined(values.gasFeeSum) && (
            <BalanceText style={styles.infoFeeValue} exchangeRate={exchangeRate}>
              {values.gasFeeSum}
            </BalanceText>
          )}
        </View>

        <Divider />

        <View style={styles.infoContainerItem}>
          <Text style={styles.infoTitle}>Storage fee:</Text>
          <Text style={styles.infoFeeAmount}>
            {isDefined(storageFee) ? `${storageFee.toFixed()} TEZ` : 'Not defined'}
          </Text>
          {isDefined(storageFee) && (
            <BalanceText style={styles.infoFeeValue} exchangeRate={exchangeRate}>
              {storageFee}
            </BalanceText>
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
              onValueChange={(newValue: number) =>
                setFieldValue('gasFeeSum', new BigNumber(newValue).decimalPlaces(TEZ_TOKEN_METADATA.decimals))
              }
            />
          )}
        </View>
        {estimationWasSuccessful && (
          <>
            <Divider size={formatSize(8)} />
            <TouchableOpacity
              style={styles.toggleViewButton}
              onPress={() => setIsShowDetailedInput(!isShowDetailedInput)}>
              <Icon name={isShowDetailedInput ? IconNameEnum.X : IconNameEnum.Gear} size={formatSize(16)} />
            </TouchableOpacity>
          </>
        )}
      </View>
    </>
  );
};
