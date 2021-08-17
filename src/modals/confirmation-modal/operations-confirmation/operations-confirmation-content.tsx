import { OpKind } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';
import { FormikProps } from 'formik';
import React, { FC, useEffect, useState } from 'react';
import { Text, View } from 'react-native';

import { AccountDropdownItem } from '../../../components/account-dropdown/account-dropdown-item/account-dropdown-item';
import { ButtonLargePrimary } from '../../../components/button/button-large/button-large-primary/button-large-primary';
import { ButtonLargeSecondary } from '../../../components/button/button-large/button-large-secondary/button-large-secondary';
import { Divider } from '../../../components/divider/divider';
import { ModalButtonsContainer } from '../../../components/modal-buttons-container/modal-buttons-container';
import { ScreenContainer } from '../../../components/screen-container/screen-container';
import { EmptyFn } from '../../../config/general';
import { ParamsWithKind } from '../../../interfaces/op-params.interface';
import { WalletAccountInterface } from '../../../interfaces/wallet-account.interface';
import { formatSize } from '../../../styles/format-size';
import { showWarningToast } from '../../../toast/toast.utils';
import { TEZ_TOKEN_METADATA } from '../../../token/data/tokens-metadata';
import { isDefined } from '../../../utils/is-defined';
import { tzToMutez } from '../../../utils/tezos.util';
import { FeeFormInput } from './fee-form-input/fee-form-input';
import { FeeFormInputValues } from './fee-form-input/fee-form-input.form';
import { useEstimations } from './hooks/use-estimations.hook';
import { useFeeForm } from './hooks/use-fee-form.hook';
import { useOperationsConfirmationStyles } from './operations-confirmation.styles';
import { OperationsPreview } from './operations-preview/operations-preview';

interface OperationsConfirmationContentProps
  extends Pick<
    FormikProps<FeeFormInputValues>,
    'values' | 'isValid' | 'isSubmitting' | 'setFieldValue' | 'submitForm'
  > {
  sender: WalletAccountInterface;
  opParams: ParamsWithKind[];
  onBackButtonPress: EmptyFn;
}

export const OperationsConfirmationContent: FC<OperationsConfirmationContentProps> = ({
  children,
  sender,
  opParams,
  values,
  isValid,
  isSubmitting,
  setFieldValue,
  submitForm,
  onBackButtonPress
}) => {
  const styles = useOperationsConfirmationStyles();
  const estimations = useEstimations(sender, opParams);
  const { opParamsWithFees, basicFees, estimationWasSuccessful, minimalFeePerStorageByteMutez, onlyOneOperation } =
    useFeeForm(opParams, estimations.data);

  const [possibleBacktrackWarningShown, setPossibleBacktrackWarningShown] = useState(false);

  useEffect(() => {
    if (!isDefined(values.gasFeeSum) || !isDefined(values.storageLimitSum)) {
      return;
    }

    const operationsTezExpenses = opParams.reduce((sumPart, params) => {
      let summand = new BigNumber(0);
      let isMutez: boolean | undefined;
      if (params.kind === OpKind.TRANSACTION) {
        summand = new BigNumber(params.amount);
        isMutez = params.mutez;
      }

      if (params.kind === OpKind.ORIGINATION) {
        summand = new BigNumber(params.balance ?? '0');
        isMutez = params.mutez;
      }

      return sumPart.plus(isMutez ? summand : tzToMutez(summand, TEZ_TOKEN_METADATA.decimals));
    }, new BigNumber(0));

    const balance = sender.tezosBalance.data;

    console.log(
      operationsTezExpenses.toString(),
      values.gasFeeSum.toString(),
      values.storageLimitSum.toString(),
      balance
    );
    const backtrackIsPossible = operationsTezExpenses
      .plus(tzToMutez(values.gasFeeSum, TEZ_TOKEN_METADATA.decimals))
      .plus(values.storageLimitSum)
      .gt(balance);

    if (backtrackIsPossible && !possibleBacktrackWarningShown) {
      showWarningToast({
        description: 'The balance of TEZ is not enough to make a transaction.'
      });
    }
    setPossibleBacktrackWarningShown(backtrackIsPossible);
  }, [opParams, values.gasFeeSum, values.storageLimitSum, sender, possibleBacktrackWarningShown]);

  return (
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
  );
};
