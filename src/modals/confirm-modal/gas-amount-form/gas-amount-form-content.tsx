import { BigNumber } from 'bignumber.js';
import { FormikProps } from 'formik';
import React, { FC, useState } from 'react';
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
import { conditionalStyle } from '../../../utils/conditional-style';
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
        gasFee: basicFees.gasFee.plus(1e-4).plus(newValue * 5e-5),
        storageFee: basicFees.storageFee
      },
      true
    );
  };

  const handleGasFeeChange = (newGasFee?: BigNumber) => {
    if (newGasFee) {
      const newSliderValue = Math.min(
        2,
        Math.max(0, newGasFee.minus(basicFees.gasFee).minus(1e-4).div(5e-5).integerValue().toNumber())
      );
      setFieldValue('sliderValue', newSliderValue);
    } else {
      setFieldValue('sliderValue', 0);
    }
  };

  const totalFee = (values.gasFee ?? new BigNumber(0)).plus(values.storageFee ?? 0);

  return (
    <ScreenContainer isFullScreenMode={true}>
      <View>
        {children}
        <View style={styles.row}>
          <View style={styles.feeView}>
            <Text style={styles.feeLabel}>Gas fee:</Text>
            <View style={styles.row}>
              {values.gasFee ? (
                <>
                  <Text style={styles.feeAmount}>{values.gasFee.toFixed()} XTZ</Text>
                  <Text style={styles.feeAmountUsd}>(XXX.XX $)</Text>
                </>
              ) : (
                <Text style={styles.feeAmount}>Not defined</Text>
              )}
            </View>
          </View>
          <View style={styles.feeView}>
            <Text style={styles.feeLabel}>Storage fee:</Text>
            <View style={styles.row}>
              {values.storageFee ? (
                <>
                  <Text style={styles.feeAmount}>{values.storageFee.toFixed()} XTZ</Text>
                  <Text style={styles.feeAmountUsd}>(XXX.XX $)</Text>
                </>
              ) : (
                <Text style={styles.feeAmount}>Not defined</Text>
              )}
            </View>
          </View>
        </View>
        <Divider />
        <View>
          {!shouldShowDetailedSettings && (
            <View style={styles.row}>
              <View style={styles.shortFeeInputForm}>
                <Slider
                  value={values.sliderValue}
                  minimumValue={0}
                  maximumValue={2}
                  onValueChange={handleSliderChange}
                />
              </View>
              <View>
                <TouchableOpacity style={styles.toggleSettingsButton} onPress={showDetailedSettings}>
                  <Icon size={formatSize(16)} name={IconNameEnum.Gear} style={styles.orangeIcon} />
                </TouchableOpacity>
              </View>
            </View>
          )}
          <View style={[styles.row, conditionalStyle(!shouldShowDetailedSettings, styles.hidden)]}>
            <View style={styles.feeInputForm}>
              <Label description="Total:" />
              <StyledNumericInput decimals={6} value={totalFee} editable={false} />

              <Label description="Gas fee:" />
              <FormNumericInput decimals={6} name="gasFee" isShowCleanButton onChange={handleGasFeeChange} />

              <Label description="Storage fee:" />
              <FormNumericInput decimals={6} name="storageFee" isShowCleanButton />
            </View>
            {estimationWasSuccessful && (
              <View>
                <TouchableOpacity style={styles.toggleSettingsButton} onPress={hideDetailedSettings}>
                  <Icon size={formatSize(16)} name={IconNameEnum.CloseNoCircle} style={styles.orangeIcon} />
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
