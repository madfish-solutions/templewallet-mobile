import { BigNumber } from 'bignumber.js';
import { FormikProps } from 'formik';
import React, { FC, useMemo, useState } from 'react';
import { Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

import { ButtonLargePrimary } from '../../../components/button/button-large/button-large-primary/button-large-primary';
import { ButtonLargeSecondary } from '../../../components/button/button-large/button-large-secondary/button-large-secondary';
import { ButtonsContainer } from '../../../components/button/buttons-container/buttons-container';
import { Divider } from '../../../components/divider/divider';
import { Icon } from '../../../components/icon/icon';
import { IconNameEnum } from '../../../components/icon/icon-name.enum';
import { Label } from '../../../components/label/label';
import { ScreenContainer } from '../../../components/screen-container/screen-container';
import { Slider } from '../../../components/slider/slider';
import { StyledNumericInput } from '../../../components/styled-numberic-input/styled-numeric-input';
import { FormNumericInput } from '../../../form/form-numeric-input';
import { useNavigation } from '../../../navigator/use-navigation.hook';
import { formatSize } from '../../../styles/format-size';
import { XTZ_TOKEN_METADATA } from '../../../token/data/tokens-metadata';
import { conditionalStyle } from '../../../utils/conditional-style';
import { isDefined } from '../../../utils/is-defined';
import { useGasAmountFormContentStyles } from './gas-amount-form-content.styles';
import { GasAmountFormValues } from './gas-amount-form.form';

type GasAmountFormContentProps = FormikProps<GasAmountFormValues> & {
  isLoading: boolean;
  estimationWasSuccessful: boolean;
  basicFees: {
    gasFee: BigNumber;
    storageFee: BigNumber;
  };
};

export const GasAmountFormContent: FC<GasAmountFormContentProps> = ({
  isLoading,
  children,
  estimationWasSuccessful,
  submitForm,
  values,
  setValues,
  setFieldValue,
  basicFees
}) => {
  const styles = useGasAmountFormContentStyles();
  const [shouldShowDetailedSettings, setShouldShowDetailedSettings] = useState(!estimationWasSuccessful);
  const { goBack } = useNavigation();

  const showDetailedSettings = () => setShouldShowDetailedSettings(true);
  const hideDetailedSettings = () => setShouldShowDetailedSettings(false);

  const handleSliderChange = (newValue: number) => {
    setValues(
      {
        sliderValue: newValue,
        gasFee: new BigNumber(newValue).decimalPlaces(XTZ_TOKEN_METADATA.decimals),
        storageFee: basicFees.storageFee
      },
      true
    );
  };

  const [sliderMinValue, sliderMaxValue] = useMemo<[number, number]>(
    () => [basicFees.gasFee.plus(1e-4).toNumber(), basicFees.gasFee.plus(2e-4).toNumber()],
    [basicFees.gasFee]
  );

  const totalFee = useMemo(() => {
    const gasFee = values.gasFee ?? new BigNumber(0);
    const storageFee = values.storageFee ?? 0;

    const newSliderValue = Math.min(sliderMaxValue, Math.max(sliderMinValue, gasFee.toNumber()));
    setFieldValue('sliderValue', newSliderValue);

    return gasFee.plus(storageFee);
  }, [values.gasFee, values.storageFee]);

  return (
    <ScreenContainer isFullScreenMode={true}>
      <View>
        {children}
        <View style={styles.row}>
          <View style={styles.feeView}>
            <Text style={styles.feeLabel}>Gas fee:</Text>
            <Text style={styles.feeAmount}>
              {isDefined(values.gasFee) ? `${values.gasFee.toFixed()} TEZ` : 'Not defined'}
            </Text>
            <Text style={styles.feeAmountUsd}>(XXX.XX $)</Text>
          </View>
          <View style={styles.feeView}>
            <Text style={styles.feeLabel}>Storage fee:</Text>
            <Text style={styles.feeAmount}>
              {isDefined(values.storageFee) ? `${values.storageFee.toFixed()} TEZ` : 'Not defined'}
            </Text>
            <Text style={styles.feeAmountUsd}>(XXX.XX $)</Text>
          </View>
        </View>
        <Divider size={formatSize(32)} />
        <View>
          {!shouldShowDetailedSettings && (
            <View style={styles.row}>
              <View style={styles.shortFeeInputForm}>
                <Slider
                  value={values.sliderValue}
                  minimumValue={sliderMinValue}
                  maximumValue={sliderMaxValue}
                  step={1e-6}
                  onValueChange={handleSliderChange}
                />
              </View>
              <View>
                <TouchableOpacity style={styles.toggleSettingsButton} onPress={showDetailedSettings}>
                  <Icon name={IconNameEnum.Gear} style={styles.orangeIcon} />
                </TouchableOpacity>
              </View>
            </View>
          )}
          <View style={[styles.row, conditionalStyle(!shouldShowDetailedSettings, styles.hidden)]}>
            <View style={styles.feeInputForm}>
              <Label description="Total:" />
              <StyledNumericInput value={totalFee} editable={false} />
              <Divider size={formatSize(16)} />

              <Label description="Gas fee:" />
              <FormNumericInput name="gasFee" isShowCleanButton={true} />

              <Label description="Storage fee:" />
              <FormNumericInput name="storageFee" isShowCleanButton={true} />
            </View>
            {estimationWasSuccessful && (
              <View>
                <TouchableOpacity style={styles.toggleSettingsButton} onPress={hideDetailedSettings}>
                  <Icon size={formatSize(16)} name={IconNameEnum.X} style={styles.orangeIcon} />
                </TouchableOpacity>
              </View>
            )}
          </View>

          <Divider />
        </View>
      </View>

      <ButtonsContainer>
        <ButtonLargeSecondary title="Back" disabled={isLoading} marginRight={formatSize(15)} onPress={goBack} />
        <ButtonLargePrimary title="Confirm" disabled={isLoading} onPress={submitForm} />
      </ButtonsContainer>
    </ScreenContainer>
  );
};
