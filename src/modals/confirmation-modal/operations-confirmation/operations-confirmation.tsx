import { OpKind, ParamsWithKind } from '@taquito/taquito';
import { Formik } from 'formik';
import React, { FC } from 'react';
import { Text, View } from 'react-native';

import { AccountDropdownItem } from '../../../components/account-dropdown/account-dropdown-item/account-dropdown-item';
import { ButtonLargePrimary } from '../../../components/button/button-large/button-large-primary/button-large-primary';
import { ButtonLargeSecondary } from '../../../components/button/button-large/button-large-secondary/button-large-secondary';
import { Divider } from '../../../components/divider/divider';
import { LoadingPlaceholder } from '../../../components/loading-placeholder/loading-placeholder';
import { ModalButtonsContainer } from '../../../components/modal-buttons-container/modal-buttons-container';
import { ScreenContainer } from '../../../components/screen-container/screen-container';
import { EventFn } from '../../../config/general';
import { useNetworkInfo } from '../../../hooks/use-network-info.hook';
import { AccountInterface } from '../../../interfaces/account.interface';
import { TestIdProps } from '../../../interfaces/test-id.props';
import { useNavigation } from '../../../navigator/hooks/use-navigation.hook';
import { formatSize } from '../../../styles/format-size';
import { AnalyticsEventCategory } from '../../../utils/analytics/analytics-event.enum';
import { useAnalytics } from '../../../utils/analytics/use-analytics.hook';
import { isDefined } from '../../../utils/is-defined';
import { tzToMutez } from '../../../utils/tezos.util';
import { FeeFormInput } from './fee-form-input/fee-form-input';
import { FeeFormInputValues } from './fee-form-input/fee-form-input.form';
import { useEstimations } from './hooks/use-estimations.hook';
import { useFeeForm } from './hooks/use-fee-form.hook';
import { useOperationsConfirmationStyles } from './operations-confirmation.styles';
import { OperationsPreview } from './operations-preview/operations-preview';

interface Props extends TestIdProps {
  sender: AccountInterface;
  opParams: ParamsWithKind[];
  isLoading: boolean;
  onSubmit: EventFn<ParamsWithKind[]>;
}

export const OperationsConfirmation: FC<Props> = ({ sender, opParams, isLoading, onSubmit, children, testID }) => {
  const styles = useOperationsConfirmationStyles();
  const { goBack } = useNavigation();

  const { metadata } = useNetworkInfo();

  const { trackEvent } = useAnalytics();

  const estimations = useEstimations(sender, opParams);
  const {
    opParamsWithFees,
    basicFees,
    estimationWasSuccessful,
    minimalFeePerStorageByteMutez,
    onlyOneOperation,
    revealGasFee,
    formValidationSchema,
    formInitialValues
  } = useFeeForm(opParams, estimations.data);

  const handleSubmit = ({ gasFeeSum, storageLimitSum }: FeeFormInputValues) => {
    if (isDefined(testID)) {
      trackEvent(testID, AnalyticsEventCategory.FormSubmit);
    }

    // Remove revealGasGee from sum
    // Taquito will add it byself
    gasFeeSum = gasFeeSum?.minus(revealGasFee);

    const params = opParamsWithFees.map((opParam, index) => {
      const isLastOpParam = index === opParams.length - 1;

      if (opParam.kind !== OpKind.ACTIVATION) {
        const patchedOpParam = { ...opParam }; // Make copy;
        if (isDefined(gasFeeSum)) {
          patchedOpParam.fee = isLastOpParam ? tzToMutez(gasFeeSum, metadata.decimals).toNumber() : 0;
        }
        if (isDefined(storageLimitSum) && onlyOneOperation) {
          patchedOpParam.storageLimit = storageLimitSum.toNumber();
        }

        return patchedOpParam;
      }

      return opParam;
    });

    onSubmit(params);
  };

  return (
    <Formik<FeeFormInputValues>
      enableReinitialize={true}
      initialValues={formInitialValues}
      validationSchema={formValidationSchema}
      onSubmit={handleSubmit}
    >
      {({ values, isValid, setFieldValue, submitForm }) => (
        <>
          <ScreenContainer>
            {children}
            {estimations.isLoading ? (
              <LoadingPlaceholder text="Operation is loading..." />
            ) : (
              <>
                <Text style={styles.sectionTitle}>Account</Text>
                <Divider />

                <AccountDropdownItem account={sender} />
                <Divider />

                <Text style={styles.sectionTitle}>Preview</Text>
                <Divider size={formatSize(12)} />

                <View style={styles.divider} />
                <Divider size={formatSize(8)} />

                <OperationsPreview opParams={opParamsWithFees} />
                <Divider />

                <FeeFormInput
                  values={values}
                  basicFees={basicFees}
                  estimationWasSuccessful={estimationWasSuccessful}
                  onlyOneOperation={onlyOneOperation}
                  minimalFeePerStorageByteMutez={minimalFeePerStorageByteMutez}
                  setFieldValue={setFieldValue}
                />
              </>
            )}
            <Divider />
          </ScreenContainer>

          <ModalButtonsContainer>
            <ButtonLargeSecondary title="Back" disabled={isLoading} onPress={goBack} />
            <Divider size={formatSize(16)} />
            <ButtonLargePrimary
              title="Confirm"
              disabled={estimations.isLoading || isLoading || !isValid}
              onPress={submitForm}
            />
          </ModalButtonsContainer>
        </>
      )}
    </Formik>
  );
};
