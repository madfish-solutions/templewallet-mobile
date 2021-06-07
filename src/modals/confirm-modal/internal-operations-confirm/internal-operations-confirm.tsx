import { Estimate } from '@taquito/taquito/dist/types/contract/estimate';
import { BigNumber } from 'bignumber.js';
import { Formik, FormikProps } from 'formik';
import React, { FC, useMemo, useState } from 'react';
import { Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { number, object, SchemaOf } from 'yup';

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
import { assetAmountValidation } from '../../../form/validation/asset-amount';
import { InternalOperationsPayload } from '../../../interfaces/confirm-payload/internal-operations-payload.interface';
import { useNavigation } from '../../../navigator/use-navigation.hook';
import { formatSize } from '../../../styles/format-size';
import { conditionalStyle } from '../../../utils/conditional-style';
import { mutezToTz } from '../../../utils/tezos.util';
import { InternalOpsConfirmFormValues } from './internal-operations-confirm.form';
import { useInternalOpsConfirmStyles } from './internal-operations-confirm.styles';
import { OperationDetailsView } from './operations-details-view';

type InternalOperationsConfirmProps = {
  buttonsDisabled: boolean;
  estimations?: Estimate[];
  params: InternalOperationsPayload;
  onSubmit: (values: { additionalGasFee: BigNumber; additionalStorageFee: BigNumber }) => void;
};

export const InternalOperationsConfirm: FC<InternalOperationsConfirmProps> = ({
  buttonsDisabled,
  estimations,
  params,
  onSubmit
}) => {
  const basicFees = useMemo(
    () =>
      estimations?.reduce(
        (sumPart, estimation) => ({
          gasFee: sumPart.gasFee.plus(mutezToTz(new BigNumber(estimation.totalCost), 6)),
          storageFee: sumPart.storageFee.plus(mutezToTz(new BigNumber(estimation.storageLimit), 6))
        }),
        { gasFee: new BigNumber(0), storageFee: new BigNumber(0) }
      ) ?? { gasFee: new BigNumber(1e-6), storageFee: new BigNumber(0) },
    [estimations]
  );

  const handleSubmit = ({ gasFee, storageFee }: InternalOpsConfirmFormValues) => {
    onSubmit({
      additionalGasFee: gasFee.minus(basicFees.gasFee),
      additionalStorageFee: storageFee.minus(basicFees.storageFee)
    });
  };

  const internalOpsConfirmValidationSchema = useMemo<SchemaOf<InternalOpsConfirmFormValues>>(
    () =>
      object().shape({
        gasFee: assetAmountValidation
          .clone()
          .test('min-gas-fee', `Minimal value is ${basicFees.gasFee.toFixed()}`, value => {
            if (!(value instanceof BigNumber)) {
              return false;
            }

            return value.gte(basicFees.gasFee);
          })
          .required(),
        storageFee: assetAmountValidation
          .clone()
          .test('min-storage-fee', `Minimal value is ${basicFees.storageFee.toFixed()}`, value => {
            if (!(value instanceof BigNumber)) {
              return false;
            }

            return value.gte(basicFees.storageFee);
          })
          .required(),
        sliderValue: number().required()
      }),
    [basicFees]
  );

  const initialValues = {
    gasFee: basicFees.gasFee.plus(1e-4),
    storageFee: basicFees.storageFee,
    sliderValue: 0
  };

  return (
    <Formik
      enableReinitialize={true}
      initialValues={initialValues}
      validationSchema={internalOpsConfirmValidationSchema}
      onSubmit={handleSubmit}>
      {formikProps => (
        <FormContent
          {...formikProps}
          basicFees={basicFees}
          buttonsDisabled={buttonsDisabled}
          estimationWasSuccessful={!!estimations}
          params={params}
        />
      )}
    </Formik>
  );
};

type FormContentProps = FormikProps<InternalOpsConfirmFormValues> & {
  buttonsDisabled: boolean;
  estimationWasSuccessful: boolean;
  params: InternalOperationsPayload;
  basicFees: {
    gasFee: BigNumber;
    storageFee: BigNumber;
  };
};

const FormContent: FC<FormContentProps> = ({
  buttonsDisabled,
  estimationWasSuccessful,
  submitForm,
  values,
  setValues,
  setFieldValue,
  params,
  basicFees
}) => {
  const { opParams, sourcePkh } = params;
  const styles = useInternalOpsConfirmStyles();
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
        <OperationDetailsView opParams={opParams} sourcePkh={sourcePkh} />
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
                  onValueChange={handleSliderChange}
                  value={values.sliderValue}
                  minimumValue={0}
                  maximumValue={2}
                  style={styles.slider}>
                  <Icon size={formatSize(24)} name={IconNameEnum.Slow} style={styles.sliderIcon} />
                  <Icon size={formatSize(24)} name={IconNameEnum.NormalSpeed} style={styles.sliderIcon} />
                  <Icon size={formatSize(24)} name={IconNameEnum.Fast} style={styles.sliderIcon} />
                </Slider>
              </View>
              <View>
                <TouchableOpacity onPress={showDetailedSettings} style={styles.toggleSettingsButton}>
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
                <TouchableOpacity onPress={hideDetailedSettings} style={styles.toggleSettingsButton}>
                  <Icon size={formatSize(16)} name={IconNameEnum.CloseNoCircle} style={styles.orangeIcon} />
                </TouchableOpacity>
              </View>
            )}
          </View>

          <Divider />
        </View>
      </View>

      <ButtonsContainer>
        <ButtonLargeSecondary title="Back" disabled={buttonsDisabled} marginRight={formatSize(2)} onPress={goBack} />
        <ButtonLargePrimary title="Confirm" disabled={buttonsDisabled} onPress={submitForm} />
      </ButtonsContainer>
    </ScreenContainer>
  );
};
