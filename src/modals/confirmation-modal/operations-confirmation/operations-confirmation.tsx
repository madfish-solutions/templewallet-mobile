import { OpKind } from '@taquito/taquito';
import { Formik } from 'formik';
import React, { FC } from 'react';
import { Text, View } from 'react-native';

import { AccountDropdownItem } from '../../../components/account-dropdown/account-dropdown-item/account-dropdown-item';
import { ButtonLargePrimary } from '../../../components/button/button-large/button-large-primary/button-large-primary';
import { ButtonLargeSecondary } from '../../../components/button/button-large/button-large-secondary/button-large-secondary';
import { Divider } from '../../../components/divider/divider';
import { ModalButtonsContainer } from '../../../components/modal-buttons-container/modal-buttons-container';
import { ScreenContainer } from '../../../components/screen-container/screen-container';
import { EmptyFn, EventFn } from '../../../config/general';
import { ParamsWithKind } from '../../../interfaces/op-params.interface';
import { WalletAccountInterface } from '../../../interfaces/wallet-account.interface';
import { useExchangeRatesSelector } from '../../../store/currency/currency-selectors';
import { formatSize } from '../../../styles/format-size';
import { TEZ_TOKEN_METADATA } from '../../../token/data/tokens-metadata';
import { isDefined } from '../../../utils/is-defined';
import { tzToMutez } from '../../../utils/tezos.util';
import { FeeFormInput } from './fee-form-input/fee-form-input';
import { FeeFormInputValues } from './fee-form-input/fee-form-input.form';
import { useEstimations } from './hooks/use-estimations.hook';
import { useFeeForm } from './hooks/use-fee-form.hook';
import { useOperationsConfirmationStyles } from './operations-confirmation.styles';
import { OperationsPreview } from './operations-preview/operations-preview';

interface Props {
  sender: WalletAccountInterface;
  opParams: ParamsWithKind[];
  onSubmit: EventFn<ParamsWithKind[]>;
  onBackButtonPress: EmptyFn;
}

export const OperationsConfirmation: FC<Props> = ({ sender, opParams, onSubmit, onBackButtonPress, children }) => {
  const styles = useOperationsConfirmationStyles();

  const estimations = useEstimations(sender, opParams);
  const { exchangeRates } = useExchangeRatesSelector();
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
    // Remove revealGasGee from sum
    // Taquito will add it byself
    gasFeeSum = gasFeeSum?.minus(revealGasFee);

    const params = opParamsWithFees.map((opParam, index) => {
      const isLastOpParam = index === opParams.length - 1;

      if (opParam.kind !== OpKind.ACTIVATION) {
        const patchedOpParam = { ...opParam }; // Make copy;
        if (isDefined(gasFeeSum)) {
          patchedOpParam.fee = isLastOpParam ? tzToMutez(gasFeeSum, TEZ_TOKEN_METADATA.decimals).toNumber() : 0;
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
      onSubmit={handleSubmit}>
      {({ values, isValid, isSubmitting, setFieldValue, submitForm }) => (
        <>
          <ScreenContainer>
            {children}
            {estimations.isLoading ? (
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

                <OperationsPreview opParams={opParamsWithFees} />
                <Divider />

                <FeeFormInput
                  values={values}
                  basicFees={basicFees}
                  estimationWasSuccessful={estimationWasSuccessful}
                  onlyOneOperation={onlyOneOperation}
                  minimalFeePerStorageByteMutez={minimalFeePerStorageByteMutez}
                  setFieldValue={setFieldValue}
                  exchangeRate={exchangeRates.data[TEZ_TOKEN_METADATA.name]}
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
