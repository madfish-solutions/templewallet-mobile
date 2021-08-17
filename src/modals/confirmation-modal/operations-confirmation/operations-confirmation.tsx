import { OpKind } from '@taquito/taquito';
import { Formik } from 'formik';
import React, { FC } from 'react';

import { EmptyFn, EventFn } from '../../../config/general';
import { ParamsWithKind } from '../../../interfaces/op-params.interface';
import { WalletAccountInterface } from '../../../interfaces/wallet-account.interface';
import { TEZ_TOKEN_METADATA } from '../../../token/data/tokens-metadata';
import { isDefined } from '../../../utils/is-defined';
import { tzToMutez } from '../../../utils/tezos.util';
import { FeeFormInputValues } from './fee-form-input/fee-form-input.form';
import { useEstimations } from './hooks/use-estimations.hook';
import { useFeeForm } from './hooks/use-fee-form.hook';
import { OperationsConfirmationContent } from './operations-confirmation-content';

interface Props {
  sender: WalletAccountInterface;
  opParams: ParamsWithKind[];
  onSubmit: EventFn<ParamsWithKind[]>;
  onBackButtonPress: EmptyFn;
}

export const OperationsConfirmation: FC<Props> = ({ sender, opParams, onSubmit, onBackButtonPress, children }) => {
  const estimations = useEstimations(sender, opParams);
  const { opParamsWithFees, onlyOneOperation, revealGasFee, formValidationSchema, formInitialValues } = useFeeForm(
    opParams,
    estimations.data
  );

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
        <OperationsConfirmationContent
          values={values}
          isValid={isValid}
          isSubmitting={isSubmitting}
          setFieldValue={setFieldValue}
          submitForm={submitForm}
          sender={sender}
          opParams={opParams}
          onBackButtonPress={onBackButtonPress}>
          {children}
        </OperationsConfirmationContent>
      )}
    </Formik>
  );
};
