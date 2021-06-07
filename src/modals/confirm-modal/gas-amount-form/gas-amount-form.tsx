import { Estimate } from '@taquito/taquito/dist/types/contract/estimate';
import { BigNumber } from 'bignumber.js';
import { Formik } from 'formik';
import React, { FC, useMemo } from 'react';
import { number, object, SchemaOf } from 'yup';

import { assetAmountValidation } from '../../../form/validation/asset-amount';
import { mutezToTz } from '../../../utils/tezos.util';
import { GasAmountFormContent } from '../gas-amount-form/gas-amount-form-content';
import { GasAmountFormValues } from '../gas-amount-form/gas-amount-form.form';

type GasAmountFormProps = {
  buttonsDisabled: boolean;
  estimations?: Estimate[];
  onSubmit: (values: { additionalGasFee: BigNumber; additionalStorageFee: BigNumber }) => void;
};

export const GasAmountForm: FC<GasAmountFormProps> = ({ buttonsDisabled, children, estimations, onSubmit }) => {
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

  const handleSubmit = ({ gasFee, storageFee }: GasAmountFormValues) => {
    onSubmit({
      additionalGasFee: gasFee.minus(basicFees.gasFee),
      additionalStorageFee: storageFee.minus(basicFees.storageFee)
    });
  };

  const internalOpsConfirmValidationSchema = useMemo<SchemaOf<GasAmountFormValues>>(
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
        <GasAmountFormContent
          {...formikProps}
          basicFees={basicFees}
          buttonsDisabled={buttonsDisabled}
          estimationWasSuccessful={!!estimations}>
          {children}
        </GasAmountFormContent>
      )}
    </Formik>
  );
};
