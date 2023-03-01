import { OpKind, ParamsWithKind } from '@taquito/taquito';
import { Formik } from 'formik';
import React, { FC } from 'react';
import { Text, View } from 'react-native';

import { AccountDropdownItem } from 'src/components/account-dropdown/account-dropdown-item/account-dropdown-item';
import { ButtonLargePrimary } from 'src/components/button/button-large/button-large-primary/button-large-primary';
import { ButtonLargeSecondary } from 'src/components/button/button-large/button-large-secondary/button-large-secondary';
import { Divider } from 'src/components/divider/divider';
import { LoadingPlaceholder } from 'src/components/loading-placeholder/loading-placeholder';
import { ModalButtonsContainer } from 'src/components/modal-buttons-container/modal-buttons-container';
import { ScreenContainer } from 'src/components/screen-container/screen-container';
import { EventFn } from 'src/config/general';
import { useNetworkInfo } from 'src/hooks/use-network-info.hook';
import { AccountInterface } from 'src/interfaces/account.interface';
import { TestIdProps } from 'src/interfaces/test-id.props';
import { useNavigation } from 'src/navigator/hooks/use-navigation.hook';
import { formatSize } from 'src/styles/format-size';
import { AnalyticsEventCategory } from 'src/utils/analytics/analytics-event.enum';
import { useAnalytics } from 'src/utils/analytics/use-analytics.hook';
import { isDefined } from 'src/utils/is-defined';
import { isTruthy } from 'src/utils/is-truthy';
import { tzToMutez } from 'src/utils/tezos.util';

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
    opParamsWithEstimations,
    basicFees,
    estimationsApplied,
    minimalFeePerStorageByteMutez,
    onlyOneOperation,
    revealGasFee,
    formValidationSchema,
    formInitialValues
  } = useFeeForm(opParams, estimations.data);

  const handleSubmit = ({ gasFeeSum, storageLimitSum }: FeeFormInputValues) => {
    if (isTruthy(testID)) {
      trackEvent(testID, AnalyticsEventCategory.FormSubmit);
    }

    // Remove revealGasGee from sum
    // Taquito will add it byself
    gasFeeSum = gasFeeSum?.minus(revealGasFee);

    const params = opParamsWithEstimations.map((opParam, index) => {
      if (opParam.kind === OpKind.ACTIVATION) {
        return opParam;
      }

      const patchedOpParam = { ...opParam }; // Make copy;

      if (isDefined(gasFeeSum)) {
        const isLastOpParam = index === opParams.length - 1;
        patchedOpParam.fee = isLastOpParam ? tzToMutez(gasFeeSum, metadata.decimals).toNumber() : 0;
      }

      if (isDefined(storageLimitSum) && onlyOneOperation) {
        patchedOpParam.storageLimit = storageLimitSum.toNumber();
      }

      return patchedOpParam;
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

                <OperationsPreview opParams={opParamsWithEstimations} />
                <Divider />

                <FeeFormInput
                  values={values}
                  basicFees={basicFees}
                  estimationWasSuccessful={estimationsApplied}
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
              title="Confirmfd"
              disabled={estimations.isLoading || isLoading || !isValid}
              onPress={submitForm}
            />
          </ModalButtonsContainer>
        </>
      )}
    </Formik>
  );
};
