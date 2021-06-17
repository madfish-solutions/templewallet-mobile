import { WalletParamsWithKind } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';
import { Formik } from 'formik';
import React, { FC, useEffect } from 'react';
import { Text, View } from 'react-native';
import { useDispatch } from 'react-redux';

import { AccountDropdownItem } from '../../../components/account-dropdown/account-dropdown-item/account-dropdown-item';
import { ButtonLargePrimary } from '../../../components/button/button-large/button-large-primary/button-large-primary';
import { ButtonLargeSecondary } from '../../../components/button/button-large/button-large-secondary/button-large-secondary';
import { Divider } from '../../../components/divider/divider';
import { ModalButtonsContainer } from '../../../components/modal-buttons-container/modal-buttons-container';
import { ScreenContainer } from '../../../components/screen-container/screen-container';
import { StacksEnum } from '../../../navigator/enums/stacks.enum';
import { useNavigation } from '../../../navigator/hooks/use-navigation.hook';
import { useShelter } from '../../../shelter/use-shelter.hook';
import { loadEstimationsActions } from '../../../store/wallet/wallet-actions';
import { useEstimationsSelector } from '../../../store/wallet/wallet-selectors';
import { formatSize } from '../../../styles/format-size';
import { isDefined } from '../../../utils/is-defined';
import { tzToMutez } from '../../../utils/tezos.util';
import { ConfirmationModalParams } from '../confirmation-modal.params';
import { FeeFormInput } from './fee-form-input/fee-form-input';
import { FeeFormInputValues } from './fee-form-input/fee-form-input.form';
import { useFeeForm } from './fee-form-input/use-fee-form.hook';
import { useInternalOperationsConfirmationStyles } from './internal-operations-confirmation.styles';
import { OperationsPreview } from './operations-preview/operations-preview';

type Props = Omit<ConfirmationModalParams, 'type'>;

export const InternalOperationsConfirmation: FC<Props> = ({ sender, opParams }) => {
  const styles = useInternalOperationsConfirmationStyles();
  const dispatch = useDispatch();
  const { send } = useShelter();
  const { goBack, navigate } = useNavigation();

  const estimations = useEstimationsSelector();
  const { basicFees, estimationWasSuccessful, formValidationSchema, formInitialValues } = useFeeForm(estimations.data);

  useEffect(() => void dispatch(loadEstimationsActions.submit({ sender, opParams })), []);

  const handleSubmit = ({ gasFee, storageFee }: FeeFormInputValues) => {
    if (isDefined(gasFee) && isDefined(storageFee)) {
      let params: WalletParamsWithKind[] = opParams;

      if (estimationWasSuccessful) {
        const rawAddGasFee = tzToMutez(gasFee.minus(basicFees.gasFee), 6);
        const rawAddStorageFee = tzToMutez(storageFee.minus(basicFees.storageFee), 6);

        const rawAddGasFeePerOp = rawAddGasFee.div(opParams.length).integerValue();
        const rawAddStorageFeePerOp = rawAddStorageFee.div(opParams.length).integerValue();

        params = opParams.map((param, index) => {
          const { totalCost, storageLimit } = estimations.data[index];

          return {
            ...param,
            fee: new BigNumber(totalCost)
              .plus(rawAddGasFeePerOp)
              .plus(index === opParams.length - 1 ? rawAddGasFee.mod(opParams.length) : 0),
            storage_limit: new BigNumber(storageLimit)
              .plus(rawAddStorageFeePerOp)
              .plus(index === opParams.length - 1 ? rawAddStorageFee.mod(opParams.length) : 0)
          };
        });
      }

      send({
        publicKeyHash: sender.publicKeyHash,
        opParams: params,
        successCallback: (opHash: string) => {
          // TODO: map opHash and operationsPreview into activity and display it
          console.log(opHash);
          navigate(StacksEnum.MainStack);
        }
      });
    }
  };

  return (
    <Formik<FeeFormInputValues>
      enableReinitialize={true}
      initialValues={formInitialValues}
      validationSchema={formValidationSchema}
      onSubmit={handleSubmit}>
      {({ values, setValues, isValid, isSubmitting, submitForm }) => (
        <>
          <ScreenContainer>
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

                <OperationsPreview opParams={opParams} />
                <Divider />

                <FeeFormInput
                  values={values}
                  basicFees={basicFees}
                  estimationWasSuccessful={estimationWasSuccessful}
                  setValues={setValues}
                />
              </>
            )}
            <Divider />
          </ScreenContainer>

          <ModalButtonsContainer>
            <ButtonLargeSecondary title="Back" disabled={isSubmitting} onPress={goBack} />
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
