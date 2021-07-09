import { WalletParamsWithKind } from '@taquito/taquito';
import { Formik } from 'formik';
import React, { FC, useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { useDispatch } from 'react-redux';

import { AccountDropdownItem } from '../../../components/account-dropdown/account-dropdown-item/account-dropdown-item';
import { ButtonLargePrimary } from '../../../components/button/button-large/button-large-primary/button-large-primary';
import { ButtonLargeSecondary } from '../../../components/button/button-large/button-large-secondary/button-large-secondary';
import { Divider } from '../../../components/divider/divider';
import { ModalButtonsContainer } from '../../../components/modal-buttons-container/modal-buttons-container';
import { ScreenContainer } from '../../../components/screen-container/screen-container';
import { EmptyFn, EventFn } from '../../../config/general';
import { WalletAccountInterface } from '../../../interfaces/wallet-account.interface';
import { loadEstimationsActions } from '../../../store/wallet/wallet-actions';
import { useEstimationsSelector } from '../../../store/wallet/wallet-selectors';
import { formatSize } from '../../../styles/format-size';
import { TEZ_TOKEN_METADATA } from '../../../token/data/tokens-metadata';
import { isDefined } from '../../../utils/is-defined';
import { tzToMutez } from '../../../utils/tezos.util';
import { FeeFormInput } from './fee-form-input/fee-form-input';
import { FeeFormInputValues } from './fee-form-input/fee-form-input.form';
import { useFeeForm } from './fee-form-input/use-fee-form.hook';
import { useOperationsConfirmationStyles } from './operations-confirmation.styles';
import { OperationsPreview } from './operations-preview/operations-preview';

interface Props {
  sender: WalletAccountInterface;
  opParams: WalletParamsWithKind[];
  onSubmit: EventFn<WalletParamsWithKind[]>;
  onBackButtonPress: EmptyFn;
}

export const OperationsConfirmation: FC<Props> = ({ sender, opParams, onSubmit, onBackButtonPress, children }) => {
  const styles = useOperationsConfirmationStyles();
  const dispatch = useDispatch();
  const [estimationsRequested, setEstimationsRequested] = useState(false);

  const estimations = useEstimationsSelector();
  const {
    basicFees,
    estimationWasSuccessful,
    minimalFeePerStorageByteMutez,
    onlyOneOperation,
    formValidationSchema,
    formInitialValues
  } = useFeeForm(opParams, estimations.data);

  useEffect(() => {
    dispatch(loadEstimationsActions.submit({ sender, opParams }));
    setEstimationsRequested(true);
  }, []);

  const handleSubmit = ({ gasFeeSum, storageLimitSum }: FeeFormInputValues) => {
    const params = opParams.map((param, index) => {
      const isLastOpParam = index === opParams.length - 1;

      const fee = isDefined(gasFeeSum) && isLastOpParam ? tzToMutez(gasFeeSum, TEZ_TOKEN_METADATA.decimals) : 0;
      const storageLimit =
        isDefined(storageLimitSum) && onlyOneOperation
          ? storageLimitSum
          : estimationWasSuccessful
          ? estimations.data[index].storageLimit
          : undefined;

      return { ...param, fee, storageLimit };
    });

    onSubmit(params);
  };

  return (
    <Formik<FeeFormInputValues>
      enableReinitialize={true}
      initialValues={formInitialValues}
      validationSchema={formValidationSchema}
      onSubmit={handleSubmit}>
      {({ values, isValid, isSubmitting, setFieldValue, submitForm }) => (
        <>
          <ScreenContainer>
            {children}
            {estimations.isLoading || !estimationsRequested ? (
              <Text style={styles.loadingMessage}>Loading...</Text>
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

                <OperationsPreview opParams={opParams} />
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
            <ButtonLargeSecondary title="Back" disabled={isSubmitting} onPress={onBackButtonPress} />
            <Divider size={formatSize(16)} />
            <ButtonLargePrimary
              title="Confirm"
              disabled={estimations.isLoading || isSubmitting || !isValid}
              onPress={submitForm}
            />
          </ModalButtonsContainer>
        </>
      )}
    </Formik>
  );
};
